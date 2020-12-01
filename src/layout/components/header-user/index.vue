<template>
  <a-dropdown>
    <a
      class="ant-dropdown-link"
      @click="(e) => e.preventDefault()"
      id="username"
    >
      <a-icon type="user" style="padding-right: 5px"/>{{ username ? `${username}` : "未登录" }}
    </a>
    <a-menu slot="overlay">
      <a-menu-item>
        <a @click="logOff" style="font-size:14px"><a-icon type="poweroff" />&nbsp;&nbsp;注销</a>
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
      username: window.sessionStorage.getItem("username"),
    };
  },
  computed: {},
  methods: {
    logOff() {
      window.sessionStorage.removeItem("username");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("userId")

      var mgr = new Oidc.UserManager(setting.oidcConfig);
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