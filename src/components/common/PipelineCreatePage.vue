<template>
  <a-modal
    v-model="dialogVisible"
    ok-text="确认"
    cancel-text="取消"
    :title="title"
    @ok="handleOk"
  >
    <div>
      <label>工作流名称:</label>
      <a-input
        placeholder="输入工作流名称"
        allowClear
        v-model="name"
        style="width: 300px; padding-left: 10px"
      />
    </div>
    <div style="margin-top:20px" v-if="this.id == ''">
      <label>选择模板&nbsp;&nbsp;&nbsp;&nbsp;:</label>
      <a-radio-group v-model="value" style="margin-left:10px" @change="onChange">
        <a-radio :value="0"> 否 </a-radio>
        <a-radio :value="1"> 是 </a-radio>
      </a-radio-group>
      <a-select 
        v-model="templateValue" style="margin-left:10px;width:210px" 
        v-show="isTemplateSelected"  
        :autoClearSearchValue="false"
        show-search
        :filter-option="true">
      <a-select-option v-for="item in templates" :key="item.id" :value="item.name">{{ item.name }}</a-select-option>
      </a-select>
    </div>
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
      diagram: "{}",
      title: "创建工作流",
      value: 0,
      templateValue: "",
      isTemplateSelected: false,
      templates: []
    };
  },
  mounted() {},
  methods: {
    init() {
      let that = this;
      if (that.id != "") {
        api.GET_PIPELINE_BY_ID_API(that.id).then((res) => {
          that.name = res.name;
          that.diagram = res.diagram;
        });
        that.title = "更改工作流名称";
      } else {
        api.GET_TEMPLATE_PIPELINE().then(res => {
          if(res && res.length > 0){
            that.templates = res;
            that.templateValue = that.templates[0].name
          }
        })
      }

      that.dialogVisible = true;
    },
    onChange(e){
      if(e.target.value == 0){
        this.isTemplateSelected = false;
        this.templateValue = this.templates[0].name;
      } else {
        this.isTemplateSelected = true;
      }
    },
    handleOk() {
      if (this.name == "") {
        this.$message.error("请输入工作流名称");
        return;
      }

      if(this.value == 1 && this.templateValue == "") {
        this.$message.error("请选择模板");
        return;
      }

      let that = this;
      api.GET_PIPELINE_API().then((res) => {
        let isPipelineNameUnique = true;
        res.forEach((pipeline) => {
          if (pipeline.name == that.name) {
            isPipelineNameUnique = false;
            return false;
          }
        });

        if (isPipelineNameUnique) {
          if (that.id == "") {
            if(that.value == 1){
              let template = that.templates.find(e => e.name == that.templateValue)
              that.diagram = template.diagram
            }

            api.CREATE_PIPELINE_API(that.name, that.diagram).then((res) => {
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
              diagram: JSON.stringify(diagram),
            };
            api.SAVE_PIPELINE_API(pipelineData).then((res) => {
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
    },
  },
};
</script>
