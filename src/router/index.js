import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import abstract from '@/components/views/abstract'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:__dirname,
  routes: [
    {
      path: '/',
      component: Main,
      children:[{
        path:'/abstract',
        component:abstract
      }]
    }
  ]
})
