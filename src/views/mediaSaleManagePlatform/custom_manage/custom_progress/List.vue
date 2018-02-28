<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
                <el-input  placeholder="BD专员姓名/账号"  :maxlength="20" v-model="form.bdKeyWords"  class="form-input"></el-input>
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
              <el-button type="primary" size="medium" class='btn-search' @click="init" >搜索</el-button>
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
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'bdName', label:'BD专员姓名/账号',width:180,formatter:function(y){
            if (!y.bdName && !y.account) {
              return "-";
            } else {
              let name = y.bdName ? y.bdName + "  /" : "  /";
              let account = y.account ? y.account : "-";
              return name + account;
            }
          }},
          { key:'recordCount', label:'总备案数'},
          { key:'effectiveCount', label:'有效客户（有跟进）',width:180},
          { key:'successCount', label:'签约成功数',width:100},
          { key:'advCount', label:'广告位数量',width:100},
          { key:'noShelvesCount', label:'未上架广告位',width:120},
          { key:'invalidMediaCOunt', label:'失效媒体'},
          { key:'invalidAdvCount', label:'失效广告位',width:100},
          { key:'ratio', label:'备案成功率（成功/总备案）',width:200, formatter: function(y) {
              return y.ratio == 0 ? '-' : y.ratio + '%';  
          }},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form:{
        bdKeyWords:''
      },
      time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'), this.tool.date.format(new Date(),'yyyy-MM-dd')],
    }
    
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      if( this.time && this.time.length > 0){
          this.form.startTime = this.time[0];
          this.form.endTime = this.time[1];
      }else{
          this.form.startTime='';
          this.form.endTime='';
      }
      this.api_mediaManagePlatform_progress({data:{
        bdKeyWords:this.form.bdKeyWords,
        startTime:this.form.startTime,
        endTime:this.form.endTime,
        operateBdId:this.getUser.bd.bdId,
        rows:this.datagrid.Pagination.page_size,
        pageNumber:this.datagrid.Pagination.current_page
      }}).then(res=>{
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