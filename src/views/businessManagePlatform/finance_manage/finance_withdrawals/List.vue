<template>
  <div class="m11txgl">
      <el-tabs v-model="statu.wdStatus" @tab-click="handleClick" class= 'marl'>
        <el-tab-pane label="申请中" name="1">
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :form="form" >
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.withdrawalId" placeholder="输入提现号" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.correlationName" placeholder="输入客户名称" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="withdrawal_search_params.correlationType" placeholder="请选择角色" clearable>
                  <el-option label="商家" value="2"></el-option>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="促销员" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
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
                <el-button type="primary" size="medium" class='btn-search' @click="get_withdrawal_info" >搜索</el-button>
                <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <list-data
            ref='list-data'
            @addFinWit="addFinWit"
            @operateAgree="operateAgree"
            @operateFefuse="operateFefuse"
            @onChangeCurrentPage="onChangeCurPage"
            @onChangePageSize="onChangeCurPageSize"
            :DataGrid = 'datagrid'>
          </list-data>
        </el-tab-pane>
        <el-tab-pane label="待打款" name="2">
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :form="form" >
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.withdrawalId" placeholder="输入提现号" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.correlationName" placeholder="输入客户名称" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="withdrawal_search_params.correlationType" placeholder="请选择角色" clearable>
                  <el-option label="商家" value="2"></el-option>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="促销员" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
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
                <el-button type="primary" size="medium" class='btn-search' @click="get_withdrawal_info" >搜索</el-button>
                <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <list-data
            ref='list-data'
            @confirm="confirm"
            @note="note"
            @printVoucher="printVoucher"
            @onChangeCurrentPage="onChangeCurPage"
            @onChangePageSize="onChangeCurPageSize"
            :DataGrid = 'datagrid2'>
          </list-data>
        </el-tab-pane>
        <el-tab-pane label="已打款" name="4">
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :form="form" >
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.withdrawalId" placeholder="输入提现号" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.correlationName" placeholder="输入客户名称" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="withdrawal_search_params.correlationType" placeholder="请选择角色" clearable>
                  <el-option label="商家" value="2"></el-option>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="促销员" value="1"></el-option>
                  <el-option label="BD专员" value="6"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
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
                <el-button type="primary" size="medium" class='btn-search' @click="get_withdrawal_info" >搜索</el-button>
                <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
                <el-button type="primary" size="medium" @click="derive" >导出</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <list-data
            ref='list-data'
            @printVoucher="printVoucher"
            @onChangeCurrentPage="onChangeCurPage"
            @onChangePageSize="onChangeCurPageSize"
            :DataGrid = 'datagrid4'>
          </list-data>
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="3">
          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <el-form :inline="true" :form="form" >
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.withdrawalId" placeholder="输入提现号" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input @keydown.enter="get_withdrawal_info" v-model="withdrawal_search_params.correlationName" placeholder="输入客户名称" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="withdrawal_search_params.correlationType" placeholder="请选择角色" clearable>
                  <el-option label="商家" value="2"></el-option>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="促销员" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
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
                <el-button type="primary" size="medium" class='btn-search' @click="get_withdrawal_info" >搜索</el-button>
                <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <list-data
            ref='list-data'
            @onChangeCurrentPage="onChangeCurPage"
            @onChangePageSize="onChangeCurPageSize"
            :DataGrid = 'datagrid3'>
          </list-data>
        </el-tab-pane>
      </el-tabs>
      <!--点击批量发放-->
			<el-dialog title="导入数据" :visible.sync="addFinWit_show" width="700px" :before-close="cancle_upload" >
        <div class="top clearfix ">
          <div class="left fl">
            <div>
              <el-button type="primary" plain @click="sel_lease_file"> 上传租赁费用数据</el-button>
              <input v-if="input_show" type="file" id="uploadLease" style="display:none" @change="file_Lease_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            </div>
            <div>
              <el-button type="primary" plain @click="sel_BD_file"> 上传BD专员工资数据</el-button>
              <input v-if="input_show" type="file" id="uploadBD" style="display:none" @change="file_Bd_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            </div>
            
          </div>
          <div class="right fl">
             <p @click="down('Media')">下载租赁费用模板</p>
             <p @click="down('BD')">下载BD专员工资模板</p>
          </div>
        </div>
        <div class="bottom">
          <p> 1、请使用系统默认的模板导入，请勿擅自更改模板；</p>
          <p> 2、每种下载模板已预置名单，请按照对应名单填写提现信息，不提现的名单请删除后再上传；</p>
          <p> 3、请严格按照表格说明的规范填写，填写不合法均会导入失败；</p>
          <p> 4、单次导入数据不可多余500个；</p>
          <p> 5、导入后，数据需要一段时间同步，请耐心等待</p>
        </div>
      </el-dialog>
      <!--上传结果-->
      <el-dialog title="导入结果" :visible.sync="result_show" width="700px" :before-close="cancle_upload" >
        <div class="top clearfix ">
          <div class="left fl">
            <p class="mess">成功：{{resmess.successCount}}</p>
            <div>
              <el-button type="primary" plain @click="down_fail"> 下载失败数据</el-button>
            </div>
            
          </div>
          <div class="right fl">
            <p class="mess">失败：{{resmess.errorCount}}</p>
            <div>
              <el-button type="primary" plain @click="upload_fail"> 重新上传</el-button>
              <input v-if="input_show" type="file" id="uploadFail" style="display:none" @change="file_fail_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            </div>
          </div>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      let tool = this.tool
      return {
        datagrid: {
          List: [],
          FieldList: [
            {
              type: "operate",
              label: "操作",
              btns: [
                { text: "同意", eventName: "operateAgree" },
                { text: "拒绝", eventName: "operateFefuse" },
              ]
            },
            { key: "withdrawalId", label: "提现号" },
            { key: "customerName", label: "客户名称" },
            { key: "roleName", label: "角色" },
            { key: "amount", label: "申请金额/元" },
            { key: "createdTime", label: "申请时间", width: 150 },
            { key: "applyComment", label: "申请备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.applyComment, 25)
            }},
          ],
          ToolBar: [
            { text: "新增提现", eventName: "addFinWit" }
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false
        },
        datagrid2: {
          List: [],
          FieldList: [
            {
              type: "operate",
              label: "操作",
              btns: [
                { text: "确认打款", eventName: "confirm" },
                { text: "打印凭证", eventName: "printVoucher", condition:function({data}){ return data.printNum === '0'}},
                { text: "再次打印", eventName: "printVoucher", condition:function({data}){ return data.printNum !== '0'}},
                { text: "备注", eventName: "note" },
              ]
            },
            { key: "withdrawalId", label: "提现号" },
            { key: "customerName", label: "客户名称" },
            { key: "roleName", label: "角色" },
            { key: "amount", label: "申请金额/元" },
            { key: "updatedTime", label: "更新时间",  width: 150, },
            { key: "applyComment", label: "申请备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.applyComment, 25)
            }},
            { key: "comment", label: "备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.comment, 25)
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false
        },
        datagrid4: {
          List: [],
          FieldList: [
            {
              type: "operate",
              label: "操作",
              btns: [
                { text: "打印凭证", eventName: "printVoucher", condition:function({data}){ return data.printNum === '0'}},
                { text: "再次凭证", eventName: "printVoucher", condition:function({data}){ return data.printNum !== '0'}},
              ]
            },
            { key: "withdrawalId", label: "提现号" },
            { key: "customerName", label: "客户名称" },
            { key: "roleName", label: "角色" },
            { key: "amount", label: "申请金额/元" },
            { key: "updatedTime", label: "更新时间",  width: 150, },
            { key: "applyComment", label: "申请备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.applyComment, 25)
            }},
            { key: "comment", label: "备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.comment, 25)
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false
        },
        datagrid3: {
          List: [],
          FieldList: [
            { key: "withdrawalId", label: "提现号" },
            { key: "customerName", label: "客户名称" },
            { key: "roleName", label: "角色" },
            { key: "amount", label: "申请金额/元" },
            { key: "updatedTime", label: "更新时间",  width: 150, },
            { key: "applyComment", label: "申请备注",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.applyComment, 25)
            }},
            { key: "rejectReason", label: "拒绝理由",tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.rejectReason, 25)
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false
        },
        form: {},
        // 搜索参数
        withdrawal_search_params: {withdrawalId: '', correlationName: '', correlationType: '', beginTime: '', endTime: ''},
        statu:{wdStatus: sessionStorage.getItem('status')?sessionStorage.getItem('status'):'1'}, 
        // statu:{wdStatus: '1'}, 
        pageCount:0,
        // 分页参数  
        pagination:{pageNum1:1, rows1: 10, pageNum2:1, pageNum3:1, pageNum4:1},
        // 提现列表
        withdrawal_list:[],
        // 记录页码
        pageNumber: 1,
        // 备注
        comment:'',
        time:'',
        // 新增结算弹窗
        addFinWit_show:false,
        // 上传结果弹窗
        result_show:false,
        resmess:{},
        fail_type:'',
        input_show:true
      }
    },
    watch:{
      'time': {
        handler (val, oldVal) {
          let that = this
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            that.withdrawal_search_params.beginTime = ''
            that.withdrawal_search_params.endTime = ''
          }
        },
        deep: true
      }
    },
    methods: {
      // 下载模板
      down (type) {
        if (type == 'Media') {
          location.href = 'https://dl.m2c2017.com/excel/media_leasing_withdraw_import_template.xlsx '
        } else if ( type == "BD") {
          location.href = 'https://dl.m2c2017.com/excel/bd_withdraw_import_template.xlsx'
        }
      },
      // 下载失败文件
      down_fail () {
        location.href =  this.resmess.url
      },
      cancle_upload () {
        this.addFinWit_show = false
        this.result_show = false
        // 销毁input
        this.input_show = false
      },
      sel_lease_file(){
        document.querySelector('#uploadLease').click()
      },
      sel_BD_file () {
        document.querySelector('#uploadBD').click()
      },
      upload_fail(event){
        document.querySelector('#uploadFail').click()
      },
      file_Lease_upload(event){
        this.addFinWit_show = false
        this.fail_type = 'lease'
        let obj = event.target.files[0]
        let url = `${this.BASE_URL}m2c.trading/web/withdrawal/importRentWithdrawal`
        console.log('文件', obj)
        var formData = new FormData()
        formData.append('file', obj)
        this.file_upload(formData,url)
      },
      file_Bd_upload(event) {
        this.addFinWit_show = false
         this.fail_type = 'BD'
        let obj = event.target.files[0]
        let url = `${this.BASE_URL}m2c.trading/web/withdrawal/importBDSalaryWithdrawal`
        console.log('文件', obj)
        var formData = new FormData()
        formData.append('file', obj)
        // formData.append('userId', JSON.parse(sessionStorage.getItem('userInfo')).userId)
        // formData.append('userName', JSON.parse(sessionStorage.getItem('userInfo')).userName)
        console.log('参数--',formData)
        this.file_upload(formData,url)
      },
      file_fail_upload(event){
        this.result_show = false
        let obj = event.target.files[0]
         let url = ''
        if (this.fail_type = 'lease') {
          url = `${this.BASE_URL}m2c.trading/web/withdrawal/importRentWithdrawal`
        } else if (this.fail_type = 'BD') {
          url = `${this.BASE_URL}m2c.trading/web/withdrawal/importBDSalaryWithdrawal`
        }
        var formData = new FormData()
        formData.append('file', obj)
        this.file_upload(formData,url)
      },
      // 文件上传
      file_upload(formData,url) {
        let that = this
        formData.append('userId', JSON.parse(sessionStorage.getItem('userInfo')).userId)
        formData.append('userName', JSON.parse(sessionStorage.getItem('userInfo')).userName)
        $.ajax({
          url: url,
          type: 'post',
          data: formData,
          /**
           *必须false才会自动加上正确的Content-Type
           */
          contentType: false,
          /**
           * 必须false才会避开jQuery对 formdata 的默认处理
           * XMLHttpRequest会对 formdata 进行正确的处理
           */
          processData: false,
          success: function(res) {
            console.log('上传结果',res)
            if (res.status != 200) {
              that.$message.error(res.errorMessage)
              return
            }
            if (res.status == 200) {
              if (res.content.errorCount > 0) {
                that.result_show = true
                that.resmess = res.content
              } else {
                that.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                that.get_withdrawal_info()
              }
            // that.result_show = true
              
              // alert("上传成功！")
              // that.$message({
              //   message: '上传成功！',
              //   type: 'success'
              // })
            }
          },
          error: function(err) {
            console.log(err)
            
            that.$message.error('上传失败，请稍后再试!')
          }
        })
      },
      // 打开新增结算弹窗
      addFinWit(){
        // 创建input
        this.input_show = true
        this.addFinWit_show = true
      },
      onChangeCurPage(page) {
        if(this.statu.wdStatus === '1') {
          this.datagrid.Pagination.current_page = page
        } else if (this.statu.wdStatus === '2') {
          this.datagrid2.Pagination.current_page = page
        } else if (this.statu.wdStatus === '3') {
          this.datagrid3.Pagination.current_page = page
        } else if (this.statu.wdStatus === '4') {
          this.datagrid4.Pagination.current_page = page
        }
        this.get_withdrawal_info()
      },
      onChangeCurPageSize(pageSize) {
        if(this.statu.wdStatus === '1') {
          this.datagrid.Pagination.page_size = pageSize
        } else if (this.statu.wdStatus === '2') {
          this.datagrid2.Pagination.page_size = pageSize
        } else if (this.statu.wdStatus === '3') {
          this.datagrid3.Pagination.page_size = pageSize
        } else if (this.statu.wdStatus === '4') {
          this.datagrid4.Pagination.page_size = pageSize
        }
        this.get_withdrawal_info()
      },
      // 打印凭证
      printVoucher (opts) {
        sessionStorage.setItem('status', this.statu.wdStatus)
        sessionStorage.setItem('PrintVoucher', opts.data.withdrawalId)
        this.$router.push({path: '/m/withdrawalManage/printVoucher'})
      },
      // 切换
      handleClick(tab, event) {
        this.reset()
        this.get_withdrawal_info()
      },
      // 重置
      reset () {
        this.withdrawal_search_params = {withdrawalId: '', correlationName: '', correlationType: '', beginTime: '', endTime: ''}
        this.time = ''
      },
      // 获取订单结算列表
      get_withdrawal_info () {
        if (this.time !== null && this.time !== '') {
          this.withdrawal_search_params.beginTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.withdrawal_search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        if(this.statu.wdStatus === '1') {
          this.form.rows = this.datagrid.Pagination.page_size
          this.form.pageNum = this.datagrid.Pagination.current_page
        } else if (this.statu.wdStatus === '2') {
          this.form.rows = this.datagrid2.Pagination.page_size
          this.form.pageNum = this.datagrid2.Pagination.current_page
        } else if (this.statu.wdStatus === '3') {
          this.form.rows = this.datagrid3.Pagination.page_size
          this.form.pageNum = this.datagrid3.Pagination.current_page
        } else if (this.statu.wdStatus === '4') {
          this.form.rows = this.datagrid4.Pagination.page_size
          this.form.pageNum = this.datagrid4.Pagination.current_page
        }
        this.api_businessManagePlatform_getPlatformList ({ 
          data: Object.assign({}, this.withdrawal_search_params, this.statu, this.form, {
            token: sessionStorage.getItem("access_token")
          }),
        }).then(res => {
          if(res.content.length>0) {
            res.content.map((item,index)=> {
              if(item.type === '') {
                res.content[index].type = '商城销售'
              }
            })
          }
          if (res.content === '') {
            res.content = []
          }
          if(this.statu.wdStatus === '1') {
            this.datagrid.List = res.content
            this.datagrid.Pagination.total = res.totalCount
          } else if (this.statu.wdStatus === '2') {
            this.datagrid2.List = res.content
            this.datagrid2.Pagination.total = res.totalCount
          } else if (this.statu.wdStatus === '3') {
            this.datagrid3.List = res.content
            this.datagrid3.Pagination.total = res.totalCount
          } else if (this.statu.wdStatus === '4') {
            this.datagrid4.List = res.content
            this.datagrid4.Pagination.total = res.totalCount
          }
        })
      },
      // 同意
      operateAgree (opts) {
        let that = this
        this.$confirm('是否同意申请?', '', {
          confirmButtonText: '同意',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api_businessManagePlatform_applicationAgree ({ 
            data: {
              withdrawalId: opts.data.withdrawalId,
              updatedUserId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              updatedUserName:JSON.parse(sessionStorage.getItem('userInfo')).userName
            },
          }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功' 
            })
            this.get_withdrawal_info()
          })
          }).catch(() => {        
        })
      },
      // 拒绝
      operateFefuse (opts) {
        let that = this
        this.$prompt('请填写拒绝理由', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,100}$/,
          inputErrorMessage: '拒绝理由长度不超过100个字符'
        }).then(({ value }) => {
          this.api_businessManagePlatform_applicationRefuse ({ 
            data: {
              withdrawalId: opts.data.withdrawalId,
              updatedUserId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              updatedUserName:JSON.parse(sessionStorage.getItem('userInfo')).userName,
              rejectReason: value
            },
          }).then(res => {
            this.$message({
              type: 'success',
              message: '已拒绝' 
            })
            this.get_withdrawal_info()
          })
        }).catch(() => {    
        })
      },
      // 确认打款操作
      confirm(opts) {
        let that = this
        that.$confirm('是否确认打款?', '', {
          confirmButtonText: '同意',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            type:'post',
            url: that.BASE_URL + 'm2c.trading/web/withdrawal/transfer',
            data: {
              withdrawalId: opts.data.withdrawalId,
              updatedUserId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              updatedUserName:JSON.parse(sessionStorage.getItem('userInfo')).userName
            },
            headers: {
              'access_token': sessionStorage.getItem('access_token')
            },
            success: function (result) {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.get_withdrawal_info()
            }
          })
        }).catch(() => {        
        })
      },
      // 备注
      note (opts) {
        let that = this
        this.$prompt('请输入备注', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:opts.data.comment,
          inputPattern:  /^.{1,100}$/,
          inputErrorMessage: '备注长度不超过100个字符'
          // inputPlaceholder:'请填写'
        }).then(({ value }) => {
          this.api_businessManagePlatform_setRemarks ({ 
            data: {
              withdrawalId: opts.data.withdrawalId,
              comment: value,
              updatedUserId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              updatedUserName:JSON.parse(sessionStorage.getItem('userInfo')).userName
            },
          }).then(res => {
            this.$message({
              type: 'success',
              message: '备注成功' 
            })
            this.get_withdrawal_info()
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });       
        })
      },
      // 导出已打款的记录
      derive () {
        let that = this
        let url = that.BASE_URL + 'm2c.trading/web/withdrawal/platform/export?withdrawalId='+that.withdrawal_search_params.withdrawalId+'&access_token='+sessionStorage.getItem('access_token')+'&correlationName='+that.withdrawal_search_params.correlationName+'&correlationType='+that.withdrawal_search_params.correlationType+'&beginTime='+that.withdrawal_search_params.beginTime+'&endTime='+that.withdrawal_search_params.endTime
        location.href=url
      },
    },
    mounted () {
      let that = this
      that.get_withdrawal_info()
    },
    destroyed () {
      window.handle = null
    }
  }
</script>
<style lang="scss" scoped>
  .top{
    margin: 0 0 15px 0;
    .left {
      margin-left:20px;
      .mess{
         line-height: 52px;
         color:#67C23A;
      }
    }
    .right{
      margin-left:40px;
      .mess{
         line-height: 52px;
         color:#F56C6C;
      }
      p{
        line-height: 52px;
        color:#409EFF;
        cursor: pointer;
      }
    }
  }
</style>

