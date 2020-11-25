const config = {
    baseUrl: "http://192.168.1.156",
    oidcConfig: {
        authority: "http://192.168.1.156:32002",
        client_id: "Nebula.Identity",
        redirect_uri: "http://192.168.2.199:4200",
        response_type: "id_token token",
        scope: "openid profile api",
        post_logout_redirect_uri: "http://192.168.2.199:4200"
    },
    maxWorkflowNameLength: 20,
    maxInputLength:50,
    title: "敏捷自动化测试平台"
}