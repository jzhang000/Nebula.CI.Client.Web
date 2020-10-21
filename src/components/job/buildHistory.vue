<template>
  <div style="height:100%">
    <a-config-provider :locale="locale">
    <a-collapse v-model="activeKey" expand-icon-position="left" style="height:100%">
      <a-collapse-panel key="1" header="构建历史" style="height:100%">
        <a-list
          item-layout="vertical"
          size="small"
          :pagination="pagination"
          :data-source="listData"
        >
          <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
            <div>
              <el-link :underline="false">
                <img
                  src="/static/16x16/red.png"
                  @click="showConsole(item.id)"
                  title="构建失败"
                  v-if="item.status=='exception'"
                />
                <img
                  src="/static/16x16/blue.png"
                  @click="showConsole(item.id)"
                  title="构建成功"
                  v-else-if="item.status=='success'"
                />
                <img
                  src="/static/16x16/aborted.png"
                  @click="showConsole(item.id)"
                  title="构建暂停"
                  v-else-if="item.status=='normal'"
                />
                <a-icon type="loading" title="构建中" v-else />
              </el-link>
              <el-link
                @click="showStatus(item.id, item.buildTime)"
                style="padding-top:3px"
              >#{{ item.no }}</el-link>
              <el-link
                :underline="false"
                @click="showStatus(item.id, item.buildTime)"
                style="padding-top:3px;padding-left:30px"
              >{{ item.buildTime }}</el-link>
              <a
                slot="actions"
                style="float:right;color:red;padding-top:3px"
                @click="deleteItem(item, index)"
              >删除</a>
              <a-progress :percent="item.percent" :status="item.status" />
            </div>
          </a-list-item>
        </a-list>
        <a-icon slot="extra" type="history" @click="showHistory" />
      </a-collapse-panel>
    </a-collapse>
    </a-config-provider>
  </div>
</template>
<script>
import dayjs from "dayjs";
import api from "@/api";
import Bus from "@/libs/Bus"
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  data() {
    return {
      listData : [],
      pagination: {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
        simple: true,
        hideOnSinglePage: true,
      },
      activeKey: ['1'],
      myInterval: null,
      pipeline : null,
      locale:zhCN,
      zhCN
    };
  },
  created() {
    var that = this;
    that.loadHistory()

      // setInterval不会清除定时器队列，每重复执行1次都会导致定时器叠加 \
    that.myInterval = window.setInterval(() => {
        // setTimeout是自带清除定时器
        setTimeout(function () {
          that.loadHistory()
        }, 600);
      }, 5000);
  },
  destroyed() {
    clearInterval(this.myInterval);
  },
  mounted() {
 
  },
  methods: {
    showStatus(id, buildTime) {
      this.$router.push({
        path: "/ci/job/" + this.$route.params.pipelineId + "/" + id,
      });
    },
    showHistory(e) {
      console.info(this.activeKey[0]);
    },
    showConsole(e) {
      console.info(e);
    },
    deleteItem(item, index) {
      //调用api 删除数据库中构建记录
      let that = this;
      api.DELETE_PIPELINE_BUILD_API(item.id).then(res => {
        that.$delete(that.listData, index);
        Bus.$emit('deleteBuildData', item.id)
      })
    },
    loadHistory() {
        let that = this;
        if(that.$route.params.pipelineId){
          api.PIPELINE_BUILD_HISTORY_API(that.$route.params.pipelineId).then((res) => {
            res.forEach((item, index) => {
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
                let runningPipeline = {id: item.id, no : item.no, pipelineId : item.pipelineId, pipelineName: item.pipelineName, percent : item.percent, buildTime : item.startTime, status : pipelineStatus}
                if(that.listData.length <= index){
                    that.listData.unshift(runningPipeline)
                } else {
                    that.listData[that.listData.length - 1 - index].percent = item.percent
                    that.listData[that.listData.length - 1 - index].status = pipelineStatus
                    that.listData[that.listData.length - 1 - index].buildTime = item.startTime 
                }
            })

            Bus.$emit('updateBuildData', this.listData)
          });
        }
    }
  }
};
</script>