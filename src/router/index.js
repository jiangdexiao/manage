import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/login'
import Home from '@/views/Home'
import mediaManagePlatform from './mediaManagePlatform/'
import operationManagePlatform from './operationManagePlatform/'
import demo from './demo/'

const menus = mediaManagePlatform.concat(demo)
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
      path: '/home',
      name: 'home',
      hidden: true,
      component: Home,
      children:menus
    }
  ]
})
