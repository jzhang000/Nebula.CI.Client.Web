<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="height:100vh; position: fixed;width:100%"
  >
    <a-layout-sider
      width="300px"
      :style="{ overflow: 'auto', width:'300px', height: '100vh', position: 'fixed', left: 0, padding:'1rem 0 2.5rem 0', background: '#fff'}"
    >

      <a-menu
        @click="handleClick"
        class="menu"
        mode="inline"
        :selectedKeys="defaultkey"
        style="width:300px">
        <a-menu-item key="1">
          <img src="/static/24x24/search.png" />
          <span>构建状态</span>
        </a-menu-item>
        <a-menu-item key="2">
          <img src="/static/24x24/terminal.png" />
          <span>构建信息</span>
        </a-menu-item>
        <a-menu-item key="3">
          <img src="/static/24x24/redo.png" />
          <span>回放</span>
        </a-menu-item>
        <a-menu-item key="4">
          <img src="/static/24x24/gear2.png" />
          <span>导出配置</span>
        </a-menu-item>
        <a-menu-item key="5">
          <img src="/static/24x24/edit-delete.png" />
          <a-popconfirm
            title="确定要删除本次构建?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm"
            placement="right"
            >
            <span href="#">删除构建#{{this.buildNo}}</span>
          </a-popconfirm>
        </a-menu-item>
        <a-menu-item v-for="item in additionalMenu" :key="item.name" @click="pluginClick(item.name, item.resultUrl)">
            <img :src="item.img != '' ? item.img : '/static/24x24/plugin.png'"/>
            <span href="#">{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content
        :style="{ margin: '0 0 4px 302px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <keep-alive>
          <router-view />
        </keep-alive>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import lodash from "lodash";
import api from '@/api'
export default {
  data() {
    return {
      buildNo:"",
      diagram:"",
      pipelineName : "",
      defaultkey : ['1'],
      additionalMenu : [
            //{"name" : "git", "resultUrl" : "http://github.com", img : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB4klEQVRIS7WVoU8jQRTGvzeCHATDFgyKtiQk18slBByIOszZ1uHOnUO1W9Gt2FadwxEMsiBRGDB3gsApSkJC9/6Ao8UgIIR5l2m77ZbO7sxdYN3szLzffO9984bwzh+9c3xYA5yM6xHoizoQg4+7Qd2zOZwVwElXCkTcjAZkoGYDMQJU8O5v/3AuW94QTPsAVkKQDSQRkEqXt0F0IIk379uNHws5b/bl8fkzSemDKN9PV7KSWICTdr8SYW9w2hsxPbX+p+U9qPHCcmlVSvHLRokWkEq730DYHcs50Ua37f9U/xYXvZmnD8/nAOdMkAmAk6nsEPj7pEPopBP4W+F/Z7n8kaRomiBjgFTGLQOox9mvE9R761Xw7m3j2gYyBPR9jmqSt0NAKlO5YiGLChICIakY7o8WfghQm6JydaARwGWAWp3A/xSum18q5VmI0/54NBcFXAC8ZqdAAQAWnIuqIEmtAeCyE/jrPdSwaP+UogEAqAkpz1QMKUQ+MUW9XCZAiHB4164X1br5rNtkRkGn9vXF09hUX+z4dIwwulutvWg6JSZAXMuIbxWv0qUC6PJt6keJzc7mbvx3s7Nxlyn4mE2T/K+tyVs9OBElVQL1rMngI5vXzFpBkjrTnPHJNAUwzf8Fruz4Gbvufl8AAAAASUVORK5CYII="}
          ],
    };
  },
  components: {
    
  },
  mounted(){
    if(this.$route.name == "plugin"){
        this.defaultkey = [this.$route.params.pluginName]       
        this.$router.push({name: "plugin", params:{pluginName : this.$route.params.pluginName, resultUrl : this.additionalMenu.find(item => item.name == this.$route.params.pluginName).resultUrl}});       
    } else if(this.$route.name == "console") {
        this.defaultkey = ['2']
    } else {
        this.defaultkey = ['1']
    }

    api.PIPELINE_BUILD_DETAIL_API(this.$route.params.buildId).then(res => {
        this.buildNo = res.no
        this.diagram = res.diagram
        this.pipelineName = res.pipelineName

        let tasks = JSON.parse(res.logs)
        let diagram = JSON.parse(res.diagram)
        let nodeList = diagram.nodeList
        tasks.forEach(task => {
            if(task.ResultUrl && task.ResultUrl != ""){
                let node = nodeList.find(n => n.id == task.ShapeId)
                let resultUrl = task.ResultUrl + "?id=" + res.id + "&property=" + node.property
                console.log(resultUrl)
                this.additionalMenu.push({name: task.TaskAnnoName, resultUrl:resultUrl, img:task.img ? task.img : ""})
            }
        })
    })
  },
  methods: {
    handleClick(e) {
      switch (e.key) {
        case "1":
          this.$router.push({path: '/ci/job/' + this.$route.params.pipelineId + "/" + this.$route.params.buildId});
          this.defaultkey = ['1']
          break;
        case "2":
          //构建信息
          this.$router.push({path: '/ci/job/' + this.$route.params.pipelineId + "/" + this.$route.params.buildId + "/console"});
          this.defaultkey = ['2']
          break;
        case "3":
          this.buidlPipeline()
          break;
        case "4":
          //导出pipeline配置
          this.downloadConfig()
          break;
        case "5":
          //删除pipeline
          break;
      }
    },
    confirm(e) {
      //api 删除build
        api.DELETE_PIPELINE_BUILD_API(this.$route.params.buildId).then(res => {
          this.$message.success('删除构建成功');
          this.$router.push({path: '/ci/job/' + this.$route.params.pipelineId});  
        })
    },
    buidlPipeline(){
      console.log(this.diagram)
      api.REBACK_PIPELINE_API(this.$route.params.pipelineId, this.diagram).then(res =>{
        this.$message.success('回放成功' );
        this.$router.push({path: '/ci/job/' + this.$route.params.pipelineId});
      })
    },
    pluginClick(name, url){
        this.defaultkey = [name]
        this.$router.push({name: "plugin", params:{pluginName : name, resultUrl : url}});  
    },
    downloadConfig(){
      this.$confirm('确定要下载该版本pipeline配置数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSON.parse(this.diagram), null, '\t'));
                    var downloadAnchorNode = document.createElement('a')
                    downloadAnchorNode.setAttribute("href", datastr);
                    downloadAnchorNode.setAttribute("download", this.pipelineName + "_" + this.buildNo +'.json')
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    this.$message.success("正在下载中,请稍后...")
                }).catch(() => {}
      )
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
</style>
