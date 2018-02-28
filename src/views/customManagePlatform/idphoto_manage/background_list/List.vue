<template>
  <div class="list">
    <el-col :span="24" class="toolbar">
      <el-form ref="form" :rules="formRules" :inline="true" :model="form">
        <el-form-item prop="colorName">
          <el-input  placeholder="底色名称（0~100个中文）" :maxlength="100" v-model="form.colorName" class="form-input" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search()" class='btn-search'>搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnDelete="onClickBtnDelete"
      @del="del"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
    <Edit :isShow="isShow"  @saveSuccess="saveSuccess"></Edit>
  </div>
</template>
<script>
  import {tool} from '../../../../utils/'
  import Edit from './Edit.vue'
export default {
  components:{Edit},
  data() {
    const color_name = (rule,value,callback)=>{
      if(value == undefined || value.trim() == "") {
        callback();
      } else {
        if(/^[\u4E00-\u9FA5]+$/i.test(value.trim())){
          callback()
        }else{
          callback(new Error('只能输入中文'))
        }
      }
    }

    return {
      form:{},
      pageCount:'',
      datagrid:{
        List:[],
        FieldList:[
          {key:'colorName',label:'颜色名称'},
          {key:'colorValue', label:'色值'},
          {key:'createTime',label:'添加时间'},
          {type:'operate',label:'操作',
            btns:[
              {text:'删除',eventName:'del'},
            ]
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
        ],
        Pagination:{
          current_page:1,
          page_size:10,
          total:0
        },

      },
      isShow:false,
      formRules:{
        colorName:[
          {validator:color_name,trigger:"blur"}
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {

    //新增按钮
    onClickBtnAdd (opts) {
      //this.$router.push({name:'custom_background_add'})
      this.isShow = true
    },

    search() {
      this.$refs.form.validate(valid => {
        if(valid) {
          this.init();
        }
      })
    },

    saveSuccess() {
      this.init();
    },
    //改变页码
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.init()
    },

    //改变每页显示条数
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },

    //删除时提示选择
    onClickBtnDelete(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'error',message:'请至少选择一项'})
        return
      }else{
        let ids = [];
        for(let i=0 ; i< selectItems.datas.length;i++) {
          ids.push(selectItems.datas[i].colorId)
        }
        this.delbatch( {data:ids.join()} )
      }
    },

    //批量删除
    delbatch(opts) {
      //提示
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //参数
        let option={
          colorId:opts.data
        }
        //调用删除api
        this.api_customManagePlatform_delcolor({data:option}).then(res=>{
          this.init()
        })
      }).catch(() => {

      })
    },
    //单条删除
    del(opts) {
      //提示
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //参数
        let option={
          colorId:opts.data.colorId
        }
        //调用删除api
        this.api_customManagePlatform_delcolor({data:option}).then(res=>{
          this.init()
        })
      }).catch(() => {

      })
    },

    //初始化页面
    init(){
      //参数
      let option = {
        colorName: this.form.colorName ? this.form.colorName : "",
        pageNumber : this.datagrid.Pagination.current_page,
        rows : this.datagrid.Pagination.page_size,
      }
      //调api加载数据
      this.api_customManagePlatform_initcolor({data:option}).then(res=>{
        this.datagrid.List = res.content ? res.content : [];
        this.datagrid.Pagination.total = res.totalCount;
        this.datagrid.Pagination.page_size = res.rows;
        this.datagrid.Pagination.current_page = res.pageNumber;

      })
    },

  }
}
</script>
<style lang="scss" scoped>

</style>
