import list from '@/views/demo/list/list.vue'
import filter from '@/views/demo/filter/filter.vue'
import expand from '@/views/demo/expand/expand.vue'
export default [
    {
        path:'/list',
        name:'list',
        component:list
    },
    {
        path:'/filter',
        name:'filter',
        component:filter
    },
    {
        path:'/expand',
        name:'expand',
        component:expand
    }
]