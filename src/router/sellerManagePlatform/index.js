/**
 * 商家管理系统
 */

import abstract from '@/views/sellerManagePlatform/abstract/abstract.vue'
//资金
import capital_list from '@/views/sellerManagePlatform/capital_manage/capital_list/List.vue'
import capital_payment_detail from '@/views/sellerManagePlatform/capital_manage/capital_payment_detail/List.vue'
//订单
import order_behind from '@/views/sellerManagePlatform/order_manage/order_behind/List.vue'
import order_front from '@/views/sellerManagePlatform/order_manage/order_front/List.vue'
//商品
import product_comment from '@/views/sellerManagePlatform/product_manage/product_comment/List.vue'
import product_list from '@/views/sellerManagePlatform/product_manage/product_list/List.vue'
//业务员
import salesman_list from '@/views/sellerManagePlatform/salesman_manage/salesman_list/List.vue'
//商家
import seller_list from '@/views/sellerManagePlatform/seller_manage/seller_list/List.vue'
//设置
import set_brand from '@/views/sellerManagePlatform/set_manage/set_brand/List.vue'
import set_category from '@/views/sellerManagePlatform/set_manage/set_category/List.vue'
import set_model from '@/views/sellerManagePlatform/set_manage/set_model/List.vue'
import set_rate from '@/views/sellerManagePlatform/set_manage/set_rate/List.vue' 
import set_unit from '@/views/sellerManagePlatform/set_manage/set_unit/List.vue' 

export default [
    { path:'/abstract',name:'abstract',component:abstract},
    { path:'/capital_list',name:'capital_list',component:capital_list},
    { path:'/capital_payment_detail',name:'capital_payment_detail',component:capital_payment_detail},
    { path:'/order_behind', name:'order_behind', component:order_behind},
    { path:'/order_front',name:'order_front', component:order_front},
    { path:'/product_comment',name:'product_comment',component:product_comment},
    { path:'/product_list', name:'product_list', component:product_list},
    { path:'/salesman_list', name:'salesman_list',component:salesman_list},
    { path:'/seller_list', name:'seller_list',component:seller_list},
    { path:'/set_brand',name:'set_brand', component:set_brand},
    { path:'/set_category', name:'set_category',component:set_category},
    { path:'/set_model', name:'set_model', component:set_model},
    { path:'/set_rate',name:'set_rate',component:set_rate},
    { path:'/set_unit', name:'set_unit',component:set_unit}
]