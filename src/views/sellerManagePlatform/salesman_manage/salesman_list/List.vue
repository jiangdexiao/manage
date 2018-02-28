<template>
  <div class="list">
    <div class="toolbar">
       <el-select v-model="search_params.staffStatus" placeholder="状态">
        <el-option
          v-for="reply in staffStatusArray"
          :key="reply.value"
          :label="reply.label"
          :value="reply.value">
        </el-option>
      </el-select>
      <el-date-picker style='padding-bottom:1px;'
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input type="text" placeholder="输入业务员手机号/姓名" :maxlength="100" v-model="search_params.filter" title="输入业务员手机号/姓名"></el-input> 
      <el-button type="primary" size="medium" @click="getSalesmanList()" class="btn-search">搜索</el-button>
    </div>
    <div class="toolbar btnbar">
      <el-button type="primary" class="add" size="medium" @click="addNew(1)">新增</el-button>
      <el-button type="primary" class="operation" icon="el-icon-download" size="medium" @click="exportSeller()">导出</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="salesmanData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
            <el-button type="text" @click.native="modify_td_click(scope.$index,scope.row,'detail')">详情</el-button>
            <el-button  v-if='scope.row.sellerCondition == 1'  type="text" @click.native="modify_td_click(scope.$index,scope.row,'forbid')">离职</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="sellerName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="sellerPhone"
        label="手机号"
        >
      </el-table-column>
      <el-table-column
        prop="goodsPrice"
        label="所属区域"
        >
        <template slot-scope="scope"><span >{{scope.row.sellerProvince}}{{scope.row.sellerCity}}{{scope.row.sellerArea}}</span></template>
      </el-table-column>
        <el-table-column
        prop=""
        label="状态"
        >
         <template slot-scope="scope">
           <span scope >{{ scope.row.sellerCondition ===1?'在职中':'已离职'}}</span>
           </template>
      </el-table-column>
      <el-table-column
        prop="createdDate"
        label="入职时间"
        >
      </el-table-column>
    </el-table>
    <div class="block fl" style="margin: 20px;">
        <el-pagination
          @size-change="goodsStoreHandleSizeChange"
          @current-change="goodsStoreHandleCurrentChange"
          :current-page="goodsStoreCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="goodsStorePageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsStoreTotalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
  export default {
    data () {
      return {
        addSellerId:'',
        hidePassINP:false,
        time:'',
        salesmanData:[],
        goodsStorePageRows:10,
        goodsStoreCurrentPage:1,
        goodsStoreTotalCount:0,
        staffStatusArray: [{value: '', label: '状态'}, {value: '1', label: '在职中'}, {value: '2', label: '已离职'}],
        search_params: {filter: '', startTime: '', endTime: '',staffStatus:''},
        salemanInfo: [],
        sellerId: '',
        area_all_search: [],
        // isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
        //时间赋值
      checkMobile(){
        let that = this
        let reg = /^[1-9]\d*$/;
        if(!reg.test(that.salemanInfo.sellerPhone)){
          that.salemanInfo.sellerPhone = ''
        }
      },
        timeCheck () {
        let that = this
        if(that.time != null){
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        }else{
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
        goodsStoreHandleCurrentChange(val) {
        let that = this
        that.goodsStoreCurrentPage=val
        // that.isChangePage = true
        that.getSalesmanList();
      },
      goodsStoreHandleSizeChange(val) {
        let that = this
        that.goodsStorePageRows=val
        that.getSalesmanList();
      },
      addModifyShow () {
        let that = this
        that.addModify = that.$route.query.addModify
      },
      // 重置
      reset_add_modify_params () {
        this.salemanInfo = []
      },
      // 获取全部业务员信息
      getSalesmanList () {
        let that = this
        let parameter ={
        token:tool.cookie.getCookie('access_token'),
        filter:that.search_params.filter,
        startTime:that.search_params.startTime,
        endTime:that.search_params.endTime,
        isEncry: false,
        rows: that.goodsStorePageRows,       // 每页多少条数据
        pageNum: that.goodsStoreCurrentPage,    // 请求第几页
        sellerCondition:that.search_params.staffStatus,
      }
        that.api_sellerManagePlatform_getSalesmanList({data:parameter}).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          for(var i=0;i<res.content.length;i++){
              let d = new Date(res.content[i].createdDate)
              res.content[i].createdDate = tool.date.format(d, 'yyyy-MM-dd hh:mm:ss')
            }
          that.salesmanData = res.content 
          that.goodsStoreTotalCount = res.totalCount
          }
      })
      },
      // 表格上点击详情
      modify_td_click (index,row,type) {
        let that = this
        if(type==='detail'){
          // 跳转到业务员编辑 新增页面
           this.$router.push({name:'s_salesman_addModify',query:{
           isAdd:false,from:'salesmanList',fromSellerId:row.sellerId
           }})
        }else{ // 离职 确认弹框
           this.$confirm('员工离职后无法登录系统', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
          // 发送离职请求
          console.log('row.sellerId-----------',row.sellerId);
          this.api_sellerManagePlatform_turnOffPermissions({
            data:{sellerId:row.sellerId}
            }).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.$message({ type: 'success', message: '禁用成功!'});
            this.getSalesmanList()
            }else{
            this.$message({ type: 'success', message: '禁用失败!'});
            }
        })
         }).catch(() => {
           this.$message({
             type: 'info',
             message: '已取消'
           });          
         });
        }
      },
      addNew () {
        let that = this
        that.hidePassINP =true
        that.isAdd = true
        // // 生成业务员id
        //  that.api_sellerManagePlatform_getSalesmanId({
        //    data: {token:tool.cookie.getCookie('access_token')}
        // }).then(res=>{
        //   if(res==undefined){ return false
        //   }else if(res.status == '200'){
        //     that.sellerId = res.content
        //     console.log('addSellerId---------------',that.sellerId)
        //    that.$router.push({name:'s_salesman_addModify',query:{ isAdd:true,addSellerId: that.sellerId }})
        //     }
        // })
        that.$router.push({name:'s_salesman_addModify',query:{ isAdd:true,}})
      },
      // 导出Excel文件
      exportSeller () {
        let that = this
        let url=this.BASE_URL + 'm2c.scm/seller/sys/admin/exportSeller?filter='+that.search_params.filter+'&startTime='+that.search_params.startTime+"&endTime="+that.search_params.endTime+'&access_token='+sessionStorage.getItem('access_token')
        if(!that.tool.permission.permission('scm:seller:export')){
          this.$message('无权限访问接口')
          return
        }
        window.location.href=url
      }
    },
    mounted () {
      let that = this
      that.getSalesmanList()
      that.addModifyShow()
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../../../static/css/main.sellerManage.css";
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 200px;
        height: 36px;
        color:black;
        border:1px solid   rgb(216, 220, 228) ;
        border-radius:5px;
        text-indent:1em;
      }
      input::-webkit-input-placeholder{
        color:rgb(205, 200, 213);
      }
      input:-moz-placeholder{
        color:rgb(205, 200, 213);
      }
      input::-ms-input-placeholder{
        color:rgb(205, 200, 213);
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 7px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 7px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      position: relative;
      .bootstrap-table {
        margin: 0;
      }
      [tableexport-id] {
        width: 120px;
        height: 25px;
        color: #fff;
        line-height: 25px;
        border-radius: 2px;
        border: none;
        margin-bottom: 12px;
        position: absolute;
        top: 10px;
        left: 134px;
        background: #F56C6C;
      }
      .public_button {
        width: 120px;
        height: 25px;
        color: #fff;
        border-radius: 2px;
        border: none;
      }
    }
</style>
