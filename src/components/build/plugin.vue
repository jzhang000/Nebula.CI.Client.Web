<template>
    <iframe :src="src" ref="iframe" width="100%" height="100%" frameborder="no" border="0" style="padding-bottom:30px"></iframe>
</template>
<script>
import lodash from "lodash";

export default {
  data() {
    return {
      src : process.env.API_BASE_URL + this.$route.params.resultUrl,
    };
  },
  mounted(){
    
  },
  beforeRouteUpdate(to,from,next){
    this.src= process.env.API_BASE_URL + to.params.resultUrl;
    next();
  }
}
</script>

