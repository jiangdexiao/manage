<template>
  <div class="goods_detail list" >

    <div class="detail_container">
      <!--商品详情-->
      <div class="g_detail">
      	<div>
					<div v-if='historyContent'>
							<div class="tit0 mt20 mb10 "><h4>{{historyFlag ===1?'变更历史':'变更内容'}}</h4></div>
					<el-table
						:data="dataSource"
						style="width: 95% ;margin-left:40px;">
						<el-table-column
						v-if="historyFlag ===1"
							label="变更时间"
							width=flexWidth>
							<template slot-scope="scope">
							<span>{{scope.row.changeTime|date_format('yyyy-MM-dd hh:m:ss')}}</span>
							</template>
						</el-table-column>
						<el-table-column
							label="变更内容"
							width=flexWidth>
							<template slot-scope="scope">
								<span>{{scope.row.changeType===1?'修改商品分类':scope.row.changeType===2?'修改拍获价':scope.row.changeType===3?'修改供货价':scope.row.changeType===4?'增加sku':''}} </span>
							</template>
						</el-table-column>
						<el-table-column
							label="变更前"
							prop='beforeContent'
							width=flexWidth>
						</el-table-column>
						<el-table-column label="变更后" 	width="540">
							<template slot-scope="scope">
								<div v-if="scope.row.changeType!=4">
									<el-tooltip  placement="right-start" effect="light" >
										<div  style="max-width:270px"  slot='content'>{{scope.row.changeReason}}</div>
											<span>{{scope.row.afterContent}} <i class="iconfont icon-ico_msg"></i></span>
									</el-tooltip>
								</div>
										<el-button v-if="scope.row.changeType==4" id='btn' @click.stop.prevent='showDetailBox($event)'	size="mini"	type="text" > 查看明细
										<div class='detailBoxStyle' id='showDetailBoxId' v-if="scope.row.addSku.length>0">
												<h3 >明细<span class="fr close bg-ico_close02" @click.stop="hiddenDetailBox($event)"  style='cursor:pointer'> </span> </h3>
												<el-table :data="scope.row.addSku"   style="width:100%;padding:10px;" max-height="325" >
													<el-table-column  width="112" 	prop="skuName" label="规格值"></el-table-column>
													<el-table-column width="120" label="对外展示">
															<template slot-scope="scope">
																<el-switch  disabled
																	v-model="scope.row.showStatus"
																	active-color="#13ce66"
																	inactive-color="#ccc">
																</el-switch>
															</template>
													</el-table-column>
													<el-table-column width="120"  prop="availableNum" label="库存"></el-table-column>
													<el-table-column  width="130" prop="weight" label="重量/kg(公斤)" :render-header="renderHeader" ></el-table-column>
													<el-table-column width="120"  prop="photographPrice" label="拍获价/元"></el-table-column>
													<el-table-column width="120"  prop="marketPrice"  label="市场价/元">	</el-table-column>
													<el-table-column width="120" :prop="scope.row.addSku[0].settlementMode==='1'?'supplyPrice':'serviceRate' " :label="scope.row.addSku[0].settlementMode==='1'?'供货价/元':'服务费率/%'"></el-table-column>
													<el-table-column width="120" prop="goodsCode" label="商品编码"></el-table-column>
											</el-table>
										</div>
										</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div style="margin:20px 30px 20px 0;float: right">
								<el-pagination
									@size-change="goodsHistoryHandleSizeChange"
									@current-change="goodsHistoryHandleCurrentChange"
									:current-page="goodsHistoryCurrentPage"
									:page-size="10"
									layout="total, prev, pager, next, jumper"
									:total="goodsHistoryTotalCount">
								</el-pagination>
						</div>
					</div>
      		<div class="tit0 mt20 mb10 "><h4>基本信息</h4></div>
      		<table class="tab_detail">
      				<tr>
      					<td class="a1">
      						商品名称
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsName}}</div>
      					</td>
      					<td class="a3">
      						商品副标题
      					</td>
      					<td class="a4">{{data.goodsSubTitle}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						商品分类
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsClassify}}</div>
      					</td>
      					<td class="a3">
      						商品品牌
      					</td>
      					<td class="a4">{{data.goodsBrandName}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						计量单位
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsUnitName}}</div>
      					</td>
      					<td class="a3">
      						最小起订量
      					</td>
      					<td class="a4">{{data.goodsMinQuantity}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						运费模板
      					</td>
      					<td class="a2">
      						<div class="wobse">{{data.goodsPostageName}}</div>
      					</td>
      					<td class="a3">
      						商品条形码
      					</td>
      					<td class="a4">{{data.goodsBarCode}}</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						关键词
      					</td>
      					<td class="a2" colspan="3">
      						<div class="wobse">{{goodsKeyWord}}</div>
      					</td>
      				</tr>
      				<tr>
      					<td class="a1">
      						商品保障
      					</td>
								<td class="a2" colspan="3">
      						<div class="wobse"><p v-for="(item,index) in goodsGuarantee">{{index+1}}.{{item.guaranteeName}}<span v-if="item.guaranteeDesc !=undefined && item.guaranteeDesc !=''">-{{item.guaranteeDesc}}</span></p></div>
      					</td>
      				</tr>
      		</table>
      		<div class="tit0 mt20 mb20 "><h4>商品规格</h4></div>
					<template v-if="data.skuFlag==0">
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格</td>
									<td>库存</td>
									<td>重量/kg{{data.goodsUnitName==''?'':'（'+data.goodsUnitName+'）'}}<div class="icon">
                    <div class="tips" style="width:400px;z-index:2;">
                      <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                    </div>
                  </div></td>
									<td>拍获价/元</td>
									<td>市场价/元</td>
									<td>{{countMode==1?'供货价':'服务费率/%'}}</td>
									<td>商品编码</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(good,index) in goodsSKUs">
                  <td>无</td>
									<td>{{good.availableNum}}</td>
									<td>{{good.weight}}</td>
									<td>{{good.photographPrice}}</td>
									<td>{{good.marketPrice}}</td>
									<td v-if="countMode==1">{{good.supplyPrice}}</td>
            			<td v-if="countMode==2">{{data.serviceRate}}</td>
									<td>{{good.goodsCode}}</td>
								</tr>
							</tbody>
						</table>
					</template>
      		<template v-if="data.skuFlag==1">
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格</td>
									<td>规格值</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item,index) in goodsSpecifications">
									<td>{{item.itemName}}</td>
									<td>
										<template v-for="tag in item.itemValue">{{tag.spec_name+"  &nbsp; "}}</template>
									</td>
								</tr>
							</tbody>
						</table>
						<table class="tab_detail02">
							<thead>
								<tr>
									<td>规格值</td>
									<td>对外展示</td>
									<td>库存</td>
									<td>重量/kg{{data.goodsUnitName==''?'':'（'+data.goodsUnitName+'）'}}<div class="icon">
                    <div class="tips" style="width:400px;z-index:2;">
                      <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                    </div>
                  </div></td>
									<td>拍获价/元</td>
									<td>市场价/元</td>
                  <td v-if="countMode!='-1'">{{countMode==1?'供货价':'服务费率/%'}}</td>
									<td>商品编码</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(good,index) in goodsSKUs">
            			<td>{{good.skuName}}</td>
									<td>
										<el-switch disabled
											v-model="good.show"
											active-color="#13ce66"
											inactive-color="#ccc">
										</el-switch>
									</td>
									<td>{{good.availableNum}}</td>
									<td>{{good.weight}}</td>
									<td>{{good.photographPrice}}</td>
									<td>{{good.marketPrice}}</td>
                  <td v-if="countMode==1">{{good.supplyPrice}}</td>
                  <td v-if="countMode==2">{{data.serviceRate}}</td>
									<td>{{good.goodsCode}}</td>
								</tr>
							</tbody>
						</table>
					</template>
      		<div class="tit0 mt20 mb20 "><h4>商品详情</h4></div>
      		<div class="div_detail">
            <div class=" mt20" v-if="data.approveStatus == ''|| data.approveStatus == undefined">
      				<span class="tit01 fl">商品识别图</span>
      				<div class="t_img recognizedImg">
								<i class="nothing" v-if="goodsRecognized.length==0">--</i>
								<template v-for="(file,index) in goodsRecognized" v-if="index<6">
									<div class="conimg" @click="imgWrapShow(index)">
										<img class="conimg mr10 fl" :src="file" />
										<div><i class="el-icon-zoom-in"></i></div>
									</div>
								</template>
								<a v-if="goodsRecognized.length>6" @click="imgWrapShow(0)" class="lookMore">查看更多</a>
							</div>
							<div class="clear"></div>
							<span class="t_img fl" style="font-size:12px;color:#999;display:block;margin:10px 0;margin-left:110px;">用于客户端拍摄广告图识别商品</span>
      			</div>
						<!-- 图片弹层 作用于识别图 -->
            <div class="hptczp" v-show="imgWrap"></div>
            <div class="imgWrap" v-show="imgWrap">
							<div class="imgUl">
								<ul>
									<li>
										<img :src="goodsRecognized[imgIndex]" />
									</li>
								</ul>
							</div>
							<div class="ctrl">
								<a @click="prev" class="prev" v-if="imgIndex > 0"></a>
								<a @click="next" class="next" v-if="imgIndex < goodsRecognized.length-1"></a>
							</div>
							<div class="ctrlImg">
								<a @click="prevImg" class="prevImg" v-show="ulIndex > 0"><span></span></a>
								<div class="ctrlImgUl">
									<ul id="ctrlImgUl">
										<li v-for="(file,index) in goodsRecognized" class="mr10 fl" :class="{'active':index==imgIndex}" @click="checkImg(index)">
											<img :src="file" />
										</li>
									</ul>
								</div>
								<a @click="nextImg" class="nextImg" v-show="ulIndex < ulLength-1"><span></span></a>
							</div>
							<a class="close" @click="imgWrapHide"></a>
            </div>
						<div >

						</div>
						<div class="clear"></div>
      			<div class=" mt20" style='overflow:hidden'>
      				<span class="tit01 fl">商品主图</span>
      				<div class="t_img fl" >
								<template v-for="file in fileList">
									<img :src='file'/>
								</template>
							</div>
      			</div>
						<div class="clear"></div>
						<div class="mt20" style='overflow:hidden'>
      				<span class="tit01 fl">主图视频</span>
      				<span class="t_img fl ">
								<i class="nothing" v-if="data.goodsMainVideo==''">--</i>
								<template v-if="data.goodsMainVideo!==''">
									<div class="positionR">
										<img class="mainImg" :src="fileList[0]" />
										<a @click="showVideo" class="showVideo">&#xe691;</a>
									</div>
								</template>
							</span>
      			</div>
						<!--主图视频-->
						<div class="hptczp" v-if="videoShow"></div>
						<div class="videoBox" v-if="videoShow">
							<a class="close" @click="videoHide"></a>
							<video :src="data.goodsMainVideo" controls width="100%" height="100%"></video>
						</div>
      			<div class="mt20" style="display:block;overflow:hidden">
      				<span class="tit01 fl">图文详情</span>
							<div class="t_img fl">
								<i class="nothing" v-if="info==''">--</i>
								<div v-html="info">{{info}}</div>
      				<!-- <div id="editor-container">
								<UE :config=config ref="ue"></UE>
							</div> -->
							</div>
      			</div>
      		</div>
      	</div>
      </div>
      <!--媒体资源-->
      <!-- <div v-show="showactive02" class="media_resources">
      	<table class="tab_detail03">
      		<thead>
      			<tr>
      				<td>已绑定媒体/5</td>
      				<td>合作方式</td>
      				<td>已绑定广告位/25</td>
      				<td>详情</td>
      			</tr>
      		</thead>
      		<tbody>
      			<tr>
      				<td>万豪酒店集团</td>
      				<td>平台型</td>
      				<td>3</td>
      				<td>
      					<i class="icon_back" v-show="showback" @click="Showtab02"></i>
      					<i class="icon_open" v-show="showopen" @click="Showtab"></i>
      				</td>
      			</tr>
      			<tr v-show="showback">
      				<td colspan="4" style="padding: 0px;">
      					<table class="tab_detail04">
      						<thead>
      							<tr>
      								<td>广告位名</td>
      								<td>广告位ID</td>
      								<td>广告位分类</td>
      								<td>媒介属性</td>
      								<td>展现形式</td>
      								<td>有效时间</td>
      								<td>地理位置</td>
      							</tr>
      						</thead>
      						<tbody>
      							<tr>
      								<td>电梯A座1号广告位</td>
      								<td>1</td>
      								<td>2</td>
      								<td>3</td>
      								<td>4</td>
      								<td>5</td>
      								<td>广东省深圳市南山区</td>
      							</tr>
      						</tbody>
      					</table>
      				</td>
      			</tr>
      		</tbody>
      	</table>
      </div> -->
      <div class="hptczp" v-show="showReject===true"  style=""></div>
      <div class="hptczp_content"  v-show="showReject===true">
        <div class="hptczp_header">
          <span>拒绝原因</span>
          <span class="fr close" @click="cancel()"></span>
        </div>
        <div class="hptczp_body">
          <textarea placeholder="请填写100字符以内内容" v-model="rejectReason" :maxlength="100"></textarea>
        </div>
        <div class="hptczp_footer">
          <button type="button" class="btn save" @click="reject()"  :disabled="rejectReason==''">确认</button>
          <button type="button" class="btn cancel" @click="cancel()" >取消</button>
        </div>
      </div>
    </div>
  <!--返回-->
		<div class="return poi3">
			<el-button v-show="data.approveStatus !== undefined && data.approveStatus === 1" type="primary" size="medium" @click="agree ()">同意上架</el-button>
			<el-button v-show="data.approveStatus !== undefined && data.approveStatus === 1" type="danger" size="medium" @click="showRejectDiv ()">拒绝上架</el-button>
			<el-button size="medium" @click="goBack()">返回</el-button>
		</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
				historyContent:false, // 变更历史 内容是否显示
				flexWidth:'',
				historyFlag:'',
				dataSource:[{addSku:[{
					settlementMode:''
				}]}], // 商品审核/ 库内容变动数据
				detailData:[], // 明细
				goodsHistoryPageRows: 10,
        goodsHistoryCurrentPage: 1,
				goodsHistoryTotalCount: 0,
        showReject: false,
        rejectReason: '',
        showactive02: false,
        showback: false,
        showopen: true,
        goodsId: this.$route.query.goodsId,
        data: '',
        goodsSpecifications: [],
        goodsSKUs: [],
        fileList: [],
        goodsKeyWord: '',
        goodsGuarantee: [],
        dialogImageUrl: '',
        dialogVisible: false,
        uploadUrl: this.localbase + 'm2c.support/img/upload',
        upLoadData: {
          imgGroup: 2},
        info: '',
				fileListShow: [],
				goodsRecognized:[],
				imgWrap:false, //图片盒子显示隐藏
				imgIndex:0, //大图
				ulIndex:0, //小图
				ulLength:1, //小图页数
				videoShow:false, //视频弹层
      }
		},
    methods: {
			//主图视频showVideo
			showVideo(){
				this.videoShow = true
			},
			videoHide(){
				this.videoShow = false
			},
			// 图片放大
      imgWrapShow(index){
				let that = this
				that.imgWrap = true
				that.imgIndex = index
				let l = that.goodsRecognized.length * 74 + 'px'
				document.getElementById('ctrlImgUl').style.width=l
      },
      prev(){
        let that = this
        if(that.imgIndex > 0){
          that.imgIndex--
        }
				that.ulIndex = Math.ceil((that.imgIndex+1)/8)-1
				document.getElementById('ctrlImgUl').style.marginLeft = -that.ulIndex*'592'+'px'
      },
      next(){
        let that = this
        if(that.imgIndex < that.goodsRecognized.length-1){
          that.imgIndex++
        }
				that.ulIndex = Math.ceil((that.imgIndex+1)/8)-1
				document.getElementById('ctrlImgUl').style.marginLeft = -that.ulIndex*'592'+'px'
			},
			// 小图
			nextImg(){
				let that = this
				that.ulLength = Math.ceil(that.goodsRecognized.length/8)
				that.ulIndex = Math.ceil((that.imgIndex+1)/8)-1
				if(that.ulIndex<that.ulLength-1)
				that.ulIndex++
				console.log(that.ulIndex)
				document.getElementById('ctrlImgUl').style.marginLeft = -that.ulIndex*'592'+'px'
				that.imgIndex = that.ulIndex*8
				console.log(that.imgIndex)
			},
			prevImg(){
				let that = this
				that.ulLength = Math.ceil(that.goodsRecognized.length/8)
				that.ulIndex = Math.ceil((that.imgIndex+1)/8)-1
				if(that.ulIndex>0)
				that.ulIndex--
				console.log(that.ulIndex)
				document.getElementById('ctrlImgUl').style.marginLeft = -that.ulIndex*'592'+'px'
				that.imgIndex = that.ulIndex*8
				console.log(that.imgIndex)
			},
			checkImg(index){
				let that = this
				that.imgIndex = index
			},
			// 关闭弹层
			imgWrapHide(){
				let that = this
				that.imgIndex = 0
				that.ulIndex = 0
				that.imgWrap = false
				document.getElementById('ctrlImgUl').style.marginLeft = '0px'
			},
      showRejectDiv () {
        var that = this
        that.showReject = true
      },
      cancel () {
        let that = this
        that.showReject = false
        that.rejectReason = ''
      },
      reject () {
        let that = this
        if (that.rejectReason == '') {
          return
        }
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
          that.$router.push({name: 's_product_list', query: {activeName: 'second'}})
        })
      },
      agree () {
        let that = this
        this.api_sellerManagePlatform_goodsApproveAgree({
          data: {
            goodsId: that.$route.query.goodsId
          }
        }).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status == '200') {
            that.$message({
							type:'success',
							message:'操作成功'
						})
            that.$router.push({name: 's_product_list', query: {activeName: 'first'}})
          } else {
            that.$message('同意审核异常')
          }
        })
      },
      goBack () {
				if(this.$route.query.from=='a'){
					this.$router.push({name:'s_product_list',query:{activeName:'first'}})
				}else if(this.$route.query.from=='b'){
					this.$router.push({name:'s_product_list',query:{activeName:'second'}})
				}
      },
      Showtab () {
        var that = this
        that.showback = true
        that.showopen = false
      },
      Showtab02 () {
        var that = this
        that.showopen = true
        that.showback = false
      },
      goodsInfo () {
        let that = this
        if (that.$route.query.approveStatus == '' || that.$route.query.approveStatus == undefined) {
          this.api_sellerManagePlatform_getGoodsDetail({
            pathParams: '/' + that.$route.query.goodsId
          }).then(result => {
            if (result == undefined) {
              return false
            } else if (result.status == '200') {
              that.data = result.content
              that.data.skuFlag = result.content.skuFlag.toString()
              that.goodsSpecifications = result.content.goodsSpecifications
              that.goodsSKUs = result.content.goodsSKUs
              that.fileList = result.content.goodsMainImages
              if (result.content.goodsRecognized == undefined) {
                that.goodsRecognized = []
              } else {
                for ( let i = 0; i < result.content.goodsRecognized.length; i++) {
                  that.goodsRecognized.push(result.content.goodsRecognized[i].recognizedUrl)
                }
              }
              that.ulLength = Math.ceil(that.goodsRecognized.length / 8)
              that.info = result.content.goodsDesc
              that.goodsKeyWord = result.content.goodsKeyWord.join('/')
              that.goodsGuarantee = result.content.goodsGuarantee
              that.countMode = result.content.settlementMode
              console.log(that.countMode)
              if (result.content.recognizedUrl === '') {
                 return
              } else {
                that.fileListShow.push(eval('(' + '{url:"' + result.content.recognizedUrl + '"}' + ')'))
              }
            }
          })
        } else {
          this.api_sellerManagePlatform_getGoodsApproveDetail({
            pathParams: '/' + that.$route.query.goodsId
          }).then(result => {
            if (result == undefined) {
              return false
            } else if (result.status == '200') {
              that.data = result.content
              that.data.skuFlag = result.content.skuFlag.toString()
              that.goodsSpecifications = result.content.goodsSpecifications
              that.goodsSKUs = result.content.goodsSKUs
              that.fileList = result.content.goodsMainImages
              if (result.content.goodsRecognized == undefined) {
                that.goodsRecognized = []
              } else {
                for ( let i = 0; i < result.content.goodsRecognized.length; i++) {
                  that.goodsRecognized.push(result.content.goodsRecognized[i].recognizedUrl)
                }
              }
              that.ulLength = Math.ceil(that.goodsRecognized.length / 8)
              that.info = result.content.goodsDesc
              that.goodsKeyWord = result.content.goodsKeyWord.join('/')
              that.goodsGuarantee = result.content.goodsGuarantee
              that.countMode = result.content.settlementMode
              console.log(that.countMode)
              if (result.content.recognizedUrl === '') {
                return
              } else {
                that.fileListShow.push(eval('(' + '{url:"' + result.content.recognizedUrl + '"}' + ')'))
              }
            }
          })
        }
			},
				// 商品库 /审核 变更历史
			getGoodsInfoHistory(){
				let  parameter = {
						goodsId :this.goodsId,
						pageNum:this.goodsHistoryCurrentPage,
						rows:this.goodsHistoryPageRows,
				}
				this.api_sellerManagePlatform_getGoodsInfoHistory({
					data:parameter,
					path:this.historyFlag===1? 'm2c.scm/admin/goods/history':'m2c.scm/admin/goods/approve/history',
          }).then(result => {
            if (result == undefined) {
              return false
            } else if (result.status == '200') {
							console.log('商品库/审核变更历史数据/',result.content)
							if(result.content!==""){
								this.historyContent =true
							}
							// addSku明细 switch 数据转换
							console.log(1111)
							for(let i =0;i<result.content.length;i++ ){
								for(let j =0;j<result.content[i].addSku.length;j++){
										if(result.content[i].addSku[j].showStatus===2){
											result.content[i].addSku[j].showStatus= true
										}else{
											result.content[i].addSku[j].showStatus= false
										}
								}
							}
							console.log('result.content.changeReason',result.content)
						  this.dataSource = result.content
						  this.goodsHistoryTotalCount =result.totalCount
            }
          })
			}
			// 商品库变更历史  页码
			, goodsHistoryHandleSizeChange(val) {
        let that = this
        that.goodsHistoryCurrentPage = val
        that.getGoodsInfoHistory();
      }
      , goodsHistoryHandleCurrentChange(val) {
        let that = this
        that.goodsHistoryCurrentPage = val
        that.getGoodsInfoHistory();
			},
			//  明细表头 渲染
			  renderHeader:(h, {column,index })=>{
				return <el-tooltip placement ='right-start'  effect="light" content='表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg' >
								<span>重量/kg(公斤) <i class ='iconfont icon-ico_explain' style='color:#f09608'></i></span>
						</el-tooltip>
			},
			 showDetailBox (event) {
				let el =event.target
				// 点击到非按钮  return
				if(el.parentNode.id!='btn')return
				// 点击到按钮 其他弹框收起
				let divList = document.querySelectorAll('#showDetailBoxId')
				for(let i = 0;i<divList.length;i++){
						divList[i].style.display="none";
				}
			let  elNew =event.target.children[0] || event.target.parentNode.parentNode
				// console.log(elNew,'elNew')
			 elNew.style.display="block";
			},
			hiddenDetailBox(event){
			let elNew =event.target.children[0] || event.target.parentNode.parentNode
				// console.log(elNew,'elNew2')
			 elNew.style.display="none";
			}
    },
    mounted () {
			let that = this
			that.goodsInfo()
			if(this.$route.query.from=='a'){
				this.historyFlag =1
				this.flexWidth ='387'
			}else if(this.$route.query.from=='b'){
					this.historyFlag =2
					this.flexWidth ="516"
			}
			// 商品审核详情
			that.getGoodsInfoHistory()
		},
		created(){
			// 点击到空白处 弹框消失
			let body =document.querySelector('body')
			body.addEventListener('click',(e)=>{
			let divList = document.querySelectorAll('#showDetailBoxId')
				for(let i = 0;i<divList.length;i++){
						divList[i].style.display="none";
				}
			})
		}
  }
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
 video::-internal-media-controls-download-button {
    display:none;
}

video::-webkit-media-controls-enclosure {
    overflow:hidden;
}

video::-webkit-media-controls-panel {
    width: calc(100% + 30px);
}
 .icon-ico_msg:hover .changeReason{
	 		display:block!important;
			z-index: 10000;
 }
 .videoBox{width:660px;height:440px;z-index: 1000;position: fixed;top:50%;left:50%;margin-left:-330px;margin-top:-220px;
	a.close{
		display:inline-block;width:30px;height:30px;opacity: 1;
		position: absolute;top:-60px;right:-200px; background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -350px -181px no-repeat;
	}
}
.positionR{position:relative;width:150px;height:100px;overflow: hidden;}
i.nothing{
	display:inline-block;line-height:36px;
}
.goods_detail{
  /*background: #fff;*/
  padding: 20px 30px;
  .return{
  	width: 100%;
  	height: 65px;
  	background: #FFFFFF;
		box-shadow: 0 -1px 3px 0 rgba(0,0,0,0.30);
		line-height: 60px;
		padding-left: 10px;
		bottom: 0px;
		left: 200px;
		.r_fh{
			border: 1px solid #CCCCCC;
			border-radius: 2px;
			font-size: 14px;
			color: #333333;
			width: 80px;
			height: 30px;
			line-height: 30px;
			background: #fff;
		}
  }
  .detail_container{
  	min-height: 800px;
  	background: #fff;
  	padding:0px;
  	margin-bottom: 50px;
  	padding-bottom: 30px;
  	.nav{
  		box-shadow: 0 1px 0 0 #EDF0F7;
  		width: 100%;
  		height: 40px;
  		line-height: 40px;
  		.nav_tit{
  			width:130px;
  			height:40px;
  		 	display: inline-block;
  		 	text-align:center;
  			a{
  			color: #666666;
  			text-decoration: none;
  			cursor: pointer;
  		}
  		}
  		.active{
  			border-bottom: 2px solid #0086FF;
  			a{
  				color:#0086FF;
  			}
  		}
  	}
  	.g_detail{
  		.tit0{
  			font-size: 16px;
				color: #333333;
				padding-left: 20px;
				line-height: 30px;
  		}
  		.tab_detail{
				border: 1px solid #E5E5E5;
				border-collapse: collapse;
  			margin: auto;
				width: 95%;
				font-size:14px;
  			tr{
  				min-height: 40px;
  				border-bottom: 1px solid #E5E5E5;
  				td{
  					height: 40px;
  					text-align: center;
  				}
  			}
  			.a1{
  				width: 13.8%;
  				background-color: rgb(244, 245, 255);
  				font-size: 14px;
					color: #666666;
  			}
  			.a2{
  				width: 36%;
  				text-align: left;
					padding-left: 10px;
					color:#333;
					p{padding-top:6px;
						span{color:#999;}
					}
  			}
  			.a3{
  				width: 13.8%;
  				background-color: rgb(244, 245, 255);
  				font-size: 14px;
					color: #666666;
  			}
  			.a4{
  				width: 36%;
  				text-align: left;
					padding-left: 10px;
					color:#333;
  			}
  		}
  		.tab_detail02{
  			margin: 20px auto;
				width: 95%;
				border-collapse: collapse;
				font-size: 14px;
				color:#333;
  			thead{
  				background: #DFE9F6;
  				td{
  					height: 40px;
  				}
  			}
  			tbody{
  				background: #f4f5ff;
  				td{
  					height: 60px;
  				}
  			}
  			td{
  				text-align: left;
  				padding-left: 30px;

  			}
  		}
  		.div_detail{
  			margin: auto;
  			width: 95%;
  			padding-left: 30px;
  			.tit01{
  				font-size: 14px;
					color: #666666;
					display: inline-block;
					line-height: 40px;
					margin-right: 20px;
					width:90px;text-align: right;
  			}
  			.t_img{
					height:auto;margin-top:10px;
					img{
						width:100px;height:100px;margin-right:20px;
					}
					img.mainImg,a.showVideo{width:150px;height:100px;position:absolute;top:0;left:0;}
					a.showVideo{display:inline-block;background:rgba(0,0,0,0.5);
					transition: all 0.3s ease; font-family:"iconfont" !important;color:#fff;
    font-size:30px;font-style:normal;line-height:100px;text-align: center;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;}
					a.showVideo:hover{transform-origin: center center;transform: scale(1.1);}
				}
				.overflow{
					width:148px;height:148px;overflow: hidden;
				}
  			.t_img02{
  				border: 1px solid #E6E8F2;
					border-radius: 2px;
					width: 70%;
					max-height: 367px;
					overflow-y: auto;
  				img{
  					width: 750px;
  					height: 367px;
  					margin-right: 20px;
  				}
  			}
				a.lookMore{display:inline-block;width:100px;height:100px; border:1px solid #E6E8F2;text-align: center;line-height: 100px;color:#667991; cursor:pointer;}
				.conimg{
          width: 100px;
          height: 100px;
          position: relative;
          display: inline-block;float:left;margin-right:10px;
          div{
            position: absolute;
            width:100px;height:100px;
            top: 0;
            left: 0;
            background:rgba(255,255,255,0.5);
            display: none;
            i{width:16px;height:16px;position:absolute;top:44px;left:44px;}
          }
        }
        .conimg:hover div{
          display: block;
        }
  		}
  	}
  	.media_resources{
  		width: 95%;
  		margin: auto;
  		.tab_detail03{
  			width:100%;
  			margin-top:30px;
  			border:1px solid #E5E5E5;
  			thead{
  				background: #DFE9F6;
  				td{
  					height: 40px;
  					padding-left: 30px;
  					font-size: 14px;
						color: #333333;
  				}
  			}
  			tbody{
  				background: #fff;
  				tr{
  					border-bottom:1px solid #E5E5E5;
  					td{
  					height: 60px;
  					padding-left: 30px;
  					font-size: 16px;
						color: #333333;
						.icon_back{
							width: 16px;
							height: 16px;
							display: block;
							background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -964px -282px no-repeat;
							cursor: pointer;
						}
						.icon_open{
							width: 16px;
							height: 16px;
							display: block;
							background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -848px -514px no-repeat;
							cursor: pointer;
						}
  				}
  				}

  			}
  		}
  		.tab_detail04{
  			width: 100%;
  			thead{
  				background: #F4F5FA;
  				tr{
  					td{
  						height: 40px;
  						font-size: 14px;
							color: #666666;
  					}
  				}
  			}
  			tbody{
  				background: #EDF0F7;
					box-shadow: 0 1px 0 0 #E5E5E5;
  				tr{
  					td{
  						height: 60px;
  						font-size: 14px;
  					}
  				}
  			}
  		}
  	}
  }

}
/*公用样式*/
.mt5{
  margin-top: 5px;
}
.mt10{
  margin-top: 10px;
}
.mt20{
  margin-top: 20px;
}
.ml10{
  margin-left: 10px;
}
.ml20{
  margin-left: 20px;
}
.mr20{
  margin-right: 20px;
}
.mr10{
  margin-right: 10px;
}
.mb10{
  margin-bottom: 10px;
}
.mb20{
  margin-bottom: 20px;
}
.ml30{
  margin-left: 30px;
}
.poi1{
  position: relative;
}
.poi2{
  position: absolute;
}
.poi3{
  position: fixed;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.wose{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.clear{
  clear: both;
  overflow: hidden;
}
.border_r{
  border-right: 1px solid #e5e5e5;
}
.border_b{
  border-bottom: 1px solid #e5e5e5;
}
.hptczp{
  width: 100%;
  height: 100%;
  display: block;
  position: fixed;
  left: 0px;
  top: 0px;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  opacity: 0.5;

}
  .imgWrap{
		//禁用选中
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-khtml-user-select: none;
		user-select: none;
    width:670px;
    height:685px;
    position: fixed;
    top:50%;left:50%;
    margin-top:-343px;
    margin-left:-335px;
    z-index: 999;
		.ctrlImg{width:100%;height:70px;margin-top:15px;position: absolute;top:615px;left:0;
			a.prevImg,a.nextImg{display:inline-block;width:30px;height:70px;margin-right:5px;background:#fff;float:left;border-radius:5px;opacity:0.6;padding-left:10px;line-height: 84px;transition: all .3s ease;position:absolute;top:0;left:0;}
			a.prevImg span,a.nextImg span{display: inline-block;width:10px;height:24px;background:url('../../../../../static/images/sellerManage/nextImg.png') no-repeat 0 0;}
			a.prevImg span{background:url('../../../../../static/images/sellerManage/prevImg.png') no-repeat 0 0;}
			a.nextImg{padding-left:6px;left:640px;}
			a.prevImg:hover,a.nextImg:hover{opacity:1; text-decoration:none; cursor:pointer;padding-left:10px;}
			a.prevImg:hover{padding-left:6px;}
			.ctrlImgUl{position:absolute;left:35px;width:600px;height:70px;border-radius:5px;background:#fff;padding:5px 10px;margin-right:5px;float:left;overflow: hidden;
				ul{width:auto; list-style:none;transition: all .3s ease;
					li{width:60px;height:60px;margin-right:14px;
						img{width:100%;height:100%;}
					}
					li.active{border:4px solid #18DCF6;}
				}
			}
			a.nextImg{margin-right:0px;}
		}
    a.close{
      display:inline-block;width:30px;height:30px;opacity: 1;
      position: absolute;top:-60px;right:-200px;  background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -350px -181px no-repeat;
    }
    div.imgUl{
      width:600px;
      height:600px;
      position: absolute;
      top:0px;left:35px;
      vertical-align: middle;
      display: table;
      ul{
        width:600px;
        height:600px;white-space:nowrap; float: left;list-style-type:none;
        li{
          line-height:600px;text-align:center;
          width:600px;
          height:600px;
          img{max-width:600px;max-height:600px;}
        }
      }
    }
    div.ctrl{
      position: absolute;
      top:260px;
      left:-130px;
      width:920px;
      a{
        width:50px;height:50px;display:inline-block;position:absolute;
      }
      a.prev{top:0;left:0px;background:url('../../../../../static/images/sellerManage/css_sprites.png') no-repeat -50px -50px ;opacity:0.4}
      a.next{top:0;right:0px;background:url('../../../../../static/images/sellerManage/css_sprites.png') no-repeat -200px -50px;opacity:0.4}
      a.prev:hover{transition: all 0.2s ease;opacity:1}
      a.next:hover{transition: all 0.2s ease;opacity:1}
    }
  }
.hptczp_content{
  width: 420px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -140px;
  background: #FFFFFF;
  border-radius: 4px;
  .hptczp_header{
		width:100%;
		line-height: 50px;
    height: 50px;
    background: #DFE9F6;
    span{
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
  .hptczp_body{
    padding-left: 20px;
    padding-right: 20px;
    background: #FFFFFF;
    margin-top: 10px;
    textarea{
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
  .hptczp_footer{
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
		#uploadImg{
			width:150px;height:150px;overflow: hidden;
		}
		.el-upload--picture-card{
			overflow: hidden;
		}
  }
}
.detailBoxStyle{
position:absolute;
clear: both;
overflow: auto;
top:26px;
right:0px;
width:986px;
height:auto;
z-index:2000;
display: none;
border: 1px solid #ccc;
border-radius: 5px;
background-color: #fff;
h3{
	height:50px;
	line-height:50px;
	padding:0px 25px;
	text-align:left;
	background-color:#DFE9F6;
	color:#666;
	span.close{display:inline-block;width:50px; height:50px;position:absolute;top:0; right:0;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -294px -326px no-repeat;opacity:1;}
}
	.el-table{
		margin-top: 10px;
		margin-bottom: 10px;
		background-color: #fff;
	}
}
</style>
<style>
.el-table__body-wrapper,.el-table, .el-table td{
	overflow:visible !important;
}
	.detailBoxStyle .el-table::before{
			display: none!important;
		}
		.el-table__header-wrapper{
			width: 962px;
		}
		.el-table__row  div{
			text-align: left;
		}
</style>
