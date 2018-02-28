<template>
  <div v-loading="loading">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form">
        <el-form-item>
          <el-input placeholder="媒体编码" :maxlength="50" v-model="form.coding" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="媒体名称" :maxlength="50" v-model="form.mediaName" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <EleAreaProvinceCity v-on:selected="selected"></EleAreaProvinceCity>
        </el-form-item>
        <el-form-item>
            <el-select v-model="form.industry" placeholder="请选择行业" clearable>
            <el-option v-for="(cell,i) in industryList" :value="cell.cateCode" :key='i'
                       :label="cell.cateName"></el-option>
          </el-select>
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

        <el-form-item>
          <el-input placeholder="广告ID" :maxlength="50" v-model="form.mresId" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            @change="changeDate"
            v-model="periodic"
            type="daterange"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="init"> 查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" class="toolbar btnbar">
     <el-button v-if="periodic===''" type="primary" >
        导出<a :href="BI_BASE_URL + 'm2c.bi/canying/sale/report/excel'"></a>
      </el-button>
      <el-button v-else type="primary" >
        导出
        <a :href="BI_BASE_URL + 'm2c.bi/canying/sale/report/excel'+'?startTime='+startTime+'&endTime='+endTime"></a>
      </el-button>
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
        periodic: [new Date(new Date().getTime() - 20 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
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
          adlocation: []
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
            {key: 'mediaNo', label: '媒体编码', width: 200},
            {key: 'mediaName', label: '媒体名称', width: 200},
            {key: 'city', label: '城市'},
            {key: 'profession', label: '行业',},
            {key: 'formName', label: '广告位形式', width: 120},
            {key: 'advAreaName', label: '广告位置',},
            {key: 'mresNo', label: '条码', width: 200},
            {key: 'category', label: '品类',},
            {key: 'goodsName', label: '商品', width: 200},
            {key: 'scanCnt', label: '扫拍量',},
            {key: 'cartingCnt', label: '加购数',},
            {key: 'orderCustomerCnt', label: '下单客户数',},
            {key: 'orderCnt', label: '订单数',},
            {key: 'payAmt', label: '交易额',},
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false,
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
      this.init();
      this.exportSeller();
    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.init()
      },
      changeDate() {
        this.startTime = this.periodic[0];
        this.endTime = this.periodic[1];
      },

      selected(val) {
        this.form.region = val;
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
      exportSeller() {
//        saleExcel
//        let url=
      },

      init() {
        this.tableData = [];
        this.loading = true
        this.api_biManagePlatform_saleReort({
          data: {
            startTime: this.startTime ? this.startTime : "",
            endTime: this.endTime ? this.endTime : "",
            mediaNo: this.form.coding ? this.form.coding : '',
            mediaName: this.form.mediaName ? this.form.mediaName : '',
            cityCode: this.form.region ? this.form.region : '',
            professionCode: this.form.industry ? this.form.industry : '',
            mresId: this.form.mresId ? this.form.mresId : '',
            formId: this.form.cate ? this.form.cate : '',
            advAreaCode: this.form.adlocation ? this.form.adlocation : '',
          }
        }).then(res => {
          this.loading = false
          this.datagrid.List = res.content ? res.content : []
          this.datagrid.List.forEach(item => {
            item.payAmt = item.payAmt / 10000
          })
        })
      },
    },

  }
</script>

<style lang="scss">
  .bi-export-btn {
    position: relative;
    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background-color: transparent;
    }
  }
</style>
