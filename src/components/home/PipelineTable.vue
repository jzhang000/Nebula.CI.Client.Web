<template>
  <div class="rootDiv">
    <div class="header">
      <a-button type="primary" @click="createPipeline"> <a-icon type="edit" />新建工作流</a-button>
      <a-input-search
        v-model="searchStr"
        placeholder="输入工作流名称"
        class="input-search"
        @change="onSearch"
        @search="onSearch"
      />
    </div>
    <el-scrollbar class="pipeline-scrollbar">
      <a-config-provider :locale="locale">
        <a-table
          :columns="columns"
          :data-source="dataForShow"
          :pagination="{ pageSize: 10 }"
          :rowClassName="rowClassName"
        >
          <a
            slot="name"
            slot-scope="text, record"
            :title="text"
            @click="handlePipelineClick(record.id)"
            class="workflow-name"
            >{{ text }}</a
          >
          <span slot="customTitle"> &nbsp;&nbsp;名称 </span>
          <span slot="lastStatus" slot-scope="text, record">
            <img
              src="/static/32x32/blue.png"
              title="构建成功"
              v-if="record.lastStatus == 'Succeeded'"
            />
            <img
              src="/static/32x32/nobuilt.png"
              title="没有构建"
              v-else-if="record.lastStatus == null"
            />
            <img src="/static/32x32/red.png" title="构建失败" v-else />
          </span>
          <span slot="action" slot-scope="text, record">
            <a title="开始构建"
              ><img
                src="/static/24x24/clock.png"
                @click="runPipeline(record.id, record.name, record.diagram)"
            /></a>
          </span>
        </a-table>
      </a-config-provider>
    </el-scrollbar>
    <pipeline-create v-if="pipelineCreateVisible" :id="pipelineId" ref="pipelineCreate"></pipeline-create>
  </div>
</template>
<script>
import dayjs from "dayjs";
import api from "@/api";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import PipelineCreate from '../common/PipelineCreatePage'

const columns = [
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    sorter: (a, b) => a.name.length - b.name.length,
    ellipsis: true,
  },
  {
    title: "构建次数",
    dataIndex: "execTimes",
    sorter: (a, b) => a.execTimes - b.execTimes,
    width: "9.2%",
  },
  {
    title: "成功次数",
    dataIndex: "succeededTimes",
    sorter: (a, b) => a.succeededTimes - b.succeededTimes,
    width: "9.2%",
  },
  {
    title: "失败次数",
    dataIndex: "failedTimes",
    sorter: (a, b) => a.failedTimes - b.failedTimes,
    width: "9.2%",
  },
  {
    title: "上次构建状态",
    dataIndex: "lastStatus",
    key: "lastStatus",
    scopedSlots: { customRender: "lastStatus" },
    width: "10%",
  },
  {
    title: "上次成功",
    dataIndex: "lastSucceededTime",
    key: "lastSucceededTime",
    customRender: (text, row, index) => {
      //return text ? dayjs(new Date()).diff(dayjs(text),'day') + "天" + ( dayjs(new Date()).diff(dayjs(text),'hour') - dayjs(new Date()).diff(dayjs(text),'day') * 24 ) + "小时" +  + (dayjs(new Date()).diff(dayjs(text),'minute') - dayjs(new Date()).diff(dayjs(text),'hour') * 60) + "分" : "无"
      return text ? text : "无";
    },
    width: "15%",
  },
  {
    title: "上次失败",
    key: "lastFailedTime",
    dataIndex: "lastFailedTime",
    customRender: (text, row, index) => {
      //return text ? dayjs(new Date()).diff(dayjs(text),'day') + "天" + ( dayjs(new Date()).diff(dayjs(text),'hour') - dayjs(new Date()).diff(dayjs(text),'day') * 24 ) + "小时" +  + (dayjs(new Date()).diff(dayjs(text),'minute') - dayjs(new Date()).diff(dayjs(text),'hour') * 60) + "分" : "无"
      return text ? text : "无";
    },
    width: "15%",
  },
  {
    title: "",
    key: "action",
    scopedSlots: { customRender: "action" },
    width: "10%",
    align: "center",
  },
];

export default {
  data() {
    return {
      data: [],
      dataForShow: [],
      columns,
      locale: zhCN,
      zhCN,
      searchStr: "",
      pipelineCreateVisible: false,
      pipelineId:"",
    };
  },
  components: {
    PipelineCreate
  },
  mounted() {
    let that = this;
    api.GET_PIPELINE_API().then((res) => {
      that.data = res;
      that.data.forEach((item, index) => {
        item.key = index;
      });
      that.dataForShow = that.data;
    });
  },
  methods: {
    rowClassName(record, index) {
      let className = "light-row";
      if (index % 2 === 1) className = "dark-row";
      return className;
    },
    createPipeline(){
      this.pipelineCreateVisible = true
      this.$nextTick(function () {
        this.$refs.pipelineCreate.init()
      })
    },
    onSearch() {
      if (this.searchStr != "") {
        this.dataForShow = this.data.filter((item) => item.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1);
      } else {
        this.dataForShow = this.data;
      }
    },
    handlePipelineClick(id) {
      this.$router.push({ path: "/ci/job/" + id });
    },
    runPipeline(id, name, diagram) {
      if(diagram && diagram != "{}"){
        api.RUN_PIPELINE_API(id).then((res) => {
          this.$message.success("工作流 " + name + " 开始构建");
        });
      } else {
        this.$message.error("工作流配置为空，请配置")
      }
    },
  },
};
</script>
<style scoped>
.rootDiv{
  height: 100%;
}
.header{
  padding-bottom: 10px
}
.input-search{
  width: 200px;
}
.pipeline-scrollbar{
  height: calc(100% - 100px);
}
.workflow-name{
  font-weight: 600; 
  color: #0b6aa2
}
.light-row {
  background-color: #fff;
}
.dark-row {
  background-color: #fbfbfb;
}
</style>