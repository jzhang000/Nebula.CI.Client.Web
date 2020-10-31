<template>
  <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <a-icon v-if="isFullscreen" type="fullscreen-exit" />
      <a-icon v-else type="fullscreen" style="font-size: 16px" />
    </el-button>
  </el-tooltip>
</template>
<script>
import screenfull from "screenfull";
export default {
  data() {
    return {
      isFullscreen: false,
    };
  },
  mounted() {
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
  },
  methods: {
    toggle() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    },
    checkFull() {
      var isFull = document.webkitIsFullScreen;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
  },
};
</script>
<style scoped>
.btn-text {
  padding: 14px 12px;
  border-radius: 4px;
  margin: 0px !important;
  color: #ffffff;
}
.can-hover:hover {
  background: #314255;
}
</style>