<template>
  <div class="list">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form">
        <el-form-item>
          <el-select v-model="form.data" placeholder="请选择日期段">
            <el-option
              v-for="item in optionsData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.industry" placeholder="请选择行业" clearable>
            <el-option v-for="(cell,i) in industryList" :value="cell.cateCode" :key='i'
                       :label="cell.cateName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="媒体编号" :maxlength="50" v-model="form.mediaNo" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <EleAreaProvinceCity v-on:selected="selected"></EleAreaProvinceCity>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.cate" placeholder="请选择广告位形式" clearable>
            <el-option v-for="(cell,i) in formDisc" :value="cell.formId" :key='i' :label="cell.formName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.adlocation" placeholder="请选广告位置" clearable>
            <el-option v-for="(cell,i) in dicList" :value="cell.dicCode" :key='i'
                       :label="cell.dicName"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
           <el-input placeholder="媒体名称" :maxlength="50" v-model="form.mediaName" class="form-input"></el-input>
         </el-form-item>-->
        <el-form-item>
          <el-input placeholder="广告位条码" :maxlength="50" v-model="form.mresNo" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="init"> 查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" class="toolbar btnbar" >
        <el-button type="primary" class="bi-export-btn" @click="outPut" >导出</el-button>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid='datagrid'></list-data>
  </div>
</template>

<script>
  import EleAreaProvinceCity from '../../../../components/business/EleAreaProvinceCity.vue'

  export default {
    data() {
      return {
        optionsData: [{
          value: '1',
          label: '近10天'
        }, {
          value: '2',
          label: '近30天'
        }, {
          value: '3',
          label: '近60天'
        }],
        disab: false,
//        inquire: "查询",
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          },
        },
        startTime: '',
        endTime: '',
        //行业分类
        industryList: [],
        //广告位置
        dicList: [],
        formDisc: [],
        form: {
          adlocation: '',
          data:'1',
          region:'',
          mediaNo:'',
          mresNo:'',
          cate:'',
          industry:''
        },
        tableData: {},
        optionAd: '1',
        advArea: true,
        adformName: false,
        admresName: false,
        fullscreenLoading: false,
        loading: false,
        datagrid: {
          List: [],
          FieldList: [
            {key: 'num', label: '序号', width: '50px'},
            {key: 'mediaNo', label: '媒体编号', width: '100px'},
            {key: 'mediaName', label: '媒体名称', width: '240px'},
            {key: 'mresNo', label: '广告位条码', width: '200px'},
            {key: 'mresName', label: '广告位名称', width: '120px'},
            {key: 'avgPV', label: '日均浏览量', width: '100px'},
            {key: 'avgPayOrderCnt', label: '日均支付订单量', width: '120px'},
            {key: 'avgPayOrderAmt', label: '日均交易额', width: '100px'},
            {key: 'resUsedRate', label: '广告位利用率', width: '110px'},
            {key: 'resTransRate', label: '扫拍/下单转化率', width: '140px'},
            {key: 'resIncomeAmt', label: '日均收入', width: '100px'},
            {key: 'avgPerOrderCost', label: '平均订单成本', width: '120px'},
            {key: 'avgPerScanCost', label: '扫拍一次花费的成本', width: '150px'},
            {key: 'resIncomeRate', label: '收益率（广告位日收入-广告位成本）/广告位的成本', width: '220px'},
          ],
          Checkbox: false,
          Pagination: {
            total: 0,
            page_size: 10,
            current_page: 1
          },

        },
      }
    },
    components: {
      EleAreaProvinceCity,
    },
    mounted() {
      this.get_industry()
      this.getDicList()
      this.get_industry()
      this.get_adform()
      this.init()
    },
    methods: {
      outPut(){
          window.location.href= `${this.BI_BASE_URL}m2c.bi/res/cost/analysis/export?type=${this.form.data}&cityCode=${this.form.region}&mediaNo=${this.form.mediaNo}&mresNo=${this.form.mresNo}&formId=${this.form.cate}&advAreaCode=${this.form.adlocation}&cate=${this.form.industry}`
      },
      changeDate() {
        this.startTime = this.periodic[0];
        this.endTime = this.periodic[1];
      },
      selected(val) {
        this.form.region = val;
      },
      // {type,data,dataIndex,list,btn,btnIndex}
      onChangeCurPage(page) {
//        this.$message('当前页是第' + page + '页')
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize(pageSize) {
//        this.$message('当前每页显示 ' + pageSize + ' 条')
        this.datagrid.Pagination.page_size = pageSize
        this.init()
      },
      // 获取行业分类列表
      get_industry() {
        this.api_biManagePlatform_catePar({data: {token: sessionStorage.getItem('access_token')}}).then(res => {
          this.industryList = res.content ? res.content : []
        })

      },
      // 获取广告形式
      get_adform() {
        this.api_biManagePlatform_exhibitType({data: {token: sessionStorage.getItem('access_token')}}).then(res => {
          this.formDisc = res.content ? res.content : []
        })

      },
      // 获取广告位位置
      getDicList() {
        this.api_common_dicList({
          data: {
            token: sessionStorage.getItem('access_token'),
            dicType: 'mres_cate'
          }
        }).then(res => {
          this.dicList = res.content ? res.content : []
        })
      },

      init() {
//costAnalysis   professionCode: this.form.industry ? this.form.industry : '',

        this.api_biManagePlatform_costAnalysis({
          data: {
            rows: this.datagrid.Pagination.page_size,
            pageNo: this.datagrid.Pagination.current_page,
            type: this.form.data,
            mediaNo: this.form.mediaNo ? this.form.mediaNo : '',
            cityCode: this.form.region ? this.form.region : '',
            mresNo: this.form.mresNo ? this.form.mresNo : '',
            cate: this.form.industry ? this.form.industry : '',
            formId: this.form.cate ? this.form.cate : '',
            advAreaCode: this.form.adlocation ? this.form.adlocation : '',
          }
        }).then(res => {
          this.datagrid.List = res.content ? res.content : []
          this.datagrid.List.forEach((item, i) => {
            item.resCostRate = ((item.resCostRate * 100).toFixed(2) + '%')
            item.resIncomeRate = ((item.resIncomeRate * 100).toFixed(2) + '%')
            item.resTransRate = ((item.resTransRate * 100).toFixed(2) + '%')
            item.resUsedRate = ((item.resUsedRate * 100).toFixed(2) + '%')
            item.avgPerOrderCost = (item.avgPerOrderCost / 10000).toFixed(2)
            item.resIncomeAmt = (item.resIncomeAmt / 10000).toFixed(2)
            item.avgPayOrderAmt = (item.avgPayOrderAmt / 10000).toFixed(2);
            item.avgPerScanCost = (item.avgPerScanCost / 10000).toFixed(2);
            /*序号*/
            item.num = res.rows * (res.pageNumber - 1) + i + 1;
          })
          this.datagrid.Pagination.total = res.totalCount;
        }).catch(err=>{
          this.datagrid.Pagination.total = 0
          this.datagrid.List = []
        })

      }

    },

  }
</script>

<style lang="scss">


</style>
