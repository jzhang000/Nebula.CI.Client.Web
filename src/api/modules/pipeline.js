import { find, assign } from 'lodash'

const port = "6060"

export default ({ service, request }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    GET_PIPELINE_API() {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline',
            method: 'get',
            port: port
        })
    },

    GET_PIPELINE_BY_ID_API(id) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline/' + id,
            method: 'get',
            port: port
        })
    },

    CREATE_PIPELINE_API(pipelineName) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline',
            method: 'post',
            data: {
                name: pipelineName,
                diagram: "{}"
            },
            port: port
        })
    },

    SAVE_PIPELINE_API(pipeline) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline',
            method: 'put',
            data: JSON.stringify(pipeline),
            port: port
        })
    },

    DELETE_PIPELINE_API(pipelineId) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline/' + pipelineId,
            method: 'delete',
            port: port
        })
    },

    RUN_PIPELINE_API(pipelineId) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline/' + pipelineId + '/run',
            method: 'get',
            port: port
        })
    },

    REBACK_PIPELINE_API(pipelineId, diagram) {
        // 接口请求
        return request({
            url: '/api/ci/services/pipeline/' + pipelineId + '/run?diagram=' + diagram,
            method: 'get',
            port: port
        })
    },

    GET_PIPELINE_INFO(pipelineId) {
        return request({
            url: '/api/ci/services/pipeline/' + pipelineId + '/info',
            method: 'get',
            port: port
        })
    },

    SET_PIPELINE_INFO(pipelineInfo) {
        return request({
            url: '/api/ci/services/pipeline/info',
            method: 'put',
            port: port,
            data: JSON.stringify(pipelineInfo)
        })
    }
})