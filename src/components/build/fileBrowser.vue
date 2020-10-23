<template>
    <iframe :src="src" ref="iframe" width="100%" height="100%" frameborder="no" border="0" style="padding-bottom:30px"></iframe>
</template>
<script>
export default {
  data() {
    return {
      src : "",
    };
  },
  mounted() {
      this.src = window.location.origin + "/" + this.$route.params.resultUrl
  }
}
</script>

