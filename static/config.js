const config = {
    baseUrl: "http://172.18.67.150",
    oidcConfig: {
        authority: "http://172.18.67.150:32002",
        client_id: "Nebula.Identity",
        redirect_uri: "http://172.18.67.101:4200",
        response_type: "id_token token",
        scope: "openid profile api",
        post_logout_redirect_uri: "http://172.18.67.101:4200"
    },
    maxWorkflowNameLength: 20,
    maxInputLength:50,
    title: "敏捷自动化测试平台"
}