<template>
    <div class="wrapper">
        <v-head :title="title" :userName="getUser.name" :token="getUser.token" @setPassword="setPassword" @viewPersonInfo="viewPersonInfo" ></v-head>
         <v-sidebar :menus="getMenus?getMenus.menus:[]" ></v-sidebar>
        <vBread></vBread>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
        <password :isShow="show_password_dialog"></password>
        <userinfo :isShow="show_userinfo_dialog"></userinfo>
    </div>
</template>

<script>
    import { mapActions , mapGetters, mapState } from "vuex"
    import vHead from '../components/layout/head-nav/header.vue'
    import vSidebar from '../components/layout/left-menu/sidebar.vue'
    import vBread from '../components/layout/bread/bread.vue'
    import password from './login/password.vue'
    import userinfo from './login/userinfo.vue'
    export default {
        components:{
            vHead, vSidebar,vBread,password,userinfo
        },
        data(){
            return{
                title:sessionStorage.getItem('title'),
                show_password_dialog:false,
                show_userinfo_dialog:false
            }
        },
        computed:{
            ...mapGetters(['getUser','getMenus'])
        },
        methods:{
            ...mapActions(['setUser','setMenu']),
            setPassword(){
                this.show_password_dialog = true
            },
            viewPersonInfo(){
                this.show_userinfo_dialog = true
            }
        },
        created(){
            if( !this.getMenus || this.getMenus.length == 0 ){
                this.setMenu()
            }
            if( !this.getUser ){
                this.setUser()
            }
            // console.log(this.getMenus)
        },
        mounted(){
            if (!this.tool.cookie.getCookie('access_token')) {
                sessionStorage.clear()
                this.tool.cookie.delCookie('access_token')
                this.tool.cookie.delCookie('auth')
                this.$goRoute({path: '/login'})
                return
            }
        }
    }
</script>
