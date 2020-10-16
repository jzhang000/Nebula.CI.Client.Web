import { find, assign } from 'lodash'

const port = "6060"

export default ({ service, request }) => ({
    /**
     * @description 登录
     * @param {Object} data 登录携带的信息
     */
    TEST_API() {
        // 接口请求
        return request({
            url: '/api/app/pipeline',
            method: 'get',
            port: port
        })
    }
})