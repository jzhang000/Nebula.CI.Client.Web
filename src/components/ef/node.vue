<template>
  <el-tooltip :disabled="tooltipDisabled" placement="right">
    <div slot="content" class="fy_tooltip_content">节点名称：{{text}}</div>
    <div
      ref="node"
      :style="nodeContainerStyle"
      @click="clickNode"
      @mousedown="tooltipDisabled=true"
      @mouseup="changeNodeSite"
      @dblclick="dbclick"
      :class="nodeContainerClass"
    >
      <!-- 最左侧的那条竖线 -->
      <div class="ef-node-left"></div>
      <!-- 节点类型的图标 -->
      <div class="ef-node-left-ico flow-node-drag">
        <i :class="nodeIcoClass"></i>
      </div>
      <!-- 节点名称 -->
      <div class="ef-node-text" :show-overflow-tooltip="true">{{node.annoName}}</div>
      <!-- 节点状态图标 -->
      <div class="ef-node-right-ico">
        <i
          class="el-icon-circle-check el-node-state-success"
          draggable
          v-show="node.state === 'success'"
        ></i>
        <i
          class="el-icon-circle-close el-node-state-error"
          draggable
          v-show="node.state === 'error'"
        ></i>
        <i
          class="el-icon-warning-outline el-node-state-warning"
          draggable
          v-show="node.state === 'warning'"
        ></i>
        <i
          class="el-icon-loading el-node-state-running"
          draggable
          v-show="node.state === 'running'"
        ></i>
      </div>
    </div>
  </el-tooltip>
</template>

<script>
import { MessageBox, Message } from "element-ui";

export default {
  props: {
    node: Object,
    activeElement: Object
  },
  data() {
    return {
      tooltipDisabled: false,
      text: this.node.annoName
    };
  },
  computed: {
    nodeContainerClass() {
      return {
        "ef-node-container": true,
        "ef-node-active":
          this.activeElement.type == "node"
            ? this.activeElement.nodeId === this.node.id
            : false
      };
    },
    // 节点容器样式
    nodeContainerStyle() {
      return {
        top: this.node.top,
        left: this.node.left
      };
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.ico] = true;
      // 添加该class可以推拽连线出来
      nodeIcoClass["flow-node-drag"] = true;
      return nodeIcoClass;
    }
  },
  methods: {
    // 点击节点
    clickNode() {
      this.$emit("clickNode", this.node);
    },
    // 鼠标移动后抬起
    changeNodeSite() {
      this.tooltipDisabled = false;
      // 避免抖动
      if (
        this.node.left == this.$refs.node.style.left &&
        this.node.top == this.$refs.node.style.top
      ) {
        return;
      }
      this.$emit("changeNodeSite", {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      });
    },
    dbclick() {
      MessageBox.prompt("请输入新名称", "重命名", {
        confirmButtonText: "确定",
        inputValue: this.node.annoName,
        inputPattern: /^[\da-z\u2E80-\u9FFF\+\-\_]{1,21}$/i,
        inputErrorMessage: "节点名称不符合要求,请检查",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(({ value }) => {
          if (value.trim() == "") {
            this.$message.error("节点名称不允许为空");
            return;
          }

          if (value.length > config.maxWorkflowNameLength) {
            this.$message.error("节点名称超过20个字符，请调整长度");
            return;
          }

          var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9\+\-]+$/
          if (!reg.test(value.trim())) {
            this.$message.error("节点名称不允许特殊字符");
            return false;
          }

          this.node.annoName = value;
          this.text = value;

          this.tooltipDisabled = false;
          this.$emit("dbclick", this.node);
        })
        .catch(() => {});
    }
  }
};
</script>
