<template>
  <div>
    <a-breadcrumb :routes="routes" style="margin-left: 26px;">
      <span slot="separator">
        <a-icon type="caret-right" />
      </span>
      <template slot="itemRender" slot-scope="{route}">
        <router-link
          :to="`${route.path}`"
          style="font-weight:bold;color:#000000"
        >{{ route.breadcrumbName }}</router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      basePath: "",
      routes: [
        {
          path: "/",
          breadcrumbName: "首页",
        },
      ],
    };
  },
  watch: {
    async $route(route) {
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      if (this.$route.params.pipelineId != null) {
        let pipelineId = this.$route.params.pipelineId;
        let pipelineName = await this.getPipelineName(pipelineId);
        if (this.$route.params.buildId == null) {
          this.routes = [
            { path: "/", breadcrumbName: "首页" },
            {
              path: "/ci/job/" + this.$route.params.pipelineId,
              breadcrumbName: pipelineName,
            },
          ];
        } else {
          let buildId = this.$route.params.buildId;
          let buildNo = await this.getBuildNo(buildId);
          this.routes = [
            { path: "/", breadcrumbName: "首页" },
            {
              path: "/ci/job/" + this.$route.params.pipelineId,
              breadcrumbName: pipelineName,
            },
            {
              path: "/ci/job/" + this.$route.params.pipelineId + "/" + this.$route.params.buildId,
              breadcrumbName: buildNo,
            },
          ];
        }
      } else {
        this.routes = [{ path: "/", breadcrumbName: "首页" }];
      }
    },
  },
  async mounted() {
    if (this.$route.params.pipelineId != null) {
      let that = this;
      let pipelineId = that.$route.params.pipelineId;
      let pipelineName = await that.getPipelineName(pipelineId);
      if (that.$route.params.buildId == null) {
        that.routes = [
          { path: "/", breadcrumbName: "首页" },
          {
            path: "/ci/job/" + that.$route.params.pipelineId,
            breadcrumbName: pipelineName,
          },
        ];
      } else {
        let buildId = that.$route.params.buildId;
        let buildNo = await that.getBuildNo(buildId);
        that.routes = [
          { path: "/", breadcrumbName: "首页" },
          {
            path: "/ci/job/" + that.$route.params.pipelineId,
            breadcrumbName: pipelineName,
          },
          {
            path: "/ci/job/" + that.$route.params.pipelineId + "/" + that.$route.params.id,
            breadcrumbName: buildNo + "",
          },
        ];
      }
    } else {
      this.routes = [{ path: "/", breadcrumbName: "首页" }];
    }
  },
  methods: {
    async getPipelineName(id) {
      let pipeline = await api.GET_PIPELINE_BY_ID_API(id);
      return pipeline.name;
    },
    async getBuildNo(id) {
      let buildDetail = await api.PIPELINE_BUILD_DETAIL_API(id);
      return buildDetail.no;
    }
  },
};
</script>