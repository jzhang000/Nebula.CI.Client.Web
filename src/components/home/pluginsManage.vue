<template>
  <div style="height: 100%">
      <div style="padding-bottom: 10px">
        <a-upload style="float: left;padding-right: 20px" :showUploadList="false" name="file" action="" accept=".json" :before-upload="uploadPlugin">
          <a-button type="primary"> <a-icon type="cloud-upload" />上传插件</a-button>
        </a-upload>
        <a-input-search v-model="searchStr" placeholder="输入插件名称" style="width: 200px" @change="onSearch" @search="onSearch" />
      </div>
    <el-scrollbar class="plugin-scrollbar">
      <a-config-provider :locale="locale">
        <a-table
          v-if="data && data.length"
          :columns="columns"
          :data-source="dataForShow"
          :pagination="{ pageSize: 10 }"
          :defaultExpandAllRows="true"
          :expandIconAsCell="false"
          :expandIconColumnIndex="-1"
        >
          <span slot="name" slot-scope="text, record">
            <span style="font-weight: 600; color: #0b6aa2">{{ text }}</span>
            <br />
            <br />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ record.description }}</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button @click="deletePlugin(record)" style="border-color:#9ba7af;color:#000"
              ><a-icon type="delete" />删除</a-button
            >
          </span>
        </a-table>
      </a-config-provider>
    </el-scrollbar>
  </div>
</template>
<script>
import api from "@/api";
import zhCN from "ant-design-vue/es/locale/zh_CN";
const columns = [
  {
    dataIndex: "annoName",
    key: "annoName",
    title: "插件名称",
    scopedSlots: { customRender: "name" },
    sorter: (a, b) => a.annoName.length - b.annoName.length,
    ellipsis: true,
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
      zhCN,
      locale: zhCN,
      searchStr: ""
    };
  },
  mounted() {
    let that = this;
    api.PLUGIN_API().then((res) => {
      that.data = res;
      that.data.forEach((item, index) => {
        item.key = index;
        item.description = "测试";
      });
      that.dataForShow = that.data
    });
  },
  methods: {
    uploadPlugin(file){
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        console.log(e.target.result)
      };
      return false;
    },
    onSearch(){
      if(this.searchStr != ""){
        this.dataForShow = this.data.filter(item => item.annoName.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1)
      } else {
        this.dataForShow = this.data
      }
    },
    deletePlugin(record) {
      this.$confirm("确定要删除插件 " + record.annoName + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      }).then(() => {
          alert("点了删除");
      }).catch(() => {

      });
    },
  },
};
</script>
<style scoped>
.plugin-scrollbar{
  height: calc(100% - 100px);
}
</style>