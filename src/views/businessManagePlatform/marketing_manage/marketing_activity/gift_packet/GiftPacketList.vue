<template>
  <div class="yh_search">
    <el-col :span="24" class="toolbar search_c">
      <el-form :inline="true" class="demo-form-inline">
        <div>
          <el-form-item>
            <el-input placeholder="请输入新人礼包名称" v-model="searchParams.packet_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入新人礼包编号" v-model="searchParams.packet_no" @blur="formValidator('1')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchParams.time"
              type="daterange"
              clearable
              align="left"
              :editable="false"
              range-separator="~"
              start-placeholder="开始生成日期"
              end-placeholder="截止生成日期"
              :picker-options="dateOptions">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
        	<el-form-item>
            <el-select v-model="searchParams.use_status" clearable placeholder="全部使用状态" @change="getGiftPacketList">
              <el-option label="全部使用状态" value="0"></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="无可用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.packet_status" clearable placeholder="全部生效状态" @change="getGiftPacketList">
              <el-option label="全部生效状态" value="0"></el-option>
              <el-option label="未生效" value="1"></el-option>
              <el-option label="已生效" value="2"></el-option>
              <el-option label="已失效" value="3"></el-option>
            </el-select>
          </el-form-item>
          <div class="fr">
          <el-form-item>
            <el-button type="primary" class="sort btn-search" @click="getGiftPacketList()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain @click="resetSearchParams()">重置搜索条件</el-button>
          </el-form-item>
          </div>
        </div>
      </el-form>
    </el-col>
    <el-col :span="24" class="tablecontainer">
      <div>
        <el-button class="tbcolor01" @click="toAddGiftPacket()">新增新人礼包</el-button>
      </div>
      <div class="tab">
        <el-table :data="tableData.content" style="width: 100%">
          <el-table-column label="操作"  align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" style="color:#0078E4;" @click="detailGiftPacket(scope.row.packetId)">详情</el-button>
              <el-button type="text" size="small" style="color:#11D2EB;" v-if="scope.row.packetStatus < 3" @click="modifyGiftPacket(scope.row.packetId)">修改</el-button>
              <el-button type="text" size="small" style="color:#73A9E8;" v-if="scope.row.packetStatus == 1" @click="effectGiftPacket(scope.row.packetId)">生效</el-button>
              <el-button type="text" size="small" style="color:#FF0000;" v-if="scope.row.packetStatus == 2" @click="stopGiftPacket(scope.row.packetId)">结束</el-button>
            </template>
          </el-table-column>
          <el-table-column label="编号" align="center" prop="packetNo"></el-table-column>
          <el-table-column label="名称" align="center" prop="packetName"></el-table-column>
          <el-table-column label="有效状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.packetStatus === 1 ? '未生效' : scope.row.packetStatus === 2 ? '已生效' : scope.row.packetStatus === 3 ? '已失效' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.useStatus === 1 ? '正常' : scope.row.useStatus === 2 ? '无可用' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="生成时间" align="center" prop="createdDate">
          </el-table-column>
        </el-table>
        <div class="fl mt10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.page_no"
            :page-sizes="[10, 15, 20, 40]"
            :page-size="searchParams.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.totalCount">
          </el-pagination>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: '',
      searchParams: {
        packet_no: '',
        packet_name: '',
        time: [],
        start_time: '',
        end_time: '',
        packet_status: '',
        use_status: '',
        page_no: 1,
        page_size: 10
      },
      dateOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    'searchParams.time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.searchParams.start_time = ''
          that.searchParams.end_time = ''
        }
      },
      deep: true
    }
  },
  mounted () {
    let _this = this
    _this.getGiftPacketList()
  },
  methods: {
    // 跳转新增新人礼包
    toAddGiftPacket () {
      let _this = this
      _this.$router.push({path: '/m/marketActivity/giftPacketList/giftPacketAdd'})
    },
    formatDate (date, fmt) {
      let that = this
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : that.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    // 验证输入条件
    formValidator (flag) {
      let _this = this
      // flag--1:编号
      if (flag === '0' || flag === '1') {
        let reg = /^[0-9]*$/
        if (reg.test(_this.searchParams.packet_no) === false) {
          _this.searchParams.packet_no = ''
          alert('新人礼包编号只能是数字')
        }
      }
    },
    // 重置搜索条件
    resetSearchParams () {
      let _this = this
      _this.searchParams = {
        packet_no: '',
        packet_name: '',
        packet_status: '',
        start_time: '',
        end_time: '',
        use_status: '',
        page_no: 1,
        page_size: 10
      }
      _this.getGiftPacketList()
    },
    // 获取新人礼包列表
    getGiftPacketList () {
      let _this = this
      if (_this.searchParams.time != null && _this.searchParams.time.length > 0) {
        _this.searchParams.start_time = _this.formatDate(_this.searchParams.time[0], 'yyyy-MM-dd')
        _this.searchParams.end_time = _this.formatDate(_this.searchParams.time[1], 'yyyy-MM-dd')
      }
      _this.api_businessManagePlatform_packetPage({
        data: _this.searchParams
      }).then(result => {
        _this.tableData = result
      })
//      $.ajax({
//        url: _this.BASE_URL + 'm2c.market/admin/packet/page',
//        headers: {'access_token': sessionStorage.getItem('access_token')},
//        data: _this.searchParams,
//        success: function (result) {
//          _this.tableData = result
//        }
//      })
    },
    // 结束新人礼包
    stopGiftPacket (packetId) {
      let _this = this
      if (confirm('是否需要结束该新人礼包，未领取的用户将无法领取，已领取的用户优惠券仍然可用，但客户端新人专区将会隐藏?')) {
        _this.api_businessManagePlatform_stopPacket({
          pathParams: `/${packetId}`
        }).then(result => {
          console.log('status:', result.status)
          alert('结束新人礼包成功!')
          _this.getGiftPacketList()
        })
//        $.ajax({
//          type: 'post',
//          url: _this.BASE_URL + 'm2c.market/admin/packet/end/' + packetId,
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          success: function (result) {
//            if (result.status === 200) {
//              console.log('status:', result.status)
//              alert('结束新人礼包成功!')
//              _this.getGiftPacketList()
//            } else {
//              alert('结束新人礼包失败!')
//            }
//          }
//        })
      }
    },
    // 生效新人礼包
    effectGiftPacket (packetId) {
      let _this = this
      if (confirm('是否需要生效该新人礼包，现生效的新人礼包将自动失效，未领取的用户将领取礼包，已领取的用户优惠券仍然可用，但客户端新人专区将会隐藏?')) {
        _this.api_businessManagePlatform_effectFullcut({
          pathParams: `/${packetId}`
        }).then(result => {
          console.log('status:', result.status)
          alert('生效新人礼包成功!')
          _this.getGiftPacketList()
        })
//        $.ajax({
//          type: 'post',
//          url: _this.BASE_URL + 'm2c.market/admin/packet/effected/' + packetId,
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          success: function (result) {
//            if (result.status === 200) {
//              console.log('status:', result.status)
//              alert('生效新人礼包成功!')
//              _this.getGiftPacketList()
//            } else {
//              alert('生效新人礼包失败!')
//            }
//          }
//        })
      }
    },
    // 跳转修改优惠券
    modifyGiftPacket (packetId) {
      let _this = this
      sessionStorage.setItem('packet_id', packetId)
      _this.$router.push({path: '/m/marketActivity/giftPacketList/giftPacketModify'})
    },
    // 新人礼包详情
    detailGiftPacket (packetId) {
      let _this = this
      sessionStorage.setItem('packet_id', packetId)
      _this.$router.push({path: '/m/marketActivity/giftPacketList/giftPacketDetail'})
    },
    handleSizeChange (pageSize) {
      let _this = this
      _this.searchParams.page_size = pageSize
      _this.getGiftPacketList()
    },
    handleCurrentChange (pageNo) {
      let _this = this
      _this.searchParams.page_no = pageNo
      _this.getGiftPacketList()
    }
  }
}
</script>

<style lang="scss" scoped>
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear{
  clear: both;
}
.mt10{
  margin-top: 10px;
}
.mr60{
	margin-right: 60px;
}
.ml40{
	margin-left: 40px;
}
.yh_search{
  padding: 15px 26px;
  .add_xzyh{
  	height: 330px;
  	border-bottom: 1px solid #E5E5E5;
  	overflow: auto;
  	.c_active{
  		border: 1px solid #0086FF!important;
  		position: relative;
  		.tit{
  			color: #0086FF!important;
  		}
  		.icon_selected{
  			position: absolute;
  			background: url(../../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
  			width:18px;
				height:18px;
				right: 0px;
				bottom: 0px;
  		}
  	}
  	.add_xbox{
  		width: 200px;
    	height: 250px;
    	border: 1px solid #E6E8F2;
    	padding-top: 36px;
    	margin-bottom: 20px;
    	margin-left: 5%;
    	cursor: pointer;
  		.add_xbox_bg{
  		width: 100px;
  		height: 60px;
  		background: url(../../../../../../static/images/businessManage/icon_quan.png) no-repeat center;
  		margin: auto;
  		margin-bottom: 27px;
  		}
  		.tit{
			font-size:16px;
			font-family:PingFangSC-Medium;
			color:#333;
			line-height:22px;
			margin-bottom: 20px;
			text-align: center;
  		}
  		.tit01{
  		width: 120px;
			font-size:12px;
			font-family:PingFangSC-Light;
			color:rgba(51,51,51,1);
			line-height:20px;
			text-align: center;
			margin: auto;
  		}
  	}
  }
  .search_c{
    background-color: #fff;
    padding: 14px 35px;
    padding-top: 28px;
    margin-bottom: 10px;
  }
  .tablecontainer{
    background-color: #fff;
    padding: 10px;
    .tab{
    margin-top: 10px;
    margin-bottom:10px;
    }
    .tbcolor01{
      background: #11D2EB;
      border: 1px solid #11D2EB;
      color: #fff;
    }
    .tbcolor02{
      background: #F5BD23;
      border: 1px solid #F5BD23;
      color: #fff;
    }
    .tbcolor03{
      background: #88BAF4;
      border: 1px solid #88BAF4;
      color: #fff;
    }
  }
}
</style>
