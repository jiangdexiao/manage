<template>
    <div>
        <el-cascader placeholder="选择媒体分类" class="form-input" clearable
            :options="list"
            v-model="selected"
            change-on-select
            @change="BannerHandleItemChange">
        </el-cascader>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return{
        list:[],
        selected:[]
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods:{
    BannerHandleItemChange(vals){
        if( !vals || vals.length == 0){//清空
            this.$emit('selected','');
            return;
        }
        let that = this; 
        this.$emit('selected', vals[vals.length-1], vals);
        let val = vals[vals.length-1];
        // this.$emit('selected',val);
        let obj = that.list.find(p => p.value === val);
        if (!obj || obj.children.length > 0) return;
        this.api_mediaManagePlatform_cateChd({data:{parentCateCode:val,token:this.getUser.token}}).then(res=>{
            obj.children = res.content.map(item => {
                return { label: item.cateName, value: item.cateCode };
            })
        })
    },
    getMedias(val,obj){
        this.api_mediaManagePlatform_cateChd({data:{parentCateCode:val,token:this.getUser.token}}).then(res=>{
            if( res.content && res.content.length>0){
                obj.children = res.content.map(item => {
                    let temp = { label: item.cateName, value: item.cateCode }
                    if( this.selectVal.toString().indexOf(item.value) !=-1 ){
                        this.getMedias(item.value,temp)
                    }
                   return temp
                })
            }
        })
    },
      // 获取新增媒体分类列表
    init() {
        this.api_mediaManagePlatform_catePar({data:{token:this.getUser.token}}).then(res=>{
            if( this.selectVal && this.selectVal.length > 0 ){
                 //设置默认赋值
                this.list = res.content.map(item => {
                    let temp = { label: item.cateName, value: item.cateCode,children:[]}
                    if( this.selectVal.toString().indexOf(item.cateCode) !=-1){
                        
                        this.getMedias(item.cateCode,temp)
                    }
                    return temp
                })
                this.selected = this.selectVal;
            }else{
                this.list = res.content.map(item => {
                    return { label: item.cateName, value: item.cateCode, children: [] };
                })
            }
        })
    }
  },
  props:{
      selectVal:{
          type:Array
      }
  },
  mounted(){
      this.$nextTick( function(){
        this.init();
      })
  },
  watch:{
    selectVal(v){
        this.selected =[]
      if( v && v!="" ){
          this.selected = v
          this.init()
      }
    }
  }
}
</script>

