<template></template>

<script>
import Oidc from "oidc-client";

  var identifyconfig = {
    authority: process.env.AUTHORITY_URL ? process.env.AUTHORITY_URL : config.oidcConfig.authority,
    client_id: "Nebula.Identity",
    redirect_uri: process.env.CLIENT_URL ? process.env.CLIENT_URL + "/CallBack" : config.oidcConfig.redirect_uri + "/CallBack",
    response_type: "id_token token",
    scope: "openid profile api",
    post_logout_redirect_uri: process.env.CLIENT_URL ? process.env.CLIENT_URL + "/" : config.oidcConfig.redirect_uri + "/",
  };

var mgr = new Oidc.UserManager(identifyconfig);
export default {
  beforeCreate() {
    mgr.signinRedirect();
  }
};
</script>
