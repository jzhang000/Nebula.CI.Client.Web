<template>
    <div style="height:100%;">
    <h1 style="padding:24px 24px 0 0">
      <img src="/static/32x32/blue.png"  title="构建成功" v-if="status == 'Succeeded'"/>
      <img src="/static/32x32/nobuilt.png" title="没有构建" v-else-if="status == null"/>
      <img src="/static/32x32/red.png"  title="构建失败" v-else/>
      <strong>{{ pipelineName }}</strong> 第 <b>#{{ this.buildNo }}</b> 次构建
    </h1>
      <el-scrollbar style="height:90%;background:#292A2B">
      <div class="log">
        <codemirror
                :value="dialogContent"
                :options="options"
                readonly="true"
            ></codemirror>
      </div>
      </el-scrollbar>
    </div>
</template>
<script>
import lodash from "lodash";
import api from '@/api'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
require("codemirror/mode/yaml/yaml.js")
import "codemirror/theme/panda-syntax.css"
export default {
  data() {
    return {
      dialogContent: "",
      buildNo:"",
      status: null,
      pipelineName : "",
      options: {
        mode: {name: "yaml", json: true},
        styleActiveLine: true,
        lineNumbers: true,
        readOnly: true,    
        matchBrackets: true,
        theme: "panda-syntax"
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
        that.pipelineName = res.pipelineName

        that.dialogContent += "Pipeline " + res.pipelineName + " 执行日志: \n" + "----------------------------\n开始时间:" + res.startTime + "\n结束时间:" + res.completionTime + "\n"
        if(res.message){
          that.dialogContent += "执行日志:\n" + res.message
        }
        that.dialogContent += "\n\n"

        let logs = JSON.parse(res.logs)
        if(logs){
          that.dialogContent += "节点执行日志:\n" + "----------------------------\n"
          logs.forEach(task =>{
            if(task.Log){
              that.dialogContent += "节点名称:" + task.TaskAnnoName + "\n开始时间:" + task.Log.StartTime + "\n完成时间:" + task.Log.CompletionTime + "\n" + "执行状态:" + task.Log.Status + "\n" + "执行日志:\n" + task.Log.Content + "\n"
            } else {
              that.dialogContent += "节点名称:" + task.TaskAnnoName + "\n执行状态:未执行"
            }
          })
        }
    })
  },
  beforeRouteUpdate(to,from,next){
    this.src=to.params.resultUrl;
    next();
  }
}
</script>
<style scoped>
.log{
  overflow: scroll !important;
}
</style>

