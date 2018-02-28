<template>
  <div class=" list survey_contaner">
   <div class="survey_c_top ">
      <el-row :gutter="20" >
        <el-col  :xs="6" :sm='6' >
          <div class="survey_c_tbox  ">
            <div class="tit">
              <span>待结算金额统计（元）</span>
              <div class="icon bg-ico_explain02">
                <div class="tips">
                  <p>顾客付款后，待系统结算的金额</p>
                </div>
              </div>
            </div>
            <div class="tit02 ">
              <span style="font-size: 30px">{{(content.totalSettleAmount)}}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="{span: 6, offset: 14}" :sm='6' >
          <div class="survey_c_tbox  fl mr20">
            <div class="tit">
              <span>可用金额统计（元）</span>
              <div class="icon bg-ico_explain02">
                <div class="tips" style="width:240px;">
                  <p>已结算的金额；结算完成，待结算金额进入可用金额，可用金额可提现</p>
                </div>
              </div>
            </div>
            <div class="tit02">
              <span style="font-size: 30px">{{content.totalTradableAmount == '' ? 0 : (content.totalTradableAmount)}}</span>
              <span class="tit_span fr">
                <div>
                  <span class="fl">商家</span>
                  <span class="fr">{{content.dealerTradableAmount == null ?'-':(content.dealerTradableAmount)}}</span>
                </div>
                <div style='margin-top:20px;s'>
                  <span class="fl">平台</span>
                  <span class="fr">{{content.platformTradableAmount== null ?'-':(content.platformTradableAmount)}}</span>
                </div>
              </span>
            </div>
          </div>
      </el-col>
    </el-row>
   </div>
   <div class="survey_c_sort">
   	<div class="search ">
      <el-input v-model.trim="dealerName" placeholder="商家名称" :maxlength="100" title="商家名称"></el-input><el-button type="primary" size="medium" @click="amountList()" class="btn-search">搜索</el-button>
   	</div>
   </div>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="handleCurrentChange"
      @onChangePageSize="handleSizeChange"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
export default {
  data () {
    return {
      datagrid:{ // 列表绑定数据
      List: [],
      Checkbox:false,
      FieldList: [
        { key: 'dealerName', label: '商家名称'},
        { key: 'settleAmount', label: '待结算金额/元'},
        { key: 'tradableAmount', label: '可用金额/元'}
      ],
      Pagination: {
        current_page: 1,
        page_size:10,
        total: 0
      },
    },
    goodsCheckStorePageRows: 10,
    currentPage: 1,
    content: '',
    dealerName: '',
    //isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
    }
  },
  methods: {
    amount () {
      let that = this
      let parameter ={
        token:tool.cookie.getCookie('access_token'),
      }
      that.api_sellerManagePlatform_amount({data:parameter}).then(res=>{
      if(res==undefined){
        return false
      }else if(res.status == '200'){
          that.content = res.content
        }
    })
    },
    handleSizeChange (val) {
      let that = this
      that.goodsCheckStorePageRows = val
      that.amountList()
    },
    handleCurrentChange (val) {
      let that = this
      that.currentPage = val
      //that.isChangePage = true
      that.amountList()
    },
    amountList () {
      let that = this
      // if(!that.isChangePage){
      //   that.currentPage = 1
      // }
      let parameter ={
        token:tool.cookie.getCookie('access_token'),
        pageNumber:that.currentPage,
        rows:that.goodsCheckStorePageRows,
        dealerName:that.dealerName
      }
      that.api_sellerManagePlatform_amountList({data:parameter}).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.datagrid.List = res.content 
          that.datagrid.Pagination.total = res.totalCount
          }
    })
     // that.isChangePage = false
    }
  },
  mounted(){
    let that = this;
    that.amount();
    that.amountList();
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../../../static/css/main.sellerManage.css";
div.icon{
  width:16px;
  height:16px;
  display:inline-block; 
  position:relative;
  div.tips{
    width:100px;height:auto;background:#fff;
    border:1px solid #E5E5E5;border-radius: 4px;
    box-shadow: 0 1px 0 0 #E5E5E5;
    display:none;
    position: absolute;
    top:18px;left:0px; 
    text-indent: 0;padding:6px;font-weight:normal;
    p{line-height:24px;font-size:12px; color:#666;}
  }
}
div.icon:hover div.tips{display:block;}
.survey_contaner{
	.survey_c_top{
    display: inline-block;
		min-height: 120px;
		width: 100%;
		padding-bottom: 20px;
		border-bottom: 1px solid #D2D4E2;
		.survey_c_tbox{
			width: 380px;
			height: auto;
			background: #EDF0F7;
			padding: 20px;
			margin-top: 20px;
			.tit{
				font-size: 14px;
				color: #333333;
				margin-right:5px;
			}
			.tit02{
				font-size: 20px;
				color: #333333;
				width: 100%;
				display: inline-block;
			}
			.tit_span{
				width: 50%;
				height: 40px;
				display: inline-block;
				border-left: 1px solid #D2D4E2;
				padding-left: 20px;
    		padding-right: 20px;
    		font-size: 14px;
				color: #666666;
			}
		}
	}
	.survey_c_sort{
    width: 100%;
    height: 60px;
    padding-top: 10px;
    margin-bottom:10px;
    .search{
      position: relative;
      width:302px;
      height:42px;
      .inp{
        width:100%;
        height: 100%;
        background: #FFFFFF;
				border: 1px solid #E6E8F2;
      }
      i{
        width: 50px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        border: 1px solid #ccc;
        background: #F4F5FA;
        position: absolute;
        right: 0;
        top: 0;
      }
      }
	}
  .survey_c_cen{
    min-height: 40px;
    padding-bottom: 20px;
    .notetable{
      min-height: 40px;
      // border: 1px solid #e5e5e5;
      thead{
        background: #DFE9F6;
        tr{
          height: 40px;
          line-height: 40px;
          td{
            padding-left:40px;
          }
        }
      }
    }
  }
}
</style>
