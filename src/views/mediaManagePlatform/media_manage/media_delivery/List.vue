<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar private-date  deliveryWrap">
			<el-form :inline="true" :model="form" ref="ruleForm" :rules="rules" >
        <el-col :span="24">
          <el-form-item>
              <el-input  placeholder="媒体名/编号" :maxlength="50" v-model="form.mediaName" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
              <EleMediaCategory v-on:selected="categorySelected"></EleMediaCategory>
          </el-form-item> 
          <el-form-item>
            <el-select v-model="form.level"  class="form-input" placeholder="媒体等级" clearable>
                <el-option label="A级" value="1"></el-option>
                <el-option label="B级" value="2"></el-option>
                <el-option label="C级" value="3"></el-option>
                <el-option label="D级" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="el-input el-input--suffix el-input__inner l_h34"
              @click="handleStatusClick">
              选择投放状态   
              <i class="el-input__icon fr l_h34" :class="icon_className" slot="suffix"  @click="handleStatusClick"></i>
            </div>
            <div class="boxsty" v-if="showSel" @click="isshowSelBox"></div>
            <div class="el-select-dropdown el-popper selBoxSty" v-if="showSel">
                <el-date-picker :editable="false" size="small" unlink-panels 
                  v-model="time" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <el-checkbox-group 
                  v-model="advStatus">
                  <el-checkbox v-for="(status,i) in selStatusArr" :label="status.val" :key="i">{{status.name}}</el-checkbox>
                </el-checkbox-group>
                <!-- <el-button size="medium" class="fr mg_t-10" @click="handleStatusClick">确  定</el-button> -->
            </div>
          </el-form-item> 
          <!-- <el-form-item>
              <el-select v-model="form.advStatus"  class="form-input" placeholder="选择投放状态" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item>
              <el-select v-model="form.mresCate" class="form-input" placeholder="选择广告位位置" clearable>
                  <el-option v-for="(cell,i) in bannerCategoryList" :label="cell.dicName" :value="cell.dicCode" :key='i'></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-select v-model="form.mediaType" class="form-input" placeholder="请选择属性" clearable>
                  <el-option label="视觉" value="1"></el-option>
                  <el-option label="听觉" value="2"></el-option>
                  <el-option label="视听" value="3"></el-option>
                  <el-option label="实物类" value="4"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.advSize"  class="form-input" placeholder="广告位尺寸" clearable>
                <el-option v-for="(cell,i) in advSizeList" :label="cell.sizeInfo" :value="cell.sizeInfo" :key='i'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.formId"  class="form-input" placeholder="广告位形式" clearable>
                <el-option v-for="(cell,i) in formIdList" :label="cell.formName" :value="cell.formId" :key='i'></el-option>
            </el-select>
          </el-form-item>  
          <el-form-item>
              <el-select v-model="form.exhibitType"  class="form-input" placeholder="请选择形式" clearable>
                  <el-option label="图片" value="1"></el-option>
                  <el-option label="视频" value="2"></el-option>
                  <el-option label="音频" value="3"></el-option>
                  <el-option label="实物" value="4"></el-option>
                  <el-option label="现场" value="5"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <EleAreaProvinceCityAreas v-on:selected="provinceSelected"></EleAreaProvinceCityAreas>
          </el-form-item>
          <el-form-item>
            <el-input  placeholder="广告位名/ID/条码值" :maxlength="50" v-model="form.mresKeyWorks" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.goodsKeyWork" filterable remote placeholder="商品名/商品ID"  clearable :remote-method="getGoods" :loading="loading" >
              <el-option v-for="(item,i) in goods" :key="i" :label="item.goodsName + '/' + item.goodsId" :value="item.goodsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.dealerKeyWork" filterable remote placeholder="商家名/商家ID"  clearable :remote-method="getSellers" :loading="loading">
              <el-option v-for="(item,i) in sellers" :key="i" :label="item.dealerName + '/' + item.dealerId" :value="item.dealerId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dateTime">
            <el-date-picker :editable="false" :picker-options="formPickerOptions" v-model="form.dateTime" type="month" placeholder="选择月" value-format="yyyy-MM" class="form-input" ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="search('loadingshow')" class='btn-search' >查询</el-button>
            <el-button type="primary" size="medium" @click="batch_delivery">批量投放</el-button>
          </el-form-item>
        </el-col>
			</el-form>
		</el-col>
		<!--列表-->
      <schedule ref="schedule" :pagination="{ispage:true}"  v-on:openEditDialogListener="openEditDialogListener"></schedule>
      <editDialog  :dialog="dialog" :good="good" v-on:search="search" ></editDialog>
      <DevBatch :isShow="show_devBatch_dialog" :data="data"  @success="search"></DevBatch>
      <loadingComponent :showLoading="isShowLoading"></loadingComponent>
	</section>
</template>

<script>
import { EleAreaProvinceCityAreas, EleMediaCategory} from '../../../../components/business/'
import schedule from "./Schedule.vue"
import editDialog from './Edit.vue'
import DevBatch from './devBatch.vue'
import loadingComponent from './loading'
import { tool } from '../../../../utils/'
export default {
  data() {
    return {
      token: sessionStorage.getItem('access_token'),
      form: {
        mediaCode: '', //行业
        advStatus: "", //投放状态
        mresCate: "", //广告位分类
        mediaType: "", //属性
        exhibitType: "", //形式
        tagRegion: '', //活动区域
        mresKeyWorks: "", //广告位名
        dealerKeyWork: "", //商家名
        mediaName: "", //媒体名
        goodsKeyWork: "", //商品名
        dateTime: tool.date.format(new Date(),'yyyy-MM'), //时间

       level:'',
       advSize:'',
       formId:'',
      },
      advSizeList:[],
      //广告位形式列表
      formIdList: [],
      time:[tool.date.format(new Date(),'yyyy-MM-dd'), tool.date.format(new Date(),'yyyy-MM-dd')],
      icon_className:'el-icon-arrow-down' ,
      selStatusArr:[{name:'每天有投放',val:1},{name:'每天未投放',val:2},{name:'部分投放',val:3}],
      advStatus:[1,2,3],
      showSel:false,
      show_devBatch_dialog:false,
      data:null,

      //搜索表单验证规则
      rules: {
        dateTime: [
          { type: "string", required: true, message: "请输入月份", trigger: "blur" }
        ]
      },
      mediaList: [], //
      regions: [], //区域
      bannerCategoryList: [], //广告位分类
      goods: [], //商品
      sellers: [], //商家
      loading: false,
      isShowLoading:false,
      dialog:{
        dialogVisible:false,
        starTime:'',
        endTime:'',
        mresId:'',
        goodId:''
      },
      good:{},
      formPickerOptions:{
        disabledDate(time) {
          let nowDate = new Date();
          nowDate.setMonth(nowDate.getMonth()-6);
          let prevDate = nowDate.getTime();
          nowDate.setMonth(nowDate.getMonth()+24+6);
          let nextDate = nowDate.getTime();
          let piker = time.getTime();
          return piker < prevDate || piker > nextDate;
        }
      }
    };
  },
  components: {
    EleAreaProvinceCityAreas,
    EleMediaCategory,
    editDialog,
    schedule,
    DevBatch,
    loadingComponent,
  },
  methods: {
    isshowSelBox(){
      if(this.advStatus.length && (!this.time || !this.time.length)){
        this.$message({ message: "请选择投放状态的日期", type: "error" });
        return 
      }else{
        this.showSel = false
        this.icon_className = this.showSel ? 'el-icon-arrow-up' :'el-icon-arrow-down'
      }
    },
    handleStatusClick(ev) {
      this.showSel = !this.showSel
      this.icon_className = this.showSel ? 'el-icon-arrow-up' :'el-icon-arrow-down'
      ev.stopPropagation()
    },
    batch_delivery(){ 
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if( !valid )return;
        that.data = that.form
        that.data.advStartTime = that.time ? that.time[0] : ''
        that.data.advEndTime = that.time ? that.time[1] :''
        that.data.advStatus = that.advStatus.length ? that.advStatus.sort().join(',') :''
        that.show_devBatch_dialog = true
      })
    },

    provinceSelected(val){
        this.form.tagRegion = val;
    },
    categorySelected(val){
        this.form.mediaCode = val;
    },
    openEditDialogListener(startTime,endTime,mresId,ids){
      let that = this;
      that.dialog = {dialogVisible:true,startTime,endTime,mresId,goodId:ids[0]};
      this.api_mediaManagePlatform_adScheduleDel({ data:{goodsId:that.dialog.goodId,endTime:that.dialog.endTime,mresIds:that.dialog.mresId,startTime:that.dialog.startTime} })
      .then(data=>{
        that.good = data.content; 
        if(that.good.goodsId && !that.good.imageUrl){
          this.api_mediaManagePlatform_recognizeds({ data:{ goodsIds:that.good.goodsId} }).then(data=>{
             that.good.imageUrl = data.content[0].goodsRecognized.length ? data.content[0].goodsRecognized[0].recognizedUrl : '';
          })
        }
      })
      // console.log("父组件接收到子组件的数据："+"startTime:"+startTime+"endTime:"+endTime+ " mresid:"+ mresId+" ids:"+ ids)
      // console.log("dialog"+JSON.stringify(this.dialog))
    },
    getGoods(query) {
      if (query == "") return;
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'});return;
      }
      let that = this;
      that.goods = [];
      that.loading = true;
      this.api_sellerManagePlatform_goodsInformation({ data:{goodsMessage: query, pageOrNot: 0} }).then(res=>{
        that.loading = false;
        that.goods = res.content;
      }).catch(err=>{
        that.loading = false
      })
    },
    getSellers(query) {
      if (query == "") return;
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'});return;
      }
      let that = this;
      that.sellers = [];
      that.loading = true;
      this.api_sellerManagePlatform_dealerInformation({ data:{dealerMessage: query, pageOrNot: 1} }).then(res=>{
        that.loading = false;
        that.sellers = res.content;
      }).catch(err=>{
        that.loading = false
      })
    },
    search(opt) {
      let that = this;
      if(opt=='loadingshow'){
        that.isShowLoading=true
      }
      that.$refs.ruleForm.validate(valid => {
        if( !valid ){
          that.isShowLoading=false
          return
        };
        let params = {};  
        params.mediaCode = that.form.mediaCode ? that.form.mediaCode : "";
        params.tagRegion = that.form.tagRegion ? that.form.tagRegion : "";
        params.advStatus = that.form.advStatus;
        params.mresCate = that.form.mresCate;
        params.mediaType = that.form.mediaType;
        params.exhibitType = that.form.exhibitType;
        params.mresKeyWorks = that.form.mresKeyWorks;
        params.dealerKeyWork = that.form.dealerKeyWork;
        params.goodsKeyWork = that.form.goodsKeyWork;
        params.mediaName = that.form.mediaName;
        params.dateTime = that.form.dateTime;
        params.level = that.form.level;
        params.advSize= that.form.advSize;
        params.formId = that.form.formId;
        params.advStartTime = this.time ? this.time[0] :''
        params.advEndTime = this.time ? this.time[1] :''
        params.advStatus = this.advStatus.length ? this.advStatus.sort().join(',') :''
        that.isShowLoading=false
        that.$refs.schedule.initData(params);
      });
    },
    parseData(data){
      let that = this, hasColumns = false;
      for(let [rowIndex,rowItem] of data.content.entries()){
        if( rowItem.jsonMap && rowItem.jsonMap.length>0){
          let row = {};
          for(let [columnIndex,columnItem] of rowItem.jsonMap.entries()){
            if(columnIndex === 0){
              row['col'+columnIndex] = rowItem.cateName;
              if( !hasColumns )that.columns.push({id: "col"+columnIndex , name:'' });
            }
            row['col'+ (++columnIndex) ] = columnItem.goodsName;
            if( !hasColumns )that.columns.push({id: "col"+ (++columnIndex),name: columnItem.day});
          }
          that.rows.push(row);
          hasColumns = true
          row = null;
        }
      }
    },
    getRegions() {
      // let that = this;
      // that.$.ajax({
      //   url: that.BASE_URL + "m2c.support/regn/provs",
      //   data: { token: that.token },
      //   success: function(result) {
      //     if (result.status != 200) return;
      //     that.regions = result.content.map(item => {
      //       return { label: item.name, value: item.code, children: [] };
      //     });
      //   }
      // });
    },
    regionHandleItemChange(val) {
      // let that = this;
      // let obj = that.regions.find(p => p.value === val.toString());
      // if (!obj || obj.children.length > 0) return;
      // that.$.ajax({
      //   url: that.BASE_URL + "m2c.support/regn/cits",
      //   data: { token: that.token, province: val.toString() },
      //   success: function(result) {
      //     if (result.status != 200) return;
      //     obj.children = result.content.map(item => {
      //       return { label: item.name, value: item.code };
      //     });
      //   }
      // });
    },
    //获取广告位分类  、 广告位形式、广告位尺寸
    getBannerCategoryList() {
      this.api_common_dicList({ data:{token: this.token, dicType: "mres_cate"} }).then(res=>{
        this.bannerCategoryList = res.content;
      })
      this.api_mediaManagePlatform_formList().then(res=>{
        this.formIdList = res.content;
      })  
      this.api_mediaManagePlatform_advSizeList().then(res=>{
        this.advSizeList = res.content;
      })
    },
    // 获取新增媒体分类列表
    getMediaList() {
      // let that = this;
      // that.$.ajax({
      //   url: that.BASE_URL + "m2c.media/cate/par",
      //   data: { token: that.token },
      //   success: function(result) {
      //     if (result.status != 200) return;
      //     that.mediaList = result.content.map(item => {
      //       return { label: item.cateName, value: item.cateCode, children: [] };
      //     });
      //   }
      // });
    },
    BannerHandleItemChange(val) {
      // let that = this;
      // let obj = that.mediaList.find(p => p.value === val.toString());
      // if (!obj || obj.children.length > 0) return;
      // that.$.ajax({
      //   url: that.BASE_URL + "m2c.media/cate/chd",
      //   data: { token: that.token, parentCateCode: val.toString() },
      //   success: function(result) {
      //     if (result.status != 200) return;
      //     obj.children = result.content.map(item => {
      //       return { label: item.cateName, value: item.cateCode };
      //     });
      //   }
      // });
    },
    /*****
     * 分页操作
     */
    handleSizeChange(){
      //修改每页条数
    },
    handleCurrentChange() {
      //切换当前页码
    }
  },
  mounted() {
    // this.getMediaList();
    this.getBannerCategoryList();
    // this.getRegions();
    this.search();
  }
};
</script>

<style lang="scss">
.deliveryWrap{
  .fl{
    float:left;
  }
  .fr{
    float:right;
  }
  .l_h34{
    line-height:34px;
  }
  .boxsty{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: inline-block;
    z-index: 2000;
  }
  .selBoxSty {
    z-index: 2001;
    max-width: 270px;
    display: inline-table;
    padding: 20px 20px 10px 20px;
    .el-date-editor--daterange.el-input__inner {
      width:210px !important;
    }
    .el-date-editor .el-range__icon{
        width: 20px !important;
        padding-left: 3px;
    }
    .el-range__close-icon{    width: 16px !important;}
    .el-range-editor.el-input__inner {
        padding: 3px;
    }
    .el-date-editor .el-range-input {
        float: left;
        width: 70px;
        margin-top: 4px;
    }
    .el-date-editor .el-range-separator{
        float: left;
        line-height:28px;
    }
    .el-checkbox{
      margin-right:15px;
    }
    .el-checkbox+.el-checkbox {
        margin-left: 0px;
    }
    .mg_t-10{
      margin-top:-10px;
    }
  }
}
</style>