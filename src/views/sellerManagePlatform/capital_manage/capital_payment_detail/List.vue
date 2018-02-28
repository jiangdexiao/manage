<template>
  <div class="list clear">
    <div class="searcWrap">
      <el-select v-model="search_params.businessType" placeholder="业务类型">
        <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.inoutType" placeholder="收入方式">
        <el-option v-for="item in inoutTypes" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input v-model="search_params.condition"  :maxlength="100" placeholder="输入业务号/商家信息" title="输入业务号/商家信息"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()" class="btn-search">搜索</el-button>
      <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportDetail()" class="fr">导出</el-button>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        ref="multipleTable"
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50">
        </el-table-column>
        <el-table-column
          label="业务号"
          width="300">
          <template slot-scope="scope">
            <span v-if="scope.row.businessType != 4 && scope.row.businessType != 5">{{scope.row.businessId}}</span>
            <span v-if="scope.row.businessType == 4">售后单号 {{scope.row.businessId}}</span>
            <span v-if="scope.row.businessType == 5">售后单号 {{scope.row.businessId}}</span><br/>
            <span v-if="scope.row.businessType == 4 || scope.row.businessType == 5"  style="font-size:12px;color: lightsteelblue ">{{scope.row.correlationBusinessId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务类型"
          width="200"
          >
          <template slot-scope="scope"><span>{{scope.row.businessType==1?'销售分成':scope.row.businessType==2?'满减分摊':scope.row.businessType==3?'提现':scope.row.businessType==4?'分成退款':scope.row.businessType==5?'满减分摊退款':scope.row.businessType==6?'优惠券分摊':scope.row.businessType==7?'优惠券分摊退款':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="收入/元"
          >
          <template slot-scope="scope"><span>+{{scope.row.inoutType == 1 ?(scope.row.amount/1).toFixed(2):(1-1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="支出/元"
          width="200"
          >
          <template slot-scope="scope"><span v-if="scope.row.amount>=0">-{{scope.row.inoutType == 2 ?(scope.row.amount/1).toFixed(2):(1-1).toFixed(2)}}</span> <span v-if="scope.row.amount <0">{{scope.row.inoutType == 2 ?(scope.row.amount/1).toFixed(2):(1-1).toFixed(2)}}</span></template>
        </el-table-column>
        <el-table-column
          label="商家信息"
          >
          <template slot-scope="scope"><span>{{scope.row.platformName}}</span></template>
        </el-table-column>
        <el-table-column
          label="生成时间"
          >
          <template slot-scope="scope"><span >{{scope.row.createDate }}</span></template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin: 20px;float: left">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        time: '',
        pageRows: 10,
        currentPage: 1,
        totalCount: 0,
        inoutTypes: [{
          value: '',
          label: '收入方式'
        }, {
          value: '1',
          label: '收入'
        }, {
          value: '2',
          label: '支出'
        }],
        expectations: [{
          value: '',
          label: '业务类型'
        }, {
          value: '1',
          label: '销售分成'
        }, {
          value: '2',
          label: '满减分摊'
        }, {
          value: '3',
          label: '提现'
        }, {
          value: '4',
          label: '分成退款'
        }, {
          value: '5',
          label: '满减分摊退款'
        }, {
          value: '6',
          label: '优惠券分摊'
        }, {
          value: '7',
          label: '优惠券分摊退款'
        }],
        // 搜索参数
        search_params: { inoutType: '', condition: '', startTime: '', endTime: '', businessType: '' },
        orderStoreData: [],
        // isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
      // 时间赋值
      timeCheck () {
        let that = this
        if (that.time != null) {
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        } else {
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      exportDetail () { 
        let that = this
        if(!that.tool.permission.permission('trading:dealerAccounting:export')){
          this.$message('无权限访问接口')
          return
        }
        let url = this.BASE_URL + 'm2c.trading/web/accounting/dealer/manager/inout/detail/export?businessIdOrDealerName='+that.search_params.condition+'&startDate='+that.search_params.startTime+"&endDate="+that.search_params.endTime+"&inoutType="+that.search_params.inoutType+"&businessType="+that.search_params.businessType+"&access_token="+sessionStorage.getItem('access_token');
        window.location.href = url

        // let url =that.BASE_URL+'m2c.trading/web/accounting/dealer/manager/inout/detail/export?businessIdOrDealerName='+that.search_params.condition+'&startDate='+that.search_params.startTime+"&endDate="+that.search_params.endTime+"&inoutType="+that.search_params.inoutType+"&businessType="+that.search_params.businessType
        // window.location.href = url
      },
      // 获取全部订单信息
      orderStore () {
        let that = this
        // if(!that.isChangePage){
        //   that.currentPage = 1
        // }
        let parameter ={
          token: sessionStorage.getItem('mToken'),
          pageSize: that.pageRows,                     // 每页多少条数据
          pageNo: that.currentPage,    // 请求第几页*/
          businessIdOrDealerName:that.search_params.condition.replace(/\s+/g,""),
          businessType:that.search_params.businessType,
          inoutType:that.search_params.inoutType,
          startDate:that.search_params.startTime,
          endDate:that.search_params.endTime
        }
     that.api_sellerManagePlatform_orderStore({data:parameter}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
          for(var i =0 ;i <res.content.length; i++){
            if(res.content.businessType != 4 && res.content.businessType != 5 ){
               res.content.businessIdNO = res.content.businessId;
            }else if( res.content.businessType === 4 || res.content.businessType === 5){
              res.content.businessIdNO = '售后单号 '+ res.content.businessId;
            }
          }
          that.orderStoreData = res.content
          that.totalCount = res.totalCount
          }
      })
        // that.isChangePage = false
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.orderStore();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        // that.isChangePage = true
        that.orderStore();
      }
      ,handleCommand (index,row,action) {
        let that = this
        if (action === '_detail') {
          let path='details';
          sessionStorage.setItem('afterSale:afterSellOrderId', row.afterSellOrderId)
          that.$goRoute({path: path})
        }
      }
    },
    mounted () {
      this.orderStore()
    }
  }
</script>
<style lang="scss" scoped>
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      padding: 10px;
      position: relative;
      .bootstrap-table {
        margin: 0;
      }
      [tableexport-id] {
        width: 120px;
        height: 25px;
        color: #fff;
        line-height: 25px;
        border-radius: 2px;
        border: none;
        margin-bottom: 12px;
        position: absolute;
        top: 10px;
        left: 134px;
        background: #F56C6C;
      }
      .public_button {
        width: 120px;
        height: 25px;
        color: #fff;
        border-radius: 2px;
        border: none;
      }
      .print_order {
        background: #18DCF6;
      }
      //表格样式
      table {
        td {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
</style>

