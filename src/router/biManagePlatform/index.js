/**
 * BI 系统
 */

const abstract = resolve => require(['@/views/biManagePlatform/abstract/abstract.vue'], resolve);

const media_restaurantAnalysis = resolve => require(['@/views/biManagePlatform/media/restaurant_analysis/List.vue'], resolve);
const media_salesReport = resolve => require(['@/views/biManagePlatform/media/sales_report/List.vue'], resolve);
const media_analysisReport = resolve => require(['@/views/biManagePlatform/media/analysis_report/List.vue'], resolve);
const media_paint = resolve => require(['@/views/biManagePlatform/media/paint/List.vue'], resolve);

const product_survey = resolve => require(['@/views/biManagePlatform/product/survey/List.vue'], resolve);

const transaction_survey = resolve => require(['@/views/biManagePlatform/transaction/survey/List.vue'], resolve);
const transaction_coupon = resolve => require(['@/views/biManagePlatform/transaction/coupon/List.vue'], resolve);
const transaction_coupon_detail = resolve => require(['@/views/biManagePlatform/transaction/coupon/Details.vue'], resolve);
const transaction_statics = resolve => require(['@/views/biManagePlatform/transaction/statics/List.vue'], resolve);

export default [
  {path: '/bi/abstract', name: 'bi_abstract', component: abstract},
  {path: '/bi/media/restaurantAnalysis', name: 'media_restaurantAnalysis', component: media_restaurantAnalysis, title: '餐饮媒体分析'},
  {path: '/bi/media/salesReport', name: 'media_salesReport', component: media_salesReport, title: '运营销售报表'},
  {path: '/bi/media/analysisReport', name: 'media_analysisReport', component: media_analysisReport, title: '媒体运营分析报表'},
  {path: '/bi/media/paint', name: ' media_paint', component:  media_paint, title: '广告位画像'},

  {path: '/bi/product/survey', name: 'product_survey', component: product_survey, title: '商品概况'},

  {path: '/bi/transaction/survey', name: 'transaction_survey', component: transaction_survey, title: '交易概况'},
  {path: '/bi/transaction/coupon', name: 'transaction_coupon', component: transaction_coupon, title: '优惠券'},
  {path: '/bi/transaction/coupon/detail', name: 'detail', component: transaction_coupon_detail, title: '详情'},
  {path: '/bi/transaction/statics', name: 'transaction_statics', component: transaction_statics,title: '搜索词统计'}
]


