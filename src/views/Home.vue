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
    import vHead from '../components/layout/head-nav/header.vue';
    import vSidebar from '../components/layout/left-menu/sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        }
    }
</script>
