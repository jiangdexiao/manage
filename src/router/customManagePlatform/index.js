/**
 * 工具组 系统
 */

const custom_abstract = resolve => require(['@/views/customManagePlatform/abstract/abstract.vue'], resolve);

const custom_idphoto = resolve => require(['@/views/customManagePlatform/idphoto_manage/idphoto_list/List.vue'], resolve);
const custom_specs_addModify = resolve => require(['@/views/customManagePlatform/idphoto_manage/idphoto_list/AddModify.vue'], resolve);
const custom_specs_detail = resolve => require(['@/views/customManagePlatform/idphoto_manage/idphoto_list/Detail.vue'], resolve);

const custom_history = resolve => require(['@/views/customManagePlatform/idphoto_manage/history_list/List.vue'], resolve);

const custom_background = resolve => require(['@/views/customManagePlatform/idphoto_manage/background_list/List.vue'], resolve);

const custom_category = resolve => require(['@/views/customManagePlatform/idphoto_manage/category_list/List.vue'], resolve);



export default [
    {path:'/custom/abstract', name:'custom_abstract', component:custom_abstract},
    {path:'/custom/idphoto', name:'custom_idphoto', component:custom_idphoto},
    {path:'/custom/idphoto/addModify', name:'custom_specs_addModify',title:"编辑", component:custom_specs_addModify},
    {path:'/custom/idphoto/detail', name:'custom_specs_detail',title:"详情", component:custom_specs_detail},
    {path:'/custom/history', name:'custom_history', component:custom_history},
    {path:'/custom/background', name:'custom_background', component:custom_background},
    {path:'/custom/category', name:'custom_category', component:custom_category},
]
