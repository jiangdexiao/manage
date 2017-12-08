import axios from 'axios'

/**
 * 
 * 
 * @export
 * @param {string} path 
 * @param {string} type
 * @param {object} data 
 * @param {string} pathParams  
 * @param {string} headers 
 * @param {object} opts 
 * @returns 
 */
export default function ({ path, type, data,pathParams, headers, opts } = {}) {
    type = type ? type : 'get'
    path = path?path.trim():''
    pathParams = pathParams?pathParams.trim():''
    if(path.endsWith('/')){
        path = path.substring(0,path.lastIndexOf('/'))
    }
    if(pathParams){
        path = path + pathParams
    }
    let userInfo = sessionStorage.getItem('userInfo')
    userInfo = userInfo?JSON.parse(userInfo):{}
    userInfo.token = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJKV1Q6Nzk3NDIxMTgtNTE4Zi00NjBhLWI1MzQtYmQzNmVjZGE3YWZhIiwiaWF0IjoxNTEyNzAyNjkyLCJzdWIiOiJ7XCJjcmVhdGVUaW1lXCI6XCIyMDE3LTA3LTEwIDA5OjU5OjMyXCIsXCJlbWFpbFwiOlwiYWRtaW5AbTJjLmNvbVwiLFwibmFtZVwiOlwibXR4MTIxNVwiLFwibm90ZVwiOlwibm90ZVwiLFwicGVybWlzc2lvbktleVwiOlwiSldUOlNZU1RFTTpQRVJNSVNTSU9OOjdiYTI4Y2YxNzliOTQwMzJiMWQ3N2NmMzdkMzM2MDhlXCIsXCJyb2xlSWRcIjpcIjFcIixcInRlbE5vXCI6XCIxMzgyODc0OTc1NVwiLFwidXBkYXRlVGltZVwiOlwiMjAxNy0xMi0wOCAxMToxMTozMFwiLFwidXNlcklkXCI6XCI2YzcxMWU4ZTNmMDUxMjM0NTBkODMwYjk0YzcwNGNjYTc5OWZcIixcInVzZXJOYW1lXCI6XCJtdHgxMjE1XCIsXCJ1c2VyTm9cIjpcIjFcIixcInVzZXJTdGF0dXNcIjpcIk5PUk1BTFwifSIsImV4cCI6MTUxMjc4OTA5Mn0.Qha1eAmHmWKR9SjncYuudqgekazXkaMJ0JlKiDCzpH5tEo7kpeObH8Dnp8ngUk8jBbVdE-oHrTJ5IBl2BjUIwhi8p77NCwjp8NPAWinXdfn8Qfsmer29OAbH7h3RBezYWRX5M5AUKi-2VrEWevJmBcZK8MBCF14dhk6HIAlwhaw'
    if( !userInfo.token ){
        this.$message({type:'error',message:'登录失效，请重新登录'})
        return
    }
    
    var options = {
        method: type,
        url: this.BASE_URL + path,
        params:data,
        headers: headers && typeof headers === 'object' ? headers :{'access_token': userInfo.token}
    }
    // options[type === 'get' ? 'params' : 'data'] = data
    // console.log(`请求地址：${options.url},请求参数：${JSON.stringify(data)}`)
    // 分发显示加载样式任务
    this.$store.dispatch('show_loading')
    // axios内置属性均可写在这里
    if (opts && typeof opts === 'object') {
        for (var f in opts) {
            options[f] = opts[f]
        }
    }
    
    // 发送请求
    return new Promise((resolve, reject) => {
        axios(options).then((res) => {
            this.$store.dispatch('hide_loading')
            
            if (res.data.status != 200) {
                this.$message({showClose: true,message: `请求错误：${res.data.errorMessage}`,type: 'error'})
            }else{
                resolve(res.data)
            }
        }).catch((err) => {
            reject(err);
            this.$store.dispatch('hide_loading')
            this.$message({showClose: true,message: `请求错误：${err}`,type: 'error'})
        })
    })
}