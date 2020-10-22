<template>
  <div style="height:100%;">
    <el-scrollbar style="height:90%;">
      <span style="font-size:2rem">
            <img src="/static/32x32/blue.png"  title="构建成功" v-if="status == 'Succeeded'"/>
            <img src="/static/32x32/nobuilt.png" title="没有构建" v-else-if="status == null"/>
            <img src="/static/32x32/red.png"  title="构建失败" v-else/>
            构建 &nbsp;#{{ this.buildNum }}({{ this.buildTime }})</span>
      <div style="text-align: center;padding-bottom:20px">
        <vue-pipeline
          ref="pipeline"
          :x="parseInt(form.x)"
          :y="parseInt(form.y)"
          :data="data"
          :showArrow="form.showArrow"
          :ystep="parseInt(form.ystep)"
          :xstep="parseInt(form.xstep)"
          :lineStyle="form.lineStyle"
          @select="handleSelect"
        />
      </div>
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
import "codemirror/lib/codemirror.css";
import "codemirror/theme/panda-syntax.css"
import { codemirror } from "vue-codemirror";
require("codemirror/mode/javascript/javascript.js");
import api from "@/api";

export default {
  data() {
    return {
      data:[],
      title:"",
      status:"Succeeded",
      dialogVisible: false,
      dialogContent: "",
      options: {
        mode: {name: "javascript", json: true},
        lineNumbers: true,
        readonly: true,    
        matchBrackets: true,
        theme:"panda-syntax"
      },
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
      buildNum: "",
      buildTime: "",
    };
  },
  components: {
    codemirror,
  },
  methods: {
    handleSelect(node) {
      let content = "节点名称:" + node.name + "\n开始时间:" + node.log.StartTime + "\n完成时间:" + node.log.CompletionTime + "\n" + "执行状态:" + node.log.Status + "\n" + "执行日志为:\n" + node.log.Content
      this.title = node.name + "  日志"
      this.dialogContent = content
      this.dialogVisible = true
    },
    init() {
      this.dialogVisible = true;
      this.flowJsonData = JSON.stringify(this.data).toString();
    },
  },
  mounted() {
    let that = this;
    api.PIPELINE_BUILD_DETAIL_API(this.$route.params.buildId).then((res) => {
      that.buildNum = res.no;
      that.buildTime = res.startTime;
      that.status = res.status;
      
      that.data = [{name: "开始",status: "start",log: "",hint: "", next:[]}]
      let datas = JSON.parse(res.logs);
      if(datas){
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
            that.data.push(task);
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
              that.data[0].next.push({ index: index + 1, weight: nodeWeight })
            }
          });

          that.data.push({name: "结束", status: "end", log: "", hint: "", next: []})
      }
    });
  },
};
</script>