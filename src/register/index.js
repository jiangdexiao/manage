/**
 * 注册全局api
 */

import Vue from 'vue'
import plugins from './plugins'
import BASE_URL from '../config/setting'
import ElementUI from 'element-ui';
//引入element-ui的默认CSS样式
import 'element-ui/lib/theme-chalk/index.css';


/**
 * 把一些全局对象和一些全局方法，注册到Vue原型上
 */
Vue.use(ElementUI)
Vue.use({
    install(Vue, options) {
        // 注册全局方法，如常用的接口方法，工具方法等。
        Vue.prototype.BASE_URL = BASE_URL
        for (let key in plugins) {
            console.log(key)
            Vue.prototype[key] = plugins[key]
        }
    }
})