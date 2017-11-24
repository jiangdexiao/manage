import http from '../../utils/'
import * as config from './config'

export default {
    getMenu: (params) => {
        return http.ajax({ path: config.menu.path,method:config.menu.method, data: params })
    },
    login: (params) => {
        return http.ajax({ path: config.menu.path,method:config.menu.method, data: params })
    }
}