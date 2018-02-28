<template>
  <div class="yh_search">
    <el-col :span="24" class="tablecontainer marketbar">
      <el-form :inline="true" :model="searchParams">
        <div>
        <el-form-item class="mb10">
          <el-input  v-model="searchParams.coupon_no" placeholder="请输入优惠券编号" @keydown.enter="getCouponList" @blur="formValidator('1')"></el-input>
        </el-form-item>
        <el-form-item class="mb10">
          <el-input  v-model="searchParams.coupon_name" placeholder="请输入优惠券名称" @keydown.enter="getCouponList" :maxlength="22"></el-input>
        </el-form-item>
        <el-form-item class="mb10">
          <el-select v-model="searchParams.coupon_status" clearable placeholder="全部有效状态" @change="getCouponList">
            <el-option label="全部状态" value="0"></el-option>
            <el-option label="未生效" value="1"></el-option>
            <el-option label="已生效" value="2"></el-option>
            <el-option label="已失效" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mt6 mb10">
          <el-date-picker
            v-model="searchParams.time"
            type="daterange"
            clearable
            align="left"
            :editable="false"
            range-separator="~"
            start-placeholder="生成开始日期"
            end-placeholder="生成结束日期"
            :picker-options="dateOptions">
          </el-date-picker>
        </el-form-item>
        </div>
        <div>
          <el-form-item class="mb10">
            <el-select v-model="searchParams.coupon_type" clearable placeholder="全部类型" @change="getCouponList">
              <el-option label="全部类型" value="0"></el-option>
              <el-option label="代金券" value="1"></el-option>
              <el-option label="折扣券" value="2"></el-option>
              <el-option label="分享券" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb10">
            <el-select v-model="searchParams.creator_type" clearable placeholder="全部创建者" @change="getCouponList">
              <el-option label="全部创建者" value="0"></el-option>
              <el-option label="平台" value="1"></el-option>
              <el-option label="商户" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb10">
            <el-select v-model="searchParams.use_status" clearable placeholder="全部使用状态" @change="getCouponList">
              <el-option label="全部使用状态" value="0"></el-option>
              <el-option label="正常" value="1"></el-option>
              <el-option label="无可用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb10">
            <el-button type="primary" size="medium" class="btn-search" @click="getCouponList()">搜索</el-button>
            <el-button size="medium" @click="resetSearchParams()">重置搜索条件</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-col>
    <el-col :span="24" class="tablecontainer">
      <el-button size="medium" class="tbcolor01" @click="centerDialogVisible = true">新增优惠券</el-button>
      <el-button size="medium" class="tbcolor02 ml10" @click="gotoSendCoupon()">发放优惠券</el-button>
      <el-button size="medium" class="tbcolor03" @click="gotoEditCoupon()">分享券个性编辑</el-button>
      <div class="tab">
          <el-table :data="tableData.content" style="width: 100%">
            <el-table-column label="操作"  align="center">
              <template slot-scope="scope">
                <el-button  type="text" size="small" style="color:#0B5FDD;" @click="detailCoupon(scope.row.couponId)">详情</el-button>
                <el-button  type="text" size="small" style="color:#00CEEA;" v-if="scope.row.couponStatus < 3" @click="modifyCoupon(scope.row.couponId)">修改</el-button>
                <el-button  type="text" size="small" style="color: red;" v-if="scope.row.couponStatus < 3" @click="stopCoupon(scope.row.couponId)">终止</el-button>
              </template>
            </el-table-column>
            <el-table-column label="编号" align="center" prop="couponNo">
            </el-table-column>
            <el-table-column label="创建者"  align="center">
              <template slot-scope="scope">
                <span>{{scope.row.creatorType === 1 ? '平台' : scope.row.creatorType === 2 ? '商家' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="couponName">
            </el-table-column>
            <el-table-column label="数量（剩余／总数量）" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.couponTotal === 0 ? '无限制' : scope.row.couponRemain + '/' + scope.row.couponTotal}}</span>
              </template>
            </el-table-column>
            <el-table-column label="面值" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.couponForm === 1 ? scope.row.value + '元' : scope.row.value + '折'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型"  align="center">
              <template slot-scope="scope">
                <span>{{scope.row.couponType === 1 ? '代金券' : scope.row.couponType === 2 ? '折扣券' : scope.row.couponType === 3 ? '分享券' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.couponStatus === 1 ? '未生效' : scope.row.couponStatus === 2 ? '已生效' : scope.row.couponStatus === 3 ? '已失效' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.useStatus === 1 ? '正常' : scope.row.useStatus === 2 ? '无可用' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="生成时间" align="center" prop="createTime">
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
    <el-dialog
      title="选择需要新增的优惠券的类型"
      :visible.sync="centerDialogVisible"
      width="50%"
      center>
      <div class="add_xzyh clear">
        <div :class="['add_xbox', 'fl', 'mr60', create_flag == 'cash' ? 'c_active' : '']" @click="create_flag = 'cash'">
          <div class="add_xbox_bg"></div>
          <div class="tit">代金券</div>
          <div class="tit01">用户使用该优惠券减对 应金额，可后台发放</div>
          <!--选中的时候请做出判断出现icon_selected-->
          <i class="icon_selected" v-if="create_flag == 'cash'"></i>
        </div>
        <div :class="['add_xbox', 'fl', 'mr60', create_flag == 'discount' ? 'c_active' : '']"  @click="create_flag = 'discount'">
          <div class="add_xbox_bg"></div>
          <div class="tit">折扣券</div>
          <div class="tit01">用户使用该优惠券减对 应折扣，可后台发放</div>
          <i class="icon_selected" v-if="create_flag == 'discount'"></i>
        </div>
        <div :class="['add_xbox', 'fl', create_flag == 'share' ? 'c_active' : '']" @click="create_flag = 'share'">
          <div class="add_xbox_bg"></div>
          <div class="tit">分享券</div>
          <div class="tit01">用户完成订单，或者邀请朋友 注册，将各得一张优惠券</div>
          <i class="icon_selected" v-if="create_flag == 'share'"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gotoCreateVue()">下一步</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      create_flag: 'cash',
      centerDialogVisible: false,
      tableData: '',
      searchParams: {
        coupon_no: '',
        coupon_name: '',
        coupon_type: '',
        coupon_status: '',
        time: [],
        start_time: '',
        end_time: '',
        creator_type: '',
        creator: 'platform',
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
    _this.getCouponList()
  },
  methods: {
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
        if (reg.test(_this.searchParams.coupon_no) === false) {
          _this.searchParams.coupon_no = ''
          _this.warning('优惠券编号只能是数字')
        }
      }
    },
    // 重置搜索条件
    resetSearchParams () {
      let _this = this
      _this.searchParams = {
        coupon_no: '',
        coupon_name: '',
        coupon_status: '',
        start_time: '',
        end_time: '',
        coupon_type: '',
        creator_type: '',
        use_status: '',
        page_no: 1,
        page_size: 10
      }
      _this.getCouponList()
    },
    // 获取优惠券列表
    getCouponList () {
      let _this = this
      if (_this.searchParams.time != null && _this.searchParams.time.length > 0) {
        _this.searchParams.start_time = _this.formatDate(_this.searchParams.time[0], 'yyyy-MM-dd')
        _this.searchParams.end_time = _this.formatDate(_this.searchParams.time[1], 'yyyy-MM-dd')
      }
      _this.api_businessManagePlatform_couponPage({
        data: _this.searchParams
      }).then(result => {
        _this.tableData = result
      })
//      $.ajax({
//        url: _this.BASE_URL + 'm2c.market/web/coupon/page',
//        data: Object.assign({}, {token: sessionStorage.getItem('access_token'), isEncry: false}, _this.searchParams),
//        success: function (result) {
//          _this.tableData = result
//        }
//      })
    },
    // 终止优惠券
    stopCoupon (couponId) {
      let _this = this
      if (confirm('确定要终止该优惠券?')) {
        _this.api_businessManagePlatform_stopCoupon({
          pathParams: `/${couponId}`
        }).then(result => {
          _this.$message({
            message: '优惠券终止成功!',
            type: 'success'
          })
          _this.getCouponList()
        })
//        $.ajax({
//          type: 'post',
//          url: _this.BASE_URL + 'm2c.market/admin/coupon/end/' + couponId,
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          success: function (result) {
//            if (result.status === 200) {
//              _this.$message({
//                message: '优惠券终止成功!',
//                type: 'success'
//              })
//              _this.getCouponList()
//            } else {
//              _this.warning('优惠券终止失败!')
//            }
//          }
//        })
      }
    },
    // 跳转修改优惠券
    modifyCoupon (couponId) {
      let _this = this
      sessionStorage.setItem('coupon_id', couponId)
      _this.$router.push({path: '/m/marketTool/couponList/couponModify'})
    },
    // 优惠券详情
    detailCoupon (couponId) {
      let _this = this
      sessionStorage.setItem('coupon_id', couponId)
      _this.$router.push({path: '/m/marketTool/couponList/couponDetail'})
    },
    handleSizeChange (pageSize) {
      let _this = this
      _this.searchParams.page_size = pageSize
      _this.getCouponList()
    },
    handleCurrentChange (pageNo) {
      let _this = this
      _this.searchParams.page_no = pageNo
      _this.getCouponList()
    },
    // 跳转创建优惠券页面
    gotoCreateVue () {
      let _this = this
      if (_this.create_flag === 'cash') { // 创建代金券
        _this.$router.push({path: '/m/marketTool/couponList/couponCashCreate'})
      }
      if (_this.create_flag === 'discount') { // 创建折扣券
        _this.$router.push({path: '/m/marketTool/couponList/couponDiscountCreate'})
      }
      if (_this.create_flag === 'share') { // 创建分享券
        _this.$router.push({path: '/m/marketTool/couponList/couponShareCreate'})
      }
      _this.centerDialogVisible = false
    },
    // 跳转发放优惠券页面
    gotoSendCoupon () {
      let _this = this
      _this.$router.push({path: '/m/marketTool/couponList/couponRule'})
    },
    // 跳转分享券个性编辑页面
    gotoEditCoupon () {
      let _this = this
      _this.$router.push({path: '/m/marketTool/couponList/couponShareSetting'})
    },
    // 验证提示
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
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
.mt6{
  margin-top: 6px;
}
.mt10{
  margin-top: 10px;
}
.mb10{
  margin-bottom: 10px;
}
.mr60{
	margin-right: 60px;
}
.ml10{
  margin-left: 10px;
}
.ml40{
	margin-left: 40px;
}
.yh_search{
  /*margin-top: 10px;*/
  /*padding: 15px 26px;*/
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
    padding: 20px 35px;
    margin-bottom: 10px;
  }
  .tablecontainer{
    margin-top: 10px;
    background-color: #fff;
    padding: 15px 26px;
    margin-bottom: 10px;
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
