<template>
  <div>
    <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="form">
                <el-form-item>
                    <el-input  placeholder="媒体名/管理账户" :maxlength="20" v-model="form.media" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input  placeholder="BD专员姓名/账号" :maxlength="20" v-model="form.childBdStaff" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.contractStatus"  placeholder="请选择合约状态"  clearable >
                        <el-option :value="1" label="合约中" ></el-option>
                        <el-option :value="2" label="合约过期"></el-option>
                        <el-option :value="3" label="终止合约"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.cooperWay"  placeholder="请选择合作方式"  clearable >
                        <el-option :value="1" label="分成合作" ></el-option>
                        <el-option :value="2" label="租赁合作"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                  <EleMediaCategory v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                      :editable="false"
                        unlink-panels
                        v-model="time"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" @click="init" class='btn-search'>搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          @edit="edit"
          @contract="contract"
          @onClickBtnAdd="onClickBtnAdd"
          @onClickBtnEdit="onClickBtnEdit"
          @onClickBtnContract="onClickBtnContract"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
        <Contract :isShow="show_contract_dialog" :data="data" ></Contract>
        <Edit :isShow="show_edit_dialog" :data="data" @success="saveSuccess" ></Edit>
  </div>
</template>
<script>
import EleMediaCategory from '../../../../components/business/EleMediaCategory.vue'
import Contract from '../../../mediaManagePlatform/media_manage/media_list/Contract.vue'
import Edit from './Edit.vue'
import { mapGetters } from 'vuex'
export default {
  components:{EleMediaCategory,Contract,Edit},
  data(){
    let tool = this.tool
    return{
      datagrid:{
        List:[],
        FieldList: [
          { key: 'mediaName', label: '媒体名',width:210},
          { key: 'mediaNo', label: '媒体编号',width:100},
           { key: 'level', label: '等级',width:100,formatter:function(row){
            return row.level == 1 ? 'A级' : row.level==2? 'B级' : row.level==3? 'C级' :'-' 
          }},
          { key: 'mresNum', label: '广告位总数',width:100,formatter(row){
            return row.mresNum? row.mresNum  +'个' : '-'
          }},
          { key: 'mresNum', label: '广告位明细',width:200,type:'html',formatter(row){
            let str ='';
            row.mresDetailList.map((item,i) => {
              if(i==0){
                str +=  item.formName + ' :  ' +item.total +'个' 
              }else {
                str +=  '<br>'+item.formName + ' :  ' +item.total +'个'
              }
            })
            return str
          }},

          { key: 'userName', label: '管理账号',width:210,formatter:function(row,column,cellValue){ 
            if(!row.userName && !row.userNo){
              return "-";
            }else if(!row.userName && row.userNo){
              return row.userNo;
            }else if(row.userName && !row.userNo){
              return row.userName;
            }else if(row.userName && row.userNo){
              return row.userName + "/" + row.userNo;
            }
          }},
          { key: 'contactMan', label: '媒体联系人',width:180,formatter:function(row,column,cellValue){
            if(!row.contactMan && !row.contactTel){
              return "-";
            }else if(!row.contactMan && row.contactTel){
              return row.bdStaffNo;
            }else if(row.contactMan && !row.contactTel){
              return row.contactMan;
            }else if(row.contactMan && row.contactTel){
              return row.contactMan + "/" + row.contactTel;
            }
          }},
          { key: 'bdStaffName', label: 'BD专员',width:180,formatter:function(row,column,cellValue){
            if(!row.bdStaffName && !row.bdStaffNo){
              return "-";
            }else if(!row.bdStaffName && row.bdStaffNo){
              return row.bdStaffNo;
            }else if(row.bdStaffName && !row.bdStaffNo){
              return row.bdStaffName;
            }else if(row.bdStaffName && row.bdStaffNo){
              return row.bdStaffName + "/" + row.bdStaffNo;
            }
          }},
          { key: 'contractStatus', label: '合约状态',formatter:function(row,column,cellValue){
            if( row.contractStatus === 1 )
              return '合约中'
            else if( row.contractStatus === 2 )
              return '合约过期';
            else if( row.contractStatus === 3 )
              return '终止合约';
            else return '-';
          }},
          { key: 'cooperNo', label: '合同编号',width:200,tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.cooperNo,20)
          }},
          { key: 'tagAddr', label: '区域地址', width:300, tooltip:true,formatter:function(row,column,cellValue){
            return tool.str.textLength(row.tagAddr,20)
          }},
          { key: 'parCateName', label: '分类',width:200,formatter:function(row,column,cellValue){
            return row.parCateName + " > " + row.cateName;
          }},
          { key: 'cooperWay', label: '合作方式',formatter:function(row,column,cellValue){
            if( row.cooperWay === 1 ) 
              return "分成合作";
            else if(  row.cooperWay === 2 )
              return "租赁合作";  
            else
              return '-';
          }},
           { key: 'dateEnd', label: '有效日期', width:100,formatter:function(row,column,cellValue){
            return tool.date.format(row.dateEnd, "yyyy-MM-dd");
          }},
           { key: 'dateStart', label: '签约时间',width:100,formatter:function(row,column,cellValue){
            return tool.date.format(row.dateStart, "yyyy-MM-dd");
          }},
          { type: 'operate', label: '操作',width:140,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'合同信息',eventName:'contract'}
            ]
          },
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'合同信息',eventName:'onClickBtnContract'}
        ],
        Pagination:{
          total:0,
          page_size:10,
          current_page:1
        }
      },
      time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'),this.tool.date.format(new Date(),'yyyy-MM-dd hh:mm')],
      form:{
        bdStaffId: 0,
        media: "",
        childBdStaff: "",
        contractStatus: "",
        mediaCate: "",
        cooperWay: "",
        signDateEnd: '',
        signDateStart:''
      },
      show_contract_dialog:false,
      show_media_dialog:false,
      show_edit_dialog:false,
      data:null//选中的行对象
    }
  },
  computed:{
    ...mapGetters(['getUser'])
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
    onClickBtnContract(data){
      if( data.batch.datas.length !== 1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.contract( {data:data.batch.datas[0]} )
        }
    },
    edit(row){
      this.data = row.data
      this.show_edit_dialog = true
    },
    contract(row){
      this.data = row.data
      this.show_contract_dialog = true
    },
    media(row){
      this.data = row.data
      this.show_media_dialog = true
    },
    EleMediaCategory_CallBack(val){
      this.form.mediaCate = val
    },
    saveSuccess(){
      this.init()
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
        this.form.signDateStart = new Date(this.time[0]+' 00:00').getTime()
        this.form.signDateEnd = new Date(this.time[1]).getTime()

      }else{
        this.form.signDateStart=''
        this.form.signDateEnd=''
      }
      this.form.bdStaffId = this.getUser.bd.bdId
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_mediaManagePlatform_medias({data:this.form}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
        this.datagrid.Pagination.total = res.totalCount
      })  
    }
  },
  mounted(){
    this.init()
  }
}
</script>