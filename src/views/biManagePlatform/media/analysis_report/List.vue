<template>
  <div class="list">
      <el-tabs v-model="activeTabName" @tab-click="tabClick" >  
        <el-tab-pane label="按日期" name="first"></el-tab-pane>
        <el-tab-pane label="按周次" name="second"></el-tab-pane>
        <el-tab-pane label="按月份" name="third"></el-tab-pane>
    </el-tabs>
      <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
                <EleAreaProvinceCityAreas v-on:selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCityAreas>
            </el-form-item>
            <el-form-item>
                <EleMediaCategory v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
            </el-form-item>
            <el-form-item v-if="activeTabName === 'first'">
                <el-date-picker
                    unlink-panels
                    type="daterange"
                    :picker-options="datePickerOptions"
                    v-model="time"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="activeTabName === 'second'" style="margin-right:15px" >
                <el-col :span="11">
                    <el-date-picker
                        v-model="form.startWeek"
                        :picker-options="weekPickerOptions"
                        type="week"
                        format="yyyy 第 WW 周"
                        style="width:100%"
                        placeholder="开始周次">
                    </el-date-picker>
                </el-col>
                <el-col :span="2" class="line" style="text-align:center;margin:auto;padding-left:8px;padding-top:5px;">-</el-col>
                <el-col :span="11">
                    <el-date-picker
                        v-model="form.endWeek"
                        :picker-options="weekPickerOptions"
                        type="week"
                        format="yyyy 第 WW 周"
                        style="width:100%"
                        placeholder="结束周次">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item v-if="activeTabName === 'third'" style="margin-right:15px">
                <el-col :span="11">
                    <el-date-picker
                        v-model="form.startMonth"
                        :picker-options="monthPickerOptions"
                        type="month"
                        style="width:100%"
                        placeholder="开始月份">
                    </el-date-picker>
                </el-col>
                <el-col :span="2" class="line" style="text-align:center;margin:auto;padding-left:8px;padding-top:5px;">-</el-col>
                <el-col :span="11">
                    <el-date-picker
                        v-model="form.endMonth"
                        :picker-options="monthPickerOptions"
                        type="month"
                        style="width:100%"
                        placeholder="结束月份">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" class='btn-search' @click="init" >查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <el-col :span="24" class="toolbar btnbar" >
        <el-button type="primary" class="bi-export-btn" @click="outPut" >导出</el-button>
    </el-col>
    <el-col :span="24">
        <el-table :data="datagrid.List" style="width: 100%" stripe :header-cell-style="headerCellStyle" >
            <el-table-column prop="dateid" label="时间" width="150"  fixed>
                <template slot-scope="scope">
                    <span v-if="activeTabName =='first'">
                        {{ scope.row.dateid?(scope.row.dateid.substr(0,4)+'-'+scope.row.dateid.substr(4,2)+'-'+scope.row.dateid.substr(6,2)):'' }}
                    </span>
                    <span v-else-if="activeTabName =='second'">
                        {{ scope.row.weekid }}
                    </span>
                    <span v-else-if="activeTabName =='third'">
                        {{ scope.row.monthid }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="areaName" label="区域" width="250" >
                <template slot-scope="scope">
                    {{ getArea(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column prop="cateName" label="行业类型" width="150">
                <template slot-scope="scope">
                    {{ (scope.row.cateName&&scope.row.cateTypeName)?(scope.row.cateName +'>' + scope.row.cateTypeName):'' }}
                </template>
            </el-table-column>
            <el-table-column prop="level" label="商户等级" width="150"></el-table-column>
            <el-table-column label="媒体量" align="center">
                <el-table-column prop="mediaCnt" label="新增" width="100"></el-table-column>
                <el-table-column prop="allMediaCnt" label="累计" width="100"></el-table-column>
                <el-table-column prop="mediaAddRate" label="环比" width="100">
                    <template slot-scope="scope" >
                        {{ (scope.row.mediaAddRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="合作模式" align="center">
                <el-table-column prop="mediaSegmentCnt" label="新增分成媒体" width="120"></el-table-column>
                <el-table-column prop="mediaLeaseCnt" label="新增租赁媒体" width="120"></el-table-column>
                <el-table-column prop="allMediaSegmentCnt" label="累计分成媒体" width="120"></el-table-column>
                <el-table-column prop="allMediaLeaseCnt" label="累计租赁媒体" width="120"></el-table-column>
            </el-table-column>
            <el-table-column label="上架广告位" align="center">
                <el-table-column prop="onusedCnt" label="新增数量" width="100"></el-table-column>
                <el-table-column prop="allOnusedCnt" label="累计数量" width="100"></el-table-column>
                <el-table-column prop="onusedCntRate" label="环比" width="100">
                    <template slot-scope="scope" >
                        {{ (scope.row.onusedCntRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="运营数据" align="center">
                <el-table-column prop="downloadCnt" label="新增下载" width="120"></el-table-column>
                <el-table-column prop="allDownloadCnt" label="总量下载" width="120"></el-table-column>
                <el-table-column prop="downloadCntRate" label="下载量环比" width="120">
                     <template slot-scope="scope" >
                        {{ (scope.row.downloadCntRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="regisCnt" label="新增注册量" width="120"></el-table-column>
                <el-table-column prop="allRegisCnt" label="总注册量" width="120"></el-table-column>
                <el-table-column prop="regisCntRate" label="注册量环比" width="120">
                    <template slot-scope="scope" >
                        {{ (scope.row.regisCntRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="scanCnt" label="新增扫拍量" width="120"></el-table-column>
                <el-table-column prop="allScanCnt" label="累计扫拍量" width="120"></el-table-column>
                <el-table-column prop="scanCntRate" label="扫拍量环比" width="120">
                    <template slot-scope="scope" >
                        {{ (scope.row.scanCntRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
                <el-table-column prop="payOrderCnt" label="新增订单量" width="120"></el-table-column>
                <el-table-column prop="allPayOrderCnt" label="累计订单量" width="120"></el-table-column>
                <el-table-column prop="orderAmount" label="新增销售额" width="120"></el-table-column>
                <el-table-column prop="allOrderAmount" label="累计销售额" width="120"></el-table-column>
                <el-table-column prop="transRate" label="转化率(订单量/扫拍量)" width="180">
                    <template slot-scope="scope">
                        {{ (scope.row.transRate*100).toFixed(2)+'%' }}
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </el-col>
    <el-col :span="24" class="page">
          <el-pagination
              @size-change="onChangeCurPageSize"
              @current-change="onChangeCurPage"
              :current-page="datagrid.Pagination.current_page"
              :page-size="datagrid.Pagination.page_size"
              :total="datagrid.Pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              style="float:left;">
          </el-pagination>
        </el-col>
  </div>
</template>
<script>
import {EleAreaProvinceCityAreas,EleMediaCategory} from '../../../../components/business/'
export default {
  components:{EleAreaProvinceCityAreas,EleMediaCategory},
  data(){
      let tool = this.tool
      let now = new Date()
      now.setDate(now.getDate()-1) 
      return{
          headerCellStyle:{'border-right':'1px solid rgb(160, 156, 156)','border-bottom':'1px solid rgb(160, 156, 156)'},
          datePickerOptions:{
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;
            }
          },
          weekPickerOptions: {
            firstDayOfWeek:1,
            disabledDate(time) {
                let dateArray = tool.date.getWeekStartAndEnd(-1)
                return time.getTime() > dateArray[1];
            }
          },
          monthPickerOptions: {
            disabledDate(time) {
                let nowDate = new Date();
                nowDate.setMonth(nowDate.getMonth()-1);
                return time.getTime() > nowDate ;
            }
          },
          activeTabName:'first',
          time:[tool.date.format(now,'yyyy-MM-dd'), tool.date.format(now,'yyyy-MM-dd')],
          form:{
              startWeek:'',
              endWeek:'',
              startMonth:'',
              endMonth:'',
              areaCode:'',
              mediaCateCode:''
          },
          datagrid: {
              List:[],
              Pagination: {
                current_page: 1,
                page_size:10,
                total: 0
            }
          }
      }
  },
  methods:{
      outPut(){
          let obj = this.validate()
          if(!obj){
              this.$message({type:'error',message:'请选择开始时间和结束时间'})
              return 
          }
          window.location.href= `${this.BI_BASE_URL}m2c.bi/media/operation/excel/report?start=${obj.start}&end=${obj.end}&areaCode=${this.form.areaCode}&mediaCateCode=${this.form.mediaCateCode}&`
      },
      getArea(row){
          let area = ''
          if( row.provinceName ){
              area += row.provinceName
          }
          if( row.cityName ){
              area += ">"+row.cityName
          }
          if( row.name ){
              area += ">"+row.name
          }
          return area
      },
      tabClick(obj){
          if( obj.name === 'first'){
              let now = new Date()
              now.setDate(now.getDate()-1) 
              this.time = [this.tool.date.format(now,'yyyy-MM-dd'), this.tool.date.format(now,'yyyy-MM-dd')]
          }else if( obj.name === 'second'){
              let now = new Date()
              now.setDate(now.getDate()-7) 
              this.form.startWeek = now
              this.form.endWeek = now
          }else if( obj.name === 'third'){
              this.form.startMonth = new Date(this.tool.date.getLastMonth())
              this.form.endMonth = new Date(this.tool.date.getLastMonth())
          }
          this.init()
      },
      EleMediaCategory_CallBack(val){
          this.form.mediaCateCode = val
      },
      EleAreaProvinceCity_CallBack(val){
          this.form.areaCode = val
      },
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size  = pageSize
        this.init()
      },
      validate(){
          let start = '',end = ''
          switch(this.activeTabName){
              case 'first':
                if( this.time && this.time.length >0){
                    start = this.time[0].replace('-','').replace('-','')
                    end = this.time[1].replace('-','').replace('-','')
                }
              break;
              case 'second':
                if( this.form.startWeek && this.form.endWeek){
                    if(!this.tool.date.compareDate(this.form.startWeek,this.form.endWeek)){
                        this.$message({type:'error',message:'结束时间必须大于开始时间'})
                        return
                    }
                    let sw = this.tool.date.getWeekOfYear(this.form.startWeek)
                    let ew = this.tool.date.getWeekOfYear(this.form.endWeek)
                    sw = ( sw <10?"0"+sw:sw)
                    ew = ( ew <10?"0"+ew:ew)
                    start = 'W'+this.form.startWeek.getFullYear().toString() + sw
                    end = 'W'+this.form.endWeek.getFullYear().toString() + ew
                }
              break;
              case "third":
                if( this.form.startMonth && this.form.endMonth ){
                    if(!this.tool.date.compareDate(this.form.startMonth,this.form.endMonth)){
                        this.$message({type:'error',message:'结束时间必须大于开始时间'})
                        return
                    }
                    let smonth = this.form.startMonth.getMonth()+1
                    let emonth = this.form.endMonth.getMonth()+1
                    smonth =(smonth<10 ? "0"+smonth:smonth)
                    emonth =(emonth<10 ? "0"+emonth:emonth)
                    start = 'M'+ this.form.startMonth.getFullYear().toString() + smonth
                    end = 'M'+this.form.endMonth.getFullYear().toString() + emonth
                }
              break;
          }
          if( start && end ){
              return { start,end }
          }else{
              return null
          }
      },
      init(){
          let obj = this.validate()
          if(!obj){
              this.$message({type:'error',message:'请选择开始时间和结束时间'})
              return 
          }
          this.api_biManagePlatform_mediaOperationReport({ data:{
                start:obj.start,
                end:obj.end,
                areaCode:this.form.areaCode,
                mediaCateCode:this.form.mediaCateCode,
                pageNum:this.datagrid.Pagination.current_page,
                rows:this.datagrid.Pagination.page_size
            } }).then(res=>{
                this.datagrid.Pagination.total = res.totalCount
                this.datagrid.List = res.content?res.content:[]
            }).catch(err=>{
                this.datagrid.Pagination.total = 0
                this.datagrid.List = []
            })
      }
  },
  mounted(){
      this.init()
  }
}
</script>