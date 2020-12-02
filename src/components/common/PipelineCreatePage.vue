<template>
  <a-modal v-model="dialogVisible" ok-text="确认" cancel-text="取消" :maskClosable="modalClosable" :title="title" @ok="handleOk">
    <div>
      <label>工作流名称:</label>
      <a-input
        placeholder="输入工作流名称"
        allowClear
        v-model="name"
        :maxLength="maxLength"
        style="width: 300px; padding-left: 10px"
      />
    </div>
    <div style="margin-top:20px" v-if="this.id == ''">
      <label>选择模板&nbsp;&nbsp;&nbsp;&nbsp;:</label>
      <a-radio-group v-model="value" style="margin-left:10px" @change="onChange">
        <a-radio :value="0">否</a-radio>
        <a-radio :value="1">是</a-radio>
      </a-radio-group>
      <a-select
        v-model="templateValue"
        style="margin-left:10px;width:210px"
        v-show="isTemplateSelected"
        :autoClearSearchValue="false"
        show-search
        :filter-option="true"
      >
        <a-select-option v-for="item in templates" :key="item.id" :value="item.name">{{ item.name }}</a-select-option>
      </a-select>
    </div>
  </a-modal>
</template>

<script>
import api from "@/api";
export default {
  props: {
    id: String
  },
  data() {
    return {
      dialogVisible: false,
      modalClosable: false,
      name: "",
      odlName: "",
      diagram: '{"name":"","nodeList":[],"lineList":[]}',
      title: "创建工作流",
      value: 0,
      templateValue: "",
      isTemplateSelected: false,
      templates: [],
      maxLength: config.maxWorkflowNameLength
    };
  },
  mounted() {},
  methods: {
    init() {
      let that = this;
      if (that.id != "") {
        api.GET_PIPELINE_BY_ID_API(that.id).then(res => {
          that.name = res.name;
          that.odlName = res.name;
          that.diagram = res.diagram;
        });
        that.title = "更改工作流名称";
      } else {
        api.GET_TEMPLATE_PIPELINE().then(res => {
          if (res && res.length > 0) {
            that.templates = res;
            that.templateValue = that.templates[0].name;
          }
        });
      }

      that.dialogVisible = true;
    },
    onChange(e) {
      if (e.target.value == 0) {
        this.isTemplateSelected = false;
        if(this.templates.length > 0){
          this.templateValue = this.templates[0].name;
        }
      } else {
        this.isTemplateSelected = true;
      }
    },
    handleOk() {
      let that = this;

      if (that.name == "") {
        that.$message.error("请输入工作流名称");
        return;
      }

      if (that.value == 1 && that.templateValue == "") {
        that.$message.error("请选择模板");
        return;
      }

      if (that.name.length > config.maxWorkflowNameLength) {
        that.$message.error("工作流名称过长，请调整长度");
        return;
      }

      if (that.name.trim() == "") {
        that.$message.error("工作流名称不能为空");
        that.name = "";
        return;
      }

      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!reg.test(this.name.trim())) {
        that.$message.error("工作流名称不允许特殊字符");
        return;
      }

      if (that.name != that.odlName) {
        api.GET_PIPELINE_API().then(res => {
          let isPipelineNameUnique = true;
          res.forEach(pipeline => {
            if (pipeline.name == that.name) {
              isPipelineNameUnique = false;
              return false;
            }
          });

          if (isPipelineNameUnique) {
            if (that.id == "") {
              if (that.value == 1) {
                let template = that.templates.find(
                  e => e.name == that.templateValue
                );
                that.diagram = template.diagram;
              }

              let diagramCreate = JSON.parse(that.diagram);
              diagramCreate.name = that.name;

              api.CREATE_PIPELINE_API(that.name, JSON.stringify(diagramCreate)).then(res => {
                that.$message.success("创建工作流成功");

                that.$router.push({ path: "/ci/job/" + res.id + "/info" });

                that.name = "";
                that.dialogVisible = false;
              });
            } else {
              let diagram = JSON.parse(that.diagram);
              diagram.name = that.name;

              let pipelineData = {
                name: that.name,
                id: that.id,
                diagram: JSON.stringify(diagram)
              };
              api.SAVE_PIPELINE_API(pipelineData).then(res => {
                that.$message.success("更新工作流成功");

                that.$router.push({ path: "/middle/" + that.id });

                that.name = "";
                that.dialogVisible = false;
              });
            }
          } else {
            that.$message.error("该工作流名称已存在,请重新输入");
            return;
          }
        });
      } else {
        that.$message.error("工作流名称未更改");
      }
    }
  }
};
</script>
