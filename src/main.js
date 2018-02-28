// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/index'
import './register/'
import { tool } from './utils/'
import md5 from 'md5'
// import { access } from 'fs';

Vue.config.productionTip = false

const setDocTitle=(to,from,next)=>{
  if(to.path === '/login'){
    document.title = '拍获-后台管理-登录'
  }else if( to.path === '/main'){
    document.title = '拍获管理中心'
  }
}
router.beforeEach((to, from, next) => {
  setDocTitle(to)
  if( to.path === '/login') {
    let access_token = tool.cookie.getCookie('access_token')
    let auth = tool.cookie.getCookie('auth')
    if ( !access_token ) {
      sessionStorage.clear()
      tool.cookie.delCookie('access_token')
      tool.cookie.delCookie('auth')
      next()
    } else {
      // access_token
      if (tool.jsontoken.tokenVerify(access_token)) {
        let userId = JSON.parse(tool.jsontoken.tokenDecode(access_token).sub).userId
        // let func = Vue.prototype['api_businessManagePlatform_secret']
        $.ajax({
          url: Vue.prototype.BASE_URL + 'm2c.operate/sys/user/hold/secret',
          data: {
            accessToken: access_token,
            userId: userId,
            sign: md5(userId + ':' + access_token)
          },
          headers: {
            'access_token': access_token
          },
          success: function (res) {
            if (res.status === 200) {
              next({path: '/main'})
            } else {
              sessionStorage.clear()
              tool.cookie.delCookie('access_token')
              tool.cookie.delCookie('auth')
              alert(res.errorMessage)
              next()
            }
          }
        })
      } else {

      }
    }
  }
  else if( to.path !== '/login' && to.path !== '/' ){
    let access_token = tool.cookie.getCookie('access_token')
    let auth = tool.cookie.getCookie('auth')
    if(!sessionStorage.getItem('userInfo') ||!access_token  || !auth || (access_token!=null && auth != null && md5(access_token) != auth)){
      tool.cookie.delCookie('access_token')
      tool.cookie.delCookie('auth')
      next({path:'/login'})
    }else if(sessionStorage.getItem('moduleId')){
      //跨平台之间路由跳转权限问题
      let path = to.path
      let moduleId = sessionStorage.getItem('moduleId')
      if( path.startsWith('/main') ){
        next()
      } else if( path.startsWith('/m/') && moduleId === store._modules.root.state.BUSINESS_MANAGE_PLATFORM){//运营
        next()
      }else if( path.startsWith('/mu/') && moduleId === store._modules.root.state.MEDIA_MANAGE_PLATFORM ){//媒体管理
        next()
      }else if( path.startsWith('/s/') && moduleId === store._modules.root.state.SELLER_MANAGE_PLATFORM ){//商家
        next()
      }else if( path.startsWith('/mediasale/') && moduleId === store._modules.root.state.MEDIA_SALE_MANAGE_PLATFORM  ){//媒体行销
        next()
      }else if( path.startsWith('/bi/') && moduleId === store._modules.root.state.BI_MANAGE_PLATFORM  ){//bi
        next()
      }else if( path.startsWith('/custom/') && moduleId === store._modules.root.state.TOOL_MANAGE_PLATFORM ){//工具
        next()
      }else {
        console.log('不允许跨平台跳转')
        return
      }
    }else{
      next()
    }
  }else{
    next()
  }
})

 //绑定回车键
 document.body.addEventListener('keyup',function(e){
  if( e.keyCode === 13 ){
     let toolbar = $(e.target).closest('.toolbar')
     if( !toolbar || toolbar.length === 0 ){
      toolbar = $(e.target).closest('.marketbar')
     }
     let btnsearch = $('.btn-search',toolbar)
     if( btnsearch && btnsearch.length > 0){
       let elements = [].slice.call(btnsearch)
       elements.forEach(item=>{
           item.click()
       })
     }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
