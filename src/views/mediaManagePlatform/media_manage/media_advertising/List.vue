<template>
  <div>
    <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="form">
                <el-form-item>
                    <el-input  placeholder="广告位名/ID/条码" :maxlength="50" v-model="form.mres" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input  placeholder="媒体名" :maxlength="50" v-model="form.mediaName" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.useStatus"  placeholder="选择广告位状态"  clearable >
                        <el-option value="2" label="上线中" ></el-option>
                        <el-option value="1" label="下线"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.cate"  placeholder="选择广告位位置"  clearable >
                        <el-option  v-for="(cell,i) in dicList" :value="cell.dicCode" :key='i' :label="cell.dicName" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="form.formId"  class="form-input" placeholder="广告位形式" clearable>
                      <el-option v-for="(cell,i) in formIdList" :label="cell.formName" :value="cell.formId" :key='i'></el-option>
                  </el-select>
                </el-form-item>  
                <el-form-item>
                    <el-select v-model="form.advStatus"  placeholder="选择投放状态"  clearable >
                        <el-option :value="1" label="上架中" ></el-option>
                        <el-option :value="2" label="下架"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.aprStatus"  placeholder="选择审批状态"  clearable >
                        <el-option value="11" label="下线-待审批" ></el-option>
                        <el-option value="12" label="下线-审批通过"></el-option>
                        <el-option value="13" label="下线-审批不通过"></el-option>
                        <el-option value="21" label="上线-待审批" ></el-option>
                        <el-option value="22" label="上线-审批通过"></el-option>
                        <el-option value="23" label="上线-审批不通过"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.goodsId" filterable remote placeholder="商品名/商品ID"  clearable :remote-method="getGoods" :loading="loading" >
                      <el-option v-for="(item,i) in goods" :key="i" :label="item.goodsName + '/' + item.goodsId" :value="item.goodsId">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.sellerId" filterable remote placeholder="商家名/商家ID"  clearable :remote-method="getSellers" :loading="loading">
                      <el-option v-for="(item,i) in sellers" :key="i" :label="item.dealerName + '/' + item.dealerId" :value="item.dealerId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker :editable="false" unlink-panels v-model="time" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" @click="init" class='btn-search'>搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          @edit="edit"
          @offline="offline"
          @aprFn="aprFn"
          @onClickBtnAdd="onClickBtnAdd"
          @onClickBtnEdit="onClickBtnEdit"
          @onClickBtnOffline="onClickBtnOffline"
          @onClickBtnApr="onClickBtnApr"
          @onClickBtnAprBatch="onClickBtnAprBatch"
          @onClickBtnAdv="onClickBtnAdv"
          @onClickBtnSet="onClickBtnSet"
          @onClickBtnQrcode="onClickBtnQrcode"
          @onClickBtnBarcode="onClickBtnBarcode"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
        <BarCode :isShow="show_barcode_dialog" :data="data" :type="codeType"></BarCode>
        <Adv :isShow="show_adv_dialog" :data="data"  @success="init"></Adv>
        <Apr :isShow="show_apr_dialog" :data="data"  @success="init"></Apr>
        <AprBatch :isShow="show_aprBatch_dialog" :data="data"  @success="init"></AprBatch>
        <Online :isShow="show_online_dialog" :data="data"  @success="init"></Online>
        <Edit :isShow="show_edit_dialog" :data="data"  @success="init"></Edit>
  </div>
</template>
<script>
import { tool } from '../../../../utils/'
import BarCode from './BarCode.vue'
import Adv from './Adv.vue'
import Apr from './Apr.vue' 
import AprBatch from './AprBatch.vue'
import Online from './Online.vue'
import Edit from './Edit.vue'
export default {
  components:{ BarCode,Adv,Apr,AprBatch,Online,Edit},
  data(){
    return{
      datagrid:{
        List:[],
        FieldList: [
          { key: 'mresId', label: '广告位ID',width:350},
          { key: 'mresNo', label: '条码值',width:130},
          { key: 'mresName', label: '广告位名',width:210,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.mresName,20)
          }},
          { key: 'mediaName', label: '所属媒体',width:180,tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.mediaName,20)
          }},
          { key: 'advGoodsName', label: '展示内容',width:100,tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.advGoodsName,20)
          }},
          { key: 'sellerName', label: '投放商家',width:100,tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.sellerName,20)
          }},
          { key: 'useStatus', label: '广告位状态',width:100, formatter:function(row,column,cellValue){
            if (row.useStatus === 1) return "下线";
            else if (row.useStatus === 2) return "上线中";
            else return "-";
          }},
          { key: 'aprStatus', label: '审批状态',width:150,formatter:function(row,column,cellValue){
            let txt = tool.str.getAprStatusName(row.aprStatus)
            return txt
          },style:function(row){
            let style = ''
            switch (row.aprStatus) {
              case "11":
              case "21":
                style = `color:red;`;
                break;
            }
            return style;
          }},
          { key: 'advStatus', label: '投放状态',width:100,formatter:function(row,column,cellValue){
            if (row.advStatus === 1) return "上架中";
            else if (row.advStatus === 2) return "下架";
            else return '-';
          }},
           { key: 'formName', label: '广告位形式', width:100},
           { key: 'cateName', label: '广告位位置', width:100},
           { key: 'tagAddr', label: '广告位地址',width:300},
           { key: 'orgName', label: 'BD组织',width:300,formatter(row){
             let arr=[];
              row.bdOrgList.map((item,i) => {
                arr.push(item.orgName)
              })
              return arr.join(' > ')
           }},
           { key: 'bdStaffName', label: 'BD专员',width:200,formatter(row){
              if (!row.bdStaffName && !row.bdStaffNo) {
                return "-";
              } else {
                var name = row.bdStaffName ? row.bdStaffName + "  /" : "  /";
                var account = row.bdStaffNo ? row.bdStaffNo : "-";
                return name + account;
              }
           }},
           { key: 'validDate', label: '有效日期',width:100,formatter(row){
              return tool.date.format(row.validDate, "yyyy-MM-dd");
           }},
           { key: 'regisDate', label: '新增日期',width:100,formatter(row){
              return tool.date.format(row.regisDate, "yyyy-MM-dd");
           }},
          { type: 'operate', label: '操作',width:200,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'上/下线',eventName:'offline'},
              {text:'审批',eventName:'aprFn'}
            ]
          },
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'上/下线',eventName:'onClickBtnOffline'},
          // {text:'审批',eventName:'onClickBtnApr'},
          {text:'批量审批',eventName:'onClickBtnAprBatch'},
          {text:'上/下架',eventName:'onClickBtnAdv'},
          {text:'批量投放',eventName:'onClickBtnSet'},
          {text:'下载二维码',eventName:'onClickBtnQrcode'},
          {text:'下载条码',eventName:'onClickBtnBarcode'}
        ],
        Pagination:{
          total:0,
          page_size:10,
          current_page:1
        }
      },
      // 搜索参数
      form: {
        formId:'',
        mediaId: 0,
        bdStaffId: 0,
        mres: "",
        mediaName: "",
        cate: "",
        useStatus: '',
        aprStatus: "",
        advStatus:'',
        goodsId: "",
        sellerId: "",
        regisDateStart: tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),
        regisDateEnd: tool.date.format(new Date(),'yyyy-MM-dd')
      },
      time:[tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),tool.date.format(new Date(),'yyyy-MM-dd')],
      //广告位分类列表
      dicList: [],
      //商家列表
      sellers: [],
      loading:false,
      //广告位形式列表
      formIdList: [], 
      //商品列表
      goods:[],
      data:null,//传递的参数 type = Array
      show_edit_dialog:false,
      show_online_dialog:false,
      show_apr_dialog:false,
      show_aprBatch_dialog:false,
      show_adv_dialog:false,
      show_barcode_dialog:false,
      codeType:1
    }
  },
  methods:{
    onClickBtnAdd(){
      this.data = null
      this.show_edit_dialog = true
    },
    onClickBtnEdit(data){
      if( data.batch.datas.length !== 1 ){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.edit({ data:data.batch.datas[0] } )
      }
    },
    //上下线
    onClickBtnOffline(data){
      if( data.batch.datas.length !== 1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.offline( {data:data.batch.datas[0]} )
        }
    },
    //审核
    onClickBtnApr(data){
      if( data.batch.datas.length !== 1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          if( data.batch.datas[0].aprStatus != 11 && data.batch.datas[0].aprStatus != 21 ){
            this.$message({type:'error',message:'当前状态不可以审批'});
            return
          }
          this.data = data.batch.datas
          this.show_apr_dialog = true
        }
    },
    //批量审批
    onClickBtnAprBatch(data){
      if( !data.batch.datas.length){
          this.$message({type:'error',message:'请至少选择一项'})
          return
        }else{
          let mresIds =[];
          data.batch.datas.map((item, i) => {
            if(item.aprStatus== 11 || item.aprStatus== 21){
              mresIds.push(item.mresId)
            }
          })
          if(!mresIds.length){
            this.$message({type:'error',message:'您选择的数据,当前状态不可以审批'});
            return
          }
          this.data = mresIds 
          this.show_aprBatch_dialog = true
        }
    },
    //上下架
    onClickBtnAdv(data){
      if( data.batch.datas.length !== 1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.data = data.batch.datas
          this.show_adv_dialog = true
        }
    },
    //投放
    onClickBtnSet(data){
      this.$router.push({path:'/mu/delivery'})
    },
    //下载二维码
    onClickBtnQrcode(data){
      if( data.batch.datas.length === 0){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.codeType = 1
          this.data = data.batch.datas
          this.show_barcode_dialog = true
        }
    },
    //下载条形码
    onClickBtnBarcode(data){
      if( data.batch.datas.length === 0){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.codeType = 2
          this.data = data.batch.datas
          this.show_barcode_dialog = true
        }
    },
    edit(row){
      this.data = new Array(row.data)
      this.show_edit_dialog = true
    },
    offline(row){
      this.data = new Array(row.data)
      this.show_online_dialog = true
    },
    aprFn(row){
      if(row.data.aprStatus!= 11 && row.data.aprStatus!= 21){
          this.$message({type:'error',message:'您选择的数据,当前状态不可以审批'});
          return
      }
      this.data = new Array(row.data)
      this.show_apr_dialog = true
    },
    //获取广告位形式 和 位置 
    getDicList() {  
      let that = this;
      this.api_common_dicList({data:{token:sessionStorage.getItem('access_token'),dicType:'mres_cate'}}).then(res=>{
        this.dicList = res.content?res.content:[]
      })
      this.api_mediaManagePlatform_formList().then(res=>{
        this.formIdList = res.content;
      })
    },
    getSellers(query){
      if (query == "") return
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'})
        return
      }
      this.loading = true
      this.api_sellerManagePlatform_dealerInformation({ data: {dealerMessage: query, pageOrNot: 1}}).then(res=>{
        this.loading = false
        this.sellers = res.content?res.content:[]
      }).catch(err=>{
        this.loading = false
      })
    },
    getGoods(query){
      if (query == "") return
      if( query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'})
        return
      }
      this.loading = true
      this.api_sellerManagePlatform_goodsInformation({ data: {goodsMessage: query, pageOrNot: 0}}).then(res=>{
        this.loading = false
        this.goods = res.content?res.content:[]
      }).catch(err=>{
        this.loading = false
      })
    },
    // {type,data,dataIndex,list,btn,btnIndex}
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      if( this.time && this.time.length > 0){
        this.form.regisDateStart = this.time[0]
        this.form.regisDateEnd = this.time[1]

      }else{
        this.form.regisDateStart=''
        this.form.regisDateEnd=''
      }
      this.api_mediaManagePlatform_mres({
        data:Object.assign({}, this.form,{
                useStatus: this.form.useStatus=='' ? 0 :this.form.useStatus,
                rows: this.datagrid.Pagination.page_size, 
                pageNumber: this.datagrid.Pagination.current_page 
              })
        }).then(res=>{
          this.datagrid.List = res.content?res.content:[]
          this.datagrid.Pagination.total = res.totalCount
      })  
    }
  },
  mounted(){
    this.getDicList()
    this.init()
  }
}
</script>