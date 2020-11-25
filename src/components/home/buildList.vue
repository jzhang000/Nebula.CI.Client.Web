<template>
  <div style="height:100%">
    <a-config-provider :locale="locale">
    <a-collapse v-model="activeKey" expand-icon-position="left" style="height:100%">
      <a-collapse-panel key="1" header="构建执行状态" style="height:100%">
        <div class="build-history">
        <a-list
          item-layout="vertical"
          size="small"
          :pagination="pagination"
          :data-source="listData"
          >
          <a-list-item slot="renderItem" key="item.title" slot-scope="item">
            <div>
              <el-link :underline="false"><img src="/static/16x16/red.png" title="构建失败" v-if="item.status == 'exception'"/>
              <img src="/static/16x16/blue.png"  title="构建成功" v-else-if="item.status == 'success'" />
              <img src="/static/16x16/aborted.png"  title="待执行" v-else-if="item.status == 'normal'"/>
              <a-icon type="loading" title="构建中" v-else/> </el-link>
              <el-link :underline="false" @click="showStatus(item.pipelineId)" style="padding-top:3px">#{{ item.pipelineName }}</el-link>
              <el-link :underline="false" @click="showBuilds(item.pipelineId, item.id)" style="padding-top:3px;padding-left:5px">#{{ item.no }}</el-link>
              <el-link :underline="false" @click="showBuilds(item.pipelineId)" style="float:right;padding-top:3px">{{ item.buildTime }}</el-link>
              <a-progress :percent="item.percent" :status="item.status"/>
            </div>
          </a-list-item>
        </a-list>
        </div>
      </a-collapse-panel>
    </a-collapse>
    </a-config-provider>
  </div>
</template>
<script>
import api from '@/api'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  data() {
    return {
      listData:[],
      pagination: {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 6,
        simple: true,
        hideOnSinglePage: true,
      },
      activeKey: ["1"],
      locale:zhCN,
      zhCN
    };
  },
  created() {
    var that = this;
    // setInterval不会清除定时器队列，每重复执行1次都会导致定时器叠加 \
    this.myInterval = window.setInterval(() => {
      // setTimeout是自带清除定时器
      setTimeout(function () {
        api.GET_PIPELINE_RUNNING_API().then(res => {
          that.listData = [];
          res.forEach(item => {
            let pipelineStatus = ""
            switch (item.status) {
                case "running":
                    pipelineStatus = "active";
                    break;
                case "Succeeded":
                    pipelineStatus = "success";
                    break;
                case "Failed":
                    pipelineStatus = "exception"
                    break
                default:
                    pipelineStatus = "normal"
            }

            let runningPipeline = {id: item.id, no : item.no, pipelineId: item.pipelineId,pipelineName: item.pipelineName, percent : item.percent, buildTime : item.startTime, status : pipelineStatus}    
            that.listData.push(runningPipeline)          
          })
        })
      }, 600);
    }, 5000);
  },
  destroyed(){
    clearInterval(this.myInterval)
  },
  methods: {
    showStatus(pipelineId) {
        this.$router.push({path: '/ci/job/' + pipelineId});
    },
    showBuilds(pipelineId, buildId) {
        this.$router.push({path: '/ci/job/' + pipelineId + "/" + buildId});
    }
  }
};
</script>
<style scoped>
.build-history {
  display: flex;
  overflow: auto;
  height: 570px;
}
</style>