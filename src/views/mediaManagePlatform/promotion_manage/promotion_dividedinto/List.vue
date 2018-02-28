<template>
  <div class="list">
    <el-tabs v-model="activeTabName" @tab-click="tabClick">  
        <el-tab-pane label="业绩分成" name="first"></el-tab-pane>
        <el-tab-pane label="下载分成" name="second"></el-tab-pane>
        <el-tab-pane label="注册分成" name="third"></el-tab-pane>
      </el-tabs>

      <div v-show="activeTabName=='first'"> 
      <list-data
        ref='list-data'
        @onChangeCurrentPage="onChangeCurPage"
        @onChangePageSize="onChangeCurPageSize"
        @onClickBtnAdd="onClickBtnAdd"
        @onClickBtnEdit="onClickBtnEdit"
        @onClickBtnDelete="onClickBtnDelete"
        @edit="edit"
        @del="del"
        :DataGrid = 'datagrid'></list-data>
        <Edit :isShow="isShow" :data="data" :goodsSortList="goodsSortList" :cateList="cateList" @saveSuccess="SaveSuccess" ></Edit>
      </div>

      <div v-if="activeTabName=='second'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每下载一个" prop="shareMoney" >
              <el-input :maxlength="7" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              同一台机器重复下载不计算
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
      <div v-if="activeTabName=='third'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每注册一个" prop="shareMoney" >
              <el-input :maxlength="7" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              <p>同一台机器重复注册不计算</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
  </div>
</template>
<script>
import Edit from './Edit.vue'
import { mapGetters } from 'vuex'
export default {
  components:{Edit},
  computed:{
    ...mapGetters(['getUser'])
  },
  data() {
    let tool = this.tool
    const rule_shareMoney = function(rule,value,callback){
      if(value.length && !tool.validate.money(value) ){
        callback(new Error('请输入整数或小数（小数最多两位）'))
      }else if(value > 99.99 ){
        callback(new Error('分成金额不能大于 99.99 元'))
      }else{
          callback()
      }
    }
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'region', label:'区域',formatter:function(y,column,cellValue){
            if(y.region=='0'){
                return '全部'
            }else{
                var pname = y.proName? y.proName +'  /': '  /';
                var cname= y.cityName? y.cityName : '-';
                return pname + cname
            }
          }},
          { key:'cateName', label:'行业分类',formatter:function(y,column,cellValue){
            if(y.industry=='0'){
                return '全部'
            }else{
                return y.cateName
            }
          }},
          { key:'goodsSortName', label:'商品分类', formatter: function(y,column,cellValue) {
              if(y.goodsSort=='0'){
                    return '全部'
              }else{
                  return y.goodsSortName
              }
          }},
          { key:'splitRatio', label:'分成比', formatter: function(y,column,cellValue) {
               return y.splitRatio +'%'
          }},
          { type:'operate', label: '操作', 
            btns:[ 
              {text:'修改',eventName:'edit'},
              {text:'删除',type:'danger',eventName:'del'}
            ],
            condition : function(list){
              if(list.data.divideIntoId=='18DDBA6230BDC21C44C99113FA566A2EEEDC'){
                return '内置'
              }
            }
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        }
      },
      // 搜索参数
      form: {},
      goodsSortList: [],
      cateList:[],
      // 促销员分成
      mediaOrSalesman: 2,
      isShow:false,
      data:null,
      activeTabName:'first',
      formShare:{
        formerShareMoney:'',
        shareMoney:'',
        commissionId:''
      },
      formRules:{
        shareMoney:[
            { validator: rule_shareMoney, trigger: 'change' }
        ],
      },
      share_type:''
    }
  },
  methods: {
    tabClick(){
        this.tool.dp.clearData(this.formShare)
        if(this.activeTabName=='first'){
          this.init()
        }else{
          let data_type = this.activeTabName=='second' ? 1 :2
          this.api_mediaManagePlatform_commInfo({data: {type:  data_type,roleType:3 }}).then(result => {
            this.formShare.shareMoney = result.content.shareMoney===null ? '0.00' :this.tool.str.twoDecimal(result.content.shareMoney,2)
            this.formShare.formerShareMoney = result.content.shareMoney===null ? '0.00' :this.tool.str.twoDecimal(result.content.shareMoney,2)
            this.formShare.commissionId = result.content.commissionId
            this.share_type = result.content==='' ? 'add' :'update'
          })
        }
      },
    save() {
      this.$refs.formShare.validate((valid) => {
        if (valid) {
          let data_type = this.activeTabName=='second' ? 1 :2 ,
              msg =  data_type==1 ?'下载分成设置保存成功' :'注册分成设置保存成功' ;
              this.formShare.shareMoney= this.formShare.shareMoney=='' ? '0.00':this.formShare.shareMoney
          if(this.share_type=='add'){
            this.api_mediaManagePlatform_commissionAdd({type:'post', data: {type: data_type, roleType:3, shareMoney: this.formShare.shareMoney}}).then(result => {
                this.$message({type:'success',message:msg})
                this.tabClick()
            })
          }else{
            this.api_mediaManagePlatform_commissionUpdate({type:'post', data: this.formShare}).then(result => {
                 this.$message({type:'success',message:msg})
                 this.tabClick()
            })
          }
        }
      })
    },
    formerFn() {
      this.formShare.shareMoney = this.formShare.formerShareMoney
    },
     //获取商品分类列表
    get_goodsSort () {
        this.api_mediaManagePlatform_goodsClassify({data: {level:1}}).then(res=>{
          this.goodsSortList = res.content;
        })
    },
    //获取媒体一级分类列表
    get_cateList () {
        this.api_mediaManagePlatform_catePar({data:{token:this.getUser.token}}).then(res=>{
          this.cateList = res.content;
        })
    },
    SaveSuccess(){
      this.data = {}
      this.init()
    },
    //修改
    edit(opts,selectIems) {
      this.data = opts.data
      this.isShow = true
    },
    //删除
    del(opts) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api_mediaManagePlatform_divide({pathParams:`/${opts.data.divideIntoId}`,type:'delete'}).then(res=>{
            this.init()
          })
        }).catch(() => {
        
      })
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
      }else if(selectItems.datas[0].divideIntoId == '18DDBA6230BDC21C44C99113FA566A2EEEDC'){
            this.$message({type:'error',message:'该条为默认项，不可修改和删除！'})
            return
      }else{
      this.edit( {data:selectItems.datas[0]} )
      }
    },
    //删除
    onClickBtnDelete(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else if(selectItems.ids.length >1){
          this.$message({type:'error',message:'只能选择一项'})
          return
        }else if(selectItems.datas[0].divideIntoId == '18DDBA6230BDC21C44C99113FA566A2EEEDC'){
            this.$message({type:'error',message:'该条为默认项，不可修改和删除！'})
            return
        }else{
          this.del( {data:selectItems.datas[0]} )
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
    init() {
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.form.mediaOrSalesman= this.mediaOrSalesman
      this.api_mediaManagePlatform_divide({data:this.form}).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }

  },
  mounted() {
    this.init();
    this.get_goodsSort();
    this.get_cateList()
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
</style>