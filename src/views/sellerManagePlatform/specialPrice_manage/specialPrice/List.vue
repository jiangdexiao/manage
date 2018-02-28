<template>
  <div class="list">
    <div class="toolbar">
      <el-select v-model="search_params.orderStatus">
        <el-option
          v-for="orderStatu in orderStatuses"
          :key="orderStatu.value"
          :label="orderStatu.label"
          :value="orderStatu.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input v-model="search_params.condition" :maxlength="100"  placeholder="输入商家名称/商品名称"></el-input>
      <el-button type="primary" size="medium" @click="get_good_info()" class="btn-search">搜索</el-button>
    </div>
    <div class="toolbar btnbar">
      <router-link :to="{name:'s_specialPrice_modify',query:{handle_toggle:'add'}}"><el-button type="primary" size="medium" style="margin-top:7px;">新增</el-button></router-link>
    </div>
    <el-table
      :data="dataList"
      style="width:100%">
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-col :span="12">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="handleCommand(scope.$index, scope.row,'_detail')">详情</el-dropdown-item>
                <el-dropdown-item v-if='scope.row.status!=2' @click.native="handleCommand(scope.$index, scope.row,'_edit')">编辑</el-dropdown-item>
                <el-dropdown-item  v-if='scope.row.status!=2' @click.native="handleCommand(scope.$index, scope.row,'_delete')">终止</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称">
        <template slot-scope="scope">
          <a class="ellipsis" :title="scope.row.goodsName">{{scope.row.goodsName}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="specialPriceMin"
        label="特惠价/元">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
         <template slot-scope="scope">
          <el-col :span="12">
              <span>{{scope.row.status ==0?'未生效':scope.row.status ==1?'已生效':scope.row.status ==2?'已失效':"--"}}</span>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        label="商家信息">
        <template slot-scope="scope">
          <a class="ellipsis" :title="scope.row.dealerName">{{scope.row.dealerName}}</a>
        </template>
      </el-table-column>
      <el-table-column
      <el-table-column
         prop="availableTime" width="260"
        label="有效时间">
      </el-table-column>
    </el-table>
    <div class="block" style="margin:20px;float:left">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageRows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 终止确认框-->
    <!-- <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width=20%
      :modal-append-to-body="false" >
      <span v-if= 'tipsStatus===0'> 特惠价未生效,是否终止？</span>
      <span v-if= 'tipsStatus===1'> 特惠价生效中,是否终止？</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="delete_confirm()">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      tipsStatus:'',
      dialogVisible:false, // 确认终止弹框显示
      orderStatuses:[{value:'',label:'全部状态'},{value:'0',label:'未生效'},{value:'1',label:'已生效'},{value:'2',label:'已失效'}],
      time:[],
      dataList:[],
      currentPage:1,
      pageRows:10,
      totalCount:0,
      search_params: { orderStatus: '', startTime: '', endTime: '', condition: ''},
    }
  },
  methods: {
    // 时间赋值
    timeCheck () {
      let that = this
      if (that.time != null) {
        that.search_params.startTime = that.time[0]
        that.search_params.endTime = that.time[1]
      } else {
        that.search_params.startTime = ''
        that.search_params.endTime = ''
      }
    },
    sizeChange(val){
      let that = this
      that.pageRows = val
      that.get_good_info()
    },
    currentChange(val){
      let that = this
      that.currentPage = val
      that.get_good_info()
    },
    // 行操作
    handleCommand (index ,row, action) {
      let that = this
      sessionStorage.setItem('specialId', row.specialId)
      sessionStorage.setItem('dealerId', row.dealerId)
      if (action === '_detail') {
        //详情  跳转到详情页面
        that.$router.push({name:'s_specialPrice_info'})
      } else if (action === '_edit') {
        //修改
        that.$router.push({name:'s_specialPrice_modify',query:{handle_toggle:'modify',specialId:row.specialId,status:row.status}})
      } else if (action === '_delete') {
        //删除
       that.tipsStatus= row.status
       this.$confirm(that.tipsStatus===0?'特惠价未生效,是否终止？':'特惠价生效中,是否终止？')
        .then(_ => {
          that.delete_confirm()
        })
        .catch(_ => {});
      }
    },
    //  获取特惠价列表数据
    get_good_info() {
      let that = this
      that.api_sellerManagePlatform_getSpecialPriceList({
        data: {
          status: that.search_params.orderStatus,
          startTime:that.search_params.startTime,
          endTime:that.search_params.endTime,
          searchMessage:that.search_params.condition,
          pageNum:that.currentPage, // 请求第几页
          rows:that.pageRows, // 每一页多少数据
        }
      }).then(result=>{
        console.log(result.content)
        if(result==undefined){
          return false
        }else if(result.status == '200'){
          for(var i = 0 ;i < result.content.length;i++){
            // 时间戳日期转换
            result.content[i].startTime = this.tool.date.format(new Date(result.content[i].startTime), 'yyyy-MM-dd')
            result.content[i].endTime = this.tool.date.format(new Date(result.content[i].endTime), 'yyyy-MM-dd')
            // 表格中的有效期 给定新的变量
            result.content[i].availableTime = result.content[i].startTime+" 至 "+result.content[i].endTime
            // 特惠价 金额转换
            result.content[i].specialPriceMin=(result.content[i].specialPriceMin)
          }
          that.dataList = result.content == ''?[]:result.content
          that.totalCount = result.totalCount
        }
      })
      // that.$.ajax({
      //   type:"get",
      //   url: that.base + 'm2c.scm/goods/special/list',
      //   data: {
      //     token: sessionStorage.getItem('mToken'),
      //     status: that.search_params.orderStatus,
      //     startTime:that.search_params.startTime,
      //     endTime:that.search_params.endTime,
      //     searchMessage:that.search_params.condition,
      //     pageNum:that.currentPage, // 请求第几页
      //     rows:that.pageRows, // 每一页多少数据
      //   },
      //   success: function (result) {
      //     for(var i = 0 ;i < result.content.length;i++){
      //         // 时间戳日期转换
      //         result.content[i].startTime = that.date_format(new Date(result.content[i].startTime),'yyyy-MM-dd')
      //         result.content[i].endTime = that.date_format(new Date(result.content[i].endTime), 'yyyy-MM-dd')
      //         // 表格中的有效期 给定新的变量
      //         result.content[i].availableTime = result.content[i].startTime+" 至 "+result.content[i].endTime
      //         // 特惠价 金额转换
      //         result.content[i].specialPriceMin=(result.content[i].specialPriceMin)
      //     }
      //     that.bindsList = result.content == ''?[]:result.content
      //     that.totalCount = result.totalCount
      //   }
      // })
    },
    // 确认终止
      delete_confirm(){
        let that =this
        that.api_sellerManagePlatform_postSpecialPriceEnd({
            pathParams:'/'+sessionStorage.getItem('specialId')
          }).then(result=>{
          console.log(result.content)
          if(result==undefined){
            return false
          }else if(result.status == '200'){
            that.$message("终止成功!")
            that.dialogVisible = false
            that.get_good_info()
          }else{
            that.$message("终止失败!")
            that.dialogVisible = false
          }
        })
      },
  },
  mounted () {
    let that = this
    that.get_good_info()
  }
}
</script>
<style scoped>
a{color:#666;}
</style>
