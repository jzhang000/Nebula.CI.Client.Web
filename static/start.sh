#!/bin/bash
baseUrl_new="\    baseUrl: \"$1\","
authority_new="\        authority: \"$2\","
redirect_uri_new="\        redirect_uri: \"$3\","
post_logout_redirect_uri_new="\        post_logout_redirect_uri: \"$3\","
sed -i  "/^    baseUrl/c$baseUrl_new" config.js
sed -i  "/^        authority/c$authority_new" config.js
sed -i  "/^        redirect_uri/c$redirect_uri_new" config.js
sed -i  "/^        post_logout_redirect_uri/c$post_logout_redirect_uri_new" config.js
