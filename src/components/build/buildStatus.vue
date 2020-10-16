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
        mode: {
          name: "text/html"},
        lineNumbers: true
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

      let datas = JSON.parse(res.logs);
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

        let execTime = "执行时间为: " + data.Log.ExecTime;

        let task = {
          name: data.TaskAnnoName,
          status: status,
          log: data.Log,
          hint: execTime,
        };
        let next = [];
        let nextShapes = data.NextShapes;
        nextShapes.forEach((shapeId) => {
          let i = datas.findIndex(function (item) {
            return item.ShapeId == shapeId; //如果返回true，那么findIndex方法会将这个item对应的id返回到外面接受
          });

          let shape = datas.find((e) => e.ShapeId == shapeId);
          let weight = 0;
          if (shape.Log.Status == "Succeeded") {
            weight = 2;
          }

          next.push({ index: i, weight: weight });
        });

        if (next.length != 0) {
          task["next"] = next;
        }

        that.data.push(task);
      });
    });
  },
};
</script>