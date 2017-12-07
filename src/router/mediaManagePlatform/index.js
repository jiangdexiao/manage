
import abstract from '@/views/mediaManagePlatform/abstract/abstract.vue'
//促销员
import commissioner_achievement from '@/views/mediaManagePlatform/commissioner_manage/commissioner_achievement/List.vue'
import commissioner_appeal from '@/views/mediaManagePlatform/commissioner_manage/commissioner_appeal/List.vue'
import commissioner_commission from '@/views/mediaManagePlatform/commissioner_manage/commissioner_commission/List.vue'
import commissioner_list from '@/views/mediaManagePlatform/commissioner_manage/commissioner_list/List.vue'
import commissioner_organization from '@/views/mediaManagePlatform/commissioner_manage/commissioner_organization/List.vue'
import commissioner_visited from '@/views/mediaManagePlatform/commissioner_manage/commissioner_visited/List.vue'

//客户管理
import custom_assist from '@/views/mediaManagePlatform/custom_manage/custom_assist/List.vue'
import custom_followup from '@/views/mediaManagePlatform/custom_manage/custom_followup/List.vue'
import custom_progress from '@/views/mediaManagePlatform/custom_manage/custom_progress/List.vue'
import custom_record from '@/views/mediaManagePlatform/custom_manage/custom_record/List.vue'
//财务
import finance_capital from '@/views/mediaManagePlatform/finance_manage/finance_capital/List.vue'
import finance_percentage from '@/views/mediaManagePlatform/finance_manage/finance_percentage/List.vue'
import finance_withdrawals from '@/views/mediaManagePlatform/finance_manage/finance_withdrawals/List.vue'
//媒体
import media_advertising from '@/views/mediaManagePlatform/media_manage/media_advertising/List.vue'
import media_delivery from '@/views/mediaManagePlatform/media_manage/media_delivery/List.vue'
import media_dividedinto from '@/views/mediaManagePlatform/media_manage/media_dividedinto/List.vue'
import media_list from '@/views/mediaManagePlatform/media_manage/media_list/List.vue'
import media_pending from '@/views/mediaManagePlatform/media_manage/media_pending/List.vue'
import media_ranking from '@/views/mediaManagePlatform/media_manage/media_ranking/List.vue'
//bd
import promotion_dividedinto from '@/views/mediaManagePlatform/promotion_manage/promotion_dividedinto/List.vue'
import promotion_list from '@/views/mediaManagePlatform/promotion_manage/promotion_list/List.vue'
import promotion_profit from '@/views/mediaManagePlatform/promotion_manage/promotion_profit/List.vue'
import promotion_ranking from '@/views/mediaManagePlatform/promotion_manage/promotion_ranking/List.vue'
import promotion_schedule from '@/views/mediaManagePlatform/promotion_manage/promotion_schedule/List.vue'

export default [
    { path:'/abstract', name:'abstract', component:abstract},
    //促销员
    { path:'/commissioner_achievement', name:'commissioner_achievement', component:commissioner_achievement},
    { path:'/commissioner_appeal',name:'commissioner_appeal',component:commissioner_appeal},
    { path:'/commissioner_commission',name:'commissioner_commission',component:commissioner_commission},
    { path:'/commissioner_list', name:'commissioner_list', component:commissioner_list},
    { path:'/commissioner_organization', name:'commissioner_organization', component:commissioner_organization},
    { path:'/commissioner_visited', name:'commissioner_visited', component:commissioner_visited},
    //客户管理
    { path:'/custom_assist',name:'custom_assist',component:custom_assist },
    { path:'/custom_followup',name:'custom_followup',component:custom_followup},
    { path:'/custom_progress',name:'custom_progress',component:custom_progress},
    { path:'/custom_record',name:'custom_record', component:custom_record},
    //财务
    { path:'/finance_capital',name:'finance_capital',component:finance_capital},
    { path:'/finance_percentage',name:'finance_percentage',component:finance_percentage},
    { path:'/finance_withdrawals',name:'finance_withdrawals',component:finance_withdrawals},
    //媒体
    { path:'/media_advertising', name:'media_advertising',component:media_advertising},
    { path:'/media_delivery',name:'media_delivery',component:media_delivery},
    { path:'/media_dividedinto',name:'media_dividedinto',component:media_dividedinto},
    { path:'/media_list',name:'media_list', component:media_list },
    { path:'/media_pending', name:'media_pending', component:media_pending },
    { path:'/media_ranking',name:'media_ranking',component:media_ranking},
    //bd
    { path:'/promotion_dividedinto',name:'promotion_dividedinto',component:promotion_dividedinto },
    { path:'/promotion_list',name:'promotion_list', component:promotion_list},
    { path:'/promotion_profit', name:'promotion_profit',component:promotion_profit},
    { path:'/promotion_ranking', name:'promotion_ranking', component:promotion_ranking},
    { path:'/promotion_schedule',name:'promotion_schedule', component:promotion_schedule}
]