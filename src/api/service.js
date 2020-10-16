import axios from 'axios'
import {get } from 'lodash'
import cookies from '@/libs/util.cookies'
import { errorLog, errorCreate } from './tools'
import router from '../router'
/**
 * @description 创建请求实例
 */
function createService() {
    // 创建一个 axios 实例
    const service = axios.create()
        // 请求拦截
    service.interceptors.request.use(
            config => config,
            error => {
                // 发送失败
                console.log(error)
                return Promise.reject(error)
            }
        )
        // 响应拦截
    service.interceptors.response.use(
        response => {
            // dataAxios 是 axios 返回数据中的 data
            const dataAxios = response.data
                // 这个状态码是和后端约定的
            const { code } = dataAxios
            // 根据 code 进行判断
            if (code === undefined) {
                // 如果没有 code 代表这不是项目后端开发的接口
                return dataAxios
            } else {
                // 有 code 代表这是一个后端接口 可以进行进一步的判断
                switch (code) {
                    case 0:
                        // [ 示例 ] code === 0 代表没有错误
                        return dataAxios.data
                    case 401:
                        // [ 示例 ] 其它和后台约定的 code
                        errorCreate(`[ code: 401 ] ${dataAxios.msg}: ${response.config.url}`)
                        break
                    default:
                        // 不是正确的 code
                        errorCreate(`${dataAxios.msg}: ${response.config.url}`)
                        break
                }
            }
        },
        error => {
            const status = get(error, 'response.status')
            switch (status) {
                case 400:
                    error.message = '请求错误';
                    break
                case 401:
                    error.message = '未授权或授权已过期，请重新登录';
                    //router.push({ path: '/login' })
                    break
                case 403:
                    error.message = '拒绝访问';
                    break
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`;
                    break
                case 408:
                    error.message = '请求超时';
                    break
                case 500:
                    error.message = '服务器内部错误';
                    break
                case 501:
                    error.message = '服务未实现';
                    break
                case 502:
                    error.message = '网关错误';
                    break
                case 503:
                    error.message = '服务不可用';
                    break
                case 504:
                    error.message = '网关超时';
                    break
                case 505:
                    error.message = 'HTTP版本不受支持';
                    break
                default:
                    break
            }
            errorLog(error)
            return Promise.reject(error)
        }
    )
    return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
    const baseUrl = process.env.API_BASE_URL ? process.env.API_BASE_URL : config.baseUrl
    return function(config) {
        const token = cookies.get('token')
        const configDefault = {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': get(config, 'headers.Content-Type', 'application/json')
            },
            timeout: 5000,
            baseURL: baseUrl,
            data: {}
        }
        return service(Object.assign(configDefault, config))
    }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequestFunction(service)