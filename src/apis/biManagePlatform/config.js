/**
 * bi 系统
 */
import { BI_BASEURL } from '../../config/setting.js'
export default [

  /******** 仪表盘 HOME 近20天 ********/
  { name: '订单量', method: 'homeOrderctn', path: 'm2c.bi/list/orderctn', type: 'get',baseurl:BI_BASEURL},
  { name: '媒体数',method: 'homeMediactn',path: 'm2c.bi/list/mediactn',type: 'get',baseurl:BI_BASEURL},
  { name: '广告位数量',method: 'homeMresctn',path: 'm2c.bi/list/mresCtn',type: 'get',baseurl:BI_BASEURL},
  { name: '扫拍购买转化率',method: 'homePaihuoCtn',path: 'm2c.bi/list/paihuoCtn',type: 'get',baseurl:BI_BASEURL},
  { name: '今日概况',method: 'homeSummary',path: 'm2c.bi/total/summary',type: 'get',baseurl:BI_BASEURL},

  /******* 餐饮分析 ********/
  { name: '分析趋势', method: 'canyingTendency', path: 'm2c.bi/canying/order/transfor', type: 'get',baseurl:BI_BASEURL},
  { name: '转化分析', method: 'canyingTransfor', path: 'm2c.bi/canying/transfor', type: 'get',baseurl:BI_BASEURL},
  { name: '广告位占比', method: 'canyingProp', path: 'm2c.bi/canying/res/order/prop', type: 'get',baseurl:BI_BASEURL},
  { name: '订单分析', method: 'canyingTop', path: 'm2c.bi/canying/order/top10', type: 'get',baseurl:BI_BASEURL},

  /******* 运营销售报表 ********/
  { name: '广告形式', method: 'exhibitType', path: 'm2c.media/admin/adsense/formList', type: 'get'},
  { name: '行业分类', method: 'catePar', path: 'm2c.media/cate/par', type: 'get'},
  { name: '销售报表', method: 'saleReort', path: 'm2c.bi/canying/sale/report', type: 'get',baseurl:BI_BASEURL},
  { name: '销售报表导出', method: 'saleExcel', path: 'm2c.bi/canying/sale/report/excel', type: 'get',baseurl:BI_BASEURL},

  /******* 商品概况 ********/
  { name: '商品概况表', method: 'yestoday', path: 'm2c.bi/goods/summery/yestoday', type: 'get',baseurl:BI_BASEURL},
  { name: '访客与加购趋势', method: 'visitAndBuy', path: 'm2c.bi/goods/list/visitAndBuy', type: 'get',baseurl:BI_BASEURL},
  { name: '总浏览量趋势', method: 'goodScanCnt', path: 'm2c.bi/goods/list/scan', type: 'get',baseurl:BI_BASEURL},
  { name: '销售额占比', method: 'categoryProp', path: 'm2c.bi/goods/list/category/prop', type: 'get',baseurl:BI_BASEURL},
  { name: '近5日排行', method: 'goodTop', path: 'm2c.bi/goods/list/top10', type: 'get',baseurl:BI_BASEURL},


  /******* 广告位画像 ********/
  { name: '广告位', method: 'costAnalysis', path: 'm2c.bi/res/cost/analysis', type: 'get',baseurl:BI_BASEURL},


  /******* 搜索词统计 ********/
  { name: '搜索词统计', method: 'keywords', path: 'm2c.bi/search/topkeywords', type: 'get',baseurl:BI_BASEURL},

  /******* 优惠券 ********/
  { name: '优惠券列表', method: 'couponsEffect', path: 'm2c.bi/coupons/effect', type: 'get',baseurl:BI_BASEURL},
  { name: '优惠券详情', method: 'effectCouponId', path: 'm2c.bi/coupon/effect/', type: 'get',baseurl:BI_BASEURL},
  { name: '优惠券详情图表', method: 'usesituation', path: 'm2c.bi/coupon/usesituation', type: 'get',baseurl:BI_BASEURL},


  /******* 交易概况 ********/
  { name: '昨日订单概况', method: 'orderYestoday', path: 'm2c.bi/order/yestoday/summary', type: 'get',baseurl:BI_BASEURL},
  { name: '销售金额和下单转化率', method: 'orderTrans', path: 'm2c.bi/order/trans', type: 'get',baseurl:BI_BASEURL},
  { name: '整体交易转化率', method: 'datesTrans', path: 'm2c.bi/order/dates/trans', type: 'get',baseurl:BI_BASEURL},
  { name: '下单客户趋势图', method: 'customersTrend', path: 'm2c.bi/order/customers/trend', type: 'get',baseurl:BI_BASEURL},
  { name: '各渠道销售额占比', method: 'byChannel', path: 'm2c.bi/order/sellAmount/byChannel', type: 'get',baseurl:BI_BASEURL},
  { name: '媒体运营分析报表', method: 'mediaOperationReport', path: 'm2c.bi/media/operation/query', type: 'get',baseurl:BI_BASEURL},
  { name: '媒体运营分析报表导出', method: 'mediaOperationReportExcel', path: 'm2c.bi/media/operation/excel/report', type: 'get',baseurl:BI_BASEURL},

]

