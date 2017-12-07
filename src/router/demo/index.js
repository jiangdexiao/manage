import list from '@/views/demo/list-data/list/list.vue'
import filter from '@/views/demo/list-data/filter/filter.vue'
import expand from '@/views/demo/list-data/expand/expand.vue'
import echarts from '@/views/demo/echarts/echarts.vue'

import Form from '@/views/demo/form/Form.vue'
import Checkbox from '@/views/demo/form/checkbox/'
import Cascader from '@/views/demo/form/cascader/'
import Textarea from '@/views/demo/form/textarea/'
import Select from '@/views/demo/form/select/'
import Switch from '@/views/demo/form/switch/'
import Radio from '@/views/demo/form/radio/'
import Input from '@/views/demo/form/input/'
import date from '@/views/demo/form/date/'
import Time from '@/views/demo/form/time/'
import DateTime from '@/views/demo/form/datetime/'
import Editor from '@/views/demo/form/editor/'
import Validate from '@/views/demo/form/validate/'
import Upload from '@/views/demo/form/upload/'


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
    },
    {
        path:'/cascader',
        name:'cascader',
        component:Cascader
    },
    {
        path:'/checkbox',
        name:'checkbox',
        component:Checkbox
    },
    {
        path:'/textarea',
        name:'textarea',
        component:Textarea
    },
    {
        path:'/select',
        name:'select',
        component:Select
    },
    {
        path:'/switch',
        name:'switch',
        component:Switch
    },
    {
        path:'/radio',
        name:'radio',
        component:Radio
    },
    {
        path:'/input',
        name:'input',
        component:Input
    },
    {
        path:'/date',
        name:'date',
        component:date
    },
    {
        path:'/time',
        name:'time',
        component:Time
    },
    {
        path:'/datetime',
        name:'datetime',
        component:DateTime
    },
    {
        path:'/editor',
        name:'editor',
        component:Editor
    },
    {
        path:'/validate',
        name:'validate',
        component:Validate
    },
    {
        path:'/upload',
        name:'upload',
        component:Upload
    }
]