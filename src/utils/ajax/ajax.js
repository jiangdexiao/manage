import axios from 'axios'
//抓取浏览器客户端信息
const browserInfo = ()=>{
    let browserInfo={system:'',appName:'',version:''}
    let agent = navigator.userAgent.toLowerCase() ;
    let system = agent.split(' ')[1].split(' ')[0].split('(')[1];
    browserInfo.system=system;
    let regStr_edge = /edge\/[\d.]+/gi,
        regStr_ie = /trident\/[\d.]+/gi,
        regStr_ff = /firefox\/[\d.]+/gi,
        regStr_chrome = /chrome\/[\d.]+/gi,
        regStr_saf = /safari\/[\d.]+/gi,
        regStr_opera = /opr\/[\d.]+/gi;
    //IE
    if(agent.indexOf("trident") > 0){
      browserInfo.appName=agent.match(regStr_ie)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_ie)[0].split('/')[1]
      return browserInfo;
    }
    //Edge
    if(agent.indexOf('edge') > 0){
      browserInfo.appName=agent.match(regStr_edge)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_edge)[0].split('/')[1];
      return browserInfo;
    }
    //firefox
    if(agent.indexOf("firefox") > 0){
      browserInfo.appName=agent.match(regStr_ff)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_ff)[0].split('/')[1];
      return browserInfo;
    }
    //Opera
    if(agent.indexOf("opr")>0){
      browserInfo.appName=agent.match(regStr_opera)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_opera)[0].split('/')[1];
      return browserInfo;
    }
    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
      browserInfo.appName=agent.match(regStr_saf)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_saf)[0].split('/')[1];
      return browserInfo;
    }
    //Chrome
    if(agent.indexOf("chrome") > 0){
      browserInfo.appName=agent.match(regStr_chrome)[0].split('/')[0];
      browserInfo.version=agent.match(regStr_chrome)[0].split('/')[1];
      return browserInfo;
    }else{
      // arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!')
      return browserInfo;
    }
}
//处理参数空格
const myTrim = (data)=>{
    if( data ){
        try{
            _.each(data, (value, key) => {
                if( value && value.length > 0){
                    data[key] = value.replace(/^\s+|\s+$/gm,'')
                }
            })
        }catch(e){
            console.log(e)
        }
    }
}
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
export default function ({ path, type, data,pathParams, headers, opts,baseurl } = {}) {
    type = type ? type : 'get'
    path = path?path.trim():''
    pathParams = pathParams?pathParams.trim():''
    if(path.endsWith('/')){
        path = path.substring(0,path.lastIndexOf('/'))
    }
    if(pathParams){
        path = path + pathParams
    }
    let token = sessionStorage.getItem('access_token')
    let userInfo = sessionStorage.getItem('userInfo')
    let attach = ''
    if( userInfo ){
        userInfo = JSON.parse(userInfo)
        attach=JSON.stringify({userName: encodeURI(userInfo.userName),userId:userInfo.userId,browserInfo:browserInfo(),ip:'127.0.0.1',userType:0})
    }
    if(  headers && typeof headers === 'object' )
        headers = Object.assign(headers||{},{'access_token': token,'attach':attach})
    else
        headers = {'access_token': token,'attach':attach}
    
    myTrim(data)
    var options = {
        method: type,
        url: (baseurl?baseurl:this.BASE_URL) + path,
        // params:data,
        headers: headers 
    }
    if( headers['Content-Type'] && headers['Content-Type'].indexOf('application/json')!=-1){
        options['data'] = data
    }else{
        options['params'] = data
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
            if(res.config.downloadOption && res.config.downloadOption==='download'){
                resolve(res.data)
                return
            }
            if (res.status === 900000 || res.status === 900001 || res.status === 900002 || res.status === 900003 || res.status === 900004) {
                sessionStorage.clear()
                this.tool.cookie.delCookie('access_token')
                this.tool.cookie.delCookie('auth')
                window.location.href = window.location.origin
                return
            }
            if (res.status === 2404404) {
                this.$message({showClose: true,message: `${res.data.errorMessage}`,type: 'error'})
                reject(res.data.errorMessage)
            return
            }
            if (res.data.status != 200) {
                this.$message({showClose: true,message: `${res.data.errorMessage}`,type: 'error'})
                reject(res.data.errorMessage)
            }else{
                resolve(res.data)
            }
        }).catch((err) => {
            reject(err)
            this.$store.dispatch('hide_loading')
            if (err.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                this.$message({showClose: true,message: `${err.response.data.errorMessage}`,type: 'error'})
              } else {
                // Something happened in setting up the request that triggered an Error
                this.$message({showClose: true,message: `${err.message}`,type: 'error'})
              }
            
        })
    })
}