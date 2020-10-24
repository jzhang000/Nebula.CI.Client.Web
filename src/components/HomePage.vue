<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="height:100vh; position: fixed;width:100%"
  >
    <a-layout-sider
      width="270px"
      style="background: #fff;height:100%;width:270px;padding: 1rem 0 2.5rem 0;"
    >
      <a-menu
        @click="handleClick"
        class="menu"
        mode="inline"
        :selectedKeys="selectedkeys"
        style="width:270px"
      >
        <a-menu-item key="1">
          <img src="/static/24x24/new-package.png" />
          <span>新建Pipeline</span>
        </a-menu-item>
         <a-menu-item key="2">
          <img src="/static/24x24/user.png" />
          <span>我的Pipeline</span>
        </a-menu-item>
        <a-menu-item key="3">
          <img src="/static/24x24/notepad.png" />
          <span>构建历史</span>
        </a-menu-item>
      </a-menu>
      <buildList style="padding-top:32px"/>
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
import PipelineCreate from './PipelineCreatePage'
import lodash from 'lodash'
import buildList from './buildList'
import api from '@/api'
export default {
  data() {
    return {
        pipelineCreateVisible: false,
        pipelineId:"",
        selectedkeys: ['2']
    };
  },
  components: {
    PipelineCreate, buildList
  },
  mounted(){
    console.info(process)
    if(this.$route.name == "builds"){
        this.selectedkeys = ['3']
    }
  },
  methods: {
    handleClick(e) {
      switch (e.key) {
        case "1":
          this.pipelineCreateVisible = true
          this.$nextTick(function () {
            this.$refs.pipelineCreate.init()
          })
          break;
        case "2":
          this.$router.push({path: '/'});
          this.selectedkeys = ['2']
          break;
        case "3":
          this.$router.push({path: '/ci/index/builds'});
          this.selectedkeys = ['3']
          break;
      }
    },
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
