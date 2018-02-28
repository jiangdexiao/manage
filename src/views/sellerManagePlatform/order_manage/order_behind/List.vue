<template>
  <div class="list">
    <div class="toolbar">
      <el-select v-model="search_params.orderType" placeholder="请选择售后期望">
        <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.status" placeholder="请选择售后状态">
        <el-option v-for="item in afterSales" :key="item.value" :label="item.label" :value="item.value">
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
      <el-input v-model="search_params.condition" :maxlength="100" placeholder="输入商品名称/订货号/售后号" title="输入商品名称/订货号/售后号"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()" class="btn-search">搜索</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="dataList"
      style="width: 100%">
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-col :span="12">
            <el-button
              @click.native.prevent="handleCommand(scope.$index, scope.row,'_detail')"
              type="text"
              size="small">
              详情
            </el-button>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        label="单号"
        width="300">
        <template slot-scope="scope">售后单号<span >{{scope.row.afterSellOrderId}}</span><br>订货单号<span >{{scope.row.orderId}}</span></template>
      </el-table-column>
      <el-table-column
        label="售后期望"
        width="200">
        <template slot-scope="scope"><span>{{scope.row.orderType==0?'换货':scope.row.orderType==1?'退货退款':scope.row.orderType==2?'仅退款':'-'}}</span></template>
      </el-table-column>
      <el-table-column
        label="售后总额/元">
        <!-- <template slot-scope="scope"><span>{{((parseFloat(scope.row.strBackMoney) + parseFloat(scope.row.strRtFreight))).toFixed(2)}}</span></template> -->
        <template slot-scope="scope"><span>{{(scope.row.strBackMoney)}}</span></template>
      </el-table-column>
      <el-table-column
        label="售后状态"
        width="200">
        <template slot-scope="scope">
          <span>
            <!-- {{scope.row.status==0?'申请退货':scope.row.status==1?'申请换货':scope.row.status==2?'申请退款':scope.row.status==3?'拒绝':scope.row.status==4?'已同意申请':scope.row.status==5?'客户已寄出':scope.row.status==6?'商家已收到':scope.row.status==7?'商家已寄出':scope.row.status==8?'客户收到':scope.row.status==9?'已同意退款':scope.row.status==10?'已退款':scope.row.status==11?'售后完成':scope.row.status==12?'售后关闭':scope.row.status==-1?'已取消':'-'}} -->
            {{scope.row.orderType==0?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==1?'待商家同意':scope.row.status==4?'待顾客寄回商品':(scope.row.status==5||scope.row.status==6)?'待商家发货':scope.row.status==7?'待顾客收货':scope.row.status>=8?'售后已完成':'--'):scope.row.orderType==1?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==0?'待商家同意':scope.row.status==4?'待顾客寄回商品':(scope.row.status==5||scope.row.status==6)?'待商家确认退款':scope.row.status>=9?'售后已完成':'--'):scope.row.orderType==2?(scope.row.status==-1?'售后已取消':scope.row.status==3?'商家已拒绝':scope.row.status==2?'待商家同意':scope.row.status==4?'待商家确认退款':scope.row.status>=9?'售后已完成':'--'):'--'}}
          </span></template>
      </el-table-column>
      <el-table-column
        label="商家信息">
        <template slot-scope="scope"><span>{{scope.row.dealerInfo}}</span></template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="申请时间"
        width="200">
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
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        pageRows: 10,
        currentPage: 1,
        totalCount: 0,
        expectations: [{
          value: '',
          label: '售后期望'
        }, {
          value: '2',
          label: '仅退款'
        }, {
          value: '1',
          label: '退货退款'
        }, {
          value: '0',
          label: '换货'
        }],
        afterSales: [{
          value: '',
          label: '售后状态'
        }, {
          value: '20',
          label: '待商家同意'
        }, {
          value: '21',
          label: '待顾客寄回商品'
        }, {
          value: '22',
          label: '待商家确认退款'
        }, {
          value: '23',
          label: '待商家发货'
        }, {
          value: '24',
          label: '待顾客收货'
        }, {
          value: '25',
          label: '售后已完成'
        }, {
          value: '26',
          label: '售后已取消'
        },{
          value: '27',
          label: '商家已拒绝'
        }],
        afterSaleStatus: '', // 售后状态
//        mediaStatus:[{
//          value: '',
//          label: '全部'
//        }, {
//          value: '1',
//          label: '有媒体信息'
//        }, {
//          value: '2',
//          label: '无媒体信息'
//        }],
        // 搜索参数
        search_params: { orderType: '', status: '', condition: '', startTime: '', endTime: '', hasMedia: '' },
        dataList: [],
        time: '',
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
      // 获取全部订单信息
      orderStore () {
        let that = this
        // if(!that.isChangePage){
        //   that.currentPage = 1
        // }
        let a = {
          condition:that.search_params.condition.replace(/\s+/g,""),
          rows: that.pageRows,                     // 每页多少条数据
          pageNum: that.currentPage,    // 请求第几页*/
        }
        this.api_sellerManagePlatform_getAfterOrderList({data:Object.assign(this.search_params,a)}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.dataList = res.content
            for(let i=0;i<that.dataList.length;i++){
              let d = new Date(that.dataList[i].createDate)
              this.dataList[i].createDate = this.tool.date.format(d, 'yyyy-MM-dd hh:mm')
            }
            that.totalCount =res.totalCount
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
          let path='s_order_details';
          sessionStorage.setItem('afterSale:afterSellOrderId', row.afterSellOrderId)
          that.$router.push({name: path})
        }
      }
    },
    mounted () {
      this.orderStore()
    }
  }

</script>
<style lang="scss" scoped>

</style>
