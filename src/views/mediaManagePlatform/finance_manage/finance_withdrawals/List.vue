<template>
  <div>
     <!--工具条-->
      <el-col :span="24" class="toolbar">
          <el-form :inline="true" :model="form">
              <el-form-item>
                  <el-input  placeholder="促销员姓名/账号" :maxlength="20" v-model="form.saler" class="form-input"></el-input>
              </el-form-item>
               <el-form-item>
                  <el-input  placeholder="媒体名/账号" :maxlength="20" v-model="form.media" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="form.accountType"  placeholder="选择账户类型"  clearable >
                  <el-option value="1" label="促销员"></el-option>
                  <el-option value="3" label="媒体"></el-option>
                </el-select>
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
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
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
export default {
  data(){
      let tool = this.tool
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'applyDate', label: '申请日期',width:150},
            { key: 'cashDate', label: '提现日期',width:150},
            { key: 'orgName', label: '账户类型',formatter:function(row,column,cellValue){ 
               return row.accountType == 1 ? "促销员" : row.accountType == 3 ? "媒体":'';
            }},
            { key: 'incomeSettled', label: '对应名/账号',width:380,type:'html',tooltip:true,formatter:function(row,column,cellValue){
               if(!row.name && !row.accountNo){
                    return '-'
                }else{
                    let name = row.name? tool.str.textLength(row.name,20) +'  /': '  /';
                    let account= row.accountNo? row.accountNo : '-';
                    let str = name + account
                    return  `<font title="${row.name +' / ' + account}">${str}</font>`
                }
            }},
            { key: 'flowId', label: '流水号',width:350},
            { key: 'money', label: '金额(单位:元)',formatter:function(row,column,cellValue){
              return  tool.str.twoDecimal(row.money,2)
            }},
            { key: 'cashStatus', label: '状态'}
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox:false
        },
          form:{
              saler:'',
              media:'',
              accountType:'',
              dateStart:'',
              dateEnd:''
          },
          time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'), this.tool.date.format(new Date(),'yyyy-MM-dd')],
      }
  },
  methods:{
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
        if(this.time==null){
            this.form.dateStart = '';
            this.form.dateEnd = '';
        }else{
            this.form.dateStart = this.time[0];
            this.form.dateEnd = this.time[1];
        }
        this.api_mediaManagePlatform_cash({data:this.form}).then(res=>{
          this.datagrid.List = res.content?res.content:[]
          this.datagrid.Pagination.total = res.totalCount
        })
      }
  },
  mounted(){
      this.init();
  }
}
</script>
