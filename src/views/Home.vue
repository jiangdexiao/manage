<template>
    <div class="wrapper">
        <v-head></v-head>
         <v-sidebar></v-sidebar>
        
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import { mapActions , mapGetters } from "vuex";
    import vHead from '../components/layout/head-nav/header.vue';
    import vSidebar from '../components/layout/left-menu/sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        data(){
            return{
                moduleId:''
            }
        },
        computed:{
            ...mapGetters(['getUser'])
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
            console.log(`moduleId:${this.$route.query.moduleId}`)
            this.moduleId = this.$route.query.moduleId
            this.init()
        }
    }
</script>
