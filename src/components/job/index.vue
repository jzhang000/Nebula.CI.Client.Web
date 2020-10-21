<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="height:100vh; position: fixed;width:100%"
  >
    <a-layout-sider
      width="300px"
      style="background: #fff;height:100%;width:300px;padding: 1rem 0 2.5rem 0;"
    >
      <a-menu
        @click="handleClick"
        class="menu"
        mode="inline"
        :selectedKeys="defaultkey"
        style="width:300px;">
        <a-menu-item key="1">
          <img src="/static/24x24/search.png" />
          <span>构建状态</span>
        </a-menu-item>
        <a-menu-item key="2">
          <img src="/static/24x24/clock.png" />
          <span>立即构建</span>
        </a-menu-item>
        <a-menu-item key="3">
          <img src="/static/24x24/edit-delete.png" />
          <a-popconfirm
            title="确定要删除该Pipeline?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm"
            placement="right"
            >
            <span href="#">删除Pipeline</span>
          </a-popconfirm>
        </a-menu-item>
        <a-menu-item key="4">
          <img src="/static/24x24/gear2.png" />
          <span>配置Pipeline</span>
        </a-menu-item>
         <a-menu-item key="5">
          <img src="/static/24x24/git.png" />
          <span>配置WebHook</span>
        </a-menu-item>
        <a-menu-item key="6">
          <img src="/static/24x24/notepad.png" />
          <span>重命名</span>
        </a-menu-item>
      </a-menu>
      <buildHistory />
    </a-layout-sider>
    <a-layout>
      <a-layout-content
        :style="{ margin: '4px 2px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <keep-alive>
          <router-view />
        </keep-alive>
      </a-layout-content>
    </a-layout>
    <pipeline-create v-if="pipelineCreateVisible" :id="pipelineId" ref="pipelineCreate"></pipeline-create>
  </a-layout>
</template>
<script>
import lodash from "lodash";
import buildHistory from "./buildHistory";
import PipelineCreate from '../PipelineCreatePage'
import api from '@/api'

export default {
  data() {
    return {
      pipelineCreateVisible: false,
      defaultkey : ['1'],
      pipelineId : this.$route.params.pipelineId,
      webhookUrl: window.location.origin + "/api/ci/services/pipeline/" +  this.$route.params.pipelineId + "/run"
    };
  },
  components: {
    buildHistory,PipelineCreate
  },
  mounted(){
    
  },
  methods: {
    handleClick(e) {
      switch (e.key) {
        case "1":
          //更改状态
          break;
        case "2":
          this.buidlPipeline()
          break;
        case "3":
          break;
        case "4":
          //进入diagram页面
          this.$router.push({
            path: "/ci/pipeline/" + this.$route.params.pipelineId + "/configure",
          });
          break;
        case "5":
          let that = this;
          that.$copyText(that.webhookUrl).then(function (e) {
            that.$message.success('webhook: ' + that.webhookUrl + ' 已复制到剪切板'); 
          }, function (e) {
            alert('webhook复制到剪切板失败')
            console.log(e)
          })

          break;
        case "6":
          this.pipelineCreateVisible = true;

          this.$nextTick(function () {
            this.$refs.pipelineCreate.init();
          });
          break;
      }
    },
    confirm(e) {
      //api 删除Pipeline
      api.DELETE_PIPELINE_API(this.$route.params.pipelineId).then(res => {
        this.$message.success('删除Pipeline成功');    
        this.$router.push({path: '/ci/index'});  
      }) 
    },
    buidlPipeline(){
      api.RUN_PIPELINE_API(this.$route.params.pipelineId).then(res => {
        this.$message.success('Pipeline开始构建');  
      })

      this.defaultkey = ['1']
    }
  },
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

.menu img {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

.menu span {
  vertical-align: middle;
}
</style>
