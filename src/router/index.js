import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/login'
import Main from '@/views/Main'
import Home from '@/views/Home'
import mediaManagePlatform from './mediaManagePlatform/'
import businessManagePlatform from './businessManagePlatform/'
import biManagePlatform from './biManagePlatform/'
import mediaSaleManagePlatform from './mediaSaleManagePlatform/'
import sellerManagePlatform from './sellerManagePlatform/'
import demo from './demo/'

const routers = mediaManagePlatform.concat(demo).concat(businessManagePlatform).concat(biManagePlatform).concat(sellerManagePlatform).concat(mediaSaleManagePlatform)
Vue.use(Router)

export default new Router({
  mode:'history',
  base:__dirname,
  routes: [
    {
      path: '/',
      name: 'Hello',
      hidden: true,
      redirect (to) {
        return 'login'
      }
    }, {
      path: '/login',
      name: 'login',
      hidden: true,
      component: Login
    }, {
      path: '/main',
      name: 'main',
      hidden: true,
      component: Main
    },
    {
      path: '/home',
      name: 'home',
      hidden: true,
      component: Home,
      children:routers,
      redirect(to){
        return 'abstract'
      }
    }
  ]
})
