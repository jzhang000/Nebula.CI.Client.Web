<template>
    
</template>
<script>
export default {
    data(){
        this.$router.replace({
            path:"/ci/job/" + this.$route.params.pipelineId,
            name: "job"
        })

        return {

        }
    },
    method:{

    }
}
</script>