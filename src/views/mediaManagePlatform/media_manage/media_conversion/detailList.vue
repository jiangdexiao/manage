<template>
  <div class="list">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="form">
          <el-form-item>
              <el-input placeholder="广告位名/条码" :maxlength="20" v-model="form.advNameOrmresNo" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.advCate" class="form-input" placeholder="选择广告位位置" clearable>
                <el-option v-for="(cell,i) in bannerCategoryList" :label="cell.dicName" :value="cell.dicCode" :key='i'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.form"  class="form-input" placeholder="展示形式" clearable>
                <el-option label="图片" value="1"></el-option>
                <el-option label="视频" value="2"></el-option>
                <el-option label="音频" value="3"></el-option>
                <el-option label="实物" value="4"></el-option>
                <el-option label="现场" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.mediaCate" placeholder="媒体分类">
                <el-option
                v-for="(item,i) in cateList"
                :key="i"
                :label="item.cateName"
                :value="item.cateCode">
                </el-option>
            </el-select>
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
  data() {
    return {
      token: sessionStorage.getItem('access_token'),
      datagrid:{
        List:[],
        FieldList: [
          { key: 'advName', label: '广告位名'},
          { key: 'advCateName', label: '位置'},
          { key: 'mediaCateName', label: '媒体分类'},
          { key: 'formName', label: '展示形式'},
          { key: 'advNo', label: '条码'},
          { key: 'photographNum', label: '近30天扫拍量'},
          { key: 'dealNum', label: '近30天成交量'},
          { key: 'conversionRate', label: '近30天转化率'},
          { key: 'advRoi', label: '近30天ROI'},
        ],
        Pagination:{
          total:0,
          page_size:10,
          current_page:1
        },
        Checkbox:false
      },
      form:{
        advNameOrmresNo:'',
        advCate:'',
        form:'',
        mediaCate:''
      },
      bannerCategoryList:[],
      cateList:[]
    }
  },
  methods: {
    //获取下拉列表数据： 广告位分类、媒体一级分类列表
    getSelList() {
      this.api_mediaManagePlatform_mresCateList({data:{ token: this.token, dicType: "mres_cate" }}).then(res=>{
        this.bannerCategoryList = res.content;
      })  
      this.api_mediaManagePlatform_catePar({data:{token:this.token}}).then(res=>{
        this.cateList = res.content;
      })
    },
    onChangeCurPage (page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize (pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init() {
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_mediaManagePlatform_conversionDetailList({data:this.form}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted() {
    if(!this.$route.query.type){
      this.$router.push({path:'/mu/conversion'})
    }else{
      if(this.$route.query.type==1){
        this.form.advCate= this.$route.query.cate 
      }else if(this.$route.query.type==3){
        this.form.mediaCate= this.$route.query.cate 
      }else{
        this.form.form= this.$route.query.cate 
      }
      this.init()
      this.getSelList()
    }
  } 
}
</script>