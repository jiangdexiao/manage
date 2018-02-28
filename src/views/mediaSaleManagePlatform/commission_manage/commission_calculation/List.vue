<template>
  <div class="list">
    <el-tabs v-model="activeTabName" @tab-click="tabClick">  
        <el-tab-pane label="业绩提成" name="first"></el-tab-pane>
        <el-tab-pane label="下载提成" name="second"></el-tab-pane>
        <el-tab-pane label="注册提成" name="third"></el-tab-pane>
    </el-tabs>

    <div v-if="activeTabName=='first'"> 
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input  placeholder="BD专员姓名/账号" :maxlength="20" v-model="form.keyWords" class="form-input"></el-input>
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

    <div v-if="activeTabName=='second'" class="mg_t40"> 
        <el-form ref="formShare" label-width="150px" >
          <el-form-item label="每下载一个" prop="shareMoney" >
              <p class="pbox">
                <span class="font1">{{formShare.shareMoney}}</span>元 <br>
                <span>同一台机器重复下载不计算， 不对上级分成</span>
              </p>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeTabName=='third'" class="mg_t40"> 
        <el-form ref="formShare"  label-width="150px" >
          <el-form-item label="每注册一个">
              <p class="pbox">
                <span class="font1">{{formShare.shareMoney}}</span>元 <br>
                <span>同一台机器重复注册不计算 ，不对上级分成</span>
              </p>
          </el-form-item>
        </el-form>
      </div>

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
          { key:'bdName', label:'BD专员',formatter:function(row,column,cellValue){
            if (!row.bdName && !row.account) {
              return "-";
            } else {
              let name = row.bdName ? row.bdName + "  /" : "  /";
              let account = row.account ? row.account : "-";
              return name + account;
            }
          }},
          { key:'selfRatio', label:'自推提成',formatter:function(row){
            return row.selfRatio +'%'
          }},
          { key:'subBdContributeMap', label:'下级组织',type:'html',formatter:function(y){
            if(!y.subBdContributeMap){
                return '-'
            }
            let obj = y.subBdContributeMap;
            let orgNameArr = [] ;
            for(let key in obj) {
              let arr= [], strArr=[];
              arr= obj[key];
              arr.map(item => {
                  strArr.push(item.orgName)
              })
              orgNameArr.push(strArr.join(' > '))
            }
            let strName= '';
            orgNameArr.map((items,i) => {
              if(i==0){
                  strName += items
              }else{
                  strName +=  `<br> `+ items
              }
            })
            return strName
          }},
          { key:'subBdContributeMap', label:'下级贡献提成',type:'html', formatter: function(y) {
            if(!y.subBdContributeMap){
                return '-'
            }
            let obj = y.subBdContributeMap;
            let ratioArr = [] ;
            for(let key in obj) {
              let arr= [], str='';
              arr= obj[key];
              arr.map((item,i) => {
                  if(i==0){
                      str += item.contributeRatio +'%'
                  }
              })
              ratioArr.push(str)
            }
            let strName= '';
            ratioArr.map((items,i) => {
              if(i==0){
                  strName += items
              }else{
                  strName +=  `<br> `+ items
              }
            })
            return strName
          }}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      // 定义搜索参数
      form: {
        operateBdId:'',
        keyWords:''
      },
      activeTabName:'first',
      formShare:{
        shareMoney:'',
      },
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    tabClick(){
      this.tool.dp.clearData(this.formShare)
      if(this.activeTabName=='first'){
        this.init()
      }else{
        let data_type = this.activeTabName=='second' ? 1 :2
        this.api_mediaManagePlatform_commInfo({data: {type:  data_type,roleType:2 }}).then(result => {
          this.formShare.shareMoney = result.content.shareMoney===null ? '0.00' :this.tool.str.twoDecimal(result.content.shareMoney,2)
        })
      }
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
      this.api_mediaSaleManagePlatform_ratio({data:{ 
        keyWords:this.form.keyWords,
        operateBdId: this.getUser.bd.bdId,
        rows:this.datagrid.Pagination.page_size,
        pageNumber:this.datagrid.Pagination.current_page }}).then(res=>{
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
    .pbox {
      margin: 0 15px;
    }
    .pbox span{
      line-height: 22px;
      display: inline-block;
    }
    .font1{
      color:red;
      font-weight: 600;
      font-size: 14px;
      margin-right: 10px;
    }
</style>