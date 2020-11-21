<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="height: 100vh; position: fixed; width: 100%"
  >
    <a-layout-sider
      width="270px"
      style="
        background: #fff;
        height: 100%;
        width: 300px;
        padding: 1rem 0 2.5rem 0;
      "
    >
      <a-menu
        @click="handleClick"
        class="menu"
        mode="inline"
        :selectedKeys="defaultkey"
        style="width: 270px"
      >
        <a-menu-item key="1">
          <img src="/static/24x24/projectInfo.png" />
          <span>项目信息</span>
        </a-menu-item>
        <a-menu-item key="2">
          <img src="/static/24x24/search.png" />
          <span>构建状态</span>
        </a-menu-item>
        <a-menu-item key="3">
          <img src="/static/24x24/clock.png" />
          <span>立即构建</span>
        </a-menu-item>
        <a-menu-item key="4" v-if="!this.isExample">
          <img src="/static/24x24/edit-delete.png" />
          <span>删除工作流</span>
        </a-menu-item>
        <a-menu-item key="5">
          <img src="/static/24x24/gear2.png" />
          <span>配置工作流</span>
        </a-menu-item>
        <a-menu-item key="6">
          <img src="/static/24x24/git.png" />
          <span>配置WebHook</span>
        </a-menu-item>
        <a-menu-item key="7" v-if="!this.isExample">
          <img src="/static/24x24/notepad.png" />
          <span>重命名</span>
        </a-menu-item>
      </a-menu>
      <div style="display: flex; height: calc(100% - 300px)">
        <buildHistory />
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content
        :style="{
          margin: '0px 2px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </a-layout-content>
    </a-layout>
    <pipeline-create
      v-if="pipelineCreateVisible"
      :id="pipelineId"
      ref="pipelineCreate"
    ></pipeline-create>
  </a-layout>
</template>
<script>
import lodash from "lodash";
import buildHistory from "./buildHistory";
import PipelineCreate from "../common/PipelineCreatePage";
import cookies from '@/libs/util.cookies'
import api from "@/api";

export default {
  data() {
    return {
      pipelineCreateVisible: false,
      defaultkey: ["2"],
      pipelineId: this.$route.params.pipelineId,
      webhookUrl: window.location.origin + "/api/ci/services/pipeline/" + this.$route.params.pipelineId + "/run",
      isExample : false,
      diagram:"{}"
    };
  },
  components: {
    buildHistory,
    PipelineCreate,
  },
  mounted() {
    let that = this;
    api.GET_PIPELINE_BY_ID_API(that.$route.params.pipelineId).then(res => {
      if(res){
        that.diagram = res.diagram

        let currentUserId = cookies.get("userId")
        if(res.userId == currentUserId){
          that.isExample = false
        } else {
          that.isExample = true
        }
      }
    })

    if (that.$route.name == "status") {
      that.defaultkey = ["2"];
      that.$router.push({
        path: "/ci/job/" + that.$route.params.pipelineId + "/status",
      });
    } else if (that.$route.name == "info") {
      that.defaultkey = ["1"];
      that.$router.push({
        path: "/ci/job/" + that.$route.params.pipelineId + "/info",
      });
    }
  },
  methods: {
    handleClick(e) {
      switch (e.key) {
        case "1":
          this.defaultkey = ["1"];
          this.$router.push({
            path: "/ci/job/" + this.$route.params.pipelineId + "/info",
          });
          break;
        case "2":
          //更改状态
          this.defaultkey = ["2"];
          this.$router.push({
            path: "/ci/job/" + this.$route.params.pipelineId + "/status",
          });
          break;
        case "3":
          if(this.diagram == "" || this.diagram == "{}"){
            this.$message.error("工作流配置为空，请配置");
          } else {
            this.buidlPipeline();
          }
          break;
        case "4":
          this.$confirm("确定要删除该工作流吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false,
          })
            .then(() => {
              api
                .DELETE_PIPELINE_API(this.$route.params.pipelineId)
                .then((res) => {
                  this.$message.success("删除工作流成功");
                  this.$router.push({ path: "/ci/index" });
                });
            })
            .catch(() => {});
          break;
        case "5":
          //进入diagram页面
          this.$router.push({
            path:
              "/ci/pipeline/" + this.$route.params.pipelineId + "/configure",
          });
          break;
        case "6":
          let that = this;
          that.$copyText(that.webhookUrl).then(
            function (e) {
              that.$message.success(
                "webhook: " + that.webhookUrl + " 已复制到剪切板"
              );
            },
            function (e) {
              alert("webhook复制到剪切板失败");
              console.log(e);
            }
          );

          break;
        case "7":
          this.pipelineCreateVisible = true;

          this.$nextTick(function () {
            this.$refs.pipelineCreate.init();
          });
          break;
      }
    },
    confirm(e) {
      //api 删除Pipeline
      api.DELETE_PIPELINE_API(this.$route.params.pipelineId).then((res) => {
        this.$message.success("删除工作流成功");
        this.$router.push({ path: "/ci/index" });
      });
    },
    buidlPipeline() {
      api.RUN_PIPELINE_API(this.$route.params.pipelineId).then((res) => {
        this.$message.success("工作流开始构建");
      });
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
