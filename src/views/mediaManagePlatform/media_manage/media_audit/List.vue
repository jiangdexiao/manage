<template>
  <div class="list">
      <el-tabs v-model="activeTabName" @tab-click="tabClick">   
        <el-tab-pane label="拍照数量" name="first"></el-tab-pane>
        <el-tab-pane label="稽查任务" name="second"></el-tab-pane>
      </el-tabs>
    <div v-if="activeTabName==='first'">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
              <el-select v-model="form.taskNo" class="form-input" placeholder="选择稽查任务" clearable>
                  <el-option v-for="(cell,i) in taskList" :label="cell" :value="cell" :key='i'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="媒体名称/账号" :maxlength="50" v-model="form.media" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="BD专员姓名/账号" :maxlength="20" v-model="form.bdStaff" ></el-input>
            </el-form-item> 
            <el-form-item>
                <el-input placeholder="促销员名/账号" :maxlength="20" v-model="form.salesman" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.exeStatus"  class="form-input" placeholder="选择完成状态" clearable>
                  <el-option label="完成" value="1"></el-option>
                  <el-option label="未完成" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.role"  class="form-input" placeholder="选择拍照角色" clearable>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="促销员" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="任务创建时间"
                    end-placeholder="任务创建时间"
                    :default-value="defaultValue">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
            </el-form-item>   
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @hisImg="hisImg"
      @autidImg="autidImg"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @onClickBtnDownload="onClickBtnDownload"
      :DataGrid = 'datagrid'></list-data>
    </div>
    <div v-if="activeTabName==='second'" class="mg_t40"> 
        <el-form ref="formPeriod" :model="formPeriod"  :rules="formRules" label-width="150px" >
          <el-form-item>
             <b>任务设置</b>
          </el-form-item>
          <el-form-item label="时间周期" prop="period" >
              <el-input :maxlength="3" v-model="formPeriod.period" ></el-input>天
          </el-form-item>
          <el-form-item>
              <span class="c_red">*将以保存时间开始点后每{{formPeriod.period}}天自动生成一次拍照任务</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button type="primary"  @click="savePeriod" >保 存</el-button>
        </div>
    </div>
    <manageImgDialog :isImgShow="isImgShow" :data="data"></manageImgDialog>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
import manageImgDialog from "./manageImgDialog";
export default {
  components: {manageImgDialog},
  data(){
    const rule_numOnly = function(rule,value,callback){
        if(rule.msg && !value && value!='0'){
            let msgs = rule.msg +'不能为空'
            callback(new Error(msgs))
        }else if( value && value!='0' && !tool.validate.numOnly(value) ){
          callback(new Error('请输入整数'))
        }else if(value && value>999){
          callback(new Error('时间周期为 0-999 之间的整数'))
        }else{
            callback()
        }
    }
    return {
      token: sessionStorage.getItem('access_token'),
      defaultValue: tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),
      time: [],
      datagrid: {
        List: [],
        FieldList: [
          { key:'taskNo', label:'任务',width:150},
          { key: 'name', label: '角色名/账号',width:240,formatter:function(row,column,cellValue){
            if(!row.name && !row.accNo){
                return '-'
            }else{
                var name = row.name? row.name +'  /': '  /';
                var account= row.accNo? row.accNo : '-';
                return name + account
            }
          }},
          { key:'role', label:'角色', formatter:function(y,column,cellValue){
            return y.role == 1 ? '促销员' :  y.role==3 ? '媒体' :'' 
          }},
          { key:'exeStatus', label:'状态', formatter:function(y,column,cellValue){
            return y.exeStatus == 1 ? '完成' : y.exeStatus==2? '未完成' :'' 
          }},
          { key:'passRate', label:'合格率',width:100,formatter:function(y,column,cellValue){
            return y.passRate ? tool.str.twoDecimal(y.passRate*100,2) +'%' :'-'
          }},
          { key: 'bdStaffName', label: '负责BD',width:240,formatter:function(row,column,cellValue){
            if(!row.bdStaffName && !row.bdStaffNo){
                return '-'
            }else{
                var name = row.bdStaffName? row.bdStaffName +'  /': '  /';
                var account= row.bdStaffNo? row.bdStaffNo : '-';
                return name + account
            }
          }},
          { key:'photoTime', label:'最后拍照时间',width:150,formatter:function(y,column,cellValue){
            return y.photoTime? y.photoTime :'-'
          }},
          { type: 'operate', label: '操作',width:220,
            btns:[
              {text:'历史拍照',eventName:'hisImg'},
              {text:'审核照片',eventName:'autidImg'}
            ]
          },
        ],
        ToolBar:[
          {text:'导出xls',eventName:'onClickBtnDownload'}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form:{
        taskNo:'',
        media:'',
        bdStaff:'',
        salesman:'',
        exeStatus:'',
        role:''
      },
      formPeriod:{
        period:''
      },
      formRules:{
        period:[
            { required: true,validator: rule_numOnly, msg: '时间周期', trigger: 'change' }
        ],
      },
      taskList: [], 
      activeTabName:'first', 
      //弹窗
      data:null,
      isImgShow:false
    }
  },
  methods: {
    hisImg(row){
      this.data= row.data
      this.data.option ='hisImg'
      this.isImgShow = true
    },
    autidImg(row){
      this.data= row.data
      this.data.option ='autidImg'
      this.isImgShow = true
    },
    savePeriod() {
      this.$refs.formPeriod.validate((valid) => {
          if (valid) {
            this.api_mediaManagePlatform_auditPara({type:'post', data: this.formPeriod}).then(result => {
                this.$message({type:'success',message:'设置成功'})
                this.tabClick()
            })
          }
      })
    },
    tabClick() {
        if(this.activeTabName==='first'){
            this.init()
        }else{
          this.api_mediaManagePlatform_getAuditPara().then(result => {
              this.formPeriod.period= result.content===''? 0 :result.content
          })
        }
    },
    onClickBtnDownload() {
      if( this.time && this.time.length > 0){
          this.form.dateStart = this.time[0];
          this.form.dateEnd = this.time[1];
      }else{
          this.form.dateStart='';
          this.form.dateEnd='';
      }
      const loading = this.$loading({
        lock: true,
        text: '正在提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.api_mediaManagePlatform_auditsDownLoad({
          data:this.form, type:'get', 
          headers:{ ContentType: 'application/x-www-form-urlencoded'}, 
          opts:{responseType: 'blob', downloadOption:'download'}
        }).then(res=>{
          let blob = res, 
              dateTime = this.tool.date.format(new Date(),'yyyyMMdd'),
              down_url = window.URL.createObjectURL(blob),
              a = document.createElement('a');
          a.download = '广告位稽查数据'+dateTime + '.xls' ;
          a.href = down_url;
          $("body").append(a);    
          a.click();
          $(a).remove();
          loading.close();
        }).catch(err=>{
            loading.close();
            this.$message({type:'error',message:'下载失败'});
        })
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
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      if( this.time && this.time.length > 0){
          this.form.dateStart = this.time[0];
          this.form.dateEnd = this.time[1];
      }else{
          this.form.dateStart='';
          this.form.dateEnd='';
      }
      this.api_mediaManagePlatform_auditsList({data:this.form}).then(res=>{
        this.datagrid.List = res.content=='' ? []  :res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    //获取下拉列表数据：
    getSelList() { 
      this.api_mediaManagePlatform_auditParaList().then(res=>{
        this.taskList = res.content;
      })
    }
  },
  mounted() {
    this.init()
    this.getSelList()
  }
  
}
</script>
<style lang="scss" scoped>
  .mg_l150 {
    margin-left: 150px;
  }
  .mg_t40{
    margin-top: 40px;
  }
  .mg_r20 {
    margin-right: 20px;
  }
  .c_red {
      color:red;
  }
</style>