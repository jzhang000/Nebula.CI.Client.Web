<template>
  <g class="pipeline-node-end">
    <rect rx="13" id="svg_1" height="26" width="40" y="-13" x="-12" stroke-width="1.5" class="circle-end"/>
    <text id="svg_2" x="-4" y="4" class="pipeline-node-end__text">{{label}}</text>
  </g>
</template>
<script>
export default {
  props: {
    label: {
      type: String
    }
  }
};
</script>

<style lang="css">
.pipeline-node-end .circle-end {
  stroke: none;
  fill: #8cc04f;
}

.pipeline-node-end__text {
  stroke: none;
  fill:  #fff;
  font-weight: bold;
  font-size: 12px;
}
</style>