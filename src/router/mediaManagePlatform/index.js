
const abstract = resolve => require(['@/views/mediaManagePlatform/abstract/abstract.vue'], resolve);
//促销员

const commissioner_achievement = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_achievement/List.vue'], resolve);
const commissioner_appeal = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_appeal/List.vue'], resolve);
const commissioner_commission = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_commission/List.vue'], resolve);
const commissioner_list = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_list/List.vue'], resolve);
const commissioner_organization = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_organization/List.vue'], resolve);
const commissioner_visited = resolve => require(['@/views/mediaManagePlatform/commissioner_manage/commissioner_visited/List.vue'], resolve);

//客户管理
const custom_assist = resolve => require(['@/views/mediaManagePlatform/custom_manage/custom_assist/List.vue'], resolve);
const custom_followup = resolve => require(['@/views/mediaManagePlatform/custom_manage/custom_followup/List.vue'], resolve);
const custom_progress = resolve => require(['@/views/mediaManagePlatform/custom_manage/custom_progress/List.vue'], resolve);
const custom_record = resolve => require(['@/views/mediaManagePlatform/custom_manage/custom_record/List.vue'], resolve);
//财务

const finance_capital = resolve => require(['@/views/mediaManagePlatform/finance_manage/finance_capital/List.vue'], resolve);
const finance_percentage = resolve => require(['@/views/mediaManagePlatform/finance_manage/finance_percentage/List.vue'], resolve);
const finance_withdrawals = resolve => require(['@/views/mediaManagePlatform/finance_manage/finance_withdrawals/List.vue'], resolve);
const finance_rent = resolve => require(['@/views/mediaManagePlatform/finance_manage/finance_rent/List.vue'], resolve);
const finance_rentDetail = resolve => require(['@/views/mediaManagePlatform/finance_manage/finance_rent/detailList.vue'], resolve);

//媒体

const media_advertising = resolve => require(['@/views/mediaManagePlatform/media_manage/media_advertising/List.vue'], resolve);
const media_delivery = resolve => require(['@/views/mediaManagePlatform/media_manage/media_delivery/List.vue'], resolve);
const media_dividedinto = resolve => require(['@/views/mediaManagePlatform/media_manage/media_dividedinto/List.vue'], resolve);
const media_list = resolve => require(['@/views/mediaManagePlatform/media_manage/media_list/List.vue'], resolve);
const media_pending = resolve => require(['@/views/mediaManagePlatform/media_manage/media_pending/List.vue'], resolve);
const media_ranking = resolve => require(['@/views/mediaManagePlatform/media_manage/media_ranking/List.vue'], resolve);
const media_publishPrice = resolve => require(['@/views/mediaManagePlatform/media_manage/media_publishPrice/List.vue'], resolve);
const media_conversion = resolve => require(['@/views/mediaManagePlatform/media_manage/media_conversion/List.vue'], resolve);
const media_conversionDetail = resolve => require(['@/views/mediaManagePlatform/media_manage/media_conversion/detailList.vue'], resolve);
const media_media_vacancy = resolve => require(['@/views/mediaManagePlatform/media_manage/media_vacancy/List.vue'], resolve);
const media_audit = resolve => require(['@/views/mediaManagePlatform/media_manage/media_audit/List.vue'], resolve);
const media_advCost = resolve => require(['@/views/mediaManagePlatform/media_manage/media_advCost/List.vue'], resolve);


//bd
const promotion_dividedinto = resolve => require(['@/views/mediaManagePlatform/promotion_manage/promotion_dividedinto/List.vue'], resolve);
const promotion_list = resolve => require(['@/views/mediaManagePlatform/promotion_manage/promotion_list/List.vue'], resolve);
const promotion_profit = resolve => require(['@/views/mediaManagePlatform/promotion_manage/promotion_profit/List.vue'], resolve);
const promotion_ranking = resolve => require(['@/views/mediaManagePlatform/promotion_manage/promotion_ranking/List.vue'], resolve);
const promotion_schedule = resolve => require(['@/views/mediaManagePlatform/promotion_manage/promotion_schedule/List.vue'], resolve);
//业务运营
const businessOpt_deliveryManage = resolve => require(['@/views/mediaManagePlatform/business_operation/businessOpt_deliveryManage/List.vue'], resolve);
//报表
const report_advertisingdetail = resolve => require(['@/views/mediaManagePlatform/report_manage/report_advertisingdetail/List.vue'], resolve);
const report_mediaDetailReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_mediaDetailReport/List.vue'], resolve);
const report_orderDetailReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_orderDetailReport/List.vue'], resolve);
const report_salsemanActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_salsemanActivatedReport/List.vue'], resolve);
const report_mediaActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_mediaActivatedReport/List.vue'], resolve);
//市场激励 
const reward_List = resolve => require(['@/views/mediaManagePlatform/reward_manage/reward_List/List.vue'], resolve);
const reward_detail = resolve => require(['@/views/mediaManagePlatform/reward_manage/reward_detail/List.vue'], resolve);


export default [
    { path: '/mu/abstract', name: 'media_abstract', component: abstract },
    //促销员
    { path: '/mu/achievement', name: 'media_commissioner_achievement', component: commissioner_achievement },
    { path: '/mu/appeal', name: 'media_commissioner_appeal', component: commissioner_appeal },
    { path: '/mu/commission', name: 'media_commissioner_commission', component: commissioner_commission },
    { path: '/mu/commissioner', name: 'media_commissioner_list', component: commissioner_list },
    { path: '/mu/organization', name: 'media_commissioner_organization', component: commissioner_organization },
    { path: '/mu/visit', name: 'media_commissioner_visited', component: commissioner_visited },
    //客户管理
    { path: '/mu/assist', name: 'media_custom_assist', component: custom_assist },
    { path: '/mu/followup', name: 'media_custom_followup', component: custom_followup },
    { path: '/mu/progress', name: 'media_custom_progress', component: custom_progress },
    { path: '/mu/record', name: 'media_custom_record', component: custom_record },
    //财务
    { path: '/mu/capital', name: 'media_finance_capital', component: finance_capital },
    { path: '/mu/bdPercentage', name: 'media_finance_percentage', component: finance_percentage },
    { path: '/mu/withdrawals', name: 'media_finance_withdrawals', component: finance_withdrawals },
    { path: '/mu/rent', name: 'media_finance_rent', component: finance_rent },
    { path: '/mu/rent/detail', name: 'media_finance_rentDetail', component: finance_rentDetail,title:'查看详细'},
    
    //媒体
    { path: '/mu/advertising', name: 'media_media_advertising', component: media_advertising },
    { path: '/mu/delivery', name: 'media_media_delivery', component: media_delivery },
    { path: '/mu/branch', name: 'media_media_dividedinto', component: media_dividedinto },
    { path: '/mu/medias', name: 'media_media_list', component: media_list },
    { path: '/mu/pending', name: 'media_media_pending', component: media_pending },
    { path: '/mu/mediaranking', name: 'media_media_ranking', component: media_ranking }, 
    { path: '/mu/publishPrice', name: 'media_media_publishPrice', component: media_publishPrice },
    { path: '/mu/conversion', name: 'media_media_conversion', component: media_conversion },
    { path: '/mu/conversion/detail', name: 'media_media_conversionDetail', component: media_conversionDetail,title:'查看详细' },
    { path: '/mu/vacancy', name: 'media_media_vacancy', component: media_media_vacancy },
    { path: '/mu/audit', name: 'media_media_audit', component: media_audit },
    { path: '/mu/advCost', name: 'media_media_advCost', component: media_advCost },
    
    //bd
    { path: '/mu/dividedinto', name: 'media_promotion_dividedinto', component: promotion_dividedinto },
    { path: '/mu/promotion', name: 'media_promotion_list', component: promotion_list },
    { path: '/mu/profit', name: 'media_promotion_profit', component: promotion_profit },
    { path: '/mu/ranking', name: 'media_promotion_ranking', component: promotion_ranking },
    { path: '/mu/scheduling', name: 'media_promotion_schedule', component: promotion_schedule },
    // 业务运营
    { path: '/mu/deliveryManage', name: 'media_businessOpt_deliveryManage', component: businessOpt_deliveryManage},
    // 报表
    { path: '/mu/advertisingdetail', name: 'media_report_advertisingdetail', component: report_advertisingdetail},
    { path: '/mu/mediaDetailReport', name: 'media_report_mediaDetailReport', component: report_mediaDetailReport},
    { path: '/mu/orderDetailReport', name: 'media_report_orderDetailReport', component: report_orderDetailReport},
    { path: '/mu/salsemanActivatedReport', name: 'media_report_salsemanActivatedReport', component: report_salsemanActivatedReport},
    { path: '/mu/mediaActivatedReport', name: 'media_report_mediaActivatedReport', component: report_mediaActivatedReport},
    //市场激励
    { path: '/mu/reward', name: 'media_reward_List', component: reward_List},
    { path: '/mu/rewardDetail', name: 'media_reward_detail', component: reward_detail},

]