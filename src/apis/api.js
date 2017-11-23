import URL_CONFIG from './url'
import HTTP from './http'


export const SERVICE = {
    login: (params) => {
        return HTTP.POST(URL_CONFIG.login, params).then(res => res).catch(error => error);
    }
}