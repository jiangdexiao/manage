<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" :title="type===1?'下载二维码':'下载条形码'" @close="handleClose" :visible.sync="show_barcode_dialog" :close-on-click-modal= "false">
            <div style='text-align:center;'>
                <!-- 二维码 -->
                <template v-if="type === 1" >
                    <!-- 单个 -->
                    <template v-if="codes && codes.length === 1">
                        <img style="width:200px;height:200px;"  :src="codes[0].qrImgUrl" >
                        <div >URL: {{codes[0].qrUrl}} </div>
                    </template>
                    <!-- 多个 -->
                    <template v-else>
                        <div v-if="codes && codes.length > 1">
                            <p v-for="(code,i) in codes" :key="i">{{ code.mresNo }}</p>
                            <div style='margin-top:10px'>共选择{{codes.length}}条数据</div>
                        </div>
                        
                    </template>
                </template>
                <!-- 条形码 -->
                <template v-else>
                    <!-- 单个 -->
                    <template  v-if="codes && codes.length === 1">
                        <img :src="codes[0].barImgUrl">
                        <div >条码值:  {{codes[0].mresNo}}</div>
                    </template>
                    <!-- 多个 -->
                    <template v-else>
                        <div v-if="codes && codes.length > 1">
                            <p v-for="(code,i) in codes" :key="i">{{ code.mresNo }}</p>
                            <div style='margin-top:10px'>共选择{{codes.length}}条数据</div>
                        </div>
                    </template>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveCodeDownload" >保存到本地</el-button>
                <!-- <a v-if="data && data.length === 1" :href="codes[0].barImgUrl" type="button"  download="1" @click="save">保存到本地</a> -->
            </span>
        </el-dialog>
	</div>
</template>
<script>
export default {
  data(){
      return {
          show_barcode_dialog:false,
          codes:[]
      }
  },
  methods:{
    handleClose(){
        this.codes = []
        this.show_barcode_dialog = false
        this.$parent.show_barcode_dialog = false
    },
    //条码批量保存
    saveCodeDownload(){
      let mresids = this.codes.map(item=>{ return item.mresId }).join(',')
      let str=`mresIds=${mresids}`
      // for(let key in that.codeDownload){
      //   str += key+'='+that.codeDownload[key]+'&'
      // }
      let a = document.createElement('a');
      let url = ''
      if( this.type === 1 ){
        url = `${this.BASE_URL}m2c.media/mres/qr/down?${str}`
      }else {
        url = `${this.BASE_URL}m2c.media/mres/bar/down?${str}`
      }
      let iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.display= 'none';
      document.body.appendChild(iframe);
      iframe.onload = function(){
          document.body.removeChild(iframe);
      }
      this.handleClose()
    }
  },
  computed:{
      
  },
  mounted(){
      
  },
  props:{
      isShow:{
          type:Boolean
      },
      type:{
          type:Number
      },
      data:{
          type:Array
      }
  },
  watch:{
      isShow(v){
          this.show_barcode_dialog = v
          this.codes = []
          if( v === true){
              if( this.data && this.data.length > 0 ){
                  let mresIds = this.data.map(item=>{
                    return item.mresId
                  }).join(',')
                  if( this.type === 1){
                      //二维码
                      this.api_mediaManagePlatform_qrcode({data:{ mresIds:mresIds} }).then(res=>{
                          this.codes = res.content
                      })
                  }else{
                      //条形码
                    this.api_mediaManagePlatform_barcode({data:{ mresIds:mresIds} }).then(res=>{
                        this.codes = res.content
                    })
                  }
              }
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>