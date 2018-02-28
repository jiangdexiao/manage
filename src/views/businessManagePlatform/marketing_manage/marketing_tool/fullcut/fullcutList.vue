<template>
  <div>
    <div class="search">
      <el-col :span="24" class="marketbar">
        <el-form :inline="true" :model="search_params">
          <div>
            <el-form-item class="mb0">
              <el-input v-model="search_params.full_cut_no" placeholder="满减编号" @keydown.enter="getFullCutList" @blur="formValidator(1)"></el-input>
            </el-form-item>
            <el-form-item class="mb0">
              <el-input v-model="search_params.full_cut_name" placeholder="满减名称" @keydown.enter="getFullCutList" :maxlength="22"></el-input>
            </el-form-item>
            <el-form-item class="mb0">
              <el-select v-model="search_params.status" clearable @change="getFullCutList" placeholder="全部状态">
                <el-option v-for="item in statusOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="mt6 mb0">
              <el-date-picker style="width: 400px;"
                    v-model="search_params.time"
                    type="daterange"
                    align="right"
                    :editable="false"
                    range-separator="~"
                    start-placeholder="生成开始日期"
                    end-placeholder="生成结束日期"
                    :picker-options="dateOptions">
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="mb0">
              <el-select v-model="search_params.full_cut_type" clearable @change="getFullCutList" placeholder="全部形式">
                <el-option v-for="item in fullCutTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="mb0">
              <el-select v-model="search_params.creator_type" clearable @change="getFullCutList" placeholder="全部生成者">
                <el-option v-for="item in creatorTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="mb0">
              <el-select v-model="search_params.use_type" clearable @change="getFullCutList" placeholder="全部使用情况">
                <el-option v-for="item in useTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" size="medium" @click="getFullCutList()" class="btn-search">搜索</el-button>
            <el-button size="medium" @click="resetSearchParams()">重置搜索条件</el-button>
          </div>
        </el-form>
      </el-col>
    </div>
    <div class="search-table">
    	<el-button class="blue" size="medium" @click="toCreate()"  path="/m/m94xz">新增满减</el-button>
      <el-table :data="tableData.content">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row.fullCutId)" type="text" size="small" class="mr7">详情</el-button>
            <el-button v-if="scope.row.status < 3" @click="stopFullCut(scope.row.fullCutId)" type="text" size="small" style="color: red;">终止</el-button>
            <el-button v-if="scope.row.status < 3" @click="modify(scope.row.fullCutId)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="fullCutNo" label="编号" align="center" width="150"></el-table-column>
        <el-table-column prop="creatorType" label="生成者" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.creatorType === 1 ? '平台' : scope.row.creatorType === 2 ? '商家' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fullCutName" label="满减名称" align="center" width="180"></el-table-column>
        <el-table-column prop="itemContent" label="满减规则" align="center"></el-table-column>
        <el-table-column prop="totalNum" label="数量" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.totalNum == null ? '无限制' : scope.row.totalNum == 0 ? '无限制' : scope.row.totalNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.status === 1 ? '未生效' : scope.row.status === 2 ? '已生效' : scope.row.status === 3 ? '已失效' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isUse" label="使用情况" align="center" width="150"></el-table-column>
        <el-table-column prop="createTime" label="生成时间" align="center" width="180"></el-table-column>
      </el-table>
      <el-pagination style="padding: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_params.page_no"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="search_params.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      // 搜索参数
      button_color: false,
      fullCutTypeOptions: [
        {value: 0, label: '全部形式'},
        {value: 1, label: '减钱'},
        {value: 2, label: '打折'},
        {value: 3, label: '换购'}
      ],
      statusOptions: [
        {value: 0, label: '全部状态'},
        {value: 1, label: '未生效'},
        {value: 2, label: '已生效'},
        {value: 3, label: '已失效'}
      ],
      creatorTypeOptions: [
        {value: 0, label: '全部生成者'},
        {value: 1, label: '平台'},
        {value: 2, label: '商家'}
      ],
      useTypeOptions: [
        {value: 0, label: '全部使用情况'},
        {value: 1, label: '正常'},
        {value: 2, label: '无可用'}
      ],
      dateOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      search_params: {
        full_cut_no: '',
        full_cut_name: '',
        status: 0,
        time: [],
        start_time: '',
        end_time: '',
        full_cut_type: 0,
        creator_type: 0,
        use_type: 0,
        page_no: 1,
        page_size: 10
      },
      tableData: ''
    }
  },
  watch: {
    'search_params.time': {
      handler (val, oldVal) {
        let _this = this
        if (!oldVal) return
        if (val === oldVal) return
        if (!val) {
          _this.search_params.start_time = ''
          _this.search_params.end_time = ''
        }
      },
      deep: true
    }
  },
  methods: {
    formatDate (date, fmt) {
      let _this = this
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
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
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : _this.padLeftZero(str)
          )
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    sevenDay () {
      let _this = this
      _this.search_params.time = []
      let date1 = new Date()
      _this.search_params.end_time = _this.formatDate(date1, 'yyyy-MM-dd')
      let date2 = new Date(date1)
      date2.setDate(date1.getDate() - 7)
      _this.search_params.start_time = _this.formatDate(date2, 'yyyy-MM-dd')
    },
    // 即时验证
    formValidator (flag) {
      let _this = this
      // falg--1:编号
      if (flag == 0 || flag == 1) {
        let reg = /^[0-9]*$/
        if (reg.test(_this.search_params.full_cut_no) === false) {
          _this.search_params.full_cut_no = ''
          _this.warning('满减编号只能是数字')
        }
      }
    },
    // 重置查询条件
    resetSearchParams () {
      let _this = this
      _this.search_params = {
        full_cut_no: '',
        full_cut_name: '',
        status: 0,
        start_time: '',
        end_time: '',
        full_cut_type: 0,
        creator_type: 0,
        use_type: 0,
        page_no: 1,
        page_size: 10
      }
      _this.getFullCutList()
    },
    // 获取满减列表
    getFullCutList () {
      let _this = this
      if (_this.search_params.time != null && _this.search_params.time.length > 0) {
        _this.search_params.start_time = _this.formatDate(_this.search_params.time[0], 'yyyy-MM-dd')
        _this.search_params.end_time = _this.formatDate(_this.search_params.time[1], 'yyyy-MM-dd')
      }
      _this.api_businessManagePlatform_fullcutList({
        data: _this.search_params
      }).then(result => {
        _this.tableData = result
        if (_this.tableData.content != null && _this.tableData.content.length > 0) {
          for (let i = 0; i < _this.tableData.content.length; i++) {
            let content = ''
            for (let j = 0; j < _this.tableData.content[i].itemList.length; j++) {
              content = content + _this.tableData.content[i].itemList[j].content + ';'
            }
            _this.tableData.content[i].itemContent = content
          }
        }
      })

//      $.ajax({
//        url: _this.BASE_URL + 'm2c.market/web/fullcut/page',
//        data: _this.search_params,
//        headers: {'access_token': sessionStorage.getItem('access_token')},
//        success: function (result) {
//          _this.tableData = result
//          if (_this.tableData.content != null && _this.tableData.content.length > 0) {
//            for (let i = 0; i < _this.tableData.content.length; i++) {
//              let content = ''
//              for (let j = 0; j < _this.tableData.content[i].itemList.length; j++) {
//                content = content + _this.tableData.content[i].itemList[j].content + ';'
//              }
//              _this.tableData.content[i].itemContent = content
//            }
//          }
//        }
//      })
    },
    // 分页大小变化
    handleSizeChange (pageSize) {
      let _this = this
      _this.search_params.page_size = pageSize
      _this.getFullCutList()
    },
    // 分页页码变化
    handleCurrentChange (pageNo) {
      let _this = this
      _this.search_params.page_no = pageNo
      _this.getFullCutList()
    },
    // 终止满减
    stopFullCut (fullCutId) {
      let _this = this
      if (confirm('确定要终止该满减?')) {
        _this.api_businessManagePlatform_stopFullcut({
          pathParams: `/${fullCutId}`
        }).then(result => {
          _this.$message({
            message: '满减终止成功!',
            type: 'success'
          })
          _this.getFullCutList()
        })

//        $.ajax({
//          type: 'post',
//          url: _this.BASE_URL + 'm2c.market/admin/fullcut/stop/' + fullCutId,
//          data: {},
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          success: function (result) {
//            if (result.status === 200) {
//              _this.$message({
//                message: '满减终止成功!',
//                type: 'success'
//              })
//              _this.getFullCutList()
//            } else {
//              _this.warning('满减终止失败!')
//            }
//          }
//        })
      }
    },
    // 跳转新增满减页面
    toCreate () {
      let _this = this
      _this.$router.push({path: '/m/marketTool/fullcutList/fullcutCreate'})
    },
    // 满减详情
    detail (fullCutId) {
      let _this = this
      sessionStorage.setItem('full_cut_id', fullCutId)
      _this.$router.push({path: '/m/marketTool/fullcutList/fullcutDetail'})
    },
    // 跳转修改满减
    modify (fullCutId) {
      let _this = this
      sessionStorage.setItem('full_cut_id', fullCutId)
      _this.$router.push({path: '/m/marketTool/fullcutList/fullcutModify'})
    },
    // 验证提示
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
    }
  },
  mounted () {
    let _this = this
    _this.getFullCutList()
  }
}
</script>

<style lang="scss" scoped>
  .mt6{
    margin-top: 6px;
  }
  .mb0{
    margin-bottom: 0px;
  }
  .ml30{
    margin-left: 30px;
  }
.search {
  min-height: 110px;
  margin-top: 10px;
  padding: 15px 26px;
  background-color: #fff;
}

.search-table {
  margin-top: 15px;
  background: #fff;
  padding: 5px 26px;
}

.modal-open {
  #handle {
    display: flex;
  }
  #handle.in {
    z-index: 2000;
  }
}
.text_r{
	text-align: right;
}
.blue{
	  background: #11D2EB;
    border: 1px solid #11D2EB;
    color: #fff;
}
  .mr7{
    margin-right: 7px;
  }
</style>
