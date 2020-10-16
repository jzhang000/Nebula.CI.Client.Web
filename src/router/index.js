import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import pipelineTable from '@/components/pipelineTable'
import pipelineDiagram from '@/components/ef/panel'
import job from '@/components/job'
import pipelineStatus from '@/components/job/pipelineStatus'
import builds from '@/components/builds'
import middle from '@/components/middle'
import build from '@/components/build'
import buildStatus from '@/components/build/buildStatus'
import plugin from '@/components/build/plugin'

import console from '@/components/build/console'

import CallBack from '@/components/oidc/CallBack'
import login from '@/components/oidc/login'

Vue.use(Router)
import layoutHeaderAside from '@/layout'
import cookies from '@/libs/util.cookies'

import Oidc from "oidc-client";
import setting from "@/setting";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
const router = new Router({
    routes: [{
            path: '/',
            redirect: { name: 'index' },
            component: layoutHeaderAside,
            children: [{
                    path: 'ci/index',
                    name: 'index',
                    meta: {
                        title: '首页',
                        auth: true
                    },
                    redirect: { name: 'jobView' },
                    component: HomePage,
                    children: [{
                            path: 'jobView',
                            name: 'jobView',
                            meta: {
                                title: '我的Pipeline',
                                auth: true
                            },
                            component: pipelineTable
                        },
                        {
                            path: 'builds',
                            name: 'builds',
                            meta: {
                                title: '构建历史',
                                auth: true
                            },
                            component: builds
                        }
                    ]
                },
                {
                    path: 'ci/job/:pipelineId',
                    name: 'job',
                    meta: {
                        title: '',
                        auth: true
                    },
                    redirect: { name: '/' },
                    component: job,
                    children: [{
                        path: '/',
                        name: '/',
                        meta: {
                            title: 'Pipeline状态',
                            auth: true
                        },
                        component: pipelineStatus
                    }]
                },
                {
                    path: 'ci/pipeline/:pipelineId/configure',
                    name: 'diagram',
                    component: pipelineDiagram,
                    meta: {
                        title: 'pipeline配置',
                        auth: true
                    },
                },
                {
                    path: 'ci/job/:pipelineId/:buildId',
                    name: 'build',
                    component: build,
                    redirect: { name: 'buildstatus' },
                    children: [{
                            path: '/',
                            name: 'buildstatus',
                            meta: {
                                title: '构建状态',
                                auth: true
                            },
                            component: buildStatus
                        },
                        {
                            path: 'console',
                            name: 'console',
                            meta: {
                                title: '控制台输出',
                                auth: true
                            },
                            component: console
                        },
                        {
                            path: 'plugin/:pluginName',
                            name: 'plugin',
                            meta: {
                                title: '插件',
                                auth: true
                            },
                            component: plugin
                        }
                    ]
                },
                {
                    path: 'middle/:pipelineId',
                    name: 'middle',
                    meta: {
                        title: '中间页面',
                        auth: true
                    },
                    component: middle
                },
            ]
        },
        {
            path: '/CallBack',
            name: 'CallBack',
            component: CallBack
        },
        {
            path: '/login',
            name: 'login',
            component: login
        }
    ]
})

router.beforeEach(async(to, from, next) => {
    NProgress.start()
        // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
        // 这里暂时将cookie里是否存有token作为验证是否登录的条件
        // 请根据自身业务需要修改
        const token = cookies.get('token')
        if (token && token !== 'undefined') {
            next()
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            var identifyconfig = {
                authority: process.env.AUTHORITY_URL ? process.env.AUTHORITY_URL : config.oidcConfig.authority,
                client_id: "Nebula.Identity",
                redirect_uri: process.env.CLIENT_URL ? (process.env.CLIENT_URL + "/CallBack") : (config.oidcConfig.redirect_uri + "/CallBack"),
                response_type: "id_token token",
                scope: "openid profile api",
                post_logout_redirect_uri: process.env.CLIENT_URL ? (process.env.CLIENT_URL + "/") : (config.oidcConfig.redirect_uri + "/")
            };
            var mgr = new Oidc.UserManager(identifyconfig);
            mgr.getUser().then(async function(user) {
                    if (user) {
                        cookies.set('username', user.profile.name)
                        cookies.set('token', user.access_token)

                        next()
                    } else {
                        next({
                            name: 'login',
                            query: {
                                redirect: to.fullPath
                            }
                        })
                    }
                })
                // https://github.com/d2-projects/d2-admin/issues/138
            NProgress.done()
        }
    } else {
        // 不需要身份校验 直接通过
        next()
    }
})

router.afterEach(to => {
    // 进度条
    NProgress.done()

})

export default router