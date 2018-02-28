<template>
  <div class="list">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="品牌库" name="first">
        <div class="toolbar">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd"
            @change="timeCheck">
          </el-date-picker>
          <el-input v-model="search_params.condition" :maxlength="100"  placeholder="输入品牌名称"></el-input>
          <el-button type="primary" size="medium" @click="get_comment_info()" class="btn-search">搜索</el-button>
        </div>
        <div class="toolbar btnbar">
          <el-button type="primary" size="medium" @click="addGood()">新增</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="bindsList"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="操作"
            width="120"
            >
            <template slot-scope="scope">
              <el-col :span="12">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','a')">详情</el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_edit','a')">编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_delete','a')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌名称"
            >
            <template slot-scope="scope">
              <span class="ellipsis" style="width:160px;display:block" :title="scope.row.brandName">{{scope.row.brandName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dealerName"
            label="申请商户"
            >
            <template slot-scope="scope"><span >{{scope.row.isSysAdd === 1 ? '系统' : scope.row.dealerName}}</span></template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            >
          </el-table-column>
        </el-table>
        <div class="block" style="margin:20px;">
          <el-pagination
            @size-change="bindsSizeChange"
            @current-change="bindsCurrentChange"
            :current-page="bindsCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="bindPageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="bindsTotalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="品牌审核" name="second">
        <div class="toolbar">
          <el-select v-model="search_approve.approveStatus" placeholder="品牌状态">
            <el-option
              v-for="brandStatu in brandStatus"
              :key="brandStatu.value"
              :label="brandStatu.label"
              :value="brandStatu.value">
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
          <el-input v-model="search_approve.condition"  :maxlength="100"  placeholder="输入品牌名称"></el-input>
          <el-button type="primary" size="medium" @click="get_comment_info1()" class="btn-search">搜索</el-button>
        </div>
        <div class='toolbar btnbar' style="position:relative;">
          <el-button type="default" size="medium" id ='lotsOptionBtn' @click.stop='lotsOptionShow = !lotsOptionShow'> 批量操作 </el-button>
          <div v-if = 'lotsOptionShow' class='lotsOptionShowStyle'>
            <ul class=" el-select-dropdown__list" id='lotsOptionselection' >
              <li class="el-select-dropdown__item" @click.stop='lotsOption(0)'>批量同意</li>
              <li class="el-select-dropdown__item" @click.stop='lotsOption(1)'>批量拒绝</li>
            </ul>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="bindsApproveList"
          style="width: 100%"
           @selection-change="handleSelectionChange">
          <el-table-column type="selection"  width="55" :selectable='checkboxInit'>
          </el-table-column>
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
                    <el-dropdown-item @click.native="handleCommand(scope.$index, scope.row,'_detail','b')">详情</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approveStatus === 1" @click.native="handleCommand(scope.$index, scope.row,'_agree','b')">同意
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approveStatus === 1" @click.native="handleCommand(scope.$index, scope.row,'_reject','b')">拒绝
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </template>
          </el-table-column>
          <el-table-column
            label="品牌名称">
            <template slot-scope="scope">
              <span class="ellipsis" style="width:160px;display:block" :title="scope.row.brandName">{{scope.row.brandName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dealerName"
            label="申请商户">
            <template slot-scope="scope"><span >{{scope.row.isSysAdd === 1 ? '系统' : scope.row.dealerName}}</span></template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间">
          </el-table-column>
          <el-table-column
            label="品牌状态"
            >
            <template slot-scope="scope">
              <span>{{scope.row.approveStatus==1?'审批中':scope.row.approveStatus==2?'审批不通过':''}}</span>
              <div class="ico_msg bg-ico_msg" v-if="scope.row.approveStatus==2">
                <div>{{scope.row.rejectReason}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:20px;float:left">
          <el-pagination
            @size-change="bindsApproveSizeChange"
            @current-change="bindsApproveCurrentChange"
            :current-page="bindsApproveCurrentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="bindApprovePageRows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="bindsApproveTotalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--拒绝弹层-->
    <div class="hptczp" v-show="rejectGood===true" ></div>
    <div class="hptczp_content"  v-show="rejectGood===true">
      <div class="hptczp_header">
        <h4>拒绝原因<span class="fr" @click="rejectGoodHide()"></span></h4>
      </div>
      <div class="hptczp_body">
        <textarea placeholder="请填写100字符以内内容" v-model="rejectReason" :maxlength="100"></textarea>
      </div>
      <div class="hptczp_footer">
        <el-button type="primary" size="medium" class="btn save" @click="reject_confirm()" :disabled="rejectReason=='' || noDoubleClickD" >确认</el-button>
        <button type="button" class="btn cancel" @click="rejectGoodHide()" >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        noDoubleClick:false, //禁止同意按钮多次点击
        noDoubleClickD:false, //禁止拒绝按钮多次点击
        approveIds:[],
        isLotsOptionFlag:0 , // 是否为批量拒绝
        multipleSelection: [], // 存储checkbox 选中的对象
        lotsOptionShow: false, //批量操作下拉框显示
        rejectReason: '',
        rejectGood: false, // 拒绝
        agreeGoodBg: false, // 弹层背景
        agreeGood: false, // 删除盒子
        time: '',
        activeName: 'first',
        btnShow: true,
        bindPageRows:10,
        bindsCurrentPage: 1,
        bindsTotalCount: 0,
        bindApprovePageRows: 10,
        bindsApproveCurrentPage: 1,
        bindsApproveTotalCount: 0,
        goodsDelStoreData: [],
        delectGoodBg: false, // 弹层背景
        delectGood: false, // 删除盒子
        changeGoodShow: false,
        bindsList: [],
        bindsApproveList: [],
        // 搜索参数
        search_params: {condition: '', startTime: '', endTime: ''},
        search_approve: {condition: '', startTime: '', endTime: '', approveStatus: ''},
        goodInfo: [],
        delete_params: {brandId: ''},
        change_params: {brandId: ''},
        brandStatus: [
          {value: '', label: '品牌状态'}, {value: '1', label: '审批中'}, {value: '2', label: '审批不通过'}
        ],
        // 上传图片后返回的地址
        imgshow: false,
        add_modify_params_imgurl: '',
        // 新增/修改的数据
        add_modify_params: {approveId: '', brandId: '', brandName: '', brandNameEn: '', firstAreaCode: '', twoAreaCode: '', threeAreaCode: '', firstAreaName: '', twoAreaName: '', threeAreaName: '', brandLogo: ''},
        // 控制新增/修改的参数
        handle_toggle: '',
        // 上传头像标识
        touxiang_change: false,
        // 所有的国家(供搜索使用)
        country_all_search: [],
        // 可选的省份(供搜索使用)
        province_all_search: [],
        // 所有的城市(供搜索使用)
        city_all_search: [],
        province_show: false,
        city_show: false,
        modifyLocal: '',
        isBrandApprove: false,
        isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    watch: {
      // 查询时监控国家
      'add_modify_params.firstAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.twoAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.api_sellerManagePlatform_getIntel({
              data:{
                parentCode: code
              }
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.province_all_search = result.content
                if (result.content.length > 0) {
                  that.province_show = true
                  that.city_show = false
                }
              }
            })
            // that.$.ajax({
            //   url: that.base + 'm2c.operate/address/getintel.web',
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     parentCode: code
            //   },
            //   success: function (result) {
            //     that.province_all_search = result.content
            //     if (result.content.length > 0) {
            //       that.province_show = true
            //       that.city_show = false
            //     }
            //   }
            // })
          }
        },
        deep: true
      },
      // 查询时监控省份
      'add_modify_params.twoAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.threeAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.api_sellerManagePlatform_getIntel({
              data:{
                parentCode: code
              }
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.city_all_search = result.content
                if (result.content.length > 0) {
                  that.city_show = true
                }
              }
            })
            // that.$.ajax({
            //   url: that.base + 'm2c.operate/address/getintel.web',
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     parentCode: code
            //   },
            //   success: function (result) {
            //     that.city_all_search = result.content
            //     if (result.content.length > 0) {
            //       that.city_show = true
            //     }
            //   }
            // })
          }
        },
        deep: true
      }
    },
    methods: {
      //获取复选框选中对象
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //批量操作
      lotsOption(flag){
        let that = this
        that.lotsOptionShow = false
        if(that.multipleSelection.length<=0){
          that.$message({
            message:'请选择品牌',
            center: true,
            duration:1000,
            type:'info',
          });
          return;
        }
        //循环得到审核中的数据的id
        that.approveIds = that.multipleSelection.map(function(item){return item.approveId})
        if(flag == 0){ // 批量操作同意弹框
          // that.agreeGood = true
          // that.agreeGoodBg = true
          that.isLotsOptionFlag = 2
          that.agree_confirm()
        }else{ //批量拒绝 理由弹框
          that.rejectGood = true
          that.isLotsOptionFlag =1
        }
      },
      handleTabClick (tab, event) { // tab切换
        let that = this
        that.search_params = {condition: '', startTime: '', endTime: ''},
          that.search_approve = {condition: '', startTime: '', endTime: '', approveStatus: ''}
        that.time = ''
        if (tab.paneName ==='first') {
          that.get_comment_info() // 品牌库列表
        } else if (tab.paneName === 'second') {
          that.get_comment_info1() // 品牌审核列表
        }
      },
      // 时间赋值
      timeCheck () {
        let that = this
        if (that.time != null) {
          if (that.activeName == 'first') {
            that.search_params.startTime = that.time[0]
            that.search_params.endTime = that.time[1]
          } else {
            that.search_approve.startTime = that.time[0]
            that.search_approve.endTime = that.time[1]
          }
        } else {
          if (that.activeName == 'first') {
            that.search_params.startTime = ''
            that.search_params.endTime = ''
          } else {
            that.search_approve.startTime = ''
            that.search_approve.endTime = ''
          }
        }
      },
      bindsSizeChange (val) {
        let that = this
        that.bindPageRows = val
        that.get_comment_info()
      },
      bindsCurrentChange (val) {
        let that = this
        that.bindsCurrentPage = val
        that.isChangePage = true
        that.get_comment_info()
      },
      bindsApproveSizeChange (val) {
        let that = this
        that.bindApprovePageRows = val
        that.get_comment_info1()
      },
      bindsApproveCurrentChange (val) {
        let that = this
        that.bindsApproveCurrentPage = val
        that.isChangePage = true
        that.get_comment_info1()
      },
      handleCommand (index ,row, action, to) {
        let that = this
        if (action === '_detail') {
          that.$router.push({name:'s_set_brandInfo',query:{'activeName':that.activeName,'id':to == 'a'?row.brandId:row.approveId}})
          // if (to == 'a') {
          //   that.goodInfoShow = true
          //   that.api_sellerManagePlatform_getBrand({
          //     pathParams:'/' + row.brandId
          //   }).then(result=>{
          //     that.goodInfo = result.content
          //   })
          // } else {
          //   that.goodInfoShow = true
          //   that.api_sellerManagePlatform_getApprove({
          //     pathParams:'/' + row.approveId
          //   }).then(result=>{
          //     that.goodInfo = result.content
          //   })
          //   // that.$.ajax({
          //   //   url: that.localbase + 'm2c.scm/brand/approve/' + row.approveId,
          //   //   success: function (result) {
          //   //     that.goodInfo = result.content
          //   //   }
          //   // })
          // }
        } else if (action === '_edit') {
          // that.handle_toggle = 'modify'
          that.$router.push({name:'s_set_brandModify',query:{'id':row.brandId,'handle_toggle':'modify'}})
          // that.area()
          // that.touxiang_change = false
          // that.api_sellerManagePlatform_getBrand({
          //   pathParams:'/' + row.brandId
          // }).then(result=>{
          //   that.add_modify_params = result.content
          //   /* 初始化图片 */
          //   document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
          //   if (result.content.brandLogo && result.content.brandLogo != '') {
          //     that.imgshow = true
          //   } else {
          //     that.imgshow = false
          //   }
          // })
          // that.$.ajax({
          //   url: that.localbase + 'm2c.scm/brand/' + row.brandId,
          //   success: function (result) {
          //     that.add_modify_params = result.content
          //     /* 初始化图片 */
          //     document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
          //     if (result.content.brandLogo && result.content.brandLogo != '') {
          //       that.imgshow = true
          //     } else {
          //       that.imgshow = false
          //     }
          //   }
          // })
        } else if (action === '_delete') {
          that.delete_params.brandId = row.brandId
          this.$confirm('是否删除品牌', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'warning'
          }).then(() => {
            that.api_sellerManagePlatform_deleteBrand({
              pathParams:'/'+that.delete_params.brandId
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.$message({
                  type:'success',
                  message:'删除成功'
                })
                that.delectGoodHide()
                that.get_comment_info()
              }else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
                that.delectGoodHide()
                that.get_comment_info()
              }
            })
          }).catch(() => {
            return
          });
          // that.delectGoodShow()
        } else if (action === '_agree') {
          that.search_approve.approveId = row.approveId
          that.agree_confirm()
        } else if (action === '_reject') {
          that.rejectGoodShow(row.approveId)
        }
      },
      brandQuery () {
        let that = this
        that.changeGoodShow = false
        that.modifyLocal = 1
        that.get_comment_info()
        that.isBrandApprove = false
        that.search_params = []
      },
      brandApproveQuery () {
        let that = this
        that.changeGoodShow = false
        that.modifyLocal = 2
        that.get_comment_info1()
        that.isBrandApprove = true
        that.search_params = []
      },
      area () {
        let that = this
        // 获取省市区列表
        that.api_sellerManagePlatform_getIntel({}).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            that.country_all_search = result.content
          }
        })
        // that.$.ajax({
        //   url: that.base + 'm2c.operate/address/getintel.web',
        //   data: {
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     that.country_all_search = result.content
        //   }
        // })
      },
      // 重置
      reset_add_modify_params_bind () {
        this.add_modify_params.brandId = ''
        this.add_modify_params.brandName = ''
        this.add_modify_params.brandNameEn = ''
        this.add_modify_params.firstAreaCode = ''
        this.add_modify_params.twoAreaCode = ''
        this.add_modify_params.threeAreaCode = ''
        this.add_modify_params.firstAreaName = ''
        this.add_modify_params.twoAreaName = ''
        this.add_modify_params.threeAreaName = ''
        this.add_modify_params.brandLogo = ''
      },
      // 上传图片时获取本地地址
      getObjectURL (file) {
        let url = null
        if (window.createObjectURL !== undefined) { // basic
          url = window.createObjectURL(file)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        return url
      },
      // 新增
      addGood () {
        let that = this
        that.$router.push({name:'s_set_brandModify',query:{'handle_toggle':'add'}})
        // that.$.ajax({
        //   type: 'get',
        //   url: that.localbase + 'm2c.scm/brand/id',
        //   data: {
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     that.add_modify_params.brandId = result.content
        //     that.changeGoodShow = true
        //     that.handle_toggle = 'add'
        //   }
        // })
      },
      // 上传图片
      upload_img () {
        let target = event.target
        let objUrl = this.getObjectURL(target.files[0])
        let size = target.files[0].size
        if (size >= 102400 * 10) this.show_tip('图片超过1M了哦')
        else {
          if (objUrl) {
            // this.img_url = objUrl
            this.imgshow = true
            document.querySelector('#m11yhgl_img').src = objUrl
            this.touxiang_change = true
          }
        }
      },
      // 新增/修改上传图片处理
      add_modify_imgStep (callback) {
        let that = this
        if (!that.touxiang_change) {
          callback()
        } else {
          let formData = new FormData()
          formData.append('img', document.querySelector('#m11yhgl_img_input').files[0])
          formData.append('token', sessionStorage.getItem('mToken'))
          formData.append('imgGroup', 4)
          that.api_sellerManagePlatform_uploadImg({
            data:formData
          }).then(result=>{
            if(result==undefined){
              return false
            }else if(result.status === 200){
              result = JSON.parse(result)
              if (result.errorMessage && result.errorMessage !== null) {
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
                return
              }
              that.add_modify_params_imgurl = result.content.url
              callback()
            }
          })
          // that.$.ajax({
          //   type: 'post',
          //   url: that.localbase + 'm2c.support/img/upload',
          //   data: formData,
          //   processData: false,
          //   contentType: false,
          //   success: function (result) {
          //     result = JSON.parse(result)
          //     if (result.errorMessage && result.errorMessage !== null) {
          //       that.show_tip(result.errorMessage)
          //       return
          //     }
          //     that.add_modify_params_imgurl = result.content.url
          //     callback()
          //   }
          // })
        }
      },
      // 审核同意
      agree_confirm () {
        let that = this
        this.$confirm('是否同意品牌审核', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          if (that.isLotsOptionFlag ===2) { // 批量操作
            that.noDoubleClick = 1>0
            that.api_sellerManagePlatform_batchagree({
              data:{approveIds:that.approveIds.toString()}
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.get_comment_info1()
                that.isLotsOptionFlag = 0
                that.approveIds=[]
              }
            })
            // that.$.ajax({
            //   url: that.base + 'm2c.scm/admin/brand/approve/batchagree',
            //   type:"POST",
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     approveIds:that.approveIds.toString()
            //   },
            //   success: function (result) {
            //     that.get_comment_info1()
            //     that.goodInfoShow = false
            //     that.isLotsOptionFlag = 0
            //     that.approveIds=[]
            //   }
            // })
          }else{
            that.api_sellerManagePlatform_approveAgree({
              data:{approveId:that.search_approve.approveId}
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.get_comment_info1()
              }
            })
            // that.$.ajax({
            //   type: 'post',
            //   url: that.localbase + 'm2c.scm/brand/approve/mng/agree',
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     approveId: that.search_approve.approveId
            //   },
            //   success: function (result) {
            //     that.get_comment_info1()
            //     that.goodInfoShow = false
            //   }
            // })
          }
        }).catch(() => {
          return
        });
        // if (that.isLotsOptionFlag ===2) { // 批量操作
        //   that.noDoubleClick = 1>0
        //   that.api_sellerManagePlatform_batchagree({
        //     data:{approveIds:that.approveIds.toString()}
        //   }).then(result=>{
        //     if(result==undefined){
        //       return false
        //     }else if(result.status === 200){
        //       that.get_comment_info1()
        //       that.isLotsOptionFlag = 0
        //       that.approveIds=[]
        //     }
        //   })
        //   // that.$.ajax({
        //   //   url: that.base + 'm2c.scm/admin/brand/approve/batchagree',
        //   //   type:"POST",
        //   //   data: {
        //   //     token: sessionStorage.getItem('mToken'),
        //   //     approveIds:that.approveIds.toString()
        //   //   },
        //   //   success: function (result) {
        //   //     that.get_comment_info1()
        //   //     that.goodInfoShow = false
        //   //     that.isLotsOptionFlag = 0
        //   //     that.approveIds=[]
        //   //   }
        //   // })
        // }else{
        //   that.api_sellerManagePlatform_approveAgree({
        //     data:{approveId:that.search_approve.approveId}
        //   }).then(result=>{
        //     if(result==undefined){
        //       return false
        //     }else if(result.status === 200){
        //       that.get_comment_info1()
        //     }
        //   })
        //   // that.$.ajax({
        //   //   type: 'post',
        //   //   url: that.localbase + 'm2c.scm/brand/approve/mng/agree',
        //   //   data: {
        //   //     token: sessionStorage.getItem('mToken'),
        //   //     approveId: that.search_approve.approveId
        //   //   },
        //   //   success: function (result) {
        //   //     that.get_comment_info1()
        //   //     that.goodInfoShow = false
        //   //   }
        //   // })
        // }
        // that.agreeGoodHide()
      },
      // 审核拒绝
      reject_confirm () {
        let that = this
        if (that.rejectReason == '') {
          return
        }
        that.noDoubleClickD = 1>0
        if(that.isLotsOptionFlag ==1){ // 批量申请拒绝
          that.api_sellerManagePlatform_batchreject({
            data:{
              approveIds:that.approveIds.toString(),
              rejectReason:that.rejectReason
            }
          }).then(result=>{
            if(result==undefined){
              return false
            }else if(result.status === 200){
              if(result.status === 200) {
              that.get_comment_info1()
              that.isLotsOptionFlag = 0
              }else{
              //    that.$message({
              //   message:result.errorMessage,
              //   center: true,
              //   duration:1000,
              //   type:'info',
              // });
              }
              that.noDoubleClickD =false
            }
          })
          // that.$.ajax({
          //   url: that.base + 'm2c.scm/admin/brand/approve/batchreject',
          //   type:"POST",
          //   data: {
          //     token: sessionStorage.getItem('mToken'),
          //     approveIds:that.approveIds.toString(),
          //     rejectReason:that.rejectReason
          //   },
          //   success: function (result) {
          //     if(result.status === 200) {
          //     that.get_comment_info1()
          //     that.isLotsOptionFlag = 0
          //     }else{
          //     //    that.$message({
          //     //   message:result.errorMessage,
          //     //   center: true,
          //     //   duration:1000,
          //     //   type:'info',
          //     // });
          //     }
          //     that.goodInfoShow = false
          //     that.noDoubleClickD =false
          //   }
          // })
        }else{
          that.api_sellerManagePlatform_approveReject({
            data:{
              approveId: that.search_approve.approveId,
              rejectReason: that.rejectReason
            }
          }).then(result=>{
            if(result==undefined){
              return false
            }else if(result.status === 200){
              that.get_comment_info1()
              that.$set(rejectReason,that.rejectReason)
            }
          })
          // that.$.ajax({
          //   type: 'POST',
          //   url: that.localbase + 'm2c.scm/brand/approve/mng/reject',
          //   data: {
          //     token: sessionStorage.getItem('mToken'),
          //     approveId: that.search_approve.approveId,
          //     rejectReason: that.rejectReason
          //   },
          //   success: function (result) {
          //     that.get_comment_info1()
          //     that.goodInfoShow = false
          //     that.$set(rejectReason,that.rejectReason)
          //   }
          // })
        }
      that.rejectGoodHide()
      },
      // 修改保存
      change_confirm () {
        let that = this
        console.log(that.handle_toggle)
        if (that.add_modify_params.brandName === '') {
          that.$message({
            type:'warning',
            message:'品牌名称不能为空'
          })
          return
        }
        // that.reset_add_modify_params_bind()
        that.add_modify_imgStep(function () {
          // 根据国家的code获取省份名字
          {
            let select = document.querySelector('#country_select')
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.add_modify_params.firstAreaName = ''
            } else {
              that.add_modify_params.firstAreaName = options[index].text
            }
          }
          // 根据省份code获取城市名字
          {
            let select = document.querySelector('#province_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.twoAreaName = ''
              } else {
                that.add_modify_params.twoAreaName = options[index].text
              }
            }
          }
          // 根据城市code获取区域名字
          {
            let select = document.querySelector('#city_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.threeAreaName = ''
              } else {
                that.add_modify_params.threeAreaName = options[index].text
              }
            }
          }
          if(that.handle_toggle === 'add'){
            that.api_sellerManagePlatform_modifyBrand({
              type:'post',
              data: Object.assign({
                token: sessionStorage.getItem('mToken')
              }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {})
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.get_comment_info()
                that.changeGoodShow = false
              }else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
              }
            })
          }else{
            that.api_sellerManagePlatform_modifyBrand({
              type:'put',
              pathParams:'/'+that.add_modify_params.brandId,
              data: Object.assign({
                token: sessionStorage.getItem('mToken')
              }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {})
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.get_comment_info()
                that.changeGoodShow = false
              }else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
              }
            })
          }
          // that.$.ajax({
          //   type: that.handle_toggle === 'add' ? 'post' : 'put',
          //   url: that.handle_toggle === 'add' ? that.localbase + 'm2c.scm/brand/mng' : that.localbase + 'm2c.scm/brand/mng/' + that.add_modify_params.brandId,
          //   // data: Object.assign({}, that.add_modify_params, that.touxiang_change ? {icon: that.add_modify_params_imgurl} : {}, {
          //   data: Object.assign({
          //     token: sessionStorage.getItem('mToken')
          //   }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {}),
          //   success: function (result) {
          //     if (result.status == '200' || result.status == 200) {
          //       that.get_comment_info()
          //       that.changeGoodShow = false
          //     } else {
          //       that.show_tip(result.errorMessage)
          //       return
          //     }
          //   }
          // })
        })
      },
      // 删除确认
      delete_confirm () {
        let that = this
        that.api_sellerManagePlatform_deleteBrand({
          pathParams:'/'+that.delete_params.brandId
        }).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            that.$message({
              type:'success',
              message:'删除成功'
            })
            that.delectGoodHide()
            that.get_comment_info()
          }else{
            that.$message({
              type:'warning',
              message:result.errorMessage
            })
            that.delectGoodHide()
            that.get_comment_info()
          }
        })
        // that.$.ajax({
        //   type: 'delete',
        //   url: that.localbase + 'm2c.scm/brand/mng/' + that.delete_params.brandId,
        //   data: {
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     if (result.status == 200) {
        //       that.show_tip('删除成功')
        //       that.delectGoodHide()
        //       that.get_comment_info()
        //     } else {
        //       that.show_tip(result.errorMessage)
        //       that.delectGoodHide()
        //       that.get_comment_info()
        //     }
        //   }
        // })
      },
      // 删除盒子显示
      delectGoodShow () {
        let that = this
        that.delectGood = true
        that.delectGoodBg = true
      },
      // 删除盒子隐藏
      delectGoodHide () {
        let that = this
        that.delectGood = false
        that.delectGoodBg = false
      },
      // 同意盒子显示
      agreeGoodShow (n) {
        let that = this
        that.search_approve.approveId = n
        that.agreeGood = true
        that.agreeGoodBg = true
      },
      // 同意盒子隐藏
      agreeGoodHide () {
        let that = this
        that.agreeGood = false
        that.agreeGoodBg = false
        that.noDoubleClick =false
      },
      rejectGoodShow (n) {
        var that = this
        that.search_approve.approveId = n
        that.rejectGood = true
      },
      rejectGoodHide () {
        var that = this
        that.rejectReason='',
        that.isLotsOptionFlag=0 ,
        that.rejectGood = false
        that.noDoubleClickD = false
      },
      // 获取商品库列表
      get_comment_info () {
        let that = this
        // if(!that.isChangePage){
        //   that.bindsCurrentPage = 1
        // }
        //getBrandList
        that.api_sellerManagePlatform_getBrandList({
          data: {//sessionStorage.setItem('userInfo')
            dealerId: JSON.parse(sessionStorage.getItem('userInfo')).dealerId,
            rows: that.bindPageRows,                     // 每页多少条数据
            pageNum: that.bindsCurrentPage,    // 请求第几页*/
            condition:that.search_params.condition.replace(/\s+/g,""),
            startTime:that.search_params.startTime,
            endTime:that.search_params.endTime
          }
        }).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            // 获取商品列表
            that.bindsList = result.content
            that.bindsTotalCount = result.totalCount
          }else{
            that.$message({
              type:'warning',
              message:result.errorMessage
            })
          }
        })
      },
      // 获取审核列表
      get_comment_info1 () {
        let that = this
        // if(!that.isChangePage){
        //   that.bindsApproveCurrentPage = 1
        // }
        console.log(JSON.parse(sessionStorage.getItem('userInfo')))
        that.api_sellerManagePlatform_getBrandApproveList({
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('userInfo')).dealerId,
            rows: that.bindApprovePageRows,                     // 每页多少条数据
            pageNum: that.bindsApproveCurrentPage,    // 请求第几页*/
            condition: that.search_approve.condition.replace(/\s+/g, ''),
            startTime: that.search_approve.startTime,
            endTime: that.search_approve.endTime,
            approveStatus: that.search_approve.approveStatus
          }
        }).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            that.bindsApproveList = result.content
            that.bindsApproveTotalCount = result.totalCount
          }else{
            that.$message({
              type:'warning',
              message:result.errorMessage
            })
          }
        })
      },
       //复选框初始化
      checkboxInit(row,index){
        if (row.approveStatus === 2)return 0
        else return 1;//可勾选
        },
      //隐藏[disabled=disabled] input
      hideCheckbox (){
        // 获取到包含el-check 不包含is-disable类
        let elems = document.getElementsByClassName("el-checkbox");
        var arr = [];
        for(var i = 0,len = elems.length;i<len;i++){
          if(elems[i].className.indexOf("el-checkbox")>=0&&elems[i].className.indexOf("is-disabled")<0){
            elems[i].style="display:block"
          }
        }
        let checkboxList = document.getElementsByClassName('el-checkbox is-disabled')
        console.log('checkboxList'+i, checkboxList)
        for(var i =0 ;i< checkboxList.length; i++){
          checkboxList[i].style="display:none"
        }
        }
    },
      created() {
      // 点击到弹框外其他地方 弹框收起
      let body = document.querySelector('body')
      body.addEventListener('click',(e)=>{
      if(e.target.id === 'lotsOptionBtn' || e.target.id === 'lotsOptionBtnselection'){
          this.lotsOptionShow = true
      }else {
          this.lotsOptionShow = false
      }
      },false)
    },
    mounted () {
      let that = this
      that.get_comment_info()
      that.modifyLocal = 1
      that.province_show = false
      that.city_show = false
      that.isBrandApprove = false
      that.rejectShow = false
    },
    updated () {
      let that = this
      that.$nextTick(()=>{
        that.hideCheckbox()
      })
    }
  }
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
  .lotsOptionShowStyle{
      position:absolute;
      top:30px;
      z-index:2;
      border:1px solid transparent;
      border-radius:6px;
      li{
         background:#fff
      }
      li:hover{background:rgb(236, 245, 255) }
      }
  .nav-tabs{
    .active{
      border-bottom: 2px solid #0086FF;
      a{color:#0086FF;}
    }
    li{
      font-size: 16px;
      width: 129px;
      height: 50px;
      display: inline-block;
      text-align: center;
      line-height: 48px;
      a{
        line-height: 48px;
        display: inline-block;
        cursor: initial;
        background-color: initial;
        border: initial;
        border-bottom-color: initial;
        padding: initial;
        color:#444;
      }
      a:active,a:focus,a:hover{
        color: #0086FF;
        cursor: initial;
        background-color:initial;
        border: initial;
        border-bottom-color: initial;
      }
    }
  }
  .ico_msg{
    width: 16px;
    height: 16px;
    display: inline-block;
    position:relative;
    div{display:none;width:150px;background:#fff;position: fixed;margin-top:20px;z-index:2;height:auto;
      padding:10px; margin-left:-120px;border:1px solid #ccc; border-radius:3px;box-shadow:0px 3px 3px #ccc;
    }
  }
  .ico_msg:hover div{
      display: inline-block;
    }
  /*详情*/
  #myTabContent{position:relative;}
  em.bread{position:fixed; top:80px;left:367px;font-style:normal;color:#333;z-index:9999;}
  .goodInfo{position:absolute;top:-50px;left:0;width:100%;height:840px;padding-top:80px;background:#fff;z-index:99;}
  .goodInfo p,.goodInfo div{margin-left:160px;margin-top:20px;line-height:36px;}
  .goodInfo button{margin-left:160px;margin-top:20px;}
  .goodInfo button.ml20{margin-left:20px;}
  .goodInfo div img{width:100px;height:100px; display:inline-block;}
  .goodInfo .goodInfop
  {
    width:400px;
    word-break:break-all;
  }
  .goodInfo p span,.goodInfo div span{
    margin-left: -160px; display:inline-block;width:160px;padding-right:20px;text-align: right;
  }
  .goodInfo div span.upload{display: block;margin-left:0px;color:#999;}
  .goodInfo p div,.goodInfo div div{margin-left:0;}
  /*删除*/
  .delectGoodCon {
    width: 400px;
    height: 280px;
    background: #fff;
    z-index: 9999;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -180px;
    background: #FFFFFF;
    border-radius: 4px;
    .agreetc_header, .refuse_header {
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
      span.fr{
        cursor: pointer;
      }
    }
  }

  .agreetc_header, .refuse_header {
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
    span.fr{
      cursor: pointer;
    }
  }
  .fr{
    float: right;
  }
  .agreetc_body{
    padding-left: 20px;
    padding-right: 20px;
    background: #FFFFFF;
    margin-top: 10px;
    text-align: center;
    font-size: 20px;
    color: #333333;
    line-height: 150px;
  }
  .agreetc_footer,.refuse_footer {
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
  .delectGoodBg{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999;}
  /*.delectGoodWrap{position:absolute;width:380px;height:280px;padding:10px;border-radius:10px;top:50%;left:50%;margin-left:-200px;background:#fff;z-index:99;}*/
  /*.delectGoodWrap p{line-height:50px;}*/
  .blueBtn,.defultBtn{background:rgb(96, 174, 246);width:80px;height:30px;border-radius:4px;text-align: center;color:#fff;}
  .defultBtn{background:#ccc;}
  /*修改/新增*/
  .changeGoodInfo input,.changeGoodInfo select{width:200px;line-height:34px;color:#666;}
  .icon{width:40px;height:40px;z-index:11;display:inline-block;}
  
</style>
