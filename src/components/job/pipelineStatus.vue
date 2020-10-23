<template>
  <div style="height: 100%">
    <el-scrollbar style="height: 90%">
      <span style="font-size: 2rem"
        >Pipeline &nbsp;{{ this.pipelineName }}</span
      >
      <a-collapse
        accordion
        :default-active-key="1"
        expand-icon-position="left"
        style="height: 100%"
        @change="changeActivekey"
      >
        <a-collapse-panel
          v-for="item in buildDatas"
          :key="item.id"
          :header="getHeader(item)"
        >
          <div style="text-align: center">
            <vue-pipeline
              ref="pipeline"
              :x="parseInt(form.x)"
              :y="parseInt(form.y)"
              :data="item.data"
              :showArrow="form.showArrow"
              :ystep="parseInt(form.ystep)"
              :xstep="parseInt(form.xstep)"
              :lineStyle="form.lineStyle"
              @select="handleSelect"
            />
          </div>
          <span style="color:red">{{item.message}}</span>
          <a-icon slot="extra" type="search" @click="viewBuildInfo(item.id)" />
        </a-collapse-panel>
      </a-collapse>
      <a-modal
        :title="title"
        v-model="dialogVisible"
        :bodyStyle="bodyStyle"
        width="50%"
        style="top: 0px;"
        footer=""
      >
        <!--一个高亮显示的插件-->
        <codemirror
          :value="dialogContent"
          :options="options"
          class="code"
        ></codemirror>
      </a-modal>
    </el-scrollbar>
  </div>
</template>
<script>
import api from "@/api";
import Bus from "@/libs/Bus";
import dayjs from "dayjs";
import { MessageBox, Message } from "element-ui";
import "codemirror/lib/codemirror.css";
import { codemirror } from "vue-codemirror";
require("codemirror/mode/yaml/yaml.js")
import "codemirror/theme/panda-syntax.css"
export default {
  data() {
    return {
      pipelineName: "",
      buildDatas: [],
      activeKey: ['36'],
      form: {
        x: 50,
        y: 55,
        xstep: 120,
        ystep: 70,
        data: 0,
        showArrow: true,
        lineStyle: "default",
        from: 0,
        to: 0,
      },
      title: "",
      dialogVisible: false,
      dialogContent: "",
      options: {
        mode: {name: "yaml", json: true},
        lineNumbers: true,
        readOnly: true,    
        matchBrackets: true,
        theme:"panda-syntax"
      },
      bodyStyle:{"padding": "0px"}
    };
  },
  components: {
    codemirror,
  },
  methods: {
    getHeader(item) {
      return "#" + item.no + "(" + item.buildTime + ")";
    },
    handleSelect(node) {
      let content = ""
      if(node.log){
        content =
        "节点名称:" +
        node.name +
        "\n开始时间:" +
        node.log.StartTime +
        "\n完成时间:" +
        node.log.CompletionTime +
        "\n" +
        "执行状态:" +
        node.log.Status +
        "\n" +
        "执行日志为:\n" +
        node.log.Content;
      } else {
        content =
        "节点名称:" +
        node.name +
        "\n执行状态:未执行"
      }
 
      this.title = node.name + "  日志";
      this.dialogContent = content;
      this.dialogVisible = true;
    },
    changeActivekey(id) {
      if (id) {
        this.getBuildDetails(id);
      }
    },
    viewBuildInfo(buildId) {
      this.$router.push({
        path: "/ci/job/" + this.$route.params.pipelineId + "/" + buildId,
      });
    },
    getBuildDetails(id) {
      let that = this;
      api.PIPELINE_BUILD_DETAIL_API(id).then((res) => {
        let buildDetailData = [{name: "开始",status: "start",log: "",hint: "", next:[]}];
        let datas = JSON.parse(res.logs);
        if (datas) {
          datas.forEach((data, index) => {
            let status = "paused";
            let execTime = "待执行";
            if (data.Log) {
              switch (data.Log.Status) {
                case "running":
                  status = "running";
                  break;
                case "Succeeded":
                  status = "success";
                  break;
                case "Failed":
                  status = "failure";
                  break;
                default:
                  status = "paused";
              }

              execTime = "执行时间为: " + data.Log.ExecTime;
            }

            let nodeWeight = 0;
            if (data.Log && data.Log.Status == "Succeeded") {
              nodeWeight = 2;
            }

            let task = {
              name: data.TaskAnnoName,
              status: status,
              log: data.Log,
              hint: execTime,
            };
            let next = [];
            let nextShapes = data.NextShapes;
            if(nextShapes.length > 0) {
              nextShapes.forEach((shapeId) => {
              let i = datas.findIndex(function (item) {
                return item.ShapeId == shapeId; //如果返回true，那么findIndex方法会将这个item对应的id返回到外面接受
              });

              let shape = datas.find((e) => e.ShapeId == shapeId);
              let weight = 0;
              if (shape.Log && shape.Log.Status == "Succeeded") {
                weight = 2;
              }

              next.push({ index: i + 1, weight: weight });
              });
            } else {
              next.push({ index: datas.length + 1, weight:nodeWeight})
            }

            task["next"] = next;
            buildDetailData.push(task);

            //判断是否为开始后的节点
            let firstNode = datas.find(function(item){
              let nextShapes = item.NextShapes
              if(nextShapes.length != 0){
                let targetnodeIndex = nextShapes.findIndex(n => n === data.ShapeId)
                if(targetnodeIndex == -1){
                  return false
                } else {
                  return true
                }
              } else {
                return false
              }
            })
            
            if(!firstNode){
              buildDetailData[0].next.push({ index: index + 1, weight: nodeWeight })
            }
          });

          buildDetailData.push({name: "结束", status: "end", log: "", hint: "", next: []})

          let index = that.buildDatas.findIndex(function (e) {
            return e.id == id;
          });

          that.buildDatas[index].data = buildDetailData;
          that.buildDatas[index]["message"] = res.message;
        }
      });
    },
    getBuildHistory(buildList) {
      let that = this;

      for (let i = buildList.length - 1; i >= 0; i--) {
        let tmp = that.buildDatas.find((e) => e.id == buildList[i].id);
        if (!tmp) {
          let buildData = {
            id: buildList[i].id,
            no: buildList[i].no,
            buildTime: buildList[i].buildTime,
            data: [],
          };
          that.buildDatas.unshift(buildData);
        }
      }

      if (
        buildList.length != 0 &&
        that.buildDatas.length == buildList.length &&
        that.buildDatas[0].id == buildList[0].id
      ) {
        that.buildDatas[0].buildTime = buildList[0].buildTime;
      }
    },
  },
  mounted() {
    let that = this;
    Bus.$on("updateBuildData", (data) => {
      that.getBuildHistory(data);
    });
    Bus.$on("deleteBuildData", (data) => {
      let index = that.buildDatas.findIndex(function (item) {
        return item.id == data; //如果返回true，那么findIndex方法会将这个item对应的id返回到外面接受
      });

      that.buildDatas.splice(index, 1);
    });

    api.GET_PIPELINE_BY_ID_API(that.$route.params.pipelineId).then((res) => {
      this.pipelineName = res.name;
    });
  },
};
</script>
<style scoped>
.ant-modal-body{
  padding:0px
}
</style>