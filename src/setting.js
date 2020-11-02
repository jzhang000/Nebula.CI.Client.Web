export default {
    oidcConfig: {
        authority: config.oidcConfig.authority,
        client_id: "Nebula.Identity",
        redirect_uri: config.oidcConfig.redirect_uri + "/CallBack",
        response_type: "id_token token",
        scope: "openid profile api",
        post_logout_redirect_uri: config.oidcConfig.redirect_uri + "/"
    }
}