<template></template>

<script>
import Oidc from "oidc-client";
import setting from "@/setting"

var mgr = new Oidc.UserManager(setting.oidcConfig);
export default {
  beforeCreate() {
    mgr.signinRedirect();
  }
};
</script>
