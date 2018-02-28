<template>
  <div class="Recordofrecords_container">
      <el-col :span="24" class="marketbar">
      	<div class="Recordofrecords">
      		<el-form :inline="true"  class="demo-form-inline">
  					<!--<el-form-item label="优惠券名称">-->
  					<el-form-item >
    				<el-input v-model="params.coupon_name" placeholder="请输入优惠券名称"></el-input>
  				</el-form-item>
  				<!--<el-form-item label="注册时间">-->
  				<el-form-item >
    				<el-date-picker
							v-model="time"
							width="350"
							:editable="false"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
  				</el-form-item>
  				<el-form-item>
    			<el-button type="primary btn-search" @click="get_send">查询</el-button>
  				</el-form-item>
					</el-form>
      	<div class="table">
					<el-table :data="send_list" slot="empty" stripe style="width: 100%; margin-top: 20px">
							<el-table-column label="操作" width="130">
								<template slot-scope="scope">
									<span  v-if="scope.row.failSend == 0"> - </span>
									<el-button v-if="scope.row.failSend != 0" @click="derive(scope.row)" type="text" size="small">导出失败用户</el-button>
								</template>
							</el-table-column>
							<el-table-column  label="发放状态" >
								<template slot-scope="scope">
									<span>成功：{{scope.row.successSend}}</span>&nbsp;&nbsp;
									<span>失败：{{scope.row.failSend}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="couponName" label="优惠券名称">
							</el-table-column>
							<el-table-column prop="beUsed" label="已使用" >
							</el-table-column>
							<el-table-column prop="createdDate" label="发放时间" width="250">
							</el-table-column>
						</el-table>
      	</div>
      	<div class="fr mt10">
            		<el-pagination
									@size-change="handleSizeChange"
									@current-change="handleCurrentChange"
									:current-page="pagination.pageNum"
									:page-sizes="[5,10, 20, 50, 100]"
									:page-size="pagination.rows"
									layout="total, sizes, prev, pager, next, jumper"
									:total="pagination.total">
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
      time: '',
      params: {coupon_name: '', start_date: '', end_date: ''},
      send_list: [],
      pagination: {rows: 10, total: 0, pageNum: 1}
    }
  },
  watch: {
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.params.start_date = ''
          that.params.end_date = ''
        }
      },
      deep: true
    }
  },
  methods: {
    derive (item) {
      let url = `${this.BASE_URL}m2c.market/coupon/export/send/fail/record/` + item.sendRecordId
      location.href = url
    },
    get_send () {
      let that = this
      if (that.time !== null && that.time !== '') {
        that.params.start_date = that.tool.date.format(new Date(that.time[0]), "yyyy-MM-dd")
        that.params.end_date = that.tool.date.format(new Date(that.time[1]), "yyyy-MM-dd")
      }
      let formData = Object.assign(this.params, {
        page_no: this.pagination.pageNum,
        page_size: this.pagination.rows
      })
      console.log('formData', formData)
      that.api_businessManagePlatform_sendRecordPage({
        data: formData
      }).then(result => {
        that.send_list = result.content
        console.log('that.send_list', that.send_list)
        that.pagination.total = result.totalCount
      })
//      $.ajax({
//        method: 'get',
//        url: that.BASE_URL + 'm2c.market/admin/coupon/send/record/page',
//        headers: {'access_token': sessionStorage.getItem('access_token')},
//        data: formData,
//        success: function (res) {
//          if (res.status == 200) {
//            that.send_list = res.content
//            console.log('that.send_list', that.send_list)
//            that.pagination.total = res.totalCount
//          }
//        }
//      })
    },
    // 分页功能
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagination.rows = val
      this.get_send()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagination.pageNum = val
      this.get_send()
    }
  },
  mounted () {
    this.get_send()
  }
}

</script>

<style lang="scss" scoped>
.Recordofrecords_container{
	padding: 15px 26px;
	.Recordofrecords{
		width: 100%;
		min-height: 540px;
		background: #FFFFFF;
		padding-left: 10px;
		padding-top: 15px;
		padding-right: 30px;
		padding-bottom: 10px;
	}
}
.mt30{
	margin-top: 30px;
}
.border_top{
	border-top: 1px solid #E5E5E5;
}
.pt3{
	padding-top: 3px;
}
.marauto{
	margin: auto;
}
.widnone{
	width: initial!important;
}
.mr20{
	margin-right: 20px;
}
.wid180{
	width: 180px;
}
.poi1{
	position: relative;
}
.overflowy{
	overflow-y: auto;
}
.mb10{
	margin-bottom: 10px;
}
.mr5{
	margin-right: 5px;
}
.poi2{
	position: absolute;
}
.poi3{
	position: fixed;
}
.wose{
	white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wose02{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.bluecolor{
	background: #0086FF;
	color: #FFFFFF;
}
.bluecolor02{
	color: #0086FF;

}
.wid280{
	width: 280px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear{
  clear: both;
  overflow: hidden;
}
.mt10{
  margin-top: 10px;
}
.mr10{
	margin-right: 10px;
}
.mt20{
  margin-top: 20px;
}
.ml10{
  margin-left: 10px;
}
.ml100{
  margin-left: 100px;
}
.ml75{
  margin-left: 75px;
}
.linh35{
  line-height: 35px;
  display: inline-block;
}
.ml60{
  margin-left: 60px;
}
.mr10{
  margin-right: 10px;
}
.fontstyle{
  font-style: normal;
}
</style>
