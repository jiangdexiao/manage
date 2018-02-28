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
                  <el-button type="primary" size="medium" @click="init" class='btn-search'>搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          @edit="edit"
          @offline="offline" 
          @aprFn="aprFn"
          @onClickBtnAprBatch="onClickBtnAprBatch" 
          @onClickBtnOffline="onClickBtnOffline"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
        <Online :isShow="show_online_dialog" :data="data"  @success="init"></Online>
        <Edit :isShow="show_edit_dialog" :data="data"  @success="init"></Edit>
        <Apr :isShow="show_apr_dialog" :data="data"  @success="init"></Apr>
        <AprBatch :isShow="show_aprBatch_dialog" :data="data"  @success="init"></AprBatch>
  </div>
</template>
<script>
import { tool } from '../../../../utils/'
import Online from './Online.vue'
import Edit from './Edit.vue'
import Apr from './Apr.vue' 
import AprBatch from './AprBatch.vue'
import { mapGetters } from 'vuex'
export default {
  components:{ Online,Edit,Apr,AprBatch},
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
          // { key: 'sellerName', label: '投放商家',width:100,tooltip:true,formatter:function(row,column,cellValue){
          //   return tool.str.textLength(row.sellerName,20)
          // }},
          { key: 'useStatus', label: '广告位状态',width:100,formatter:function(row,column,cellValue){
            if (row.useStatus === 1) return "下线";
            else if (row.useStatus === 2) return "上线中";
            else return "-";
          }},
          { key: 'aprStatus', label: '审批状态',width:120,formatter:function(row,column,cellValue){
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
           { key: 'tagAddr', label: '广告位地址',width:300,tooltip:true,formatter:function( row ){
             return tool.str.textLength(row.tagAddr,20)
           }},
           { key: 'validDate', label: '有效日期',width:100,formatter(row){
              return tool.date.format(row.validDate, "yyyy-MM-dd");
           }},
           { key: 'regisDate', label: '新增日期',width:100,formatter(row){
              return tool.date.format(row.regisDate, "yyyy-MM-dd");
           }},
          { type: 'operate', label: '操作',width:160,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'上/下线',eventName:'offline'},
              {text:'审批',eventName:'aprFn',condition:( row )=>{
                if(this.getUser.bd.orgInfoList.length >3 ){
                  return false
                }
                return true
              }}
            ]
          },
        ],
        ToolBar:[
          {text:'上/下线',eventName:'onClickBtnOffline'},
          {text:'批量审批',eventName:'onClickBtnAprBatch',condition:( row )=>{
            if(this.getUser.bd.orgInfoList.length >3 ){
                return false
            }
            return true
          }}
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
      },
      //广告位分类列表
      dicList: [],
      //广告位形式列表
      formIdList: [],
      //商家列表
      sellers: [],
      loading:false,
      //商品列表
      goods:[],
      data:null,//传递的参数 type = Array
      show_edit_dialog:false,
      show_online_dialog:false,
      show_apr_dialog:false,
      show_aprBatch_dialog:false
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods:{
    //批量审批
    onClickBtnAprBatch(data){
      if(this.getUser.bd.orgInfoList.length >3 ){
        return
      }
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
    //上下线
    onClickBtnOffline(data){
      if( data.batch.datas.length !== 1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.offline( {data:data.batch.datas[0]} )
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
    aprFn(row) {
      if(this.getUser.bd.orgInfoList.length >3 ){
        return
      }
      if(row.data.aprStatus!= 11 && row.data.aprStatus!= 21){
          this.$message({type:'error',message:'您选择的数据,当前状态不可以审批'});
          return
      }
      this.data = new Array(row.data)
      this.show_apr_dialog = true
    },
    getDicList() {
      let that = this;
      this.api_common_dicList({data:{token:sessionStorage.getItem('access_token'),dicType:'mres_cate'}}).then(res=>{
        this.dicList = res.content?res.content:[]
      })
      this.api_mediaManagePlatform_formList().then(res=>{
        this.formIdList = res.content;
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
      this.api_mediaManagePlatform_mres({
        data:{
          mres:this.form.mres,
          cate:this.form.cate,
          aprStatus:this.form.aprStatus,
          advStatus:this.form.advStatus,
          mediaName:this.form.mediaName,
          mediaId:0,
          formId:this.form.formId,
          bdStaffId:this.getUser.bd.bdId,
          useStatus:this.form.useStatus=='' ? 0 : this.form.useStatus,
          rows:this.datagrid.Pagination.page_size,
          pageNumber:this.datagrid.Pagination.current_page
        }
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