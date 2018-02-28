<template>
  <el-upload
    class="avatar-uploader"
    name="img"
    :data="{imgGroup:img.imgGroup}"
    :action="uploadUrl"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imgUrl||img.imageUrl" :src="imgUrl?imgUrl:(img.imageUrl?img.imageUrl:'')" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>

<script>
export default {
  name:'ele-upload',
  data(){
      return{
          imgUrl:'',
          uploadUrl:this.BASE_URL + 'm2c.support/img/upload'
      }
  },
  props:['img'],//src 默认双向绑定 从而有从而影响外部 组件的风险 父组件传递进来的参数默认是单向传递 不允许修改
  methods:{
      handleAvatarSuccess(res, file){
        if( res && res.content ){
          this.imgUrl = URL.createObjectURL(file.raw);
          this.$emit('uploadSuccess',res);
        }else{
          this.$message({message:res.errorMessage,type:'error'});
        }
      },
      beforeAvatarUpload(file){
        const ext = file.type.split('/')[1];
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!~['gif','jpg','jpeg','png','bmp','GIF','JPG','PNG'].indexOf(ext)) {
            this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
            return false;
        }
        if( this.img.minSize && file.size / 1024 < this.img.minSize ){
          this.$message.error(`图片大小必须大于${this.img.minSize}kb`);
          return false;
        }
        if( this.img.maxSize && file.size / 1024 > this.img.maxSize ){
          this.$message.error(`图片大小必须小于${this.img.maxSize}kb`);
          return false;
        }
        if (!this.img.minSize && !this.img.maxSize && !isLt2M) {
          this.$message.error('图片大小不能超过 2MB!');
          return false;
        }
        
        if( this.img.filter && typeof(this.img.filter) == 'function'){
          return this.img.filter();
        }
        return true;
      },
      clear(){
        this.imgUrl = '';
        // console.log('清除upload组件的url值')
      }
  },
  created(){
    // console.log(`创建upload组件：默认值imgUrl:${this.imgUrl}参数imageUrl:${this.img.imageUrl}`)
  }
}
</script>

<style>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader input[type='file']{
    display: none;
  }
</style>
