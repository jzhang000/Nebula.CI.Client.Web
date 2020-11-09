export default {
    oidcConfig: {
        authority: config.oidcConfig.authority,
        client_id: config.oidcConfig.client_id,
        redirect_uri: config.oidcConfig.redirect_uri + "/CallBack",
        response_type: config.oidcConfig.response_type,
        scope: config.oidcConfig.scope,
        post_logout_redirect_uri: config.oidcConfig.redirect_uri + "/"
    }
}