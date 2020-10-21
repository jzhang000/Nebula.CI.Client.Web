<template>
<div style="height:100%">
<el-scrollbar style="height:90%;">
<a-config-provider :locale="locale">
     <a-table
          :columns="columns"
          :data-source="data"
          :pagination="{ pageSize: 10 }"
          :scroll="{ y: 500 }"
          :rowClassName="rowClassName"
        >
          <a slot="name" slot-scope="text, record" @click="handlePipelineClick(record.id)" style="font-weight: 600;color:#0b6aa2">{{ text }}</a>
          <span slot="customTitle">
            &nbsp;&nbsp;名称
          </span>
          <span slot="lastStatus" slot-scope="text, record">
            <img src="/static/32x32/blue.png"  title="构建成功" v-if="record.lastStatus == 'Succeeded'"/>
            <img src="/static/32x32/nobuilt.png" title="没有构建" v-else-if="record.lastStatus == null"/>
            <img src="/static/32x32/red.png"  title="构建失败" v-else/>
          </span>
          <span slot="action" slot-scope="text, record">
            <a title="开始构建"><img  src="/static/24x24/clock.png" @click="runPipeline(record.id, record.name)" /></a>
          </span>
        </a-table>
</a-config-provider>
</el-scrollbar>
</div>
</template>
<script>
import dayjs from 'dayjs'
import api from '@/api'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const columns = [
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "上次构建状态",
    dataIndex: "lastStatus",
    key: "lastStatus",
    scopedSlots: { customRender: "lastStatus" }
  },
  {
    title: "上次成功",
    dataIndex: "lastSucceededTime",
    key: "lastSucceededTime",
    customRender: (text, row, index) => {
        return text ? dayjs(new Date()).diff(dayjs(text),'day') + "天" + ( dayjs(new Date()).diff(dayjs(text),'hour') - dayjs(new Date()).diff(dayjs(text),'day') * 24 ) + "小时" +  + (dayjs(new Date()).diff(dayjs(text),'minute') - dayjs(new Date()).diff(dayjs(text),'hour') * 60) + "分" : "无"
    },
  },
  {
    title: "上次失败",
    key: "lastFailedTime",
    dataIndex: "lastFailedTime",
    customRender: (text, row, index) => {
        return text ? dayjs(new Date()).diff(dayjs(text),'day') + "天" + ( dayjs(new Date()).diff(dayjs(text),'hour') - dayjs(new Date()).diff(dayjs(text),'day') * 24 ) + "小时" +  + (dayjs(new Date()).diff(dayjs(text),'minute') - dayjs(new Date()).diff(dayjs(text),'hour') * 60) + "分" : "无"
    },
  },
  {
    title: "",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  data() {
    return {
      data : [],
      columns,
      locale:zhCN,
      zhCN
    };
  },
  mounted(){
    let that = this;
    api.GET_PIPELINE_API().then(res => {
        that.data = res
        that.data.forEach((item, index) => {
            item.key = index
        })
    })
  },
  methods: {
    rowClassName(record,index) {
      let className = "light-row";
      if (index % 2 === 1) className = "dark-row";
      return className;
    },
    handlePipelineClick(id){
        this.$router.push({path: '/ci/job/' + id});
    },
    runPipeline(id, name){
        api.RUN_PIPELINE_API(id).then(res => {
            this.$message.success('Pipeline ' + name + ' 开始构建');      
        })
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

.light-row {background-color: #fff;}
.dark-row {background-color: #FBFBFB;}
</style>