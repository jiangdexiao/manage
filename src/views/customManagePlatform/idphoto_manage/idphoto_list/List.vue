<template>
  <div>
    <el-col :span="24" class="toolbar">
      <el-form ref="form" :rules="formRules" :inline="true" :model="form">
        <el-form-item>
          <el-select v-model="form.sortId" placeholder="证件照分类" clearable @visible-change="vchange">
            <el-option v-for="(item,i) in sortAdmin" :key='i' :label="item.sortName" :value='item.sortId'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="form.colorId" placeholder="证件照底色" clearable @visible-change="vchange">
            <el-option v-for="(item,i) in colorAdmin" :key='i' :label="item.colorName" :value='item.colorId'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="periodic"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeCheck">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="idPhotoName">
          <el-input  placeholder="规格名称（0~30个字符）" :maxlength="30" v-model="form.idPhotoName" class="form-input"></el-input>
        </el-form-item>
        <el-form-item prop="printSize">
          <el-input  placeholder="打印尺寸（mm，限数字和*号）" :maxlength="100" v-model="form.printSize" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium"  class='btn-search' @click="searchSpecs()">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnDelete="onClickBtnDelete"
      @onClickBtnEdit="onClickBtnEdit"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @edit="edit"
      @del="del"
      @detail="detail"
      :DataGrid = 'datagrid'
    >
    </list-data>
  </div>
</template>
<script>
  import {tool} from '../../../../utils/'
  export default {
    data() {

      const idPhoto_Name = (rule,value,callback)=>{
        if(value == undefined || value.trim() == "") {
          callback();
        } else {
          if(/^[0-9\u4E00-\u9FA5]+$/i.test(value.trim())){
            callback()
          }else{
            callback(new Error('只能输入中文和数字'))
          }
        }

      }

      const print_Size = (rule,value,callback)=>{
        if(value == undefined || value.trim() == "") {
          callback();
        } else {
          if(/^[0-9\*\.]+$/i.test(value.trim())){
            callback()
          }else{
            callback(new Error('只能输入数字和*号'))
          }
        }

      }

      return {
        form:{
          colorId:"",
          sortId:"",
          startTime:"",
          endTime:"",
        },
        periodic:"",
        sortAdmin:{},
        colorAdmin:{},
        datagrid:{
          List: [],
          FieldList: [
            { key: 'specsName', label: '规格名称',width:150,tooltip:true,formatter:function (row) {
                return tool.str.textLength(row.specsName,8)
              }},
            { key: 'sortName', label: '分类',width:150,tooltip:true,formatter:function (row) {
              return tool.str.textLength(row.sortName,8)
            }},
            { key: 'photoHight', label: '照片高度'},
            { key: 'photoWidth', label: '照片宽度'},
            { key: 'cutHight', label: '图像高度'},
            { key: 'cutWidth', label: '图像宽度'},
            { key: 'colorName', label: '底色',width:150,tooltip:true,formatter:function (row) {
                return tool.str.textLength(row.colorName,8)
              }},
            { key: 'isChecked', label: '是否需要回执',formatter:function(row){
              return row.isChecked == 1 ? "是" : "否";
            }},
            { key: 'createdTime', label: '添加时间',width:"180px",formatter:function(row){
                return tool.date.format(row.createdTime, "yyyy-MM-dd hh:mm:ss");
              }},
            { key: 'note', label: '备注',width:200,tooltip:true,formatter:function (row) {
                return tool.str.textLength(row.note,20)
              }},
            { type:'operate',label: '操作',
              btns:[
                {text:'详情',eventName:'detail'},
                {text:'修改',eventName:'edit'},
                {text:'删除',eventName:'del'},
              ]
            }
            ],
          ToolBar:[
            {text:'新增',eventName:'onClickBtnAdd'},
            {text:'修改',eventName:'onClickBtnEdit'},
            {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
          ],
          Pagination:{
            current_page:1,
            page_size:10,
            total:0
          },
          data:null
        },
        formRules:{
          idPhotoName:[
            {validator:idPhoto_Name,trigger:"blur"},
          ],
          printSize:[
            {validator:print_Size,trigger:"blur"},
          ]
        }
      }
    },
    mounted() {
      this.getColors()
      this.getSort()
      this.init()
    },
    methods:{
      // 时间赋值
      timeCheck () {
        let that = this
        if (that.periodic != null) {
          that.form.startTime = that.periodic[0]
          that.form.endTime = that.periodic[1]
        } else {
          that.form.startTime = ''
          that.form.endTime = ''
        }
      },
      //搜索
      searchSpecs() {
        this.$refs.form.validate(valid => {
          if(valid) {
            this.init();
          }
        })
      },
      vchange (visible) {
        if(!visible) {
          this.init();
        }
      },
      //新增跳转页面
      onClickBtnAdd(){
        this.$router.push({name:'custom_specs_addModify'})

      },
      //修改
      onClickBtnEdit(data,selectItems){
        if( data.batch.datas.length !== 1 ){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.edit({data:selectItems.datas[0]})
        }
      },
      //删除时提示选择
      onClickBtnDelete(opts,selectItems){
        if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'error',message:'请至少选择一项'})
          return
        }else{
          let ids = [];
          for(let i=0 ; i< selectItems.datas.length;i++) {
            ids.push(selectItems.datas[i].specsId)
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
            specsIds:opts.data
          }
          //调用删除api
          this.api_customManagePlatform_delSpecs({data:option}).then(res=>{
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
            specsIds:opts.data.specsId
          }
          //调用删除api
          this.api_customManagePlatform_delSpecs({data:option}).then(res=>{
            this.init()
          })
        }).catch(() => {

        })
      },
      edit(opts) {
        this.$router.push({name:'custom_specs_addModify',query:{ specsId:opts.data.specsId,}})
      },
      detail(opts) {
        this.$router.push({name:'custom_specs_detail',query:{specsId:opts.data.specsId,}})
      },
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
        this.form.pageNum = this.datagrid.Pagination.current_page
        this.api_customManagePlatform_idphotoList({data:this.form}).then(res=>{
          let specses = res.content ? res.content : [];
          for (let i = 0 ; i < specses.length; i++) {
            let colors = specses[i].idPhotoSpecsColorInfo;
            let colorNames = [];
            for (let j = 0; j < colors.length; j++) {
              colorNames.push(colors[j].colorName)
            }
            specses[i].colorName = colorNames.join(" ,")
          }
          //this.datagrid.List = res.content?res.content:[]
          this.datagrid.List = specses
          this.datagrid.Pagination.total = res.totalCount
        })
      },
      //获取底色
      getColors() {
        this.api_customManagePlatform_getColors().then(res=>{
          this.colorAdmin = res.content ? res.content : {};
        });
      },
      //获取分类
      getSort() {

        this.api_customManagePlatform_initsort({data:{pageNum:0}}).then(res=>{
          this.sortAdmin = res.content ? res.content : {};
        });
      }
    },
  }
</script>
<style lang="scss" scoped>

</style>
