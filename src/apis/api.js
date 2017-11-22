import URL from './url'
import HTTP from './http'


export const SERVICE = {
    //登录
    login: (params) => {
        return HTTP.POST(`${ URL.localbase }/login`, params).then(res => res).catch(error => error);
    }
}