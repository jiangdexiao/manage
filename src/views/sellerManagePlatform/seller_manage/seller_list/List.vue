<template>
  <div class="list">
    <div class="toolbar">
      <el-cascader
        :options="dealerclassifySelect" placeholder="商家类型"
        :props="dealerclassifyprops" expand-trigger="hover"
        v-model="selectedOptions" @change="handleItemChange"
      ></el-cascader>
      <el-select v-model="search_params.cooperationMode" placeholder="合作方式">
        <el-option
          v-for="cooperationMode in cooperationModes"
          :key="cooperationMode.value"
          :label="cooperationMode.label"
          :value="cooperationMode.value">
        </el-option>
      </el-select>
      <el-date-picker style="padding-bottom:1px;"
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker><!--时间-->
      <el-input v-model="search_params.filter" placeholder="输入商家名称/负责人手机号/业务员手机号" :maxlength="100"  title="输入商家名称/负责人手机号/业务员手机号"></el-input>
      <el-button type="primary" size="medium" @click="getDealerList()" class="btn-search">搜索</el-button>
      <a class="ml10 advanced" @click="searchBoxShow=!searchBoxShow">高级搜索</a>
    </div>
    <div class="toolbar btnbar">
      <router-link :to="{name:'s_dealer_addModify',query:{handle_toggle:'add'}}"><el-button type="primary" size="medium">新增</el-button></router-link>
    </div>
    <div class="soloSearchBox" v-if="searchBoxShow">
      <h4>高级搜索<a class="close bg-ico_close" @click="searchBoxShow=!searchBoxShow"></a></h4>
      <div class="searcWrap mess">
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">关键词：</el-col>
          <el-col :span="9">
            <el-input v-model="search_params.filter" placeholder="输入商家名称/负责人手机号/业务员手机号" title="输入商家名称/负责人手机号/业务员手机号"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">注册时间：</el-col>
          <el-col :span="9">
            <el-date-picker style="padding-bottom:1px;"
              v-model="time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd"
              @change="timeCheck">
            </el-date-picker><!--时间-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">商家类型：</el-col>
          <el-col :span="9">
            <el-cascader
              :options="dealerclassifySelect"
              :props="dealerclassifyprops" expand-trigger="hover"
              v-model="selectedOptions" @change="handleItemChange"
            ></el-cascader>
          </el-col>
          <el-col :span="3" class="alginRight">合作方式：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.cooperationMode" placeholder="合作方式">
              <el-option
                v-for="cooperationMode in cooperationModes"
                :key="cooperationMode.value"
                :label="cooperationMode.label"
                :value="cooperationMode.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">结算方式：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.countMode" placeholder="结算方式">
              <el-option
                v-for="countMode in countModes"
                :key="countMode.value"
                :label="countMode.label"
                :value="countMode.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="alginRight">押金缴纳：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.isPayDeposit" placeholder="押金缴纳">
              <el-option
                v-for="isPayDeposit in isPayDeposits"
                :key="isPayDeposit.value"
                :label="isPayDeposit.label"
                :value="isPayDeposit.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="20" :offset="3">
            <el-button type="primary" size="medium" @click="getDealerList()" class="btn-search">搜索</el-button>
            <el-button size="medium" @click="clear()">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="good_info">
      <el-table
        ref="multipleTable"
        :data="dealerList"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-col :span="12">
              <router-link class="aBlue" :to="{name:'s_dealer_addModify',query:{handle_toggle:'modify',dealerId:scope.row.dealerId}}">
                详情
              </router-link>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          prop="dealerName"
          label="商家信息"
          width="200">
        </el-table-column>
        <el-table-column
          label="管理员"
          width="150">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span><br />
            <span>{{scope.row.userPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商家类型"
          width="200">
          <template slot-scope="scope">
            <span>{{scope.row.dealerFristClassifyName}}>{{scope.row.dealerSecondClassifyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="合作方式">
          <template slot-scope="scope"><span >{{scope.row.cooperationMode === 1 ? '包销' : scope.row.cooperationMode === 2 ? '代销' : scope.row.cooperationMode === 3 ? '经销' : scope.row.cooperationMode === 4 ? '入驻' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结算方式">
          <template slot-scope="scope"><span >{{scope.row.countMode === 1 ? '按供货价' : '按服务费率'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属区域">
          <template slot-scope="scope">
            <span>{{scope.row.dealerProvince}}<br />{{scope.row.dealerCity}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务员信息">
          <template slot-scope="scope">
            <span>{{scope.row.sellerName}}</span><br />
            <span>{{scope.row.sellerPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="注册时间">
        </el-table-column>
      </el-table>
      <div class="block fl" style="margin: 20px;">
        <el-pagination
          @size-change="dealerSizeChange"
          @current-change="dealerCurrentChange"
          :current-page="dealerCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="dealerPageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dealerTotalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
export default {
  data () {
    return {
      selectedOptions:[''],
      dealerclassifySelect: [], // 商家类别一级
      dealerclassifyprops: {
        value: 'dealerClassifyId',
        children: 'child',
        label:'dealerClassifyName',
      }, // element 级联选择器
      search_params: {dealerClassify: '', filter: '', countMode: '', isPayDeposit: '', cooperationMode: '', startTime: '', endTime: ''},// 搜索参数
      cooperationModes:[{value:'',label:'合作方式'},{value:'1',label:'包销'},{value:'2',label:'代销'},{value:'3',label:'经销'},{value:'4',label:'入驻'}],// 合作模式
      countModes:[{value:'',label:'结算方式'},{value:'1',label:'按供货价'},{value:'2',label:'按服务费率'}], // 结算方式
      isPayDeposits:[{value:'',label:'押金缴纳'},{value:'0',label:'已缴纳'},{value:'1',label:'未缴纳'}],// 是否缴纳
      time:[],
      searchBoxShow:false, //高级搜索盒子显示隐藏
      dealerList:[], //表格
      dealerPageRows: 10,
      dealerCurrentPage: 1,
      dealerTotalCount:0,
      // isChangePage: false, //搜索时是否是页码切换请求 以判断是否要重置页码
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
    // 换显示条数
    dealerSizeChange(val) {
      let that = this
      that.dealerPageRows=val
      that.getDealerList();
    },
    // 换显示页码
    dealerCurrentChange(val) {
      let that = this
      that.dealerCurrentPage=val
      // that.isChangePage = true
      that.getDealerList();
    },
    // 商家分类
    handleItemChange(){
      this.search_params.dealerClassify=this.selectedOptions[this.selectedOptions.length-1]
      console.log(this.search_params.dealerClassify)
    },
    // 获取商家分类
    getDealerclassify(){
      this.api_sellerManagePlatform_getDealerclassify({}).then(res=>{
        if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.dealerclassifySelect = res.content
            this.dealerclassifySelect.unshift({"dealerClassifyId":'',"dealerClassifyName":"商家类型" });
          }
      })
    },
    // 获取列表信息
    getDealerList(){
      // if(!this.isChangePage){
      //   this.dealerCurrentPage = 1
      // }
      let a = {
        rows: this.dealerPageRows,    // 每页多少条数据
        pageNum: this.dealerCurrentPage,    // 请求第几页
        filter: this.search_params.filter.replace(/\s+/g,""),
      }
      this.api_sellerManagePlatform_getDealerList({data:Object.assign(this.search_params,a)}).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          var resultData = res.content
          this.dealerTotalCount = res.totalCount;
          this.dealerList= resultData;
          for(var i=0;i<resultData.length;i++){
            let d = new Date(resultData[i].createdDate)
            this.dealerList[i].createdDate = this.tool.date.format(d, 'yyyy-MM-dd hh:mm')
          }
          this.searchBoxShow = false
        }
      })
      // this.isChangePage = false
    },
    // 搜索重置
    clear () {
      let that = this
      that.search_params = {dealerClassify: '', filter: '', countMode: '', isPayDeposit: '', cooperationMode: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime')}
      that.selectedOptions = []
      that.time = ''
    },
  },
  mounted () {
    this.getDealerclassify()
    this.getDealerList()
  },
  watch: {
    
  }
}
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
 a.advanced{color:#666;display:inline-block;margin:7px 0;}
  .soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2;
    h4{line-height: 50px;}
    h4 a.close{
      opacity:1;display:inline-block;width:24px;height:24px;float:right; margin-right:20px;
    }
    .searcWrap{width:100%;height:auto;position:relative;}
    .alginRight{text-align: right; line-height:50px;color:#666;}
  }
  a.aBlue{color:#409EFF;}
  .mt20{margin-top:20px;}
</style>

