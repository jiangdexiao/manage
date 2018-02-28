<template>
  <div>
    <div class="coupon_detail">
      <el-popover
        ref="popover"
        placement="right"
        width="560"
        trigger="hover">
        <div class="popover">
          <p><span>1.总发出张数：</span>后台发出优惠券的总张数（后台设置为用户领取的优惠券无发放功能）</p>
          <p><span>2.使用张数：</span>用户已经使用该优惠券的总张数</p>
          <p><span>3.领用张数：</span>该优惠券已被领取的总张数（后台设置为后台派发的优惠券无领取）</p>
          <p><span>4.使用率：</span>已使用的该优惠券占总共发出的该优惠券的比例</p>
          <p><span>5.领用率：</span>已领用的该优惠券占总设置的该优惠券的比例</p>
          <p><span>6.单均实付：</span>已经使用该优惠券的订单，所实际支付的平均金额</p>
          <p><span>7.补贴率：</span>已使用该张优惠券的订单的优惠金额总和占该优惠券所作用的订单的实付金额总和的比例</p>
          <p><span>8.平台补贴率：</span>平台补贴金额占该优惠券的总花费预算的比例</p>
          <p><span>9.成交订单总额：</span>该优惠券所作用的订单所生成的订单金额总额（含未支付和已支付）</p>
          <p><span>10.成交订单实付总额：</span>该优惠券所作用的订单所生成的订单金额已支付金额</p>
          <p><span>11.人均用券张数：</span>每个使用过该优惠券的人，所平均使用的张数</p>
          <p><span>12.所花费预算：</span>该张优惠券已经生产的营销费用。</p>
        </div>
      </el-popover>
      <h3 class="data-indicator ">数据指标
        <el-button class="iconfont" v-popover:popover>&#xe678;</el-button>
      </h3>

      <ul class="top-ul">
        <li>
          <div class="fist">优惠券名称：{{toolbar.couponName}}</div>
          <div class="last">创建者：{{toolbar.createType}}</div>
        </li>
        <li>
          <div class="fist">优惠券编号：{{toolbar.couponNo}}</div>
          <div class="last">生成时间：{{toolbar.createTime}}</div>
        </li>

      </ul>
      <list-data
        ref='list-data'
        :DataGrid='datagrid'></list-data>
    </div>
    <div class="coupon-chart">
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-form :inline="true" :form="form">
            <el-form-item>
              <el-date-picker
                v-model="periodic"
                :picker-options="pickerOptions0"
                @change="changeDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" class='btn-search' :disabled="btnSearchDisabled" @click="getData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div>
        <div class="chart-bg">
          <DefaultLine
            style="width: 615px; height: 270px"
            class="echarts_box_fl"
            id="usesituation"
            :legendDada="usesituation.legend_dada"
            :xAxisData="usesituation.xAxis_data"
            :yAxisName="usesituation.yAxis_name"
            :firstName="usesituation.first_name"
            :firstData="usesituation.first_data"
            :twoName="usesituation.two_name"
            :twoData="usesituation.two_data"
          >
          </DefaultLine>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import '../../../../../static/css/bi.scss'
  import DefaultLine from '../../../../components/echarts/line/uniline/'
  import dataTransf from '../../../../components/echarts/data-transf/index.js'

  export default {
    components: {dataTransf, DefaultLine},
    data() {
      let _this = this
      return {
        btnSearchDisabled:false,
        id: '',
        toolbar: {
          couponName:'',
          createType:'',
          couponNo:'',
          createTime:'',
        },
        datagrid: {
          List: [],
          FieldList: [
            {key: 'totalNum', label: '总发出张数（张）',},
            {key: 'usedNum', label: '使用张数（张）',},
            {key: 'inNum', label: '领用张数（张）',},
            {key: 'useRate', label: '使用率（%）',},
            {key: 'inRate', label: '领用率（%）',},
            {key: 'perSingePay', label: '单均实付（元）',},
            {key: 'giveRate', label: '补贴率（%）'},
            {key: 'platGiveRate', label: '平台补贴率（%）',},
            {key: 'gmvAmt', label: '成交订单总额（元）', width: 140},
            {key: 'payGmvAmt', label: '成交订单实付总额（元）', width: 180},
            {key: 'avgCustCnt', label: '人均用券张数（张）', width: 140},
            {key: 'costAmt', label: '所花费预算（元）', width: 140},
          ],
          Checkbox: false,
        },
        periodic: [new Date(new Date().getTime() - 7 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
        form:'',
        startTime: '',
        endTime: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        usesituation: {
          legend_dada: [],
          xAxis_data: [],
          yAxis_name: '',
          first_name: '',
          first_data: [],
          two_name: '',
          two_data: [],
        },
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.init()
      this.getData()
    },
    methods: {
      init() {
        this.api_biManagePlatform_effectCouponId({data: {couponId: this.id}}).then(res => {
          this.datagrid.List = res.content;
          this.datagrid.List.forEach(item => {
            item.useRate = ((item.useRate * 100).toFixed(2) + '%');
            item.inRate = ((item.inRate * 100).toFixed(2) + '%');
            item.giveRate = ((item.giveRate * 100).toFixed(2) + '%');
            item.platGiveRate = ((item.platGiveRate * 100).toFixed(2) + '%');
            item.avgCustCnt = ((item.avgCustCnt ).toFixed(2));
            item.perSingePay = item.perSingePay.toFixed(2)
            item.gmvAmt = (item.gmvAmt / 10000).toFixed(2);
            item.payGmvAmt = (item.payGmvAmt / 10000).toFixed(2);
            item.costAmt = (item.costAmt / 10000).toFixed(2);
//            console.log(item.couponName)
            this.toolbar.couponName = item.couponName;
            this.toolbar.couponNo = item.couponNo;
            this.toolbar.createTime = this.tool.date.format(item.createTime,'yyyy-MM-dd hh:mm:ss');
            if (item.createType === "1") {
              this.toolbar.createType = '平台'
            } else {
              if (item.createType === "2")
                this.toolbar.createType = '商家'
            }

          })
        })
      },
      changeDate() {
        if (this.periodic && Array.isArray(this.periodic) && this.periodic[0]) {
          this.startTime = this.periodic[0];
          this.endTime = this.periodic[1];
          let days = this.tool.date.diffDate(new Date(this.periodic[1]),new Date(this.periodic[0]))
          if( days > 20 ){
            this.btnSearchDisabled= true
            this.$message({type:'error',message:'选择时间范围不能超过20天'})
            return
          }else{
            this.btnSearchDisabled = false
          }
        }else{
          this.btnSearchDisabled= true
          return
        }
      },
      getData() {
        this.api_biManagePlatform_usesituation({
          data: {
            couponId: this.id,
            startTime: this.periodic&&this.periodic.length>0 ? this.tool.date.format(this.periodic[0],'yyyy-MM-dd') : '',
            endTime: this.periodic&&this.periodic.length>0 ? this.tool.date.format(this.periodic[1],'yyyy-MM-dd') : ''
          }
        }).then(res => {
          this.usesituation.xAxis_data=[];
          this.usesituation.first_data=[];
          let list = res.content;
          list.forEach(item => {
            this.usesituation.xAxis_data.push(dataTransf.formatTime(item.dateId));
            this.usesituation.first_data.push(item.cnt);
          })

        })
      }
    }

  }
</script>

<style lang="scss">
  .coupon_detail {
    background-color: #fff;
    padding: 10px;
    .data-indicator {
      font-size: 14px;
      color: #333;
      .el-button {
        padding: 0 5px;
        border: 0;
        color: #EE6723;
        &:hover, &:active {
          background-color: #fff;
        }
      }
    }
    ul, li {
      list-style: none;
    }

  }

  .popover {
    font-size: 12px;
    p {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      span {
        color: #73A9E8;
      }
    }
  }
</style>
