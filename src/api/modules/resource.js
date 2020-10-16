import { find, assign } from 'lodash'

const port = "32550"

export default ({ service, request }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    RESOURCE_API() {
        // 接口请求
        return request({
            url: '/api/ci/services/resource',
            method: 'get',
            port: port
        })
    },

    PLUGIN_API() {
        // 接口请求
        return request({
            url: '/api/ci/services/plugin',
            method: 'get',
            port: port
        })
    },

    PLUGININFO_API(id) {
        // 接口请求
        return request({
            url: '/api/ci/services/plugin/' + id,
            method: 'get',
            port: port
        })
    }
})