// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/index'
import './register/'
import { cookie } from './utils/'
import md5 from 'md5'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if( to.path != '/login' && to.path != '/' ){
    let access_token = cookie.getCookie('access_token')
    let auth = cookie.getCookie('auth')
    if(!sessionStorage.getItem('userInfo') || access_token!=null && auth != null && md5(access_token) != auth){
      // this.$message({type:'error',message:'登录失效，请重新登录'})
      return
    }
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
