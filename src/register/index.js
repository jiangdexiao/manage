/**
 * 注册全局api
 */

import Vue from 'vue'
import plugins from './plugins'
import { BASEURL ,BI_BASEURL} from '../config/setting'
import components from './components.js'
import ElementUI from 'element-ui';
//引入element-ui的默认CSS样式
//import 'element-ui/lib/theme-chalk/index.css';
import '../../static/css/index.css';
import '../../static/css/main.css'
//导入过滤器
import '../utils/filter/index.js'
//导入常用工具
import { tool } from '../utils/'
/**
 * 把一些全局对象和一些全局方法，注册到Vue原型上
 */
Vue.use(ElementUI)
Vue.use({
    install(Vue, options) {
        // 注册全局方法，如常用的接口方法，工具方法等。
        Vue.prototype.BASE_URL = BASEURL
        Vue.prototype.BI_BASE_URL = BI_BASEURL
        Vue.prototype.tool = tool
        // 注册全局方法，如常用的接口方法，工具方法等。
        // let apis = []
        _.each(plugins, (item, key) => {
            // apis.push(key)
            Vue.prototype[key] = item
        })
        //用来检测是否有重复的api
        // let uniqueApis = unique(apis)
        // console.log('apis>'+apis.length,'uniqueApis>'+uniqueApis.length)
    }
})
_.each(components, (item, key) => {
    var cpName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    if (cpName && cpName[0] === '-') {
      cpName = cpName.replace('-', '')
    }
    // console.log(item)
    Vue.component(cpName, item)
  })

  // 速度最快， 占空间最多（空间换时间） 
function unique(array){ 
    var n = {}, r = [], len = array.length, val, type; 
    for (var i = 0; i < array.length; i++) { 
        val = array[i]; 
        type = typeof val; 
        if (!n[val]) { 
            n[val] = [type]; 
            r.push(val); 
        } else if (n[val].indexOf(type) < 0) { 
            n[val].push(type); 
            r.push(val); 
        } 
    } 
    return r; 
}