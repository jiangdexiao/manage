<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" title="批量投放" @close="close" :visible.sync="show_devBatch_dialog" :close-on-click-modal= "false" >
            <el-form label-width="20px">
                <el-form-item>
                    <p>{{tool.date.format(obj.dateTime,'yyyy年MM月')}}  搜索结果集</p>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="objType" @change="typeChange">
                        <el-radio :label="1">整月投放</el-radio>
                        <el-radio :label="2">按天投放</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="calendar_box" v-if="objType==2">
                    <div class="c_box">
                        <el-checkbox :indeterminate="calendar.isIndeterminate" v-model="calendar.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <span class="mg_r70 fr">{{tool.date.format(obj.dateTime,'yyyy年MM月')}}</span>
                        <ul class="week_ul">
                            <li v-for="(week,i) in weekArr" :key="i">{{week}}</li>
                        </ul>
                        <el-checkbox-group v-model="calendar.checkedDate" @change="handleCheckedDateChange">
                            <el-checkbox-button v-if="day!=0" v-for="day in calendar.dateArr" :label="day" :key="day">
                                {{day}}
                            </el-checkbox-button>
                            <label class="el-checkbox-button" v-else>
                                <span class="el-checkbox-button__inner"></span>
                            </label>
                        </el-checkbox-group>
                    </div>
                </div>

                <el-form-item>  
                    <p>共 <span class="font_r">{{obj.advNum}}</span> 个广告位</p>
                    <p>共 {{obj.totalDay}} 个投放位天， {{obj.notDeliveryNum}} 位天未投放， {{obj.deliveryNum}} 位天已投放</p>
                </el-form-item>
                <el-checkbox-group  v-model="deliveryType" class="mg_l20" @change="deliveryTypeChange">
                    <el-checkbox label='1' >投放 {{obj.notDeliveryNum}}个未投放位天（涉及 {{obj.notDeliveryAdvNum}} 个广告位）</el-checkbox><br>
                        <el-form-item ><p class="color_1">*对未投放数据操作</p></el-form-item>
                    <el-checkbox label='2' >覆盖 {{obj.deliveryNum}} 个已投放位天（涉及 {{obj.deliveryAdvNum}} 个广告位）</el-checkbox>
                        <el-form-item ><p class="color_1">*覆盖已有的投放数据</p></el-form-item>
                </el-checkbox-group>
                <el-form-item>
                    <p>实际操作 <span class="font_r"> {{showOptNum}} </span> 个广告位</p> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary"  @click="nextStep">下一步</el-button>
            </span>
        </el-dialog>
        <!-- 批量投放 -->
        <el-dialog custom-class="dialog" title="批量投放" @close="handleClose" :visible.sync="show_devBatch_good_dialog" :close-on-click-modal= "false" >
            <el-form label-width="120px">
                <el-form-item>
                    <p>{{tool.date.format(obj.dateTime,'yyyy年MM月')}} &nbsp;&nbsp; {{showOptNum}}个广告位  &nbsp;&nbsp; {{showDelyNum}} 位天</p>
                </el-form-item>
                <el-form-item label="商品">
                    <span>{{ good.goodsName }}</span>
                    <el-button type="text" @click="selectGoods">请选择商品</el-button>
                </el-form-item>
                <el-form-item label="商家">
                    <span>{{good.dealerName}}</span>
                </el-form-item>
                <el-form-item label="商家ID">
                    <span>{{good.advDealerId}}</span>
                </el-form-item>
                <el-form-item label="识别图">
                    <img v-show="good.imageUrl && good.imageUrl!=''" class="avatar mg_b15" :src="good.imageUrl">
                    <ele-upload v-show="good.imageUrl=='' && good.advGoodsId" ref="imgUpload" :img="{imageUrl:good.imageUrl,imgGroup:2,minSize:300,maxSize:700,filter:function(){
                        if( !good.advGoodsId ){
                            $message('请先选择商品');
                            return false;
                        }
                        return true;
                    }}"  v-on:uploadSuccess="uploadSuccess"></ele-upload>
                    <a class="a_textSty" v-if="good.advGoodsId && good.advGoodsId!=''"  @click="showManageImg">管理识别图</a>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="back">上一步</el-button>
                <el-button @click="handleClose('allClose')">取 消</el-button>
                <el-button type="primary"  @click="save" >确 定</el-button>
            </span>
        </el-dialog>
        <selectGoods :isShow="show_goodsList_Dialog" v-on:goodsSelected="goodsSelected" ></selectGoods>
        <manageGoodsImgDialog ref="manageGoodsImg" :imageDialog="imageDialog" v-on:imgSelected="imgSelected" v-on:delSuccess="delSuccess"></manageGoodsImgDialog>
        <loadingComponent :showLoading="imageDialog.isShowLoading"></loadingComponent>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import selectGoods from './selectGoods.vue'
import manageGoodsImgDialog from "./manageGoodsImg";
import loadingComponent from './loading';
export default {
  components: {selectGoods,manageGoodsImgDialog,loadingComponent },
  data(){
      return {
          show_devBatch_dialog:false,
          show_devBatch_good_dialog: false,
          show_goodsList_Dialog:false,
          obj:{
            dateTime:'',
            advNum:'',
            totalDay:'',
            notDeliveryNum:'',
            deliveryNum:'',
            notDeliveryAdvNum:'',
            deliveryAdvNum:'',
            type:'',
          },
          objType:1,
          dayTime:'',
          deliveryType:['1'],
          showOptNum:'',
          showDelyNum:'',
          good:{
              advGoodsId:'',
              goodsName:'', 
              dealerName:'',
              advDealerId:'',
              imageUrl:'',
          },
          imageDialog: {
            dialogVisible: false,
            isShowLoading:false,
            goodsIds:'',
            recognizedUrl:''
          },
          //日历
          weekArr: ['日','一','二','三','四','五','六'],
          calendar: {
              week:'',
              checkAll: false,
              checkedDate: [],
              dateArr: [],
              isIndeterminate: true,
          },
          isclearInterval:'',
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    typeChange(){
        if(this.objType==1) {
            this.calendar.checkAll= false;
            this.calendar.checkedDate= [];
            this.calendar.isIndeterminate= true;
            this.init()
        }else{
            this.obj.totalDay=0
            this.obj.notDeliveryNum=0
            this.obj.deliveryNum=0
            this.obj.notDeliveryAdvNum=0
            this.obj.deliveryAdvNum=0
            this.obj.type=0
            this.calendar.checkAll= true;
            this.handleCheckAllChange(true)
           // this.deliveryType = []
        }
    },
    dateDpFn(){
        let dayTime = []
        this.calendar.checkedDate.map((item,i) => {
            if(item==0){ return}
            let items= item.toString().length==1 ? '0'+item :item;
            dayTime.push(this.data.dateTime + '-' +items)
        })
        this.dayTime = dayTime.join(',');
    },
    //日历
    handleCheckAllChange(val) {
        this.calendar.checkedDate = val ? this.calendar.dateArr : [];
        this.calendar.isIndeterminate = false;
        this.dateDpFn()
        this.init()
    },
    handleCheckedDateChange(value) {
        let checkedCount = value.length;
        this.calendar.checkAll = checkedCount === this.calendar.dateArr.length;
        this.calendar.isIndeterminate = checkedCount > 0 && checkedCount < this.calendar.dateArr.length;
        this.dateDpFn()
        let timer =setInterval(()=> {
                if(this.isclearInterval == this.dayTime) return
                this.isclearInterval= this.dayTime
                clearInterval(timer);
                console.log('00')
                this.init()
            },2000)
    },
    //生成日历
    calendarFn() {
        let ymArr = this.data.dateTime.split('-'),
            lastdate = new Date(ymArr[0],ymArr[1],0).getDate(),
            dateArr = Array.from(Array(lastdate), (v,k) =>k+1),
            str = ymArr.join(', ')+', 01';
        this.calendar.week = new Date(str).getDay(); 
        for(let i=0; i<Array(this.calendar.week).length; i++ ){
            dateArr.unshift(0)
        }
        this.calendar.dateArr = dateArr;
    },
    uploadSuccess(res,opt) {
      let that = this, pdata='';
      if (!that.good.advGoodsId) {
        that.$message({type:'error',message:"请先选择商品"});
        return;
      }
      that.imageDialog.isShowLoading = true;
      pdata = {
        recognizedId: res.content.im_name,
        recognizedUrl: res.content.url
      };
      if (res && res.content) {
          this.api_sellerManagePlatform_adminGoodsRecognizeds({ type:'post',data:pdata,pathParams:`/${that.good.advGoodsId}` }).then(resdata=>{
            that.imageDialog.isShowLoading = false;
            that.$message({type:'success',message:'商品识别图添加成功'});
            that.good.imageUrl = res.content.url
            that.imageDialog.recognizedUrl= res.content.url
            that.$refs.imgUpload.clear();
          })
      } else {
        this.$refs.imgUpload.clear();
        this.$message({message:res.errorMessage,type:'error'});
        that.imageDialog.isShowLoading = false;
      }
    },
       //管理识别图删除
    delSuccess(delImgUrl) {
        if(delImgUrl == this.good.imageUrl ){
            this.good.imageUrl =''
            this.imageDialog.recognizedUrl =''
        }
    },
      //选择的识别图
    imgSelected(value){
      this.good.imageUrl = value;
      this.imageDialog.recognizedUrl = value;
      this.imageDialog.dialogVisible = false;
    },
    //管理识别图
    showManageImg(){
      let that = this;
      //查询参数
      that.imageDialog.goodsIds = that.good.advGoodsId;
      that.imageDialog.recognizedUrl = that.good.imageUrl;
      that.$refs.manageGoodsImg.init();
    },
      //选择商品
    goodsSelected(data) {
        this.$refs.imgUpload.clear();
        this.good.advGoodsId =  data.goodsId;
        this.good.goodsName =  data.goodsName;
        this.good.dealerName =  data.dealerName;
        this.good.advDealerId =  data.dealerId;
        this.good.imageUrl =  data.goodsRecognized.length ?  data.goodsRecognized[0].recognizedUrl : '';
        this.imageDialog.recognizedUrl = this.good.imageUrl;
    },
    selectGoods(){
        this.show_goodsList_Dialog =true
    },
    //批量投放
    save(){
        if(!this.good.advGoodsId){
            this.$message({ message: "请选择商品", type: "error" });
            return 
        }
        if(!this.good.imageUrl){
            this.$message({ message: "请选择识别图", type: "error" });
            return
        }
        this.imageDialog.isShowLoading = true
      this.good.deliveryType = this.deliveryType.length ? this.deliveryType.join(',') :''
      this.api_mediaManagePlatform_batchDelivery({data: Object.assign({}, this.data, this.good, {type: this.objType, dayTime: this.dayTime}), type:'post'}).then(res=>{
         this.$message({type:'success',message:'投放成功'});
         this.$emit('success',true)
         this.show_devBatch_dialog = false
         this.show_devBatch_good_dialog = false
         this.handleClose()
         this.clear()
         this.imageDialog.isShowLoading = false
      }).catch(() => {
          this.imageDialog.isShowLoading = false
      });
    },
    back(){
        this.show_devBatch_dialog = true
        this.show_devBatch_good_dialog = false
    },
    nextStep(){
        if(!this.deliveryType.length){
            this.$message({ message: "请选择投放数据", type: "error" });
            return
        }
        if(this.objType==2 && !this.calendar.checkedDate.length){
            this.$message({ message: "请选择投放时间", type: "error" });
            return
        }
        this.show_devBatch_good_dialog = true
    },
    deliveryTypeChange(val){
        this.showOptNum = this.deliveryType.length==2 ? this.obj.advNum: !this.deliveryType.length ? '0' :''
        this.showDelyNum = this.deliveryType.length==2 ?this.obj.advNum:''
        if(this.deliveryType.length==1 && this.deliveryType[0]=='1'){
            this.showOptNum = this.obj.notDeliveryAdvNum
            this.showDelyNum = this.obj.notDeliveryNum
        }else if(this.deliveryType.length==1){
            this.showOptNum = this.obj.deliveryAdvNum
            this.showDelyNum = this.obj.deliveryNum
        }
    },
    close() {
        this.show_devBatch_dialog = false
        this.$parent.show_devBatch_dialog = false
    },
    handleClose(opt){
        this.show_devBatch_good_dialog = false
        if(opt=='allClose'){
            this.show_devBatch_dialog = false
            this.clear()
        }
    },
    clear(){
        this.deliveryType=['1']
        this.objType = 1
        this.dayTime = ''
        this.showOptNum=''
        this.showDelyNum=''
        this.calendar= {
              week:'',
              checkAll: false,
              checkedDate: [],
              dateArr: [],
              isIndeterminate: true,
          }   
        this.tool.dp.clearData(this.good)
        this.tool.dp.clearData(this.obj)
    },
    init() {
        let dayTime = this.objType==1 ? '' : this.dayTime
        this.api_mediaManagePlatform_findBatchDeliveryInfo({
            type:'post',
            data: Object.assign({}, this.data, {type: dayTime==''? 1: this.objType, dayTime: dayTime }),
        }).then(res=>{
            this.tool.dp.assignData(this.obj, res.content)
            this.obj.dateTime = res.content.dateTime ? res.content.dateTime : this.data.dateTime
            this.deliveryTypeChange()
        })
    }
  },
  mounted(){},
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Object
      }
  },
  watch:{
      isShow(v){
          this.show_devBatch_dialog = v
          if( v === true){
            this.clear()
            this.init()
            this.calendarFn()
          }
      }
  }
}
</script>

<style lang="scss">
.mg_l150 {
    margin-left:150px;
}
.mg_l5 {
    margin-left:5px;
}
.mg_l20 {
    margin-left:20px;
}
.mg_b15 {
    margin-bottom: 15px;
}
.mg_r70{
    margin-right:70px;
}
.a_textSty{
    margin-left: 0px;
    width: 180px;
    text-align: center;
    display: block;
    margin-top: -15px;
}
.font_r {
    color:red;
    font-weight: 600;
}
.fr{
    float: right;
}
.color_1 {
    color:#f63;
}
.calendar_box{
    width: 600px;
    margin: 0 auto 15px;
    .c_box{
        display:inline-block;
    }
    .week_ul {
        display: inline-block;
        margin: 15px 0 0;
    }
    .week_ul li{
        float: left;
        width: 85px;
        color:red;
        font-weight: 600;
    }
    .el-checkbox-button__inner{
        border: 0px !important;
        padding: 0;
        font-size: 14px;
        border-radius: 0;
        width: 85px;
        line-height: 32px;
        text-align: left;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner{
        color: #67c23a;
        font-weight: 600;
        border: 0;
        background: url('../../../../../static/images/check.png') no-repeat;
        background-position: 21px 6px;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
     

}
</style>