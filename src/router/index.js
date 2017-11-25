import Vue from 'vue'
import Router from 'vue-router'

import { Login } from '@/views/'
import Home from '@/views/Home'
import mediaManagePlatform from './mediaManagePlatform/'

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
      children:mediaManagePlatform
    }
  ]
})
