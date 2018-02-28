<template>
  <div class="list">
    <el-col :span="24" class="toolbar">
      <el-form ref="form" :rules="formRules" :inline="true" :model="form">
        <el-form-item prop="sortName">
          <el-input  placeholder=" 分类名称（0~100个中文）" :maxlength="50" v-model="form.sortName" class="form-input">

          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search" class='btn-search'>搜索</el-button>
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
    <Edit :isShow="isShow"  @saveSuccess="SaveSuccess"></Edit>
  </div>
</template>
<script>
  import {tool} from '../../../../utils/'
  import Edit from './Edit.vue'
export default {
  components:{Edit},
  data() {
    const sort_name = (rule,value,callback)=>{
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
          {key:'sortName',label:'分类名称'},
          {key:'createTime',label:'添加时间',formatter:function(row,column,cellValue){
      return tool.date.format(row.createTime, "yyyy-MM-dd hh:mm:ss");
    }},
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
        sortName:[{
          validator:sort_name,trigger:'blur'
        }]
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    search() {
      this.$refs.form.validate(valid=>{
        if(valid){
          this.init();
        }
      })
    },

    //新增按钮
    onClickBtnAdd (opts) {
      //this.$router.push({name:'custom_category_add'});//新增分类时跳页面实现方式,现已改为模态框实现方式
      this.isShow = true
    },
    SaveSuccess(){
      this.init()
    },

    //改变页码
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page;
      this.init();
    },

    //改变每页显示条数
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize;
      this.init();
    },

    //删除时提示选择
    onClickBtnDelete(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'error',message:'请至少选择一项'});
        return;
      }else{
        let ids = [];
        for(let i=0 ; i< selectItems.datas.length;i++) {
          ids.push(selectItems.datas[i].sortId)
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
          sortIds:opts.data
        }
        //调用删除api //TODO
        this.api_customManagePlatform_delsort({data:option}).then(res=>{
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
          sortIds:opts.data.sortId
        }
        //调用删除api //TODO
        this.api_customManagePlatform_delsort({data:option}).then(res=>{
          this.init()
        })
      }).catch(() => {

      })
    },

    //初始化页面
    init(){
      //参数
      let option = {
        searchMessage: this.form.sortName ? this.form.sortName : "",
        pageNum : this.datagrid.Pagination.current_page,
        rows : this.datagrid.Pagination.page_size,
      }
      //调api加载数据
      this.api_customManagePlatform_initsort({data:option}).then(res=>{
        this.datagrid.List = res.content ? res.content : [];
        this.datagrid.List.forEach(item=>{
          //item.createTime = ;
        })
        this.datagrid.Pagination.total = res.totalCount;
      })
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
