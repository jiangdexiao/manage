<template>
  <div class="list">
    <!--工具条-->
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
       @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @view="view"
      @del="del"
      :DataGrid = 'datagrid'></list-data>

      <Edit :isShow="isShow" :data="data" @saveSuccess="SaveSuccess" ></Edit>
      <ranking :isShow="show_ranking_Dialog" :data="data"></ranking>
      <!-- 关闭 -->
      <el-dialog
        title="关闭"
        custom-class='dialog'
        :visible.sync="showClose_dialog"
        :close-on-click-modal= "false"
        @close="handleClose">
            <el-col :span="24" >
                <el-form :model="form_c" label-width="120px">
                    <el-form-item>
                        <p class="font_red">关闭该激励后将不可重新启动！！</p>
                    </el-form-item>
                    <el-form-item label="激励标题：">
                        <p>{{form_c.rewardTitle}}</p>
                    </el-form-item>
                    <el-form-item label="日期："> 
                        <p>{{tool.date.format(form_c.startTime,'yyyy-MM-dd hh:mm:ss')}}  至 {{tool.date.format(form_c.endTime,'yyyy-MM-dd hh:mm:ss')}}</p>
                    </el-form-item>
                    <el-form-item label="排行奖励：">
                        <p>{{form_c.havaRanking==1?'有':'无'}}</p>
                    </el-form-item>
                    <el-form-item label="预算：">
                        <p>{{form_c.budgetMoney}}</p>
                    </el-form-item>
                    <el-form-item label="已奖励：">
                        <p>{{form_c.useMoney}}</p>
                    </el-form-item>
                    <el-form-item label="有效角色：">
                        <p>{{form_c.roleType==1?'媒体':form_c.roleType==2?'BD专员':form_c.roleType==3?'促销员':'-'}}</p>
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeReward">确认关闭活动</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
      </el-dialog>  

  </div>
</template>
<script>
import Edit from './Edit.vue'
import ranking from './rankingList'
import {tool} from '../../../../utils/'
export default {
  components: {Edit,ranking},
  data(){
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key: 'rewardTitle', label: '标题',width:300,tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.rewardTitle,20)
          }},
          { key:'roleType', label:'有效角色', formatter: function(y,column,cellValue) {
              return y.roleType === 1 ? '媒体' : y.roleType === 2 ? 'BD' : y.roleType === 3 ?'促销员':'-'
          }},
          { key:'budgetMoney', label:'预算总额',width:150},
          { key:'useMoney', label:'已奖励金额',width:150},
          { key:'status', label:'状态', width:100,formatter: function(y,column,cellValue) {
              return y.status === 1 ? '进行中' : y.status === 2 ? '未开始' : y.status === 3 ? '已结束' :y.status ===4 ?'关闭':'-'
          }},
          { key:'startTime', label:'开始时间',width:150, formatter: function(row,column,cellValue) {
              return tool.date.format(row.startTime,'yyyy-MM-dd hh:mm:ss')
          }},
          { key:'endTime', label:'结束时间',width:150, formatter: function(row,column,cellValue) {
              return tool.date.format(row.endTime,'yyyy-MM-dd hh:mm:ss')
          }},
          { key:'havaRanking', label:'是否有排行奖励', formatter: function(y,column,cellValue) {
              return y.havaRanking === 1 ? '是' : y.havaRanking === 2 ? '否' : '-'
          }},
          { key:'haveFull', label:'是否有满额奖励', formatter: function(y,column,cellValue) {
              return y.haveFull === 1 ? '是' : y.haveFull === 2 ? '否' : '-'
          }},
          { key:'userName', label:'创建人'},
          { key:'createTime', label:'创建时间',width:180, formatter: function(row,column,cellValue) {
              return tool.date.format(row.createTime,'yyyy-MM-dd hh:mm:ss')
          }},
          { type:'operate', label: '操作', width:260,
            btns:[ 
              {text:'修改',eventName:'edit',condition: ( row )=>{
                  if(row.data.status===3 || row.data.status===4){
                      return false
                  }
                  return true
              }},
              {text:'查看排行榜',eventName:'view'},
              {text:'关闭',eventName:'del',condition: ( row )=>{
                  if(row.data.status===3 || row.data.status===4){
                      return false
                  }
                  return true
              }},
            ]
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'关闭',type:'danger',eventName:'onClickBtnDelete'},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        }
      },
      form_c:{
        rewardId:'',
        rewardTitle:'',
        startTime:'',
        endTime:'',
        havaRanking:'',
        budgetMoney:'',
        useMoney:'',
        roleType:'',
      },
      showClose_dialog:false,
      show_ranking_Dialog:false,
      isShow:false,
      data:null,
    }
  },
  methods: {
    SaveSuccess(){
      this.data = {}
      this.init()
    },
    //修改
    edit(opts,selectIems) {
      this.data = opts.data
      this.isShow = true
    },
    //查看排行榜
    view(opts) {
      this.data = opts.data
      this.show_ranking_Dialog = true
    },
    //关闭奖励活动
    closeReward(){  
        this.api_mediaManagePlatform_closeReward({data:{rewardId: this.form_c.rewardId}}).then(res=>{
            this.$message({type:'success',message:'该活动关闭成功'});
            this.init()
            this.showClose_dialog = false
        })
    },
    //关闭
    del(opts) {
      this.tool.dp.assignData(this.form_c, opts.data)
      this.showClose_dialog = true
    },
    //新增
    onClickBtnAdd (opts) {
      this.data = null
      this.isShow = true
    },
    //修改
    onClickBtnEdit(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else if(selectItems.ids.length >1){
        this.$message({type:'error',message:'只能选择一项'})
        return
      }else if(selectItems.datas[0].status===3 || selectItems.datas[0].status===4){
        this.$message({type:'error',message:'当前状态不可操作'})
        return
      }else{
        this.edit( {data:selectItems.datas[0]} )
      }
    },
    //关闭
    onClickBtnDelete(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else if(selectItems.ids.length >1){
          this.$message({type:'error',message:'只能选择一项'})
          return
        }else if(selectItems.datas[0].status===3 || selectItems.datas[0].status===4){
          this.$message({type:'error',message:'当前状态不可操作'})
          return
        }else{
          this.del( {data:selectItems.datas[0]} )
        }
    },
    handleClose(){
      this.showClose_dialog = false
       this.tool.dp.clearData(this.form_c)
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      let datas ={
        rows : this.datagrid.Pagination.page_size,
        pageNumber : this.datagrid.Pagination.current_page
      }
      this.api_mediaManagePlatform_rewardList({data:datas}).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }

  },
  mounted() {
    this.init()
  }
  
}
</script>
<style lang="scss" >
.font_red {
    color: red;
}

</style>
