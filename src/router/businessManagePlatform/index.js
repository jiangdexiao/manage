/**
 * 运营系统
 */

const abstract = resolve => require(['@/views/businessManagePlatform/abstract/abstract.vue'], resolve)
// 系统权限
const sys_role = resolve => require(['@/views/businessManagePlatform/sys_manage/sys_role/List.vue'], resolve)
const sys_update = resolve => require(['@/views/businessManagePlatform/sys_manage/sys_update/List.vue'], resolve)
const sys_user = resolve => require(['@/views/businessManagePlatform/sys_manage/sys_user/List.vue'], resolve)
// 系统设置
const sys_category = resolve => require(['@/views/businessManagePlatform/sys_setting/sys_category/List.vue'], resolve)
const sys_word = resolve => require(['@/views/businessManagePlatform/sys_setting/sys_word/List.vue'], resolve)
// 结算
const settlement_list = resolve => require(['@/views/businessManagePlatform/settlement_manage/settlement_list/List.vue'], resolve)
const settlement_detail = resolve => require(['@/views/businessManagePlatform/settlement_manage/settlement_detail/List.vue'], resolve)
const settlement_history = resolve => require(['@/views/businessManagePlatform/settlement_manage/settlement_detail/History.vue'], resolve)
// 营销管理
const marketing_tool = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/List.vue'], resolve)
const marketing_fullcut_list = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/fullcut/fullcutList.vue'], resolve)
const marketing_fullcut_create = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/fullcut/fullcutCreate.vue'], resolve)
const marketing_fullcut_modify = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/fullcut/fullcutModify.vue'], resolve)
const marketing_fullcut_detail = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/fullcut/fullcutDetail.vue'], resolve)
const marketing_coupon_list = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponList.vue'], resolve)
const marketing_coupon_cash_create = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponCashCreate.vue'], resolve)
const marketing_coupon_discount_create = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponDiscountCreate.vue'], resolve)
const marketing_coupon_share_create = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponShareCreate.vue'], resolve)
const marketing_coupon_detail = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponDetail.vue'], resolve)
const marketing_coupon_modify = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponModify.vue'], resolve)
const marketing_coupon_rule = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponRule.vue'], resolve)
const marketing_coupon_send_record = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponSendRecord.vue'], resolve)
const marketing_coupon_share_setting = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_tool/coupon/CouponShareSetting.vue'], resolve)
const marketing_activity = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_activity/List.vue'], resolve)
const marketing_gift_packet_list = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_activity/gift_packet/GiftPacketList.vue'], resolve)
const marketing_gift_packet_add = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_activity/gift_packet/GiftPacketAdd.vue'], resolve)
const marketing_gift_packet_modify = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_activity/gift_packet/GiftPacketModify.vue'], resolve)
const marketing_gift_packet_detail = resolve => require(['@/views/businessManagePlatform/marketing_manage/marketing_activity/gift_packet/GiftPacketDetail.vue'], resolve)
// 财务管理
const finance_capital = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_capital/List.vue'], resolve)
const finance_payment_detail = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_payment_detail/List.vue'], resolve)
const finance_receivables = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_receivables/List.vue'], resolve)
const finance_refund = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_refund/List.vue'], resolve)
const finance_withdrawals = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_withdrawals/List.vue'], resolve)
const finance_print = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_withdrawals/Print.vue'], resolve)
const finance_lease = resolve => require(['@/views/businessManagePlatform/finance_manage/finance_lease/List.vue'], resolve)

// 客服
const custom_achieve = resolve => require(['@/views/businessManagePlatform/custom_manage/custom_achieve/List.vue'], resolve)
const custom_back = resolve => require(['@/views/businessManagePlatform/custom_manage/custom_back/List.vue'], resolve)
// 内容管理
const content_static = resolve => require(['@/views/businessManagePlatform/content_manage/content_static/List.vue'], resolve)
const help_center = resolve => require(['@/views/businessManagePlatform/content_manage/help_center/List.vue'], resolve)
// 运营管理
const bus_banner = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_banner/List.vue'], resolve)
const bus_custom = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/List.vue'], resolve)
const bus_search = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/Search.vue'], resolve)
const bus_classify = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/Classify.vue'], resolve)
const bus_map = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/Map.vue'], resolve)
const bus_home = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_home/List.vue'], resolve)
const bus_active = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/ActiveManage.vue'], resolve)
const bus_coupon = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/AddCoupon.vue'], resolve)
const coupon_detail = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/CouponDetail.vue'], resolve)
const bus_MediaName = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/MediaNameEdit.vue'], resolve)
const bus_send = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_send/List.vue'], resolve)
const bus_market = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/marketAdvertise.vue'], resolve)
const bus_homeAdver = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/homeAdverEdit.vue'], resolve)
const bus_startAdver = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/startAdverEdit.vue'], resolve)
const bus_headLine = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/headLine.vue'], resolve)
const bus_headLineEdit = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/headLineEdit.vue'], resolve)
const bus_headLineInfo = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_market_adver/headLineInfo.vue'], resolve)
const bus_special_price = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_custom/bus_special_price/SpecialPrice.vue'], resolve)
const bus_message_push_edit = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_send/MessagePushEdit.vue'], resolve)
const bus_message_push_record = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_send/RecordPush.vue'], resolve)
const bus_message_record_see = resolve => require(['@/views/businessManagePlatform/bus_manage/bus_send/RecordSee.vue'], resolve)
// 用户
const user_group = resolve => require(['@/views/businessManagePlatform/user_manage/user_group/List.vue'], resolve)
const user_info = resolve => require(['@/views/businessManagePlatform/user_manage/user_info/List.vue'], resolve)
// 订单管理
const order_search = resolve => require(['@/views/businessManagePlatform/order_manage/order_search/List.vue'], resolve)
const order_details = resolve => require(['@/views/businessManagePlatform/order_manage/order_search/Details.vue'], resolve)
// 票据管理
const instru_search = resolve => require(['@/views/businessManagePlatform/instrument_manage/Instru_manage/List.vue'], resolve)

// 激活数据
const report_salsemanActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_salsemanActivatedReport/List.vue'], resolve)
const report_mediaActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_mediaActivatedReport/List.vue'], resolve)
// 渠道统计
const channel_manage = resolve => require(['@/views/businessManagePlatform/channelManage/List.vue'], resolve)
const detail_data = resolve => require(['@/views/businessManagePlatform/channelManage/Details.vue'], resolve)

// 媒体管理
export default [
    { path: '/m/abstract', name: 'business_abstract', component: abstract },
    // 系统权限
    { path: '/m/rolePermission', name: 'business_sys_role', component: sys_role },
    { path: '/m/systemUser', name: 'business_sys_user', component: sys_user },
    { path: '/m/upgradeManagement', name: 'business_sys_update', component: sys_update },
    // 系统设置
    { path: '/m/mediaClassification', name: 'business_sys_category', component: sys_category },
    { path: '/m/disableVocabulary', name: 'business_sys_word', component: sys_word },
    // 结算
    { path: '/m/settlementManage', name: 'settlement_list', component: settlement_list },
    { path: '/m/settlementDetail', name: 'settlement_detail', component: settlement_detail },
    { path: '/m/settlementDetail/exportHistory', name: 'settlement_history', component: settlement_history, title: '导出历史' },
    // 营销管理
    { path: '/m/marketTool', name: 'business_marketing_tool', component: marketing_tool },
    { path: '/m/marketTool/fullcutList', name: 'business_marketing_fullcut_list', component: marketing_fullcut_list, title: '满减' },
    { path: '/m/marketTool/fullcutList/fullcutDetail', name: 'business_marketing_fullcut_detail', component: marketing_fullcut_detail, title: '详情' },
    { path: '/m/marketTool/fullcutList/fullcutCreate', name: 'business_marketing_fullcut_create', component: marketing_fullcut_create, title: '新增' },
    { path: '/m/marketTool/fullcutList/fullcutModify', name: 'business_marketing_fullcut_modify', component: marketing_fullcut_modify, title: '修改' },
    { path: '/m/marketTool/couponList', name: 'business_marketing_coupon_list', component: marketing_coupon_list, title: '优惠券' },
    { path: '/m/marketTool/couponList/couponCashCreate', name: 'business_marketing_coupon_cash_create', component: marketing_coupon_cash_create, title: '新增代金券' },
    { path: '/m/marketTool/couponList/couponDiscountCreate', name: 'business_marketing_coupon_discount_create', component: marketing_coupon_discount_create, title: '新增折扣券' },
    { path: '/m/marketTool/couponList/couponShareCreate', name: 'business_marketing_coupon_share_create', component: marketing_coupon_share_create, title: '新增分享券' },
    { path: '/m/marketTool/couponList/couponDetail', name: 'business_marketing_coupon_detail', component: marketing_coupon_detail, title: '详情' },
    { path: '/m/marketTool/couponList/couponModify', name: 'business_marketing_coupon_modify', component: marketing_coupon_modify, title: '修改' },
    { path: '/m/marketTool/couponList/couponRule', name: 'business_marketing_coupon_rule', component: marketing_coupon_rule, title: '发放优惠券' },
    { path: '/m/marketTool/couponList/couponRule/couponSendRecord', name: 'business_marketing_coupon_send_record', component: marketing_coupon_send_record, title: '发放记录' },
    { path: '/m/marketTool/couponList/couponShareSetting', name: 'business_marketing_coupon_share_setting', component: marketing_coupon_share_setting, title: '个性化编辑' },
    { path: '/m/marketActivity', name: 'business_marketing_activity', component: marketing_activity },
    { path: '/m/marketActivity/giftPacketList', name: 'business_marketing_gift_packet_list', component: marketing_gift_packet_list, title: '新人礼包' },
    { path: '/m/marketActivity/giftPacketList/giftPacketAdd', name: 'business_marketing_gift_packet_add', component: marketing_gift_packet_add, title: '新增' },
    { path: '/m/marketActivity/giftPacketList/giftPacketModify', name: 'business_marketing_gift_packet_modify', component: marketing_gift_packet_modify, title: '修改' },
    { path: '/m/marketActivity/giftPacketList/giftPacketDetail', name: 'business_marketing_gift_packet_detail', component: marketing_gift_packet_detail, title: '详情' },
    // 财务管理
    { path: '/m/capitalQuery', name: 'business_finance_capital', component: finance_capital },
    { path: '/m/receivingQuery', name: 'business_finance_receivables', component: finance_receivables },
    { path: '/m/refundQuery', name: 'business_finance_refund', component: finance_refund },
    { path: '/m/paymentDetails', name: 'business_finance_payment_detail', component: finance_payment_detail },
    { path: '/m/withdrawalManage', name: 'business_finance_withdrawals', component: finance_withdrawals },
    { path: '/m/withdrawalManage/printVoucher', name: 'business_finance_print', component: finance_print, title: '打印凭证' },
    { path: '/m/leaseQuery', name: 'business_finance_lease', component: finance_lease}, // 租赁资金
    // 客服
    { path: '/m/complaintFeedback', name: 'business_custom_achieve', component: custom_achieve },
    { path: '/m/results', name: 'business_custom_back', component: custom_back },
    // 内容管理
    { path: '/m/contentStatic', name: 'business_content_static', component: content_static },
    { path: '/m/helpCenter', name: 'business_help_center', component: help_center },
    // 运营管理
    { path: '/m/bannerManage', name: 'business_bus_banner', component: bus_banner },
    { path: '/m/clientFunManage', name: 'business_bus_custom', component: bus_custom },
    { path: '/m/pushMessage', name: 'business_bus_send', component: bus_send },
    { path: '/m/clientFunManage/search', name: 'business_bus_search', component: bus_search, title: '搜索' },
    { path: '/m/clientFunManage/classification', name: 'business_bus_classify', component: bus_classify, title: '分类' },
    { path: '/m/clientFunManage/mapTreasureHunt', name: 'business_bus_map', component: bus_map, title: '寻宝地图' },
    { path: '/m/clientFunManage/specialPrice', name: 'business_bus_special_price', component: bus_special_price, title: '特惠价' },
    { path: '/m/pushMessage/messagePushEdit', name: 'business_bus_message_push_edit', component: bus_message_push_edit, title: '编辑推送' },
    { path: '/m/pushMessage/recordPush', name: 'business_bus_message_push_edit', component: bus_message_push_record, title: '推送记录' },
    { path: '/m/pushMessage/recordPush/recordSee', name: 'business_bus_message_record_see', component: bus_message_record_see, title: '查看推送' },
    { path: '/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing', name: 'business_bus_active', component: bus_active, title: '寻宝营销' },
    { path: '/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing/m811xzlq', name: 'business_bus_coupon', component: bus_coupon, title: '新增编辑'},
    { path: '/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing/m812xq', name: 'business_bus_detail', component: coupon_detail, title: '领券详情'},    
    { path: '/m/clientFunManage/mapTreasureHunt/mediaNameEdit', name: 'business_bus_coupon', component: bus_MediaName, title: '客户端媒体管理' },
    { path: '/m/mallHomepage', name: 'business_bus_home', component: bus_home },
    { path: '/m/marketAdvertise', name: 'business_bus_market', component: bus_market },
    { path: '/m/marketAdvertise/homeAdver', name: 'business_bus_homeAdver', component: bus_homeAdver, title: '主页开屏广告' },
    { path: '/m/marketAdvertise/startAdver', name: 'business_bus_startAdver', component: bus_startAdver, title: '启动广告' },
    { path: '/m/marketAdvertise/headLine', name: 'business_bus_headLine', component: bus_headLine, title: '拍货头条' },
    { path: '/m/marketAdvertise/headLine/headLineEdit', name: 'business_bus_headLineEdit', component: bus_headLineEdit, title: '编辑头条' },
    { path: '/m/marketAdvertise/headLine/headLineInfo', name: 'business_bus_headLineInfo', component: bus_headLineInfo, title: '头条详情' },
    // 用户
    { path: '/m/userManage', name: 'business_user_info', component: user_info },
    { path: '/m/userGroup', name: 'business_user_group', component: user_group },
    // 订单管理
    { path: '/m/orderList', name: 'business_order_search', component: order_search },
    { path: '/m/orderList/orderDetails', name: 'business_order_details', component: order_details, title: '订单详情' },
    // 票据管理
    { path: '/m/instruList', name: 'business_instru_search', component: instru_search },
    // 激活数据
    { path: '/m/salsemanActivatedReport', name: 'media_report_salsemanActivatedReport', component: report_salsemanActivatedReport },
    { path: '/m/mediaActivatedReport', name: 'media_report_mediaActivatedReport', component: report_mediaActivatedReport },
    // 渠道管理
    { path: '/m/channelManage', name: 'business_channel_manage', component: channel_manage },
    { path: '/m/detailData', name: 'business_detail_data', component: detail_data }
]
