<template>
  <div class="list">
    <div v-show='!changeGoodShow'>
     <el-button type="primary" size="medium" @click="addUnit()">新增</el-button>
      <div style="margin-top:20px;">
        <el-table
          ref="multipleTable"
          :data="unitList"
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
            prop="unitName"
            label="计量单位">
          </el-table-column>
        </el-table>
        <div class="block fl" style="margin: 20px;">
          <el-pagination
            @size-change="unitSizeChange"
            @current-change="unitCurrentChange"
            :current-page="unitCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="unitPageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="unitTotalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- //新增分页 -->
    <div v-if="changeGoodShow" class="updataPage">
      <label for="exampleInputName2"><i class="red">*</i>计量单位名称：</label>
      <el-input v-model="newSize" :maxlength="10"  placeholder="1-10字符"></el-input>
      <el-button type="primary" size="medium" @click='changeUnitConfirm()'>保存</el-button>
      <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "",
    data() {
      return {
        unitPageRows: 10,
        unitCurrentPage: 1,
        unitTotalCount:0,
        changeGoodShow: false,
        // 新增/修改的数据
        add_modify_params: {
          unitId: "",
          unitName: "",
          unitNameEn: "",
          firstAreaName: "",
          twoAreaName: "",
          threeAreaName: "",
        },
        // 控制新增/修改的参数
        handle_toggle: "",
        newSize: "",
        unitList:[],
        unitId:''
      };
    },
    methods: {
       // 行数选择
    unitSizeChange(val) {
      let that = this
      that.unitPageRows=val
      that.getUnitList();
    },
    // 页数选择
    unitCurrentChange(val) {
      let that = this
      that.unitCurrentPage=val
      that.getUnitList();
    },
    // 表格操作
    handleCommand (index,row,action) {
      let that = this
      if (action === '_detail') { // 详情
        that.changeGoodShow = true;
        that.handle_toggle = "change";
        //获取到同行元素的上一个前一个元素的 html
        that.newSize=row.unitName
        that.unitId=row.unitId
      } else if (action === '_delete') { // 删除
        // 表格上点击删除
        that.delete_params = row
        that.deleteUnitConfirm()
      }
    },
      // 新增
      addUnit() {
        //只显示隐藏的新增界面
        let that = this;
        that.getStantardId()
        that.changeGoodShow = true;
        that.handle_toggle = "add";
        that.newSize = '';
      },
      // 修改保存
      changeUnitConfirm(row) {
        let that = this;
        // that.reset_add_modify_params_bind()
        // console.log('结果', that.add_modify_params_imgurl)
        console.log("获取到的Id"+that.add_modify_params.unitId);
        if('' == that.newSize){
          that.$message.error('计量单位名不能为空');
        }
       this.api_sellerManagePlatform_changeUnitConfirm({ 
          type:this.handle_toggle === "add" ? "post" : "put",
          data:{
          unitName: this.newSize,
           unitId:  this.unitId
          }
        }).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            that.changeGoodShow = false;
            that.handle_toggle = "add";
            that.getUnitList(that.pageNo);
          }else{
            this.$message.error(res.errorMessage);
          }
        })
      },
      getStantardId(){
        this.api_sellerManagePlatform_getUnitId({}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.unitId = res.content;
          }else{
            this.$message.error(res.errorMessage);
          }
        })
      },
      // 删除确认
      deleteUnitConfirm() {
        let that = this
        this.$confirm('是否删除计量单位', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          this.api_sellerManagePlatform_deleteUnitConfirm({
            pathParams:'?unitId='+this.delete_params.unitId
          }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              this.unitId = res.content;
              this.$message('删除成功');
              this.getUnitList(that.pageNo)
            }else{
              this.$message.error(res.errorMessage);
            }
          })
        }).catch(() => {
          that.getUnitList();
        });
      },
      // 获取计量单位列表
      getUnitList() {
        this.api_sellerManagePlatform_getUnitList({
          data:{rows: this.unitPageRows, // 每页多少条数据
            pageNum: this.unitCurrentPage // 请求第几页
          },
        }).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.unitList=res.content;
            this.unitTotalCount = res.totalCount
          }else{
            
          }
        })
      },
      //返回
      goBack() {
        window.history.go(0);
      }
    },
    mounted() {
      this.getUnitList()
    }
  };
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
 .updataPage{font-size:14px;color:#666;}
</style>