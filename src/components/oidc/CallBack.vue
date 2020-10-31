<template>
</template>

<script>
import Oidc from "oidc-client";

new Oidc.UserManager()
  .signinRedirectCallback()
  .then(function() {
    window.location = "/#/ci/index";
  })
  .catch(function(e) {
    
  });
  export default{}
</script>