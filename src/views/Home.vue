<template>
    <div class="wrapper">
        <v-head :title="title"></v-head>
         <v-sidebar :menus="menus"></v-sidebar>
        
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import { mapActions , mapGetters,mapState } from "vuex"
    import vHead from '../components/layout/head-nav/header.vue'
    import vSidebar from '../components/layout/left-menu/sidebar.vue'
    //模拟菜单
    import { media_menus ,bi_menus, business_menus,seller_menus,media_sale_menus } from '../json/' 
    
    export default {
        components:{
            vHead, vSidebar
        },
        data(){
            return{
                moduleId:'',
                menus:[],
                title:''
            }
        },
        computed:{
            ...mapGetters(['getUser']),
            ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM'])
        },
        methods:{
            ...mapActions(["getMenuAction","setUser"]),
            init(){
                this.api_common_menu({
                    data:{
                        userId: this.getUser.userId,
                        accessToken: this.getUser.token,
                        moduleId: this.moduleId
                    }
                }).then(res => {
                    console.log(res);
                    
                }).catch(err=>{
                    console.log('请求出错啦')
                });
            }
        },
        created(){
            if( !this.getUser ){
                this.setUser()
            }
            console.log(this.getUser)
        },
        mounted(){
            
            this.moduleId = this.$route.query.moduleId || localStorage.getItem('moduleId')
            localStorage.setItem('moduleId',this.moduleId)
            console.log(`moduleId:${this.moduleId}`)
            switch(this.moduleId){
                case this.TOOL_MANAGE_PLATFORM:
                    this.title = '工具管理'
                break;
                case this.BI_MANAGE_PLATFORM:
                    this.menus = bi_menus
                    this.title = 'BI'
                break;
                case this.BUSINESS_MANAGE_PLATFORM:
                    this.menus = business_menus
                    this.title = '运营管理'
                break;
                case this.MEDIA_MANAGE_PLATFORM:
                    this.menus = media_menus
                    this.title = '媒体管理'
                break;
                case this.MEDIA_SALE_MANAGE_PLATFORM:
                    this.menus = media_sale_menus
                    this.title = '媒体行销'
                break;
                case this.SELLER_MANAGE_PLATFORM:
                    this.menus = seller_menus
                    this.title = '商家管理'
                break;
            }
            this.init()
        }
    }
</script>
