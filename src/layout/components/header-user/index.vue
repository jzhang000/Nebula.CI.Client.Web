<template>
  <a-dropdown>
    <a
      class="ant-dropdown-link"
      @click="(e) => e.preventDefault()"
      id="username"
    >
      {{ username ? `你好 ${username}` : "未登录" }}
    </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a @click="logOff"><a-icon type="poweroff" />&nbsp;&nbsp;注销</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
<script>
import cookies from "@/libs/util.cookies";
import setting from "@/setting";
import Oidc from "oidc-client";

export default {
  data() {
    return {
      username: cookies.get("username"),
    };
  },
  computed: {},
  methods: {
    logOff() {
      cookies.remove("username");
      cookies.remove("token");

      var identifyconfig = {
        authority: process.env.AUTHORITY_URL ? process.env.AUTHORITY_URL : config.oidcConfig.authority,
        client_id: "Nebula.Identity",
        redirect_uri: process.env.CLIENT_URL ? process.env.CLIENT_URL + "/CallBack" : config.oidcConfig.redirect_uri + "/CallBack",
        response_type: "id_token token",
        scope: "openid profile api",
        post_logout_redirect_uri: process.env.CLIENT_URL ? process.env.CLIENT_URL + "/" : config.oidcConfig.redirect_uri + "/",
      };

      console.info(identifyconfig)
      var mgr = new Oidc.UserManager(identifyconfig);
      mgr.signoutRedirect();

      this.$router.push({ path: "/login" });
    },
  },
};
</script>
<style scoped>
#username {
  color: #ffffff;
}
</style>