<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="用户电话/姓名" v-model="search_params.user" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="客服电话/姓名" v-model="search_params.staff" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.cate" placeholder="选择类型" clearable>
              <el-option label="使用" value="1"></el-option>
              <el-option label="订单" value="2"></el-option>
              <el-option label="发货" value="3"></el-option>
              <el-option label="支付" value="4"></el-option>
              <el-option label="投诉" value="5"></el-option>
              <el-option label="反馈建议" value="6"></el-option>
              <el-option label="其他" value="7"></el-option>
              <el-option label="未分派" value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.status" placeholder="选择状态" clearable>
              <el-option label="待处理" value="1"></el-option>
              <el-option label="完成" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              unlink-panels
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
            <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @see="see"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
    <Edit :isShow="isShow" :data="data" :addModifyToggle="addModifyToggle" :saveSuccess="Save_Success" ></Edit>
    <el-dialog
      :title="addModifyToggle==='follow'?'跟进投诉':'查看投诉'"
      custom-class='dialog'
      :visible.sync="follow_see_show"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="follow_see_params" label-width="100px">
            <el-form-item label="用户" prop="userPhone">
              {{follow_see_params.userPhone+' '+'/'+' '+follow_see_params.userName}}
            </el-form-item>
            <el-form-item label="反馈类型" prop="cate" v-if="addModifyToggle==='follow'">
              <el-select v-model="follow_see_params.cate"  placeholder="反馈类型">
                <el-option v-for="(item,i) in cate_match" :key="i" :value="i" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="反馈类型" prop="cate" v-if="addModifyToggle==='see'">
              {{cate_match[follow_see_params.cate]}}
            </el-form-item>
            <el-form-item label="反馈内容" prop="content">
              <textarea type="text"  readonly="readonly" class="textarea_upgTip" :maxlength="200" v-model="follow_see_params.content"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="addModifyToggle==='follow'">
              <el-select v-model="follow_see_params.status"  placeholder="选择状态">
                <el-option label="待处理" :value="1"></el-option>
                <el-option label="完成" :value="2"></el-option>
              </el-select>>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="addModifyToggle==='see'">
              {{follow_see_params.status===1?'待处理':follow_see_params.status===2?'完成':''}}
            </el-form-item>
            <el-form-item label="处理备注" prop="remarks" v-if="addModifyToggle==='follow'">
              <textarea type="text" class="textarea_upgTip" :maxlength="50" v-model="follow_see_params.remarks"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
            </el-form-item>
            <el-form-item label="处理备注" prop="remarks" v-if="addModifyToggle==='see'">
              <textarea type="text" readonly="readonly" class="textarea_upgTip" :maxlength="50" v-model="follow_see_params.remarks"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
            </el-form-item>
          </el-form>
        </el-col>
        <div v-for="(cell,index) in follow_see_params.feedbackList" class="feedbacklist" :key="index">
          <div class="text-left feedbacklist_title"><b>第{{follow_see_params.feedbackList.length-index}}次跟进</b></div>
          <div class="">
            <div class="public_status">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态</div>
            <div class="public_status">{{cell.status===1?'待处理':'完成'}}</div>
          </div>
          <div class="">
            <div class="public_status">处理备注</div>
            <textarea type="text" class="public_status"
                placeholder="" readonly="readonly" style="width:260px;height:70px;resize:none;padding: 10px;font-family:Helvetica Neue;color:#5a5e66;" v-model="cell.remarks"></textarea>
          </div>
          <div class="">
            <div class="public_status">{{cell.serviceStaffPhone}}&nbsp;&nbsp;&nbsp;&nbsp;{{cell.serviceStaffName}}</div>
            <div class="public_status">{{tool.date.format(new Date(cell.date),'yyyy-MM-dd hh:mm:ss')}}</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" v-show="addModifyToggle!=='see'">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="complaintFollow" >保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import Edit from "./Edit.vue"
import { tool } from "../../../../utils/"
export default {
  components: {Edit},
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 80,
            btns: [
              { text: "跟进", eventName: "edit", condition:function({data}){ return data.cStatus !== 2 }, style: "color:#A2584E" },
              { text: "查看", type: "danger", eventName: "see" }
            ]
          },
          { key: "complaintId", label: "ID", width: 80, tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.complaintId, 5)
          }},
          { label: "用户", width: 210, formatter: function (row,column,cellValue) {
            return row.userPhone + ' / ' + row.userName
          }},
          { key: "content", label: "反馈内容", width: 428, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.content, 50)
          }},
          { key: "cate", label: "类型", width: 80, formatter: function (row,column,cellValue) {
            switch (row.cate) {
              case 1:
                return '使用'
              case 2:
                return '订单'
              case 3:
                return '发货'
              case 4:
                return '支付'
              case 5:
                return '投诉'
              case 6:
                return '反馈建议'
              case 7:
                return '其他'
              case 8:
                return '未分派'
              case null:
                return '-'
            }
          }},
          { key: "cStatus", label: "状态", width: 70, formatter: function (row,column,cellValue) {
            return row.cStatus === 1 ? '待处理' : row.cStatus === 2 ? '完成' : '-'
          },style:function(row){
            let style = ''
            switch (row.cStatus) {
              case 1:
                style = `color:red;`;
                break;
            }
            return style;
          }},
          { key: "remarks", label: "最新备注", width: 200, tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.remarks, 20)
          }},
          { label: "客服", width: 170, formatter: function (row,column,cellValue) {
            if (row.staffPhone || row.staffName) {
              return row.staffPhone + ' ' + ' ' + row.staffName
            } else {
              return '未分派'
            }
          }},
          { key: "updatedDate", label: "最新修改时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.updatedDate,'yyyy-MM-dd hh:mm')
          }},
          { key: "createdDate", label: "新增时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.createdDate,'yyyy-MM-dd hh:mm')
          }}
        ],
        ToolBar: [
          { text: "新增", eventName: "onClickBtnAdd" },
          { text: "跟进", eventName: "onClickBtnEdit" },
          { text: "查看", eventName: "onClickBtnDelete" }
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        }
      },
      form: {
      },
      search_params: {user: '', staff: '', cate: '', status: '', regisDateStart: '', regisDateEnd: ''},
      add_params: {userPhone: '', userName: '', cate: '', content: '', status: '', remarks: ''},
      follow_see_params: {userPhone: '', userName: '', cate: '', content: '', status: '', remarks: ''},
      addModifyToggle: '',
      cate_match: {'1': '使用', '2': '订单', '3': '发货', '4': '支付', '5': '投诉', '6': '反馈建议', '7': '其他', '8': '未分派'},
      time:'',
      follow_see_show: false,
      isShow: false,
      data: null
    };
  },
  watch: {
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.search_params.publishDateStart = ''
          that.search_params.publishDateEnd = ''
        }
      },
      deep: true
    }
  },
  methods: {
    Save_Success() {
      console.log("保存成功");
    },
    handleClose() {
      this.follow_see_show = false
      this.follow_see_params = {userPhone: '', userName: '', cate: '', content: '', status: '', remarks: ''}
    },
    onClickSearch() {
      this.init();
    },
    edit(opts, selectIems) {
      this.addModifyToggle = 'follow'
      this.api_businessManagePlatform_getComplaint({ 
        data: {
          complaintId: opts.data.complaintId,
          token: sessionStorage.getItem('access_token')
        },
      }).then(res => {
        this.follow_see_params = {
          complaintId: res.content.complaintId,
          userPhone: res.content.userPhone,
          userName: res.content.userName,
          userId: res.content.userId,
          cate: res.content.cate,
          content: res.content.content,
          status: res.content.status,
          remarks: ' ',
          feedbackList: res.content.feedbackList ? res.content.feedbackList.reverse() : []
        }
        this.follow_see_show = true
      })
    },
    see(opts, selectIems) {
      this.addModifyToggle = 'see'
      this.api_businessManagePlatform_getComplaint({ 
        data: {
          complaintId: opts.data.complaintId,
          token: sessionStorage.getItem('access_token')
        },
      }).then(res => {
        console.log('zhi', res.content.cate)
        this.follow_see_params = {
          complaintId: res.content.complaintId,
          userPhone: res.content.userPhone,
          userName: res.content.userName,
          userId: res.content.userId,
          cate: res.content.cate,
          content: res.content.content,
          status: res.content.status,
          remarks: res.content.remarks,
          feedbackList: res.content.feedbackList ? res.content.feedbackList.reverse() : []
        }
        console.log('处理后', this.cate_match[this.follow_see_params.cate])
        this.follow_see_show = true
      })
    },
    //新增
    onClickBtnAdd(opts) {
      this.data = null
      this.isShow = true
      this.addModifyToggle = 'add'
    },
    // 跟进
    onClickBtnEdit(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        this.addModifyToggle = 'follow'
        this.edit({ data: selectItems.datas[0] })
      }
    },
    // 查看
    onClickBtnDelete(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        this.addModifyToggle = 'see'
        this.see({ data: selectItems.datas[0] })
      }
    },
    // 跟进提交
    complaintFollow () {
      this.api_businessManagePlatform_setComplaint({ 
        data: Object.assign({}, {
          token: sessionStorage.getItem('access_token'),
          serviceStaffPhone: JSON.parse(sessionStorage.getItem('userInfo')).telNo,
          serviceStaffId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
          serviceStaffName: JSON.parse(sessionStorage.getItem('userInfo')).userName
        }, this.follow_see_params),
      }).then(res => {
        this.handleClose()
        this.init()
      })
    },
    onChangeCurPage(page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.init();
    },
    onChangeCurPageSize(pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size = pageSize
      this.init();
    },
    init() {
      if (this.time !== null && this.time !== '') {
        this.search_params.publishDateStart = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
        this.search_params.publishDateEnd = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
      }
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_complaintList({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token
        }, this.form, this.search_params)
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted () {
    this.init()
  }
};
</script>

<style lang="scss" scoped>
.feedbacklist{
  overflow:hidden;
  width:70%;
  margin-left: 30px;
  // margin-right:auto;
  border:1px solid #CFCFCF;
  margin-bottom:10px;
  padding: 10px;
  .public_status{
    display: inline-block;
    margin-left: 10px;
  }
  .feedbacklist_title{margin-bottom:5px;}
}
</style>
