/**
 * 运营系统
 */

import abstract from '@/views/businessManagePlatform/abstract/abstract.vue'
//系统权限
import sys_role from '@/views/businessManagePlatform/sys_manage/sys_role/List.vue'
import sys_send from '@/views/businessManagePlatform/sys_manage/sys_send/List.vue'
import sys_update from '@/views/businessManagePlatform/sys_manage/sys_update/List.vue'
import sys_user from '@/views/businessManagePlatform/sys_manage/sys_user/List.vue'
//系统设置
import sys_category from '@/views/businessManagePlatform/sys_setting/sys_category/List.vue'
import sys_word from '@/views/businessManagePlatform/sys_setting/sys_word/List.vue'
//结算
import settlement_list from '@/views/businessManagePlatform/settlement_manage/settlement_list/List.vue'
//营销管理
import marketing_tool from '@/views/businessManagePlatform/marketing_manage/marketing_tool/List.vue'
//财务管理
import finance_capital from '@/views/businessManagePlatform/finance_manage/finance_capital/List.vue'
import finance_payment_detail from '@/views/businessManagePlatform/finance_manage/finance_payment_detail/List.vue'
import finance_receivables from '@/views/businessManagePlatform/finance_manage/finance_receivables/List.vue'
import finance_refund from '@/views/businessManagePlatform/finance_manage/finance_refund/List.vue'
import finance_withdrawals from '@/views/businessManagePlatform/finance_manage/finance_withdrawals/List.vue'
//客服
import custom_achieve from '@/views/businessManagePlatform/custom_manage/custom_achieve/List.vue'
import custom_back from '@/views/businessManagePlatform/custom_manage/custom_back/List.vue'
//内容管理
import content_static from '@/views/businessManagePlatform/content_manage/content_static/List.vue'
//运营管理
import bus_banner from '@/views/businessManagePlatform/bus_manage/bus_banner/List.vue'
import bus_custom from '@/views/businessManagePlatform/bus_manage/bus_custom/List.vue'
import bus_home from '@/views/businessManagePlatform/bus_manage/bus_home/List.vue'
//用户
import user_group from '@/views/businessManagePlatform/user_manage/user_group/List.vue'
import user_info from '@/views/businessManagePlatform/user_manage/user_info/List.vue'
export default [
    {path:'/abstract', name:'abstract', component:abstract},
    //系统权限
    { path:'/sys_role', name:'sys_role',component:sys_role},
    { path:'/sys_send', name:'sys_send',component:sys_send},
    { path:'/sys_update', name:'sys_update',component:sys_update},
    { path:'/sys_user', name:'sys_user',component:sys_user},
    //系统设置
    { path:'/sys_category', name:'sys_category',component:sys_category},
    { path:'/sys_word', name:'sys_word',component:sys_word},
    //结算
    { path:'/settlement_list', name:'settlement_list',component:settlement_list},
    //营销管理
    { path:'/marketing_tool', name:'marketing_tool',component:marketing_tool},
    //财务管理
    { path:'/finance_capital', name:'finance_capital',component:finance_capital},
    { path:'/finance_payment_detail', name:'finance_payment_detail',component:finance_payment_detail},
    { path:'/finance_receivables', name:'finance_receivables',component:finance_receivables},
    { path:'/finance_refund', name:'finance_refund',component:finance_refund},
    { path:'/finance_withdrawals', name:'finance_withdrawals',component:finance_withdrawals},
    //客服
    { path:'/custom_achieve', name:'custom_achieve',component:custom_achieve},
    { path:'/custom_back', name:'custom_back',component:custom_back},
    //内容管理
    { path:'/content_static', name:'content_static',component:content_static},
    //运营管理
    { path:'/bus_banner', name:'bus_banner',component:bus_banner},
    { path:'/bus_custom', name:'bus_custom',component:bus_custom},
    { path:'/bus_home', name:'bus_home',component:bus_home},
    //用户
    { path:'/user_group', name:'user_group',component:user_group},
    { path:'/user_info', name:'user_info',component:user_info},
]