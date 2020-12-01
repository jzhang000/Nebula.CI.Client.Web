<template>
  <el-scrollbar style="height: 90%">
    <div>
      <div style="min-width:1010px">
        <label>型号名称：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.modelName"
          :maxLength="maxlength"
          @blur="check"
          id="modelName"
        />
        <label class="rightLabel">软件名称：</label
        ><el-input
          size="small"
          class="rightInput"
          v-model="form.softwareName"
          :maxLength="maxlength"
          @blur="check"
          id="softwareName"
        />
      </div>
      <div class="labelDiv">
        <label>软件简称：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.softwareShort"
          :maxLength="maxlength"
          id="softwareShort"
          @blur="check"
        />
        <label class="rightLabel">软件代号：</label
        ><el-input
          size="small"
          class="rightInput"
          v-model="form.softwareCode"
          :maxLength="maxlength"
          @blur="check"
          id="softwareCode"
        />
      </div>
      <div class="labelDiv">
        <label>软件等级：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.softwareLevel"
          :maxLength="maxlength"
          @blur="check"
          id="softwareLevel"
        />
        <label class="rightLabel">所属系统：</label
        ><el-input
          size="small"
          class="rightInput"
          v-model="form.belongedSystem"
          :maxLength="maxlength"
          @blur="check"
          id="belongedSystem"
        />
      </div>
      <div class="labelDiv">
        <label>运行环境：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.runEnvironment"
          :maxLength="maxlength"
          @blur="check"
          id="runEnvironment"
        />
        <label class="rightLabel">研制部门：</label
        ><el-input
          size="small"
          class="rightInput"
          v-model="form.developDepartment"
          :maxLength="maxlength"
          @blur="check"
          id="developDepartment"
        />
      </div>
      <div class="labelDiv">
        <label>项目总师：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.projectChief"
          :maxLength="maxlength"
          @blur="check"
          id="projectChief"
        />
        <label class="rightLabel">主任设计师：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.chiefDesigner"
          :maxLength="maxlength"
          @blur="check"
          id="chiefDesigner"
        />
      </div>
      <div class="labelDiv">
        <label>开发人员：</label
        ><el-input
          size="small"
          class="leftInput"
          v-model="form.developer"
          :maxLength="maxlength"
          @blur="check"
          id="developer"
        />
      </div>
      <div class="btn">
        <a-button type="primary" @click="onSubmit"> 保存 </a-button>
        <a-button type="danger" style="margin-left: 10px" @click="resetForm">
          重置
        </a-button>
      </div>
    </div>
  </el-scrollbar>
</template>
<script>
import api from "@/api";

export default {
  data() {
    return {
      form: {
        id : this.$route.params.pipelineId,
        developer: "",
        chiefDesigner: "",
        projectChief: "",
        developDepartment: "",
        runEnvironment: "",
        belongedSystem: "",
        softwareLevel: "",
        softwareCode: "",
        softwareShort: "",
        softwareName: "",
        modelName: "",
      },
      maxlength:config.maxInputLength,
    };
  },
  mounted() {
      let that = this;
      api.GET_PIPELINE_INFO(that.$route.params.pipelineId).then(res =>{
          if(res){
              that.form = res
          }
      })
  },
  methods: {
    onSubmit() {
      let that = this;
        api.SET_PIPELINE_INFO(that.form).then(res =>{
          if(res == ""){
            that.$message.success('保存成功' );  
          }
        })    
    },
    resetForm() {
      this.form =  {
        id : this.$route.params.pipelineId,
        developer: "",
        chiefDesigner: "",
        projectChief: "",
        developDepartment: "",
        runEnvironment: "",
        belongedSystem: "",
        softwareLevel: "",
        softwareCode: "",
        softwareShort: "",
        softwareName: "",
        modelName: "",
      }
    },
    check(event){
      let value = event.srcElement.value
      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9\+\-]+$/
      if(value && !reg.test(value)){
        this.$message.error("不允许特殊字符")

        let id = event.srcElement.id
        this.form[id] = ""
      }
    }
  },
};
</script>

<style scoped>

.labelDiv {
  min-width: 1010px;
  padding-top: 30px;
}

.leftInput {
  width: 40%;
}

.rightInput {
  width: 40%;
  margin-left: 13px;
}

.rightLabel {
  padding-left: 40px;
}

.btn{
    padding-top:100px;
    text-align:center
}
</style>