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
    var options = {
        method: type,
        url: this.BASE_URL + path,
        params:data,
        headers: headers && typeof headers === 'object' ? headers : {}
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
            resolve(res.data)
            if (res.data.status != 200) {
                this.$message({showClose: true,message: `请求错误：${res.data.errorMessage}`,type: 'error'})
            }
        }).catch((err) => {
            reject(err);
            this.$store.dispatch('hide_loading')
            this.$message({showClose: true,message: `请求错误：${res.data.errorMessage}`,type: 'error'})
        })
    })
}