<template>
    <div v-show="showLoading" class="loading_sty">
      <div>
        <img src="../../../../../static/images/loading.gif">
        <p>正在提交中...</p>
      </div>
    </div>
</template>

<script>
export default {
  data(){
      return{
      }
  },
  props: ["showLoading"],
  methods:{
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
.loading_sty{
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  z-index: 9999;
}
.loading_sty div{
    width: 400px;
    height: 60px;
    padding: 50px 0;
    margin: 0 auto;
    top: 40%;
    font-size: 16px;
    border-radius: 10px;
    text-align: center;
    background: #fff;
    position: relative;
    display: inherit;
}
.loading_sty img{
  margin: 0 auto 10px;
  position: relative;
  display: inherit;
}
</style>