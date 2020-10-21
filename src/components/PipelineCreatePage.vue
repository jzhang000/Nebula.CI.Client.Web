<template>
  <a-modal v-model="dialogVisible" ok-text="确认" cancel-text="取消" :title="title" @ok="handleOk">
    <label>Pipeline名称:</label>
    <a-input
      placeholder="输入Pipeline名称"
      allowClear
      v-model="name"
      style="width:300px;padding-left:10px"
    />
  </a-modal>
</template>

<script>
import api from "@/api";
export default {
  props: {
    id: String,
  },
  data() {
    return {
      dialogVisible: false,
      name: "",
      diagram: "",
      title: "创建Pipeline",
    };
  },
  mounted() {},
  methods: {
    init() {
      if (this.id != "") {
        api.GET_PIPELINE_BY_ID_API(this.id).then((res) => {
            this.name = res.name
            this.diagram = res.diagram
        })
        this.title = "更改Pipeline名称";
      }

      this.dialogVisible = true;
    },
    handleOk() {
      if (this.name == "") {
        this.$message.error("请输入Pipeline名称");
        return;
      }

      var that = this;
      api.GET_PIPELINE_API().then((res) => {
        let isPipelineNameUnique = true;
        res.forEach((pipeline) => {
          if (pipeline.name == that.name) {
            isPipelineNameUnique = false;
            return false
          }
        });

        if (isPipelineNameUnique) {
          if (that.id == "") {
            api.CREATE_PIPELINE_API(that.name).then((res) => {
              that.$message.success("创建Pipeline成功");

              that.$router.push({ path: "/ci/pipeline/" + res.id + "/configure"});

              that.name = "";
              that.dialogVisible = false;
            });
          } else {
            let diagram = JSON.parse(that.diagram)
            diagram.name = that.name

            let pipelineData = { name: that.name, id: that.id, diagram : JSON.stringify(diagram)};
            api.SAVE_PIPELINE_API(pipelineData).then((res) => {
              that.$message.success("更新Pipeline成功");

              that.$router.push({ path: "/middle/" + that.id });

              that.name = "";
              that.dialogVisible = false;
            });
          }
        } else {
          that.$message.error("该pipeline名称已存在,请重新输入");
          return;
        }
      });
    },
  },
};
</script>
