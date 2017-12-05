import list from '@/views/demo/list-data/list/list.vue'
import filter from '@/views/demo/list-data/filter/filter.vue'
import expand from '@/views/demo/list-data/expand/expand.vue'
import echarts from '@/views/demo/echarts/echarts.vue'
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
    },
    {
        path:'/echarts',
        name:'echarts',
        component:echarts
    }
]