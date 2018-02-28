<template>
  <div class="list clear">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="商品库" name="first">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class=" toolbar btnbar">
            <el-cascader :options="goodsClassifys" v-model="selectedOptions1" change-on-select placeholder="商品分类"
                         :props="goodsClassifyProps"></el-cascader>
            <el-select v-model="search_goods_params.goodsStatus" placeholder="请选择商品状态">
              <el-option v-for="item in goodsStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker style="padding-bottom:1px;"
                            v-model="time"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                            @change="timeCheck">
            </el-date-picker>
            <el-input v-model="search_goods_params.condition"  :maxlength="100" placeholder="输入商品名称/编码/条形码/品牌"
                      title="输入商品名称/编码/条形码/品牌"></el-input>
            <el-button type="primary" size="medium" @click="goodsStoreSearch()" class="btn-search">搜索</el-button>
            <a class="ml10 advanced" @click="advancedSearch">高级搜索</a>
            <div class='toolbar btnbar'>
              <div style="width:100px;position:relative;display:inline-block" >
                <el-button type="default" size="medium" id="lotsOptionBtn" @click.stop='lotsOptionShow = !lotsOptionShow'>
                  批量操作
                </el-button>
                <div v-show='lotsOptionShow' class='lotsOptionShowStyle'>
                  <ul class=" el-select-dropdown__list" id="lotsOptionselection">
                    <li class="el-select-dropdown__item" @click.stop='lotsOptionGoods(1)'>批量上架</li>
                    <li class="el-select-dropdown__item" @click.stop='lotsOptionGoods(2)'>批量下架</li>
                  </ul>
                </div>
              </div>
              <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportSearch()">导出
              </el-button>
            </div>
          </div>
          <div class="soloSearchBox Advanced_s" v-show="advancedShow">
            <div class="">
              <h4>高级搜索<a @click="advancedShow=!advancedShow" class="close"></a></h4>
              <div class="searchWrap mess">
                <el-row :gutter="20">
                  <el-col :span="3" class="alginRight">关键词：</el-col>
                  <el-col :span="9" >
                     <el-input v-model="search_goods_params.condition" :maxlength="100" placeholder="输入商品名称/编码/条形码/品牌"
                              title="输入商品名称/编码/条形码/品牌"></el-input>
                  </el-col>
                  <el-col :span="3" class="alginRight">创建时间：</el-col>
                  <el-col :span="9" >
                    <el-date-picker style="padding-bottom:1px;"
                                  v-model="time"
                                  type="daterange"
                                  range-separator="-"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                  @change="timeCheck">
                      </el-date-picker>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3" class="alginRight">商品状态：</el-col>
                  <el-col :span="9" >
                     <el-select v-model="search_goods_params.goodsStatus" placeholder="请选择商品状态">
                      <el-option v-for="item in goodsStatus" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3" class="alginRight">广告图：</el-col>
                  <el-col :span="9" >
                     <el-select v-model="search_goods_params.recognizedStatus" placeholder="请选择广告图">
                      <el-option v-for="item in recognizedStatus" :key="item.value" :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3" class="alginRight">商品分类：</el-col>
                  <el-col :span="9" >
                    <el-cascader  :options="goodsClassifys" v-model="selectedOptions1" change-on-select placeholder="商品分类" :props="goodsClassifyProps"></el-cascader>
                  </el-col>
                </el-row >
                <el-row :gutter="20">
                    <el-col :span="20" :offset="3">
                      <el-button type="primary" size="medium" @click="goodsStoreSearch()" class="btn-search">搜索</el-button>
                      <el-button size="medium" @click="clearAll()">重置</el-button>
                  </el-col>
                </el-row >
                </div>
            </div>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsStoreData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChangeGoods"
            >
              <el-table-column
                type="selection"
                width="55"
              >
              </el-table-column>
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
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.goodsStatus!=1"
                                          @click.native="handleCommand(scope.$index, scope.row,'_soldout','a')">下架
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.goodsStatus==1"
                                          @click.native="handleCommand(scope.$index, scope.row,'_edit','a')">上架
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="300">
                <template slot-scope="scope"><img v-bind:src="scope.row.goodsImageUrl"
                                                  style="width: 60px;height: 60px;float:left;"/>
                  <a class="ellipsis2" :title="scope.row.goodsName">{{scope.row.goodsName}}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类"
                width="200">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                width="200"
                >
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                >
                <template slot-scope="scope"><span>{{scope.row.goodsPrice}}</span></template>
              </el-table-column>
              <el-table-column
                prop="stockNum"
                label="库存"
                >
              </el-table-column>
              <el-table-column
                prop="sellNum"
                label="销量"
                >
              </el-table-column>
              <el-table-column
                label="状态"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.goodsStatus == 1 ? '仓库中' : scope.row.goodsStatus == 2 ? '出售中' : scope.row.goodsStatus == 3 ? '已售罄' : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width='250'
                label="商家信息"
                >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <span class="ellipsis">{{scope.row.dealerName}}</span>
                    <br/><span class="ellipsis" style="color:#999;">{{scope.row.dealerType}}</span>
                    <br/><span class="ellipsis" style="color:#999;">{{scope.row.dealerId}}</span>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px;float: left">
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品审核" name="second">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class=" toolbar btnbar">
            <el-cascader :options="goodsClassifys" v-model="selectedOptions2" change-on-select
                         :props="goodsClassifyProps"></el-cascader>

            <el-select v-model="search_goodsCheck_params.approveStatus" placeholder="请选择商品状态">
              <el-option v-for="item in approveStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker style="padding-bottom:1px;"
                            v-model="time"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                            @change="timeCheck">
            </el-date-picker>
            <el-input v-model="search_goodsCheck_params.condition" :maxlength="100" placeholder="输入商品名称/编码/条形码/品牌"
                      title="输入商品名称/编码/条形码/品牌"></el-input>
            <el-button type="primary" size="medium" @click="goodsCheckStoreSearch()" class="btn-search">搜索</el-button>
            <div style="width:100px;position:relative;" class="toolbar" >
              <el-button type="default" size="medium" id='lotsOptionBtn' style="padding:10px 35px"
                         @click.stop='lotsOptionShow = !lotsOptionShow'> 批量操作
              </el-button>
              <div v-if='lotsOptionShow' class='lotsOptionShowStyle'>
                <ul class=" el-select-dropdown__list" id='lotsOptionselection'>
                  <li class="el-select-dropdown__item" @click.stop='lotsOption(3)'>批量同意上架</li>
                  <li class="el-select-dropdown__item" @click.stop='lotsOption(4)'>批量拒绝上架</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="good_info" style="margin-top: 20px;">
            <el-table
              ref="multipleTable"
              :data="goodsCheckStoreData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55"
                :selectable='checkboxInit'
              >
              </el-table-column>
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
                        <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','b')">详情
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approveStatus==1"
                                          @click.native="handleCommand(scope.$index, scope.row,'_edit','b')">同意上架
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approveStatus==1"
                                          @click.native="showRejectDiv(scope.row.goodsId)">拒绝上架
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="商品信息"
                width="300">
                <template slot-scope="scope">
                  <img v-bind:src="scope.row.goodsImageUrl" style="width: 60px;height: 60px;float:left;"/>
                  <a class="ellipsis2" :title="scope.row.goodsName">{{scope.row.goodsName}}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsClassify"
                label="分类"
                width="200">
              </el-table-column>
              <el-table-column
                prop="brandName"
                label="品牌"
                width="200"
                >
              </el-table-column>
              <el-table-column
                prop="goodsPrice"
                label="拍货价/元"
                >
                <template slot-scope="scope"><span>{{scope.row.goodsPrice}}</span></template>
              </el-table-column>
              <el-table-column
                prop="stockNum"
                label="库存"
                >
              </el-table-column>
              <el-table-column
                width='250'
                label="商家信息"
                >
                <template slot-scope="scope">
                  <el-col :span="20">
                    <span class="ellipsis">{{scope.row.dealerName}}</span>
                    <br/><span class="ellipsis" style="color:#999;">{{scope.row.dealerType}}</span>
                    <br/><span class="ellipsis" style="color:#999;">{{scope.row.dealerId}}</span>
                  </el-col>
                </template>
              </el-table-column>
              <el-table-column
                label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.approveStatus == 1 ? '审核中' : scope.row.approveStatus == 2 ? '审核不通过' : ''}}</span>
                  <div class="ico_msg" v-if="scope.row.approveStatus==2">
                    <div>{{scope.row.rejectReason}}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin: 20px;float: left">
              <el-pagination
                @size-change="goodsCheckStoreHandleSizeChange"
                @current-change="goodsCheckStoreHandleCurrentChange"
                :current-page="goodsCheckStoreCurrentPage"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="goodsCheckStorePageRows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="goodsCheckStoreTotalCount">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-button type="primary"><router-link :to="{name:'goodAddModify'}" style="color:#fff;">新增</router-link></el-button> -->
    </el-tabs>

    <!-- 商品审核 拒绝弹框-->
    <div class="hptczp" v-show="showReject===true" style="">
    </div>
    <div class="hptczp_content" v-show="showReject===true">
      <div class="hptczp_header">
        <span>拒绝原因</span>
        <span class="fr" @click="cancel()">X</span>
      </div>
      <div class="hptczp_body">
        <textarea placeholder="请填写100字符以内内容" v-model="rejectReason" maxlength="100"></textarea>
      </div>
      <div class="hptczp_footer">
        <button type="button" class="btn save" @click="reject()" :disabled="rejectReason=='' ">确认
        </button>
        <button type="button" class="btn cancel" @click="cancel()">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {tool} from '../../../../utils/'
  export default {
    name: '',
    data() {
      return {
        agreeTypeFlag: '',// 判断同意类型
        agreeGoodBg: false,// 弹层背景
        agreeGood: false,
        goodsIds: '', //批量处理goodsId
        approveIds: '', // 批量处理approveIds
        multipleSelectionGoods: [], // 商品库 存储checkbox选中的对象
        multipleSelection: [], // 商品审核 存储checkbox选中的对象
        lotsOptionShow: false, //批量操作下拉框显示
        advancedShow: false,
        showReject: false,
        goodsId: '',
        rejectReason: '',
        time: '',
        goodsStorePageRows: 10,
        goodsStoreCurrentPage: 1,
        goodsStoreTotalCount: 0,
        goodsStatus: [{
          value: '',
          label: '商品状态'
        }, {
          value: '1',
          label: '仓库中'
        }, {
          value: '2',
          label: '出售中'
        }, {
          value: '3',
          label: '已售罄'
        }],
        recognizedStatus: [{
          value: '',
          label: '广告图'
        }, {
          value: '0',
          label: '未设置'
        }, {
          value: '1',
          label: '已设置'
        }],
        goodsClassifys: [],
        goodsClassifyProps: {
          value: 'classifyId',
          children: 'subClassify',
          label: 'classifyName'
        },
        search_goods_params: {
          goodsClassifyId: '',
          goodsStatus: '',
          condition: '',
          startTime: '',
          endTime: '',
          recognizedStatus: ''
        },
        activeName: this.$route.query.activeName == undefined ? 'first' : this.$route.query.activeName,
        selectedOptions1: [''],
        selectedOptions2: [''],
        selectedOptions3: [''],
        goodsStoreData: [],
        goodsCheckStorePageRows: 10,
        goodsCheckStoreCurrentPage: 1,
        goodsCheckStoreTotalCount: 0,
        goodsCheckStoreData: [],
        approveStatus: [{
          value: '',
          label: '商品状态'
        }, {
          value: '1',
          label: '审核中'
        }, {
          value: '2',
          label: '审核不通过'
        }],
        search_goodsCheck_params: {goodsClassifyId: '', approveStatus: '', condition: '', startTime: '', endTime: ''}
      }
    },
    methods: {
      //商品库获取复选框选中对象
      handleSelectionChangeGoods(val) {
        this.multipleSelectionGoods = val;
      },
      //商品审核获取复选框选中对象
      handleSelectionChange(val) {
        let that = this
        this.multipleSelection = val;
        console.log('this.multipleSelection', this.multipleSelection)
      },
      //商品审核 批量操作
      lotsOption(flag) {
        let that = this
        that.lotsOptionShow = false
        if (that.multipleSelection.length <= 0) {
          that.$message({
            message: '请选择商品',
            center: true,
            duration: 1000,
            type: 'info',
          });
          return;
        }
        //循环得到审核中的数据的id
        that.goodsIds = that.multipleSelection.map(function (item) {
          return item.goodsId
        }).toString()
        // console.log('that.goodsIds------------------>', that.goodsIds)
        //弹出确认弹层
        if (flag === 3) {   // 商品审核 批量同意操作
          that.agreeTypeFlag = 3
          let  tipsContent = that.agreeTypeFlag === 1 ? '是否上架商品？':that.agreeTypeFlag===2? '是否下架商品？':that.agreeTypeFlag===3?'是否同意上架商品？':' '
          this.$confirm(tipsContent, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
        }).then(() => {
           this.agree_confirm ()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        } else {  // 商品审核 批量拒绝操作
          that.showReject = true
          that.agreeTypeFlag = 4
        }
      },
      //商品库 批量操作
      lotsOptionGoods(flag) {
        let that = this
        that.lotsOptionShow = false
        if (that.multipleSelectionGoods.length <= 0) {
          that.$message({
            message: '请选择商品',
            center: true,
            duration: 1000,
            type: 'info',
          });
          return;
        }
        that.goodsIds = that.multipleSelectionGoods.map(function (item) {return item.goodsId}).toString()
        if (flag === 1) {
          that.agreeTypeFlag = 1
        } else {
          that.agreeTypeFlag = 2
        }
        let  tipsContent = that.agreeTypeFlag === 1 ? '是否上架商品？':that.agreeTypeFlag===2? '是否下架商品？':that.agreeTypeFlag===3?'是否同意上架商品？':' '
          this.$confirm(tipsContent, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
        }).then(() => {
           this.agree_confirm ()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      agree_confirm() {
        let that = this
        // 商品库批量同意上、下架 商品审核申请批量同意上架
        // console.log('----------------', JSON.parse(sessionStorage.getItem('userInfo')))
        if (that.agreeTypeFlag === 1) { // 商品批量上架
          this.api_sellerManagePlatform_goodsUpShelfBatch({
            pathParams: '?goodsIds=' + that.goodsIds
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              that.goodsStore()
              that.agreeTypeFlag = ''
              that.$message({
                type: 'success',
                message: '操作成功!',
              });
            }
          })
        } else if (that.agreeTypeFlag === 2) { // 商品批量下架
          this.api_sellerManagePlatform_goodsOffShelfBatch({
            pathParams: '?goodsIds=' + that.goodsIds
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              that.goodsStore()
              that.agreeTypeFlag = ''
               that.$message({
                type: 'success',
                message: '操作成功!',
              });
            }
          })
        } else if (that.agreeTypeFlag === 3) { // 商品审核批量同意
          this.api_sellerManagePlatform_goodsApproveAgreeBatch({
            pathParams: '?goodsIds=' + that.goodsIds
          }).then(res => {
            console.log('res',res)
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              that.goodsCheckStore()
              that.agreeTypeFlag = ''
               that.$message({
                type: 'success',
                message: '操作成功!',
              });
            }
          })
        }
      },
      //复选框初始化
      checkboxInit(row, index) {
        if (row.approveStatus === 2) return 0
        else return 1;//可勾选
      },
      //隐藏[disabled=disabled] input
      hideCheckbox() {
        let elems = document.getElementsByClassName("el-checkbox");
        var arr = [];
        for (var i = 0, len = elems.length; i < len; i++) {
          if (elems[i].className.indexOf("el-checkbox") >= 0 && elems[i].className.indexOf("is-disabled") < 0) {
            elems[i].style = "display:block"
          }
        }
        let checkboxList = document.getElementsByClassName('el-checkbox is-disabled')
        for (var i = 0; i < checkboxList.length; i++) {
          checkboxList[i].style = "display:none"
        }
      },
      clearAll() {
        let that = this
        that.search_goods_params.condition = ''
        that.search_goods_params.goodsClassifyId = ''
        that.search_goods_params.goodsStatus = ''
        that.time = ''
        that.search_goods_params.endTime = ''
        that.search_goods_params.startTime = ''
        that.search_goods_params.recognizedStatus = ''
        that.selectedOptions1 = []
      },
      advancedSearch() {
        let that = this
        that.advancedShow = true
      },
      showRejectDiv(n) {
        var that = this
        that.showReject = true
        that.goodsId = n
      },
      // 时间赋值
      timeCheck() {
        let that = this
        if (that.time != null) {
          if (that.activeName == 'first') {
            that.search_goods_params.startTime = that.time[0]
            that.search_goods_params.endTime = that.time[1]
          } else if (that.activeName == 'second') {
            that.search_goodsCheck_params.startTime = that.time[0]
            that.search_goodsCheck_params.endTime = that.time[1]
          } else {
            return false
          }
        } else {
          if (that.activeName == 'first') {
            that.search_goods_params.startTime = ''
            that.search_goods_params.endTime = ''
          } else if (that.activeName == 'second') {
            that.search_goodsCheck_params.startTime = ''
            that.search_goodsCheck_params.endTime = ''
          } else {
            return false
          }
        }
      },
      cancel() {
        let that = this
        that.showReject = false
        that.goodsId = ''
        that.rejectReason = ''
      },
      reject () {
        let that = this
        if (that.rejectReason == '') {
          return
        }
        if (that.agreeTypeFlag === 4) { // 商品审核批量拒绝
          this.api_sellerManagePlatform_goodsApproveRejectBatch({
            data: {
              goodsIds: that.goodsIds,
              rejectReason: that.rejectReason
            }
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              that.goodsCheckStore()
              that.agreeTypeFlag = ''
            }
            that.showReject = false
          })
        } else {
          this.api_sellerManagePlatform_goodsApproveReject({
            data: {
              goodsId: that.goodsId,
              rejectReason: that.rejectReason
            }
          }).then(res => {
            if (res == undefined) {
              return false
            }
            that.showReject = false
            that.goodsCheckStore()
          })
        }
      },
      goodsClassify () { // 商品分类树
        let that = this
        this.api_sellerManagePlatform_goodsClassifyTree({
          data: {
            parentClassifyId: -1
          }
        }).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status == '200') {
            that.goodsClassifys = res.content
            that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"商品分类" })
          }
        })
      },
      soldGoods (row, to) { // 下架商品
        if (to === 'a') {
          this.api_sellerManagePlatform_goodsOffShelf({
            pathParams: '/' + row.goodsId
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              this.goodsStore()
              this.$message.success('操作成功');
            } else {
              this.$message.error('下架异常');
            }
          })
        } else if (to === 'b') {
          that.open3(row)
        }
      },
      editGoods (row, to) { // 上架商品
        if (to === 'a') {
          this.api_sellerManagePlatform_goodsUpShelf({
            pathParams: '/' + row.goodsId,
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              this.goodsStore()
              this.$message.success('操作成功');
            } else {
              this.$message.error('上架异常');
            }
          })
        } else if (to === 'b') {
          this.api_sellerManagePlatform_goodsApproveAgree({
            data: {
              goodsId: row.goodsId
            }
          }).then(res => {
            if (res == undefined) {
              return false
            } else if (res.status == '200') {
              this.$message.success('操作成功');
            } else {
              this.$message.error('同意审核异常');
            }
            this.goodsCheckStore()
          })
        }
      }
      , handleTabClick(tab, event) {//tab切换
        let that = this
        that.goodsStorePageRows = 10
        that.goodsStoreCurrentPage = 1
        that.goodsStoreTotalCount = 0
        that.goodsCheckStorePageRows = 10,
          that.goodsCheckStoreCurrentPage = 1,
          that.goodsCheckStoreTotalCount = 0,
          that.selectedOptions1 = ['']
        that.selectedOptions2 = ['']
        that.selectedOptions3 = ['']
        that.search_goods_params.goodsClassifyId = ''
        that.search_goods_params.goodsStatus = ''
        that.search_goods_params.condition = ''
        that.search_goods_params.startTime = ''
        that.search_goods_params.endTime = ''

        that.search_goodsCheck_params.goodsClassifyId = ''
        that.search_goodsCheck_params.approveStatus = ''
        that.search_goodsCheck_params.condition = ''
        that.search_goodsCheck_params.startTime = ''
        that.search_goodsCheck_params.endTime = ''
        if (tab.paneName === 'first') {
          that.goodsStore()//商品列表
        } else if (tab.paneName === 'second') {
          that.goodsCheckStore()//商品审核列表
        }
      },
      goodsStore() {
        let that = this
        let parameter = {
          token: tool.cookie.getCookie('access_token'),
          isEncry: false,
          dealerId: JSON.parse(sessionStorage.getItem('userInfo')).dealerId,
          rows: that.goodsStorePageRows,                     // 每页多少条数据
          pageNum: that.goodsStoreCurrentPage,    // 请求第几页*/
          goodsClassifyId: that.selectedOptions1[that.selectedOptions1.length - 1],
          goodsStatus: that.search_goods_params.goodsStatus,
          condition: that.search_goods_params.condition.replace(/\s+/g, ''),
          startTime: that.search_goods_params.startTime,
          endTime: that.search_goods_params.endTime,
          recognizedStatus: that.search_goods_params.recognizedStatus
        }
        console.log('----------------', JSON.parse(sessionStorage.getItem('userInfo')))
        that.api_sellerManagePlatform_getGoodsList({data: parameter}).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status == '200') {
            that.goodsStoreData = res.content
            that.goodsStoreTotalCount = res.totalCount
          }
        })
      }
      , goodsStoreSearch() {
        if (this.search_goods_params.startTime > this.search_goods_params.endTime) {
           this.$message('开始时间不能大于结束时间');
          return
        }
        this.goodsStore()
        this.advancedShow = false
      }
      , goodsStoreHandleSizeChange(val) {
        this.goodsStorePageRows = val
        this.goodsStore();
      }
      , goodsStoreHandleCurrentChange(val) {
        this.goodsStoreCurrentPage = val
        this.goodsStore();
      }
      , exportSearch() {
        let that = this
        if (that.search_goods_params.startTime > that.search_goods_params.endTime) {
           this.$message('开始时间不能大于结束时间');
          return
        }
        if(!that.tool.permission.permission('scm:goodsStorage:export')){
          this.$message('无权限访问接口')
          return
        }
        let url = this.BASE_URL + 'm2c.scm/admin/goods/export?goodsClassifyId=' + that.search_goods_params.goodsClassifyId + '&goodsStatus=' + that.search_goods_params.goodsStatus + '&condition=' + that.search_goods_params.condition + '&startTime=' + that.search_goods_params.startTime + '&endTime=' + that.search_goods_params.endTime+'&access_token='+sessionStorage.getItem('access_token');

        window.location.href = url
      }
      , goodsCheckStore() {
        let that = this
        let parameter = {
          token: tool.cookie.getCookie('access_token'),
          isEncry: false,
          dealerId: JSON.parse(sessionStorage.getItem('userInfo')).dealerId,
          rows: that.goodsCheckStorePageRows,                     // 每页多少条数据
          pageNum: that.goodsCheckStoreCurrentPage,    // 请求第几页*/
          goodsClassifyId: that.selectedOptions2[that.selectedOptions2.length - 1],
          approveStatus: that.search_goodsCheck_params.approveStatus,
          condition: that.search_goodsCheck_params.condition.replace(/\s+/g, ""),
          startTime: that.search_goodsCheck_params.startTime,
          endTime: that.search_goodsCheck_params.endTime
        }
        that.api_sellerManagePlatform_getGoodsApproveList({data: parameter}).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status === 200) {
            that.goodsCheckStoreData = res.content
            that.goodsCheckStoreTotalCount = res.totalCount
            console.log('----商家审核列表------------', res)
          }
        })
      }
      , goodsCheckStoreSearch() {
        if (this.search_goodsCheck_params.startTime > this.search_goodsCheck_params.endTime) {
          this.$message('开始时间不能大于结束时间');
          return
        }
        this.goodsCheckStore()
      }
      , goodsCheckStoreHandleSizeChange(val) {
        let that = this
        that.goodsCheckStorePageRows = val
        that.goodsCheckStore();
      }
      , goodsCheckStoreHandleCurrentChange(val) {
        let that = this
        that.goodsCheckStoreCurrentPage = val
        that.goodsCheckStore();
      }
      , handleCommand(index, row, action, to) {
        let that = this
        if (action === '_detail') {
          let goodsId = row.goodsId
          if (to == 'a') {
            that.$router.push({name: 's_goodsDetail', query: {goodsId: goodsId, dealerId: row.dealerId, from: to}});
          } else {
            let approveStatus = row.approveStatus
            that.$router.push({
              name: 's_goodsDetail',
              query: {goodsId: goodsId, dealerId: row.dealerId, approveStatus: approveStatus, from: to}
            });
          }
        } else if (action === '_soldout') { // 下架
          that.soldGoods(row, to)
        } else if (action === '_edit') { //上架
          that.editGoods(row, to)
        }
      }
    },
    created() {
      // 点击到弹框外其他地方 弹框收起
      let body = document.querySelector('body')
      body.addEventListener('click', (e) => {
        if (e.target.id === 'lotsOptionBtn' || e.target.id === 'lotsOptionBtnselection') {
          this.lotsOptionShow = true
        } else {
          this.lotsOptionShow = false
        }
      }, false)
    },
    mounted() {
      let that = this
      that.hideCheckbox()
      if (that.$route.query.activeName == 'second') {
        that.activeName = 'second'
        that.goodsCheckStore()
      } else {
        if (that.$route.query.goodsStatus === 2){
          that.search_goods_params.goodsStatus ='2'
        }
        that.goodsStore()
      }
      that.goodsClassify()
    },
    updated() {
      let that = this
      that.hideCheckbox()
    }
  }
</script>
<style lang="scss" scoped>
  .agreetc_header {
    width: 100%;
    height: 50px;
    background: #DFE9F6;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    span {
      display: inline-block;
      line-height: 50px;
    }
  }
  a.advanced{color:#666;display:inline-block;margin:7px 0;}
  .agreetc_body {
    padding-left: 20px;
    padding-right: 20px;
    background: #FFFFFF;
    margin-top: 10px;
    text-align: center;
    font-size: 20px;
    color: #333333;
    line-height: 150px;
  }

  .agreetc_footer, .refuse_footer {
    height: 80px;
    padding-top: 10px;
    padding-left: 50%;
    .btn {
      width: 80px;
      height: 30px;
      border: none;
      border-radius: 2px;
      color: #fff;
    }
    .save {
      margin-left: -110px;
      background: #0086FF;
    }
    .cancel {
      margin-left: 40px;
      background: #FFF;
      border: 1px solid #CCCCCC;
      color: #444;
    }
  }

  .lotsOptionShowStyle { // 批量弹框样式
    position: absolute;
    top: 32px;
    z-index: 2;
    border: 1px solid transparent;
    border-radius: 6px;
    li {
      background: #fff
    }
    li:hover {
      background: rgb(236, 245, 255)
    }
  }

  .mt7 {
    margin-top: 7px;
  }
  .ico_msg {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -848px -282px no-repeat;
    // position: relative;
    div {
      display: none;
      width: 150px;
      background: #fff;
      position: absolute;
      transform: scale(1);
      margin-top: 20px;
      z-index: 2;
      height: auto;
      padding: 10px;
      margin-left: -120px;
      border: 1px solid #ccc;
      border-radius: 3px;
      box-shadow: 0px 3px 3px #ccc;
    }
  }

  .ico_msg:hover div {
    display: inline-block;
  }
  .sz {
    width: 1620px;
    height: 880px;
    margin-left: 0px;
    margin-top: 130px;
    background-color: #fff;
    .nav {
      height: 50px;
      button {
        height: 40px;
        margin-top: 5px;
        margin-right: 15px;
      }
    }

    .tab-content {
      position: relative;
      .tab-pane {
        .search_cell {
          display: inline-block;
          position: relative;
          height: 84px;
          line-height: 84px;
          span {
            font-size: 16px;
            margin-right: 25px;
            margin-left: 20px;
            i {
              font-size: 20px;
              padding-left: 10px;
            }
          }
          .time {
            width: 330px;
            height: 61px;
            position: absolute;
            left: -61px;
            top: 41px;
            z-index: 10;
            .form-control {
              width: 139px;
              height: 31px;
              position: absolute;
              top: 12px;
            }
            .start {
              left: 20px;
            }
            .separator {
              position: absolute;
              left: 141px;
              top: -16px;
            }
            .end {
              right: 20px;
            }
          }
        }
      }

    }
    .dropdown {
      display: inline-block;
      font-size: 16px;
      line-height: 68px;
      margin-left: 10px;
      .sort {
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state {
        display: inline;
        margin-right: 20px;
      }
      .dropdown-menu {
        li {
          line-height: 30px;
          padding-left: 25px;
          position: relative;
          i {
            font-size: 10px;
            color: gray;
            padding-left: 15px;
            position: absolute;
            top: 8px;
            right: 19px;
          }
        }
      }
    }
    .search {
      display: inline-block;
      position: relative;
      .inp {
        width: 380px;
        height: 39px;
        color: #ccc;
      }
      i {
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
    span {
      cursor: pointer;
    }
    .add {
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation {
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
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
      .print_order {
        background: #18DCF6;
      }

      //表格样式
      .comment_info {
        table {
          td {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .pagination {
          margin: 0;
        }
      }
    }
  }

  /*详情*/
  .ellipsis {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  a.ellipsis2 {
    width: 180px;
    color: #5a5e66;
    margin-left: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    position: relative;
    float: left;
  }

  a.ellipsis2:hover {
    text-decoration: none;
  }
  .delectGoodBg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .blueBtn, .defultBtn {
    background: rgb(96, 174, 246);
    width: 80px;
    height: 30px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
  }

  .defultBtn {
    background: #ccc;
  }

  /*修改/新增*/
  .changeGoodInfo input, .changeGoodInfo select {
    width: 200px;
    line-height: 40px;
    color: #666;
  }
  // 遮罩层
  .hptczp {
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0.5;
  }
  .hptczp_content {
    width: 420px;
    height: 280px;
    background: #fff;
    z-index: 9999;
    position: absolute;
    left: 50%;
    top: 25%;
    margin-left: -200px;
    margin-top: -140px;
    background: #FFFFFF;
    border-radius: 4px;
    .hptczp_header {
      width: 100%;
      height: 50px;
       line-height: 50px;
      background: #DFE9F6;
      span {
        display: inline-block;
        line-height: 50px;
        text-indent: 1em;
      }
      .fr{
        float: right;
        padding-right: 16px;
        line-height: 50px;
        cursor: pointer;
      }
    }
    .hptczp_body {
      padding-left: 20px;
      padding-right: 20px;
      background: #FFFFFF;
      margin-top: 10px;
      textarea {
        width: 100%;
        height: 100%;
        border: 1px solid #E5E5E5;
        width: 360px;
        height: 140px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .hptczp_footer {
      height: 80px;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 80px;
        height: 30px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: #0086FF;
      }
      .cancel {
        margin-left: 40px;
        background: #FFF;
        border: 1px solid #CCCCCC;
        color: #444;
      }

    }
  }
    .soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2;
    h4 a.close{
      opacity:1;display:inline-block;width:24px;height:24px;float:right; margin-right:50px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -174px -470px no-repeat;
    }
    .mess{
      margin-top: 30px;padding:0px 40px;padding-bottom:30px;background:#fff;
      h4{
        line-height:50px;
        margin-bottom:10px;
        font-size:16px;
        color:#333;
      }
      .inline{display:inline-block;line-height:50px;}
      .modify{margin-left:10px;line-height:50px;width:16px;height:16px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -398px -836px no-repeat;}
    }
    .alginRight{text-align: right; line-height:50px;color:#666;}
    .formControl{display:inline-block;width:100%;height:36px;padding:6px 12px; line-height:50px;font-size:14px;background:#fff;border:1px solid #ccc;border-radius:4px;}
  }

  .Advanced_s {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    padding: 20px;
    padding-bottom: 50px;
    width: 100%;
    background: #fff;
    z-index: 2;
    .left, .right {
      .bt {
        display: inline-block;
        width: 80px;
        line-height: 50px;
        text-align: right;
        padding-right: 10px;
      }
      input, select {
        width: 75%;
        height: 40px;
        line-height: 40px;
      }
      .time {
        width: 165px;
        margin-right: 10px;

      }
    }
    .titbt {
      font-size: 18px;
      line-height: 50px;
      color: #333333;
    }
    .footer {
      padding-left: 94px;
      margin-top: 20px;
      .footerbtn {
        border: 1px solid #CCCCCC;
        border-radius: 2px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #333333;
        text-align: center;
      }
      .sort {
        background: #0086FF;
        border-radius: 2px;
        color: #FFFFFF;
      }
      .czt {
        background: #fff;
      }
    }
  }
</style>
