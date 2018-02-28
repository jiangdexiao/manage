<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar private-date" >
			<el-form :inline="true" :model="form" ref="ruleForm" :rules="rules" >
          <el-form-item>
            <el-input  placeholder="促销员姓名/账号" :maxlength="50" v-model="form.salesman" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input  placeholder="媒体名/账号" :maxlength="50" v-model="form.media" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input  placeholder="广告位名/条码值" :maxlength="50" v-model="form.mres" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
              <el-select v-model="form.mresCate" class="form-input" placeholder="选择广告位位置" clearable>
                  <el-option v-for="(cell,i) in bannerCategoryList" :label="cell.dicName" :value="cell.dicCode" :key='i'></el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="dateTime">
            <el-date-picker :editable="false" v-model="form.monthInt" type="month" placeholder="选择月" value-format="yyyy-MM" class="form-input" ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="search(searchOpt)" class='btn-search' >查询</el-button>
          </el-form-item>
          <el-form-item v-if="searchNum">
            <el-button type="primary" size="medium" @click="search('mres')">按广告位查看</el-button>
          </el-form-item>
          <el-form-item v-if="!searchNum">
            <el-button type="primary" size="medium" @click="search('sman')">按促销员查看</el-button>
          </el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
      <schedule ref="schedule" :pagination="{ispage:true}"  v-on:openEditDialogListener="openEditDialogListener"></schedule>
      <editDialog  :dialog="dialog" :saleMan="saleMan" v-on:search="search" ref="editDialog" ></editDialog>
		</el-col>
	</section>
</template>

<script>
import {tool} from '../../../../utils/'
import schedule from './scheduleInfo';
import editDialog from './scheduleInfo_dialog';
export default {
  data() {
    return {
      token: sessionStorage.getItem('access_token'),
      url: '',
      form: {
        mediaId:'0',
        monthInt: tool.date.format(new Date(),'yyyy-MM'), //时间  
        salesman:'',
        media:'',
        mres:'',
        mresCate:''
      },
      searchNum: true,
      searchOpt: 'sman',
      //搜索表单验证规则
      rules: {
        monthInt: [
          { type: "string", required: true, message: "请输入月份", trigger: "blur" }
        ]
      },
      dialog:{
        dialogVisible:false,
        startTime:'',
        endTime:'',
        startHour:'',
        endHour:'',
        salesmanId:'',
        mediaId:'',
        rowDataObj: {}
      },
      saleMan:[],
      bannerCategoryList: [], //广告位分类
    };
  },
  components: {
    editDialog,
    schedule
  },
  methods: {
    openEditDialogListener(...arg){
      let that = this;
      //开始和结束日期
      let sday = arg[0];  
      that.dialog = {
        startTime: sday,
        endTime: sday,
        rowDataObj: arg[1]
      }
      that.saleMan = arg[2].length ? arg[2] : [];
      that.$refs.editDialog.dataInitFn(that.dialog,that.saleMan);
    },
    search(open) {
      let that = this;
      that.$refs.ruleForm.validate(valid => {
        if( !valid )return;
        that.searchOpt = open;
        if(open=='sman'){
          that.url =  'scheduleSalesman' ; 
          that.searchNum = true;
        }else if(open=='mres'){  
          that.url =  'scheduleMres' ;
          that.searchNum = false;
        }else{
          that.url =   'scheduleSalesman' ;
        }
        that.$refs.schedule.initData(that.form,that.url,open,1);
      });
    },
    //获取广告位分类
    getBannerCategoryList() {
      this.api_mediaManagePlatform_mresCateList({data:{token: this.token,dicType: "mres_cate"}}).then(res=>{
        this.bannerCategoryList = res.content
      })
    },
  },
  mounted() {
    this.$nextTick( function(){
          this.getBannerCategoryList();
          this.search('mres');
    })
    
  }
};
</script>