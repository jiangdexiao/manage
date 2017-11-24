import axios from 'axios'
import BASE_URL from '../../config/setting'
import Vue from 'vue'

/**
 * 
 * 
 * @export
 * @param {string} url 
 * @param {string} type
 * @param {object} data 
 * @param {string} headers 
 * @param {object} opts 
 * @returns 
 */
export default function ({ path, type, data, headers, opts } = {}) {
    type = type?type:'get'
    var options = {
        method: type,
        url:  BASE_URL + path,
        headers: headers && typeof headers === 'object' ? headers : {}
    }
    options[type === 'get' ? 'params' : 'data'] = data
    console.log(`请求地址：${options.url},请求参数：${JSON.stringify(data)}`)
    // 分发显示加载样式任务
    // console.log(this.$store)
    this.$store.dispatch('show_loading')
    // axios内置属性均可写在这里
    if (opts && typeof opts === 'object') {
        for (var f in opts) {
            options[f] = opts[f]
        }
    }

    // 发送请求
  return axios(options).then((res) => {
    // this.$store.dispatch('hide_loading')
    if (res.data.status === 200) {
      console.log(res.data)
    } 
    else {
        Vue.prototype.$message({
            showClose: true,
            message: '请求错误：' + (err.response ? err.response.status : '') + ',' + (err.response ? err.response.statusText : ''),
            type: 'error'
        })
    }
  }).catch((err) => {
    // this.$store.dispatch('hide_loading')
    Vue.prototype.$message({
        showClose: true,
        message: '请求错误：' + (err.response ? err.response.status : '') + ',' + (err.response ? err.response.statusText : ''),
        type: 'error'
    })
  })
}