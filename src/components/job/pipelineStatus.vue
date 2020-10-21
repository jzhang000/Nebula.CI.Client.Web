<template>
  <div style="height:100%;">
    <el-scrollbar style="height:90%;">
      <span style="font-size:2rem">Pipeline &nbsp;{{this.pipelineName}}</span>
      <a-collapse
        accordion
        :default-active-key="activeKey"
        expand-icon-position="left"
        style="height:100%;"
        @change="changeActivekey"
      >
        <a-collapse-panel
          v-for="(item) in buildDatas"
          :key="item.id"
          :header="getHeader(item)"
          
        >
          <div style="text-align: center;">
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
          <a-icon slot="extra" type="search" @click="viewBuildInfo(item.id)" />
        </a-collapse-panel>
      </a-collapse>
         <a-modal
            :title="title"
            v-model="dialogVisible"
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
import dayjs from 'dayjs'
import { MessageBox, Message } from 'element-ui';
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
require("codemirror/mode/javascript/javascript.js")
export default {
  data() {
    return {
      pipelineName:"",
      buildDatas: [],
      activeKey: ['1'],
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
      title:"",
      dialogVisible: false,
      dialogContent: "",
      options: {
      mode: {
          name: "text/html"},
          lineNumbers: true
      }
    };
  },
  components: {
    codemirror
  },
  methods: {
    getHeader(item){
      return "#" + item.no + "(" + item.buildTime + ")"
    },
    handleSelect(node) {
      let content = "节点名称:" + node.name + "\n开始时间:" + node.log.StartTime + "\n完成时间:" + node.log.CompletionTime + "\n" + "执行状态:" + node.log.Status + "\n" + "执行日志为:\n" + node.log.Content
      this.title = node.name + "  日志"
      this.dialogContent = content
      this.dialogVisible = true
    },
    changeActivekey(id) {
      if(id){
         this.getBuildDetails(id)
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
        let buildDetailData = []
        let datas = JSON.parse(res.logs);
        if(datas){
          datas.forEach((data) => {
          let status = "";
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

          let execTime = "执行时间为: " + data.Log.ExecTime

          let task = { name: data.TaskAnnoName, status: status, log: data.Log, hint: execTime };
          let next = [];
          let nextShapes = data.NextShapes;
          nextShapes.forEach((shapeId) => {
            let i = datas.findIndex(function (item) {
              return item.ShapeId == shapeId; //如果返回true，那么findIndex方法会将这个item对应的id返回到外面接受
            });

            let shape = datas.find(e => e.ShapeId == shapeId)
            let weight = 0
            if(shape.Log.Status == "Succeeded"){
              weight = 2
            }

            next.push({ index: i, weight : weight });
          });

          if (next.length != 0) {
            task["next"] = next;
          }

          buildDetailData.push(task);
          });

          let index = that.buildDatas.findIndex(function (e){
            return e.id == id
          })

          that.buildDatas[index].data = buildDetailData
        }
      });
    },
    getBuildHistory(buildList) {
      let that = this;

      for (let i = buildList.length -1 ; i >= 0; i--) {
          let tmp = that.buildDatas.find(e => e.id == buildList[i].id)
          if(!tmp){
            let buildData = { id: buildList[i].id, no: buildList[i].no, buildTime: buildList[i].buildTime, data: []};
            that.buildDatas.unshift(buildData);
          }
      }

      if(buildList.length != 0 && that.buildDatas.length == buildList.length && that.buildDatas[0].id == buildList[0].id){
        that.buildDatas[0].buildTime = buildList[0].buildTime
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
      
      that.buildDatas.splice(index,1)
    })

    api.GET_PIPELINE_BY_ID_API(that.$route.params.pipelineId).then(res => {
      this.pipelineName = res.name
    })
  },
};
</script>