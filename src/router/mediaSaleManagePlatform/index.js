/**
 * 媒体行销系统
 */
import abstract from '@/views/mediaSaleManagePlatform/abstract/abstract.vue'
//提成管理
import commission_calculation from '@/views/mediaSaleManagePlatform/commission_manage/commission_calculation/List.vue'
import commission_my from '@/views/mediaSaleManagePlatform/commission_manage/commission_my/List.vue'
import commission_staff from '@/views/mediaSaleManagePlatform/commission_manage/commission_staff/List.vue'

//客户管理
import custom_assist from '@/views/mediaSaleManagePlatform/custom_manage/custom_assist/List.vue'
import custom_followup from '@/views/mediaSaleManagePlatform/custom_manage/custom_followup/List.vue'
import custom_progress from '@/views/mediaSaleManagePlatform/custom_manage/custom_progress/List.vue'
import custom_record from '@/views/mediaSaleManagePlatform/custom_manage/custom_record/List.vue'
//申诉
import appeal_my from '@/views/mediaSaleManagePlatform/appeal_manage/appeal_my/List.vue'

//媒体
import media_advertising from '@/views/mediaSaleManagePlatform/media_manage/media_advertising/List.vue'
import media_list from '@/views/mediaSaleManagePlatform/media_manage/media_list/List.vue'
//bd
import promotion_organization from '@/views/mediaSaleManagePlatform/promotion_manage/promotion_organization/List.vue'
import promotion_list from '@/views/mediaSaleManagePlatform/promotion_manage/promotion_list/List.vue'
//排行榜
import ranking_area from '@/views/mediaSaleManagePlatform/rangking_manage/ranking_area/List.vue'
import rangking_industry from '@/views/mediaSaleManagePlatform/rangking_manage/rangking_industry/List.vue'
import rangking_all from '@/views/mediaSaleManagePlatform/rangking_manage/rangking_all/List.vue'

export default [
    { path:'/abstract', name:'abstract', component:abstract},
    //提成管理
    { path:'/commission_calculation', name:'commission_calculation', component:commission_calculation},
    { path:'/commission_my',name:'commission_my',component:commission_my},
    { path:'/commission_staff',name:'commission_staff',component:commission_staff},
    //客户管理
    { path:'/custom_assist',name:'custom_assist',component:custom_assist },
    { path:'/custom_followup',name:'custom_followup',component:custom_followup},
    { path:'/custom_progress',name:'custom_progress',component:custom_progress},
    { path:'/custom_record',name:'custom_record', component:custom_record},
    //申诉
    { path:'/appeal_my',name:'appeal_my',component:appeal_my},
    //媒体
    { path:'/media_advertising', name:'media_advertising',component:media_advertising},
    { path:'/media_list',name:'media_list', component:media_list },
    //bd
    { path:'/promotion_organization',name:'promotion_organization',component:promotion_organization },
    { path:'/promotion_list',name:'promotion_list', component:promotion_list},
    //排行榜
    { path:'/ranking_area',name:'ranking_area',component:ranking_area },
    { path:'/rangking_industry',name:'rangking_industry', component:rangking_industry},
    { path:'/rangking_all',name:'rangking_all', component:rangking_all}
]