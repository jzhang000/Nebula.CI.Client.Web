<template>
  <el-scrollbar style="height: 90%">
    <div>
      <div>
        <label>型号名称：</label
        ><a-input
          class="leftInput"
          v-model="form.modelName"
          :maxLength="maxlength"
          @change="check"
        />
        <label class="rightLabel">软件名称：</label
        ><a-input
          class="rightInput"
          v-model="form.softwareName"
          :maxLength="maxlength"
          @change="check"
        />
      </div>
      <div class="labelDiv">
        <label>软件简称：</label
        ><a-input
          class="leftInput"
          v-model="form.softwareShort"
          :maxLength="maxlength"
          @change="check"
        />
        <label class="rightLabel">软件代号：</label
        ><a-input
          class="rightInput"
          v-model="form.softwareCode"
          :maxLength="maxlength"
          @change="check"
        />
      </div>
      <div class="labelDiv">
        <label>软件等级：</label
        ><a-input
          class="leftInput"
          v-model="form.softwareLevel"
          :maxLength="maxlength"
          @change="check"
        />
        <label class="rightLabel">所属系统：</label
        ><a-input
          class="rightInput"
          v-model="form.belongedSystem"
          :maxLength="maxlength"
          @change="check"
        />
      </div>
      <div class="labelDiv">
        <label>运行环境：</label
        ><a-input
          class="leftInput"
          v-model="form.runEnvironment"
          :maxLength="maxlength"
          @change="check"
        />
        <label class="rightLabel">研制部门：</label
        ><a-input
          class="rightInput"
          v-model="form.developDepartment"
          :maxLength="maxlength"
          @change="check"
        />
      </div>
      <div class="labelDiv">
        <label>项目总师：</label
        ><a-input
          class="leftInput"
          v-model="form.projectChief"
          :maxLength="maxlength"
          @change="check"
        />
        <label class="rightLabel">主任设计师：</label
        ><a-input
          class="leftInput"
          v-model="form.chiefDesigner"
          :maxLength="maxlength"
          @change="check"
        />
      </div>
      <div class="labelDiv">
        <label>开发人员：</label
        ><a-input
          class="leftInput"
          v-model="form.developer"
          :maxLength="maxlength"
          @change="check"
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
      noSpecialCharacter: true
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
      if(this.noSpecialCharacter){
        let that = this;
        api.SET_PIPELINE_INFO(that.form).then(res =>{
          if(res == ""){
            that.$message.success('保存成功' );  
          }
        })    
      } else {
        this.$message.error("不允许特殊字符,请检查")
      }  
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
    check(value){
      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if(value.data && !reg.test(value.data)){
        this.$message.error("不允许特殊字符")
        this.isHaveSpecialCharacter = false
      } else {
        this.isHaveSpecialCharacter = true
      }
    }
  },
};
</script>

<style scoped>

.labelDiv {
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