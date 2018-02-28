<template>
  <div class="list clear">
    <div class="toolbar">
      <el-select v-model="search_params.SettleStatus" placeholder="结算状态">
        <el-option v-for="item in expectations" :key="item.value" :label="item.label" :value="item.value">
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
      <el-input v-model="search_params.condition" :maxlength="100"  placeholder="输入结算号/订货号" title="输入结算号/订货号"></el-input>
      <el-button type="primary" size="medium" @click="orderStore()" class="btn-search">搜索</el-button>
    </div>
    <div class="order_tab_list" style="margin-top: 20px;">
      <el-table
        id="multipleTable" 
        :data="orderStoreData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="操作"
           width="120"
          >
          <template slot-scope="scope">
            <el-col :span="12">
              <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          label="结算号"
          width="350">
          <template slot-scope="scope"><span >{{scope.row.settleId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货号"
          width="200"
          >
          <template slot-scope="scope"><span>{{scope.row.dealerOrderId}}</span></template>
        </el-table-column>
        <el-table-column
          label="订货金额/元"
          width="150"
          >
          <template slot-scope="scope"><span>{{(scope.row.goodsTotalAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="售后金额/元"
          >
          <template slot-scope="scope"><span>{{(scope.row.afterSellAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算总额/元"
           :render-header="renderHeader"  >
          <template slot-scope="scope"><span>{{scope.row.settleTotalAmount == undefined ? '-':(scope.row.settleTotalAmount)}}</span></template>
        </el-table-column>
        <el-table-column
          label="结算状态"
          >
          <template slot-scope="scope"><span>{{scope.row.settleStatus == 1?'待结算':scope.row.settleStatus == 2 ?'已结算':'-'}}</span></template>
        </el-table-column>
        <el-table-column
          label="商家信息"
          width="260"
          >
          <template slot-scope="scope"><span>{{scope.row.dealerName}}</span></template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="200"
          >
          <template slot-scope="scope"><span >{{tool.date.format(new Date(scope.row.updatedTime), 'yyyy-MM-dd hh:mm:ss')  }}</span></template>
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
import {tool} from '../../../../utils/'
  export default {
    name: '',
    data () {
      return {
        pageRows: 10,
        currentPage: 1,
        totalCount: 0,
        expectations: [{
          value: '',
          label: '结算状态'
        }, {
          value: '1',
          label: '待结算'
        }, {
          value: '2',
          label: '已结算'
        }],
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
        search_params: { dealerOrderId: '', condition: '', startTime: '', endTime: '', SettleStatus: '' },
        orderStoreData: [],
        time: '',
        // isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
      renderHeader(createElement, { column }) {
        return createElement('div',[
          column.label,
          createElement('div',{
              class:'icon ',
            },
            [createElement('div',{
              class:'tips',
            },
            [createElement('p','商家最终结算的金额')]
            )]
          )
        ] )
      },
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
        this.api_sellerManagePlatform_getCountQueryList({
          data:{
            token:sessionStorage.getItem('access_token'),
            rows: that.pageRows,                     // 每页多少条数据
            pageNumber: that.currentPage,    // 请求第几页*/
            keyword:that.search_params.condition.replace(/\s+/g,""),
            settleStatus:that.search_params.SettleStatus,
            startDate:that.search_params.startTime,
            endDate:that.search_params.endTime
          }
        }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.orderStoreData = res.content;
          that.totalCount = res.totalCount;
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
          let createdTime = that.tool.date.format(new Date(row.updatedTime), 'yyyy-MM-dd hh:mm:ss')
          that.$router.push({name: 's_countQueryDetail', query:{settleId:row.settleId,updateTime:createdTime,dealerOrderId:row.dealerOrderId,settleStatus:row.settleStatus}})
        }
      }
    },
    mounted () {
      let  that = this
      if(that.$route.query.SettleStatus === 1 ) {
        that.search_params.SettleStatus = '1'
        }
      this.orderStore()
    }
  }
</script>
<style lang="scss" scoped>
  .el-table th div.icon{width:16px;height:16px; display:inline-block; position:relative;
    background:url('../../../../../static/images/sellerManage/css_sprites.png') no-repeat -848px -50px;
    div.tips{display:none;width:100px;height:auto;background:#fff;border:1px solid #E5E5E5;border-radius: 4px;box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;top:18px;left:0px; text-indent: 0;padding:6px;font-weight:normal;
      p{line-height:24px;font-size:12px; color:#666;}
    }
  }
  div.icon:hover div.tips{display:block;}
  .time{
    width: 330px;
    height: 61px;
    position: absolute;
    left: -123px;
    top: 19px;
    z-index: 10;
    .form-control{
      width: 139px;
      height: 31px;
      position: absolute;
      top: 12px;
    }
    .start{
      left: 20px;
    }
    .separator{
      position: absolute;
      left: 162px;
      top: 12px;
    }
  }
span{
  cursor: pointer;
}
</style>

<style lang="scss">
.el-table th div.icon{width:16px;height:16px; display:inline-block; position:relative;
    background:url('../../../../../static/images/sellerManage/css_sprites.png') no-repeat -848px -50px;
    div.tips{display:none;width:120px;height:auto;background:#fff;border:1px solid #E5E5E5;border-radius: 4px;box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;top:18px;left:-80px; padding:2px;font-weight:normal;
      p{line-height:24px;font-size:12px; color:#666;}
    }
  }
div.icon:hover  div.tips{
  display:block !important;}
.el-table .cell, .el-table th div {
    overflow: visible;
}


</style>
