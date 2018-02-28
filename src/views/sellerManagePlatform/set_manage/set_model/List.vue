
<template>
<div class ="list">
    <div v-show='!changeGoodShow'>
      <el-button type="primary" size="medium" @click="addSize()">新增</el-button>
      <div style="margin-top:20px;">
        <el-table
          ref="multipleTable"
          :data="stantardList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-col :span="12">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            prop="stantardName"
            label="规格">
          </el-table-column>
        </el-table>
        <div class="block fl" style="margin: 20px;">
          <el-pagination
            @size-change="stantardSizeChange"
            @current-change="stantardCurrentChange"
            :current-page="stantardCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="stantardPageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="stantardTotalCount">
          </el-pagination>
        </div>
      </div>
   </div>
   <!-- //新增修改 -->
   <div v-if="changeGoodShow" class="updataPage">
      <label for="exampleInputName2"><i class="red">*</i>规格名称：</label>
      <el-input v-model="newSize" :maxlength="20"  placeholder="1-20字符"></el-input>
      <el-button type="primary" size="medium" @click='change_confirm()'>保存</el-button>
      <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
   </div>
</div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      stantardPageRows: 10,
      stantardCurrentPage: 1,
      stantardTotalCount:0,
      btnShow: true,
      goodInfoShow: false, // 详情盒子
      delectSizeBg: false, // 弹窗背景
      changeGoodShow: false,
      // 新增/修改的数据
      add_modify_params: {
        stantardId: "",
        stantardName: "",
        stantardNameEn: "",
        firstAreaName: "",
        twoAreaName: "",
        threeAreaName: "",
      },
      // 控制新增/修改的参数
      handle_toggle: "",
      newSize: "",
      pageNo:1,
      stantardList:[],
      stantardId:''
    };
  },
  methods: {
    // 行数选择
    stantardSizeChange(val) {
      let that = this
      that.stantardPageRows=val
      that.get_comment_info()
    },
    // 页数选择
    stantardCurrentChange(val) {
      let that = this
      that.stantardCurrentPage=val
      that.get_comment_info()
    },
    // 表格操作
    handleCommand (index,row,action) {
      let that = this
      if (action === '_detail') { // 详情
        that.changeGoodShow = true;
        that.handle_toggle = "change"
        //获取到同行元素的上一个前一个元的 html
        that.newSize=row.stantardName
        that.stantardId=row.stantardId
      } else if (action === '_delete') { // 删除
        // 表格上点击删除
        that.delete_params = row
        that.delete_confirm()
      }
    },
    // 新增
    addSize() {
      //只显示隐藏的新增界面
      let that = this;
      that.getStantardId()
      that.changeGoodShow = true
      that.handle_toggle = "add"
       that.newSize = ''
    },
    // 修改 保存
    change_confirm() {
      let that = this
      if('' == that.newSize){
        that.$message.error('计量单位名不能为空');
      }
      this.api_sellerManagePlatform_changeStantardConfirm({
        type:this.handle_toggle === "add" ? "post" : "put",
        data:{
          stantardId:that.stantardId,
          stantardName: that.newSize
        }
      }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.changeGoodShow = false
          that.handle_toggle = "add"
          that.get_comment_info(that.pageNo)
        }else{
          this.$message.error(res.errorMessage);
        }
      })
        // that.$.ajax({
        //   type: that.handle_toggle == "add" ? "post" : "put",
        //   data: {
        //     token: sessionStorage.getItem("mToken"),
        //     stantardId:that.stantardId,
        //     stantardName: that.newSize
        //   },
        //   success: function(result) {
        //     if(result.status === 200) {
        //       that.changeGoodShow = false
        //       that.handle_toggle = "add"
        //       that.get_comment_info(that.pageNo)
        //     }else{
        //       that.show_tip(result.errorMessage)
        //     }
        //   }
        // });
    },
    // 删除确认
    delete_confirm() {
      let that = this
      this.$confirm('是否删除规格', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        // type: 'warning'
      }).then(() => {
        this.api_sellerManagePlatform_deleteStantardConfirm({
          pathParams:'?stantardId='+that.delete_params.stantardId
        }).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.unitId = res.content;
            this.$message('删除成功');
            that.get_comment_info(that.pageNo);
          }else{
            this.$message.error(res.errorMessage);
            that.get_comment_info(that.pageNo);
          }
        })
      }).catch(() => {
        that.get_comment_info(that.pageNo);
      })
      // that.$.ajax({
      //   type: "delete",
      //   url: that.localbase + 'm2c.scm/stantard/mng?stantardId=' +that.delete_params.stantardId,
      //   data: {
      //     token: sessionStorage.getItem("mToken"),
      //   },
      //   success: function(result) {
      //     if(result.status == 200) {
      //       that.show_tip("删除成功")
      //       that.get_comment_info(that.pageNo);
      //       that.delectSizeBg = false
      //     }else{
      //       that.show_tip(result.errorMessage)
      //       that.get_comment_info(that.pageNo);
      //       that.delectSizeBg = false
      //     }
      //   }
      // });
    },
    // 删除取消
    deleteSize() {
      let that = this;
      that.get_comment_info(that.pageNo);
      that.delectSizeBg = false
    },
    // 获取规格列表
    get_comment_info() {
      let that = this;
      this.api_sellerManagePlatform_getStantardList({
        data:{
          rows: that.stantardPageRows, // 每页多少条数据
          pageNum: that.stantardCurrentPage // 请求第几页
        },
      }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.stantardList=res.content;
          that.stantardTotalCount = res.totalCount
        }else{
          
        }
      })
      // that.$.ajax({
      //   type: 'GET',
      //   url: that.localbase + 'm2c.scm/stantard',
      //   data: {
      //     rows: that.stantardPageRows, // 每页多少条数据
      //     pageNum: that.stantardCurrentPage // 请求第几页
      //   },
      //   success: function (result) {
      //     if (result.status === 200){
      //       // 获取列表
      //       that.stantardList=result.content;
      //       that.stantardTotalCount = result.totalCount
      //     }
      //   }
      // })
    },
    //获取Id
    getStantardId(){
      let that = this;
      this.api_sellerManagePlatform_getStantardId({}).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.stantardId = res.content;
        }else{
          this.$message.error(res.errorMessage);
        }
      })
      // that.$.ajax({
      //   type: 'GET',
      //   url: that.localbase + 'm2c.scm/stantard/id',
      //   data: {
      //     token:sessionStorage.getItem("mToken"),
      //   },
      //   success: function (result) {
      //     if (result.status === 200) {
      //       // 获取列表
      //       that.stantardId = result.content;
      //     }else{
      //       that.show_tip(result.errorMessage)
      //     }
      //   }
      // })
    },
    //返回
    goBack() {
       window.history.go(0)
    },
  },
  mounted() {
    let that = this
    that.get_comment_info()
  }
};
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
 .updataPage{font-size:14px;color:#666;}
</style>