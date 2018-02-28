import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/login'
import Main from '@/views/Main'
import Home from '@/views/Home'
import mediaManagePlatform from './mediaManagePlatform/'
import businessManagePlatform from './businessManagePlatform/'
import biManagePlatform from './biManagePlatform/'
import customManagePlatform from './customManagePlatform/'
import mediaSaleManagePlatform from './mediaSaleManagePlatform/'
import sellerManagePlatform from './sellerManagePlatform/'
import demo from './demo/'

Vue.use(Router)


// export const aysncRouteMap = mediaManagePlatform.concat(demo).concat(businessManagePlatform).concat(biManagePlatform).concat(sellerManagePlatform).concat(mediaSaleManagePlatform)

/***不变路由 */
export  const constantRouterMap = [
  {path: '/',name: '/',hidden: true,redirect (to) {return 'login'}},
  {path: '/login',name: 'login',hidden: true,component: Login},
  {path: '/main',name: 'main', hidden: true,component: Main},
  // {path: '/home',name: 'home',hidden: true,component: Home,children:aysncRouteMap,redirect(to){return 'abstract'}}
]

export const mediaManagePlatformRoute = {path: '/mu',name: 'mediahome',hidden: true,component: Home,children:mediaManagePlatform,redirect(to){return '/mu/abstract'}}
export const businessManagePlatformRoute = {path: '/m',name: 'businesshome',hidden: true,component: Home,children:businessManagePlatform,redirect(to){return '/m/abstract'}}
export const biManagePlatformRoute = {path: '/bihome',name: 'bihome',hidden: true,component: Home,children:biManagePlatform,redirect(to){return '/bi/abstract'}}
export const mediaSaleManagePlatformRoute ={path: '/mediasalehome',name: 'mediasalehome',hidden: true,component: Home,children:mediaSaleManagePlatform,redirect(to){return '/mediasale/abstract'}}
export const sellerManagePlatformRoute = {path: '/s',name: 'sellerhome',hidden: true,component: Home,children:sellerManagePlatform,redirect(to){return '/s/abstract'}}
export const customManagePlatformRoute = {path: '/customhome',name: 'customhome',hidden: true,component: Home,children:customManagePlatform,redirect(to){return '/custom/abstract'}}

constantRouterMap.push(mediaManagePlatformRoute)
constantRouterMap.push(businessManagePlatformRoute)
constantRouterMap.push(biManagePlatformRoute)
constantRouterMap.push(mediaSaleManagePlatformRoute)
constantRouterMap.push(sellerManagePlatformRoute)
constantRouterMap.push(customManagePlatformRoute)

export default new Router({
  // mode:'history',
  // base:__dirname,
  routes: constantRouterMap
})
