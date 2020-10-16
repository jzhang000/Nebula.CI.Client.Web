import { find, assign } from 'lodash'

const port = "32550"

export default ({ services, request }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    ALL_ACTIVE_BUILD_STATUS_API() {
        // 接口请求
        return request({
            url: '/api/ci/services/resource',
            method: 'get',
            port: port
        })
    },

    PIPELINE_BUILD_HISTORY_API(pipelineId) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipelineHistory?pipelineId=' + pipelineId,
            method: 'get',
            port: port
        })
    },

    PIPELINE_BUILD_DETAIL_API(buildID) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipelineHistory/' + buildID + '/detail',
            method: 'get',
            port: port
        })
    },

    GET_PIPELINE_RUNNING_API() {
        return request({
            url: '/api/ci/services/pipelineHistory/runningList',
            method: 'get',
            port: port
        })
    },

    DELETE_PIPELINE_BUILD_API(buildID) {
        return request({
            url: '/api/ci/services/pipelineHistory/' + buildID,
            method: 'delete',
            port: port
        })
    },

})