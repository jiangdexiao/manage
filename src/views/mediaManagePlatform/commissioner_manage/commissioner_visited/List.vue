<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
                <el-input  placeholder="BD专员姓名/账号"  :maxlength="20" v-model="form.bdKeyWords"  class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <EleOrgProvinceCity v-on:selected="EleProvinceCity_CallBack" ></EleOrgProvinceCity>
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
              <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import { EleOrgProvinceCity } from '../../../../components/business/'
import { tool } from '../../../../utils/'
  export default {
    components:{EleOrgProvinceCity},
    data () {
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'bdName', label: 'BD专员姓名/账号',width:200,formatter:function(row,column,cellValue){
            if (!row.bdName && !row.account) {
              return "-";
            } else {
              let name = row.bdName ? row.bdName + "  /" : "  /";
              let account = row.account ? row.account : "-";
              return name + account;
            }
          }},
            { key: 'orgName', label: '所属组织',formatter:function(row,column,cellValue){ 
              let addr = ''
              row.orgInfoList.map((item, i) => {
                  if (i < row.orgInfoList.length - 1) {
                      addr += item.orgName + '>'
                  } else {
                      addr += item.orgName
                  }
              })
              return addr
            }},
            { key: 'recordCount', label: '客户数量'},
            { key: 'followCount', label: '跟进次数'}
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox:false
        },
        form:{
          bdKeyWords:'',
          orgId:''
        },
        time:[tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'), tool.date.format(new Date(),'yyyy-MM-dd')],
      }
    },
    methods: {
      EleProvinceCity_CallBack(param){
        this.form.orgId = param
      },
      onClickSearch(){
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
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNumber = this.datagrid.Pagination.current_page
        if( this.time && this.time.length > 0){
            this.form.startTime = this.time[0];
            this.form.endTime = this.time[1];
        }else{
            this.form.startTime='';
            this.form.endTime='';
        }
        this.api_mediaManagePlatform_customerCallCountList({data:this.form}).then(res=>{
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      }
    },
    mounted () {
      this.init()
    }
  }
  
</script>
