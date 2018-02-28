<template>
  <div class="bi-content">
    <table class="gk-table" style="margin-top: 5px">
      <thead>
      <tr>
        <th colspan="2">用户量</th>
        <th colspan="2">注册量</th>
        <th colspan="2">订单量</th>
        <th colspan="2">交易额</th>
        <th colspan="2">媒体数</th>
        <th colspan="2">扫拍量</th>
        <th colspan="2">广告位 <span>(个数)</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="title">
        <td>累计</td>
        <td>今日</td>
        <td>累计</td>
        <td>今日</td>
        <td>累计</td>
        <td>今日</td>
        <td>累计</td>
        <td>今日</td>
        <td>累计</td>
        <td>今日</td>
        <td>累计</td>
        <td>今日</td>
        <td>累计
          <div class="bottom-tips">
            <el-tooltip placement="bottom">
              <div slot="content" style="width: 100px">截止到今日凌晨的上线广告位总数</div>
              <el-button class="iconfont icon-ico_explain"></el-button>
            </el-tooltip>
          </div>
        </td>
        <td>今日 <span>（上架）</span></td>
      </tr>
      <tr class="data">
        <td><div>{{table.totalUsers}}</div></td>
        <td><div>{{table.todayUsers}}</div></td>
        <td><div>{{table.totalRegis}}</div></td>
        <td><div>{{table.todayRegis}}</div></td>
        <td><div>{{table.totalOrders}}</div></td>
        <td><div>{{table.todayOrders}}</div></td>
        <td><div>{{totalTrade}}</div></td>
        <td><div>{{todayTrade}}</div></td>
        <td><div>{{table.totalMedia}}</div></td>
        <td><div>{{table.todayMedia}}</div></td>
        <td><div>{{table.totalPaihuo}}</div></td>
        <td><div>{{table.todayPaihuo}}</div></td>
        <td><div>{{table.totalMres}}</div></td>
        <td><div>{{table.todayMres}}</div></td>
      </tr>
      </tbody>
    </table>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title"><i class="iconfont">&#xe61e;</i>近{{barData.xAxis_data.length}}{{barData.length}}天订单量趋势</div>
          <DefaultBar
            class="echarts_box_fl"
            style="width: 100%; height: 270px"
            id="chartColumn"
            :valueList="barData.value_list"
            :xAxisData="barData.xAxis_data"
            :yAxisName="barData.yAxis_name"
            :seriesName="barData.series_name"
            :legendDada="barData.legend_dada"
          >
          </DefaultBar>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title"><i class="iconfont">&#xe6a6;</i>近{{numberMedia.xAxis_data.length}}天媒体数趋势</div>
          <FillLine
            style="width: 100%; height: 270px"
            class="echarts_box_fl"
            id="numberMedia"
            :seriesData="numberMedia.series_data"
            :xAxisData="numberMedia.xAxis_data"
            :yAxisName="numberMedia.yAxis_name"
            :seriesName="numberMedia.series_name"
            :legendDada="numberMedia.legend_dada"
          >
          </FillLine>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title"><i class="iconfont">&#xe6a7;</i>近{{advertising.xAxis_data.length}}天置空率与上架广告位趋势（个数）</div>
          <DefaultLine
            style="width: 100%; height: 270px"
            class="echarts_box_fl"
            id="advertising"
            :legendDada="advertising.legend_dada"
            :xAxisData="advertising.xAxis_data"
            :yAxisName="advertising.yAxis_name"
            :firstName="advertising.first_name"
            :firstData="advertising.first_data"
            :twoName="advertising.two_name"
            :twoData="advertising.two_data"
          >
          </DefaultLine>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title"><i class="iconfont icon-zhuanhuafenxi"></i> 近{{scan.xAxis_data.length}}天扫描与购买转化率趋势</div>
          <LineColumn
            class="echarts_box_fl"
            style="width: 100%; height: 270px"
            id="scan"
            :legendData="scan.legend_data"
            :xAxisData="scan.xAxis_data"
            :yAxisName="scan.yAxis_name"
            :firstName="scan.first_name"
            :firstData="scan.first_data"
            :twoName="scan.two_name"
            :twoData="scan.two_data"
            :threeName="scan.three_name"
            :threeData="scan.three_data"
          >
          </LineColumn>
        </div>

      </el-col>
    </el-row>
  </div>
</template>
<script>
  import EchartsJs from './echarts.js'
  export default EchartsJs
</script>
<style scoped>

</style>
