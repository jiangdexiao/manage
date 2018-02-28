<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar private-date">
			<el-form :inline="true" :model="form" ref="ruleForm" :rules="rules" >
        <el-col :span="24">
          <el-form-item>
              <EleMediaCategory v-on:selected="categorySelected"></EleMediaCategory>
          </el-form-item> 
            <el-form-item>
              <el-select v-model="form.advStatus"  class="form-input" placeholder="选择投放状态" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
              </el-select>
          </el-form-item>
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
              <el-select v-model="form.exhibitType"  class="form-input" placeholder="请选择形式" clearable>
                  <el-option label="图片" value="1"></el-option>
                  <el-option label="视频" value="2"></el-option>
                  <el-option label="音频" value="3"></el-option>
                  <el-option label="实物" value="4"></el-option>
                  <el-option label="现场" value="5"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <EleAreaProvinceCity v-on:selected="provinceSelected"></EleAreaProvinceCity>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-input  placeholder="广告位名/ID/条码值" :maxlength="50" v-model="form.mresKeyWorks" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input  placeholder="媒体名" :maxlength="50" v-model="form.mediaName" class="form-input"></el-input>
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
            <el-button type="primary" size="medium" @click="search" class='btn-search' >查询</el-button>
          </el-form-item>
        </el-col>
			</el-form>
		</el-col>
		<!--列表-->
      <schedule ref="schedule" :pagination="{ispage:true}"  v-on:openEditDialogListener="openEditDialogListener"></schedule>
      <editDialog  :dialog="dialog" :good="good" v-on:search="search" ></editDialog>
	</section>
</template>

<script>
import schedule from "./Schedule.vue"
import editDialog from './Dialog.vue'
import {EleAreaProvinceCity,EleMediaCategory} from '../../../../components/business/'
import { mapGetters } from 'vuex'
export default {
  data() {
    let tool = this.tool
    return {
      token: sessionStorage.getItem('access_token'),
      form: {
        mediaCode: [], //行业
        advStatus: "", //投放状态
        mresCate: "", //广告位分类
        mediaType: "", //属性
        exhibitType: "", //形式
        tagRegion: [], //活动区域
        mresKeyWorks: "", //广告位名
        dealerKeyWork: "", //商家名
        mediaName: "", //媒体名
        goodsKeyWork: "", //商品名
        dateTime: tool.date.format(new Date(),'yyyy-MM') //时间
      },
      //搜索表单验证规则
      rules: {
        dateTime: [
          { type: "string", required: true, message: "请输入月份", trigger: "blur" }
        ]
      },
      bannerCategoryList: [], //广告位分类
      goods: [], //商品
      sellers: [], //商家
      loading: false,
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
    editDialog,
    schedule,
    EleAreaProvinceCity,
    EleMediaCategory
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    categorySelected(val){
        this.form.mediaCode = val;
    },
    provinceSelected(val){
        this.form.tagRegion = val;
    },
    openEditDialogListener(startTime,endTime,mresId,ids){
      if(ids[0]==null)return
      this.dialog = {dialogVisible:true,startTime,endTime,mresId,goodId:ids[0]}
      this.api_mediaManagePlatform_adScheduleDel({ data:{
         goodsId:this.dialog.goodId,
         endTime:this.dialog.endTime,
         mresIds:this.dialog.mresId,
         startTime:this.dialog.startTime
      } }).then(res=>{
        this.good = res.content
      })
    },
    getGoods(query) {
      if (query == "") return;
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'});return;
      }
      this.goods = [];
      this.loading = true;
      this.api_sellerManagePlatform_goodsInformation({ data:{goodsMessage:query,pageOrNot: 0} }).then(res=>{
        this.loading = false
        this.goods = res.content?res.content:[]
      }).catch(err=>{
        this.loading = false
      })
    },
    getSellers(query) {
      if (query == "") return;
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'});return;
      }
      this.sellers = [];
      this.loading = true;
      this.api_sellerManagePlatform_dealerInformation({ data:{dealerMessage: query, pageOrNot: 1} }).then(res=>{
        this.loading = false
        this.sellers = res.content?res.content:[]
      }).catch(err=>{
        this.loading = false
      })
    },
    search() {
      let that = this;
      that.$refs.ruleForm.validate(valid => {
        if( !valid )return;
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
        params.operateId = this.getUser.bd.bdId;
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
    //获取广告位分类
    getBannerCategoryList() {
      this.api_common_dicList({ data:{token:this.token,dicType:'mres_cate'} }).then(res=>{
        this.bannerCategoryList = res.content?res.content:[]
      })
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
    this.getBannerCategoryList();
    this.search();
  }
};
</script>

<style >

</style>