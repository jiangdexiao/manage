/**
 * 商家管理系统
 */
const abstract = resolve => require(['@/views/sellerManagePlatform/abstract/abstract.vue'], resolve);
//资金
const capital_list = resolve => require(['@/views/sellerManagePlatform/capital_manage/capital_list/List.vue'], resolve);
const capital_payment_detail = resolve => require(['@/views/sellerManagePlatform/capital_manage/capital_payment_detail/List.vue'], resolve);
//订单
const order_behind = resolve => require(['@/views/sellerManagePlatform/order_manage/order_behind/List.vue'], resolve);
const order_details = resolve => require(['@/views/sellerManagePlatform/order_manage/order_behind/details.vue'], resolve);
const dealerOrDtl = resolve => require(['@/views/sellerManagePlatform/order_manage/order_front/dealerOrDtl.vue'], resolve);
const order_front = resolve => require(['@/views/sellerManagePlatform/order_manage/order_front/List.vue'], resolve);
//商品
const product_comment = resolve => require(['@/views/sellerManagePlatform/product_manage/product_comment/List.vue'], resolve);
const product_list = resolve => require(['@/views/sellerManagePlatform/product_manage/product_list/List.vue'], resolve);
const goodsDetail = resolve => require(['@/views/sellerManagePlatform/product_manage/product_list/goodsDetail.vue'], resolve);
//业务员
const salesman_list = resolve => require(['@/views/sellerManagePlatform/salesman_manage/salesman_list/List.vue'], resolve);
const salesman_addModify = resolve => require(['@/views/sellerManagePlatform/salesman_manage/salesman_list/addModify.vue'], resolve);
//商家
const dealer_list = resolve => require(['@/views/sellerManagePlatform/seller_manage/seller_list/List.vue'], resolve);
const dealer_addModify = resolve => require(['@/views/sellerManagePlatform/seller_manage/seller_list/addModify.vue'], resolve);
//设置
const set_brand = resolve => require(['@/views/sellerManagePlatform/set_manage/set_brand/List.vue'], resolve);
const set_brandInfo = resolve => require(['@/views/sellerManagePlatform/set_manage/set_brand/info.vue'], resolve);
const set_brandModify = resolve => require(['@/views/sellerManagePlatform/set_manage/set_brand/modify.vue'], resolve);
const set_category = resolve => require(['@/views/sellerManagePlatform/set_manage/set_category/List.vue'], resolve);
const set_model = resolve => require(['@/views/sellerManagePlatform/set_manage/set_model/List.vue'], resolve);
const set_rate = resolve => require(['@/views/sellerManagePlatform/set_manage/set_rate/List.vue'], resolve);
const set_unit = resolve => require(['@/views/sellerManagePlatform/set_manage/set_unit/List.vue'], resolve);

//结算
const countQuery = resolve => require(['@/views/sellerManagePlatform/settlement_manage/settlement_list/List.vue'], resolve);
const countQueryDetail = resolve => require(['@/views/sellerManagePlatform/settlement_manage/settlement_list/countQueryDetail.vue'], resolve);
//营销
const specialPrice_list = resolve => require(['@/views/sellerManagePlatform/specialPrice_manage/specialPrice/List.vue'], resolve);
const specialPrice_info = resolve => require(['@/views/sellerManagePlatform/specialPrice_manage/specialPrice/info.vue'], resolve);
const specialPrice_modify = resolve => require(['@/views/sellerManagePlatform/specialPrice_manage/specialPrice/modify.vue'], resolve);


export default [
    { path: '/s/abstract', name: 's_abstract', component: abstract }, // 首页
    { path: '/s/survey', name: 's_capital_list', component: capital_list }, // 资金列表
    { path: '/s/detail', name: 's_capital_payment_detail', component: capital_payment_detail }, // 资金详情
    { path: '/s/afterSale', name: 's_order_behind', component: order_behind }, // 售后单
    { path: '/s/bug', name: 's_order_front', component: order_front }, // 订货单
    { path: '/s/afterSale/order_details', name: 's_order_details', component: order_details ,title:'详情'},//售后单详情
    { path: '/s/bug/dealerOrDtl', name: 's_dealerOrDtl', component: dealerOrDtl ,title:'详情'}, //订货单详情
    { path: '/s/goodAppraise', name: 's_product_comment', component: product_comment },// 商品评价
    { path: '/s/goodList', name: 's_product_list', component: product_list }, // 商品列表
    { path: '/s/goodList/goodsDetail', name: 's_goodsDetail', component: goodsDetail ,title:'详情'}, // 商品详情
    { path: '/s/salesmanList', name: 's_salesman_list', component: salesman_list }, // 业务员列表
    { path: '/s/salesmanList/salesmanAddModify', name: 's_salesman_addModify', component: salesman_addModify,title:'详情' }, // 业务员新增修改
    { path: '/s/dealer', name: 's_dealer_list',component: dealer_list },// 商家列表
    { path: '/s/dealer/dealer_addModify', name: 's_dealer_addModify', component: dealer_addModify ,title:'详情'},// 商家新增修改
    { path: '/s/brands', name: 's_set_brand', component: set_brand }, // 品牌列表
    { path: '/s/brands/info', name: 's_set_brandInfo', component: set_brandInfo ,title:'详情'}, // 品牌详情
    { path: '/s/brands/modify', name: 's_set_brandModify', component: set_brandModify ,title:'新增修改'}, // 品牌更新
    { path: '/s/sort', name: 's_set_category', component: set_category },
    { path: '/s/size', name: 's_set_model', component: set_model },
    { path: '/s/rate', name: 's_set_rate', component: set_rate },
    { path: '/s/unit', name: 's_set_unit', component: set_unit },
    { path: '/s/specialPriceList', name: 's_specialPrice_list', component: specialPrice_list },//特惠价管理
    { path: '/s/specialPriceList/specialPriceInfo', name: 's_specialPrice_info', component: specialPrice_info ,title:'详情'},//特惠价详情
    { path: '/s/specialPriceList/specialPriceModify', name: 's_specialPrice_modify', component: specialPrice_modify ,title:'新增修改'},//特惠价修改新增
    { path: '/s/countQuery', name: 's_countQuery', component: countQuery },//结算查询
    { path: '/s/countQuery/countQueryDetail', name: 's_countQueryDetail', component: countQueryDetail ,title:'详情'} //结算查询详情
]
