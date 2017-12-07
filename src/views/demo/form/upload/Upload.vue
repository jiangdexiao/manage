<template>
  <div class="form">
    <ele-upload ref="imgUpload" :img="img"  v-on:uploadSuccess="uploadSuccess"></ele-upload>
  </div>
</template>
<script>
  import EleUpload from './Upload.js'

  export default EleUpload
</script>
<style scoped>

</style>
