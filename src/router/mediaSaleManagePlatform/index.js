/**
 * 媒体行销系统
 */
const abstract = resolve => require(['@/views/mediaSaleManagePlatform/abstract/abstract.vue'], resolve);
//提成管理
const commission_calculation = resolve => require(['@/views/mediaSaleManagePlatform/commission_manage/commission_calculation/List.vue'], resolve);
const commission_my = resolve => require(['@/views/mediaSaleManagePlatform/commission_manage/commission_my/List.vue'], resolve);
const commission_staff = resolve => require(['@/views/mediaSaleManagePlatform/commission_manage/commission_staff/List.vue'], resolve);
//客户管理
const custom_assist = resolve => require(['@/views/mediaSaleManagePlatform/custom_manage/custom_assist/List.vue'], resolve);
const custom_followup = resolve => require(['@/views/mediaSaleManagePlatform/custom_manage/custom_followup/List.vue'], resolve);
const custom_progress = resolve => require(['@/views/mediaSaleManagePlatform/custom_manage/custom_progress/List.vue'], resolve);
const custom_record = resolve => require(['@/views/mediaSaleManagePlatform/custom_manage/custom_record/List.vue'], resolve);
//申诉
const appeal_my = resolve => require(['@/views/mediaSaleManagePlatform/appeal_manage/appeal_my/List.vue'], resolve);

//媒体
const media_advertising = resolve => require(['@/views/mediaSaleManagePlatform/media_manage/media_advertising/List.vue'], resolve);
const media_list = resolve => require(['@/views/mediaSaleManagePlatform/media_manage/media_list/List.vue'], resolve);
const media_devided = resolve => require(['@/views/mediaSaleManagePlatform/media_manage/media_devided/List.vue'], resolve);
//bd
const promotion_organization = resolve => require(['@/views/mediaSaleManagePlatform/promotion_manage/promotion_organization/List.vue'], resolve);
const promotion_list = resolve => require(['@/views/mediaSaleManagePlatform/promotion_manage/promotion_list/List.vue'], resolve);
//排行榜
const ranking_area = resolve => require(['@/views/mediaSaleManagePlatform/rangking_manage/ranking_area/List.vue'], resolve);
const rangking_industry = resolve => require(['@/views/mediaSaleManagePlatform/rangking_manage/rangking_industry/List.vue'], resolve);
const rangking_all = resolve => require(['@/views/mediaSaleManagePlatform/rangking_manage/rangking_all/List.vue'], resolve);
//激活数据
const report_salsemanActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_salsemanActivatedReport/List.vue'], resolve);
const report_mediaActivatedReport = resolve => require(['@/views/mediaManagePlatform/report_manage/report_mediaActivatedReport/List.vue'], resolve);

export default [
    { path: '/mediasale/abstract', name: 'mediasale_abstract', component: abstract },
    //提成管理
    { path: '/mediasale/mu/calculate', name: 'mediasale_commission_calculation', component: commission_calculation },
    { path: '/mediasale/mu/commission', name: 'mediasale_commission_my', component: commission_my },
    { path: '/mediasale/mu/staff', name: 'mediasale_commission_staff', component: commission_staff },
    //客户管理
    { path: '/mediasale/mu/assist', name: 'mediasale_custom_assist', component: custom_assist },
    { path: '/mediasale/mu/followup', name: 'mediasale_custom_followup', component: custom_followup },
    { path: '/mediasale/mu/progress', name: 'mediasale_custom_progress', component: custom_progress },
    { path: '/mediasale/mu/record', name: 'mediasale_custom_record', component: custom_record },
    //申诉
    { path: '/mediasale/mu/appeal', name: 'mediasale_appeal_my', component: appeal_my },
    //媒体
    { path: '/mediasale/mu/advertising', name: 'mediasale_media_advertising', component: media_advertising },
    { path: '/mediasale/mu/medias', name: 'mediasale_media_list', component: media_list },
    { path: '/mediasale/mu/advSchedule', name: 'media_devided', component: media_devided },//广告投放
    //bd
    { path: '/mediasale/mu/framework', name: 'mediasale_promotion_organization', component: promotion_organization },
    { path: '/mediasale/mu/commissioner', name: 'mediasale_promotion_list', component: promotion_list },
    //排行榜
    { path: '/mediasale/mu/area', name: 'mediasale_ranking_area', component: ranking_area },
    { path: '/mediasale/mu/industry', name: 'mediasale_rangking_industry', component: rangking_industry },
    { path: '/mediasale/mu/totallist', name: 'mediasale_rangking_all', component: rangking_all },
    //激活数据
    { path: '/mediasale/mu/salsemanActivatedReport', name: 'media_report_salsemanActivatedReport', component: report_salsemanActivatedReport},
    { path: '/mediasale/mu/mediaActivatedReport', name: 'media_report_mediaActivatedReport', component: report_mediaActivatedReport},
]