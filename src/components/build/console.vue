<template>
<el-scrollbar style="height:90%;">
    <div style="height:100%;">
    <h1>
      <img src="/static/32x32/blue.png"  title="构建成功" v-if="status == 'Succeeded'"/>
      <img src="/static/32x32/nobuilt.png" title="没有构建" v-else-if="status == null"/>
      <img src="/static/32x32/red.png"  title="构建失败" v-else/>
      第#{{ this.buildNo }}次构建</h1>
    <codemirror
                :value="dialogContent"
                :options="options"
                readonly="true"
            ></codemirror>
    </div>
</el-scrollbar>
</template>
<script>
import lodash from "lodash";
import api from '@/api'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
require("codemirror/mode/javascript/javascript.js")
export default {
  data() {
    return {
      dialogContent: "",
      buildNo:"",
      status: null,
      pipelineName : "",
      options: {
      mode: {
          name: "text/html"
      },
      styleActiveLine: true,
      }
    };
  },
  components: {
    codemirror
  },
  mounted(){
    let that = this;
    api.PIPELINE_BUILD_DETAIL_API(that.$route.params.buildId).then(res => {
        that.status = res.status
        that.buildNo = res.no + ""
        let logs = JSON.parse(res.logs)
        logs.forEach(task =>{
            that.dialogContent += "节点名称:" + task.TaskAnnoName + "\n开始时间:" + task.Log.StartTime + "\n完成时间:" + task.Log.CompletionTime + "\n" + "执行状态:" + task.Log.Status + "\n" + "执行日志:\n" + task.Log.Content + "\n"
        })
    })
  },
  beforeRouteUpdate(to,from,next){
    this.src=to.params.resultUrl;
    next();
  }
}
</script>

