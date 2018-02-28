<template>
  <!--<div>系统用户2222</div>-->
  <div>
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="推广活动" name="market">
        <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
                <el-input  placeholder="活动标题"  :maxlength="20" v-model="form.title"  class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                  unlink-panels
                  v-model="time"
                  :editable = "false"
                  width="350"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" class='btn-search' @click="get_active_info" >搜索</el-button>
              <el-button type="primary" size="medium"  @click="re_set" >重置搜索</el-button>
              <el-button type="primary"  plain size="medium"  @click="add" >新增活动</el-button>
            </el-form-item>
        </el-form>
        </el-col>
        <list-data
        ref='list-data'
        @edit="edit"
        @del="del"
        @onChangeCurrentPage="onChangeCurPage"
        @onChangePageSize="onChangeCurPageSize"
        :DataGrid = 'datagrid'></list-data>
      </el-tab-pane>
      <el-tab-pane label="寻宝领券" name="coupon">
      	<el-col :span="24" class="toolbar">
      		<el-form :inline="true" :form="couponform">
            <el-form-item>
                <el-input v-model="couponform.title"  placeholder="活动标题"  :maxlength="20"  class="form-input"></el-input>
            </el-form-item>
            <!--<el-form-item>
                <el-date-picker
                	v-model="coupontime"
                  unlink-panels
                  :editable = "false"
                  width="350"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" size="medium" class='btn-search' @click="get_coupon_info" >搜索</el-button>
              <el-button type="primary" size="medium"  @click="couponre_set">重置搜索</el-button>
              <el-button type="primary" plain size="medium" @click="couponadd">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="table">
		    	<el-table
			    	style="width: 100%" :data="datatable.List">
			    	<el-table-column label="操作" align="center">
			    		<template slot-scope="scope">
			    			<el-button  type="text" size="small" style="color:#0B5FDD;" @click="detailtab(scope.row.activityId)">详情</el-button>
                <el-button  type="text" size="small" style="color:#0B5FDD;" @click = "Editcoupon(scope.row.activityId)">修改</el-button>
                <el-button  type="text" size="small" style="color: red;" @click="deltab(scope.row.activityId)">删除</el-button>
              </template>
			    	</el-table-column>
			    	<el-table-column label="活动编号" align="center" prop="activityNo">
			    	</el-table-column>
			    	<el-table-column label="活动标题" align="center" prop="activityName">
			    	</el-table-column>
			    	<el-table-column label="投放媒体" align="center" prop="src">
			    	</el-table-column>
			    	<el-table-column label="展示内容" align="center" prop="content">
			    	</el-table-column>
			    	<el-table-column label="展示时间" align="center">
			    		<template slot-scope="scope">
                <span v-text="scope.row.expirationTimeStart"></span>
                <span>-</span>
                <span v-text="scope.row.expirationTimeEnd"></span>
              </template>
			    	</el-table-column>
		  	</el-table>
    	</div>
    	<div class="mt10">
    		<el-pagination
    			@size-change="handleSizeChange"
          @current-change="handleCurrentChange"
    			:current-page="datatable.Pagination.current_page"
		      :page-sizes="[8, 16, 32, 40 ,48 ,56]"
		      :page-size="datatable.Pagination.page_size"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="datatable.Pagination.total">
    </el-pagination>
    	</div>
      </el-col>
      </el-tab-pane>
    </el-tabs>

    <Edit :isShow="isShow" :data="data" :defaultMsg="defaultMsg" :btnType="btnType"></Edit>
  </div>
</template>
<script>
import Edit from './ActiveEdit.vue'
export default {
  components: {Edit},
  data(){
    let tool = this.tool;
    return {
      activeName:'market',
      datagrid:{
        List: [],
        FieldList: [
          { type:'operate',label: '操作',
            width:100,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'删除',type:'danger',eventName:'del', style: 'color:red'}
            ]
          },
          { key: 'activityId', label: '活动编号', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.activityId, 15)
          }},
          { key: 'title', label: '活动标题',tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.title, 15)
          }},
          { key: 'isAllMedia', label: '投放媒体',tooltip: true, formatter:function(row,column,cellValue){
                if (row.isAllMedia === 1) {
                    return '所有媒体'
                } else if (row.isAllMedia === 2) {
                    return tool.str.textLength(row.mediaNames, 15)
                }
          }},
          { key: 'roleId', label: '展示内容',formatter:function(row,column,cellValue){
                if (row.type === 1) {
                    return '自定义'
                } else if (row.type === 2) {
                    return '外部链接'
                }
          }},
          { label: '展示时间', formatter:function(row,column,cellValue){
              return tool.date.format(row.sInvalidTime,'yyyy-MM-dd hh:mm') + '-' + tool.date.format(row.eInvalidTime,'yyyy-MM-dd hh:mm')
          }},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox: false,
      },
      datatable:{
      	List: [],
      	createdTime:'',
      	eInvalidTime:'',
      	Pagination: {
          current_page: 1, // 请求第几页
          page_size:10, // 每页十条数据
          total: 0
        },
      },
      isShow:false,
      data:null,
      // 搜索活动列表参数
      form:{title: '', startTime: '', endTime: ''},
      // 搜索寻宝领券参数
      couponform:{title: ''},
      time:null,
      coupontime:null,
      btnType:'',
      coupontype: '',  // 寻宝领券 新增newadd 编辑 newedit
      defaultMsg: '',
      editdata: '',  // 编辑数据
      detaildata: '', //详情数据
    }
  },
  watch:{
    'time': {
        handler (val, oldVal) {
            if (!oldVal) return
            if (val == oldVal) return
            if (!val) {
                this.form.startTime = ''
                this.form.endTime = ''
            }
        },
        deep: true
    },
//  'coupontime': {
//  	handler (val, oldVal) {
//          if (!oldVal) return
//          if (val == oldVal) return
//          if (!val) {
//              this.couponform.startTime = ''
//              this.couponform.endTime = ''
//          }
//      },
//      deep: true
//  }
  },
  methods:{
  	goto (path) {
        this.$router.push({path: path})
    },
    handleSizeChange (pageSize) {
      let _this = this
      _this.datatable.Pagination.page_size = pageSize
      _this.get_coupon_info()
    },
    handleCurrentChange (pageNo) {
      let _this = this
      _this.datatable.Pagination.current_page = pageNo
      _this.get_coupon_info()
    },
    handleClick () {
      console.log('切换')
    },
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.get_active_info()
    },
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.get_active_info()
    },
    re_set () {
        this.form = {title: '', startTime: '', endTime: ''}
        this.time = null
        this.datagrid.Pagination.current_page = 1
        this.get_active_info()
    },
    couponre_set () {
        this.couponform = {title: ''}
        this.coupontime = null
        this.datatable.Pagination.current_page = 1
        this.get_coupon_info()
    },
    // 获取活动信息
    get_active_info () {
			console.log('shijian ',this.time)
			if (this.time !== null && this.time !== '') {
				this.form.startTime = this.tool.date.format(new Date(this.time[0]),"yyyy-MM-dd")
				this.form.endTime = this.tool.date.format(new Date(this.time[1]),"yyyy-MM-dd")
			}
      this.api_businessManagePlatform_activeList({
        data: Object.assign({}, {
              systemAccessToken: sessionStorage.getItem('access_token'),
              isEncry: false,
              pageRows: this.datagrid.Pagination.page_size,                          // 每页多少条数据
              pageNo: this.datagrid.Pagination.current_page    // 请求第几页
            }, this.form),
      }).then(result => {
          this.datagrid.List = result.content
          this.datagrid.Pagination.total = result.totalCount
      })
    },
    get_coupon_info () {
//  	console.log('领券时间',this.coupontime)
//  	if (this.coupontime !== null && this.coupontime !== '') {
//				this.couponform.startTime = this.tool.date.format(new Date(this.coupontime[0]),"yyyy-MM-dd")
//				this.couponform.endTime = this.tool.date.format(new Date(this.coupontime[1]),"yyyy-MM-dd")
//			}

    	this.api_businessManagePlatform_couponList({
        data: Object.assign({}, {
        			systemAccessToken: sessionStorage.getItem('access_token'),
              isEncry: false,
              page_size: this.datatable.Pagination.page_size,    // 每页多少条数据
              page_no: this.datatable.Pagination.current_page, 		// 请求第几页
              activity_name: this.couponform.title
            }),
      }).then(result => {
          this.datatable.List = result.content
          console.log("datatabletotal",this.datatable.Pagination.total)
          this.datatable.Pagination.total = result.totalCount
          for (let i in this.datatable.List) {
          	var startime = []
          	var endtime = []
          	startime = this.tool.date.format(new Date(this.datatable.List[i].expirationTimeStart),"yyyy-MM-dd")
          	endtime = this.tool.date.format(new Date(this.datatable.List[i].expirationTimeEnd),"yyyy-MM-dd")
           	this.datatable.List[i].expirationTimeStart = startime
           	this.datatable.List[i].expirationTimeEnd = endtime
            }
          console.log("datatable",this.datatable.List)
      })
    },
    deltab (activityId) {
    	this.$confirm('确定删除此活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.api_businessManagePlatform_delCoupon({
          data: {
              systemAccessToken: sessionStorage.getItem('access_token'),
              userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
              activity_id: activityId
            },
        }).then(result => {
            this.get_coupon_info()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    detailtab (activityId) {
    	let _this = this
			_this.api_businessManagePlatform_seekCouponDetail({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          activity_id: activityId
        },
      }).then(result => {
        _this.detaildata = result.content
        console.log('详情',_this.editdata)
    		sessionStorage.setItem('detaildata',JSON.stringify(_this.detaildata))
    		_this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing/m812xq')
      })
    },
    couponadd () {
    	let _this = this
    	_this.coupontype = 'newadd'
    	sessionStorage.setItem('coupontype',_this.coupontype)
    	_this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing/m811xzlq')
    },
    Editcoupon (activityId) {
			let _this = this
			_this.api_businessManagePlatform_seekCouponDetail({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          activity_id: activityId
        }
      }).then(result => {
        _this.editdata = result.content
        // console.log('编辑',_this.editdata)
      	_this.coupontype = 'newedit'
    		sessionStorage.setItem('coupontype',_this.coupontype)
    		sessionStorage.setItem('editdata',JSON.stringify(_this.editdata))
    		_this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing/m811xzlq')
      })
    },
    add() {
      this.btnType = 'add'
      this.isShow = true
      this.data = null
      this.defaultMsg = ''
    },
    edit (opts) {
      this.api_businessManagePlatform_detailActive({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          activityId: opts.data.activityId
        },
      }).then(result => {
        this.data = result.content
        this.defaultMsg = result.content.content
        console.log('this.defaultMsg',this.defaultMsg)
        // console.log('---------',result.content.content)
        this.btnType = 'edit'
        this.isShow = true
      })
    },
    del (opts) {
      this.$confirm('确定删除此活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.api_businessManagePlatform_delActive({
          data: {
              systemAccessToken: sessionStorage.getItem('access_token'),
              userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
              activityId: opts.data.activityId
            },
        }).then(result => {
            this.get_active_info()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    save(){
      console.log('保存成功')
      // this.get_role_info()
    }
  },
  mounted () {
    this.get_active_info()
    this.get_coupon_info()
    if(this.$route.query.id == "001"){
    	this.activeName = 'coupon'
    }
  }
}
</script>
<style lang="scss" scoped>
	.activemanage_container{
		background: #fff;
		margin-bottom: 10px;
		padding-left: 15px;
		.nav{
			width: 100%;
			height: 40px;
			line-height: 38px;
			border-bottom: 1px solid #E6E8F2;
			.nav_span{
				width: 95px;
				height: 40px;
				display: inline-block;
				a{
					line-height: 38px;
					display: inline-block;
					color: #666666;
				}
			}
			.nav_active{
				a{
					border-bottom: 2px solid #0086FF;
					color:#0086FF;
				}
				}
		}
	}
	.mt10{
		margin-top: 10px;
	}
</style>
