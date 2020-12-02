<template>
  <el-scrollbar style="height: 90%">
    <div>
      <div style="min-width:1010px">
        <label>型号名称：</label
        ><a-input
          class="leftInput"
          v-model="form.modelName"
          id="modelName"
          @change="checkLength"
        />
        <label class="rightLabel">软件名称：</label
        ><a-input
          class="rightInput"
          v-model="form.softwareName"
          id="softwareName"
          @change="checkLength"
        />
      </div>
      <div class="labelDiv">
        <label>软件简称：</label
        ><a-input
          class="leftInput"
          v-model="form.softwareShort"
          id="softwareShort"
          @change="checkLength"
        />
        <label class="rightLabel">软件代号：</label
        ><a-input
          class="rightInput"
          v-model="form.softwareCode"
          id="softwareCode"
          @change="checkLength"
        />
      </div>
      <div class="labelDiv">
        <label>软件等级：</label
        ><a-input
          class="leftInput"
          v-model="form.softwareLevel"
          id="softwareLevel"
          @change="checkLength"
        />
        <label class="rightLabel">所属系统：</label
        ><a-input
          class="rightInput"
          v-model="form.belongedSystem"
          id="belongedSystem"
          @change="checkLength"
        />
      </div>
      <div class="labelDiv">
        <label>运行环境：</label
        ><a-input
          class="leftInput"
          v-model="form.runEnvironment"
          id="runEnvironment"
          @change="checkLength"
        />
        <label class="rightLabel">研制部门：</label
        ><a-input
          class="rightInput"
          v-model="form.developDepartment"
          id="developDepartment"
          @change="checkLength"
        />
      </div>
      <div class="labelDiv">
        <label>项目总师：</label
        ><a-input
          class="leftInput"
          v-model="form.projectChief"
          id="projectChief"
          @change="checkLength"
        />
        <label class="rightLabel">主任设计师：</label
        ><a-input
          class="leftInput"
          v-model="form.chiefDesigner"
          id="chiefDesigner"
          @change="checkLength"
        />
      </div>
      <div class="labelDiv">
        <label>开发人员：</label
        ><a-input
          class="leftInput"
          v-model="form.developer"
          id="developer"
          @change="checkLength"
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
          that.$message.success('保存成功');  
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
    },
    checkLength(event){
      let value = event.srcElement.value

      if(value.length > this.maxlength){
        this.$message.error("字符长度超过50个")

        let id = event.srcElement.id
        this.form[id] = value.substring(0,this.maxlength)
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