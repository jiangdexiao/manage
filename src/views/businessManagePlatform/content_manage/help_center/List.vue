<template>
    <div class="helpcenter">
		<el-col :span="24"  v-if="compareShow">
			<div class="restore">
					系统检测到您上次编辑时异常退出，当前页面以保存上次操作的内容，如需恢复到上次“发布客户端”的内容，点击
					<button class="re_btn" @click="re_list">恢复上次内容</button>
			</div>
		</el-col>
		<el-col :span="24" class="helpcenter_cen">
			<div class="helpcenter_top">
				<span class="mr10">栏目编辑</span>
				<i class="icon-intro" v-popover:popover5>
					<el-popover trigger="hover" ref="popover5" placement="top" width="400" class="">
  						<p class="fs12 pad5">1.一级栏目无法新增内容，三级栏目无法新增子级；</p>
  						<p class="fs12 pad5">2.每个栏目有内容的情况下，无法新增子级栏目，需要将原有内容删除；有子级的情况下，同理，需将内容删除；</p>
  						<p class="fs12 pad5">3.最多新增10个一级栏目；每个一级下面最多10个栏目；每个二级下面最多10个三级栏目。</p>
					</el-popover>
					<!--<el-popover ref="popover2" class="fs12" placement="top-start" width="400" trigger="hover">
					<div slot="content">
						
						
						
					</div>
					</el-popover>-->
				</i>
			</div>
			<!--栏目盒子-->
			<div class="helpcenter_ceb">
				<div class="poi1">
					<a class="blue_xz helpcenter_c01" @click="addcolumn">＋新增一级栏目</a>
					<!--新增一级栏目-->
					<div class="add" v-show="firstcolumn">
						<div class="til">
							<el-form ref="form"  label-width="80px">
								<el-form-item label="栏目名称">
									<el-input v-model="firstcolumn_name" @blur="checkColumn(firstcolumn_name)" placeholder="一级栏目名称"></el-input>
								</el-form-item>
							</el-form>
						</div>
						<div class="add_footer">
							<button class="btn add_btn" @click="submit_add()">确认</button>
							<button class="btn cancle_btn" @click="cancle_add()">取消</button>
						</div>
					</div>
				</div>
				
				<!--输入框变成文本框-->
				<div class="mb10" style="border-top:1px solid  #E6E8F2;">
					<!--一级栏目-->
					<div class="helpcentext poi1" v-for="(item,i) in list" :key="i"  @click="hide">
						<div class="hover_c poi1 pl13 pr13 bord_l">
							<!--当有多条数据的时候出现icon-ico_arrows_packup，只有一条数据的时候没有icon-ico_arrows_packup-->
							<span :class="item.childs.length > 0?'p10 mr10':'p18 mr10'" v-show="child_show2!=item.columnId">
								<i class="iconfont icon-ico_arrows_packup tb01" v-show="item.childs.length > 0"  @click="childShow(2,item.columnId)"></i>
							</span>
							<!--点击展开的时候出现-->
							<span class="p10 mr10" v-show="child_show2==item.columnId" >
								<i class="iconfont icon-ico_arrows_unfold tb01" @click="childShow(2,item.columnId)" ></i>
							</span>
							<i class="iconfont tb02 mr10 icon-ico_arrows_default" @click="move(item.columnId)"></i>
							<span class="mr10">{{(i+1)}}</span>
							<span class="mr10" v-show="input_show != item.columnId" >{{item.columnName}}</span>
							<span class="input" v-show="input_show == item.columnId">
								<!--<el-input class="helpceninput" v-model="item.columnName" placeholder="输入栏目名称"></el-input>-->
								<el-input @click.native="prevent" @keyup.enter.native="editName" @blur="editName" class="helpceninput" v-model="edit_name.columnName" placeholder="输入栏目名称"></el-input>
							</span>
							<i class="iconfont icon-ico_compile tb03 mr10" @click="inputShow(item)"></i>
							<span class="show_hide">
								<a class="blue_xz mr30 tb04" @click="add_sec_third(2,item)">＋新增二级栏目</a>
								<span class="mr5">{{item.status==1?'显示':'隐藏'}}</span>
								<i class="iconfont tb02 mr10 icon-ico_arrows_default"  @click="showH(item.columnId)"></i>
							</span>
							<!--移动-->
							<div class="poi2 Moving" v-show="Moving == item.columnId">
									<div v-show="i!=0" @click="up_down(item,list[i-1])">上移</div>
									<div v-show="i!=(list.length-1)" @click="up_down(item,list[i+1])">下移</div>
									<div @click="del_column(item)">删除</div>
							</div>
						</div>
						<!--隐藏显示-->
						<div class="poi2 show_h"  v-show="showh == item.columnId">
							<div><el-radio v-model="item.status" :label="one" @change="show_hide(item)">显示</el-radio></div>
							<div><el-radio v-model="item.status" :label="zero" @change="show_hide(item)">隐藏</el-radio></div>
						</div>
						<div class="add_sec" v-show="sec_third_show == item.columnId">
							<span class="input ml100" >
								<el-input  :autofocus='autofocus' class="helpceninput" v-model="sec_third.columnName" @blur="checkColumn(sec_third.columnName)" placeholder="二级栏目名称"></el-input>
							</span>
							<span class="ml10">
								<button class="btn sure" @click="submit_add()">确认</button>
								<button class="btn cancle ml10" @click="cancle_add()">取消</button>
							</span>
						</div>
						<!--二级栏目-->
						<div class="helpcentext poi1" v-for="(item2,i2) in item.childs" :key="i2" v-show="child_show2==item.columnId" >
							<div class="hover_c poi1 pr13 pl43 bord_l">
								<!--当有多条数据的时候出现icon-ico_arrows_packup，只有一条数据的时候没有icon-ico_arrows_packup-->
								<span :class="item2.childs.length>0?'p10 mr10':'p18 mr10'" v-show="child_show3!=item2.columnId">
									<i class="iconfont icon-ico_arrows_packup tb01 " v-show="item2.childs.length>0" @click="childShow(3,item2.columnId)"></i>
								</span>
							
								<!--点击展开的时候出现-->
								<span class="p10 mr10" v-show="child_show3==item2.columnId">
									<i class="iconfont icon-ico_arrows_unfold tb01" @click="childShow(3,item2.columnId)"></i>
								</span>
								<i class="iconfont tb02 mr10 icon-ico_arrows_default"  @click="move(item2.columnId)"></i>
								<span :class="item2.isHasContent== 0?'mr10'  :'mr10 has_cont' ">{{'0'+(i2+1)}}</span>
								<span class="mr10 has_cont" v-show="input_show != item2.columnId && item2.isHasContent!= 0" @click="add_content(item2)">{{item2.columnName}}</span>
								<span class="mr10" v-show="input_show != item2.columnId && item2.isHasContent== 0">{{item2.columnName}}</span>
								<span class="input" v-show="input_show == item2.columnId">
									<!--<el-input class="helpceninput" v-model="item2.columnName" placeholder="输入栏目名称"></el-input>-->
									<el-input @click.native="prevent" @keyup.enter.native="editName" @blur="editName" class="helpceninput" v-model="edit_name.columnName" placeholder="输入栏目名称"></el-input>
								</span>
								<i class="iconfont icon-ico_compile tb03 mr10" @click="inputShow(item2)"></i>
								<span class="show_hide">
									<!--v-if="item2.isHasChildCol == 0"-->
									<a class="blue_xz mr30 tb04" v-if="item2.isHasContent==0" @click="add_sec_third(3,item2)">＋新增三级栏目</a>
									<a class="yellow_add mr30 tb04" v-if="item2.isHasContent==0 && item2.isHasChildCol==0" @click="add_content(item2)">＋添加内容</a>
									<span :class=" item.status == 1 ? 'mr5':'mr33'">{{item2.status==1?'显示':'隐藏'}}</span>
									<i class="iconfont tb02 mr10 icon-ico_arrows_default" v-show="item.status == 1"  @click="showH(item2.columnId)"></i>
								</span>
								<!--移动-->
								<div class="poi2 Moving" v-show="Moving == item2.columnId">
									<div v-show="i2!=0" @click="up_down(item2,item.childs[i2-1])">上移</div>
									<div v-show="i2!=(item.childs.length-1)" @click="up_down(item2,item.childs[i2+1])">下移</div>
									<div @click="del_column(item2)">删除</div>
								</div>
							</div>
							<!--隐藏显示-->
							<div class="poi2 show_h" v-show="showh == item2.columnId">
								<div><el-radio v-model="item2.status" :label="one" @change="show_hide(item2)">显示</el-radio></div>
								<div><el-radio v-model="item2.status" :label="zero" @change="show_hide(item2)">隐藏</el-radio></div>
							</div>
							<!--新增-->
							<div class="add_sec" v-show="sec_third_show == item2.columnId">
								<span class="input ml100" >
									<el-input  class="helpceninput" :autofocus='autofocus' v-model="sec_third.columnName" @blur="checkColumn(sec_third.columnName)"  placeholder="三级栏目名称"></el-input>
								</span>
								<span class="ml100">
									<button class="btn sure" @click="submit_add()">确认</button>
									<button class="btn cancle ml10" @click="cancle_add()">取消</button>
								</span>
							</div>
							<!--三级栏目-->
							<div class="helpcentext poi1 pr13 pl116 bord_l"  v-for="(item3,i3) in item2.childs" :key="i3" v-show="child_show3==item2.columnId">
								<div class="hover_c poi1">
									<i class="iconfont tb02 mr10 icon-ico_arrows_default" @click="move(item3.columnId)"></i>
									<span :class="item3.isHasContent== 0?'mr10' :'mr10 has_cont'">{{'00'+(i3+1)}}</span>
									<span :class="item3.isHasContent== 0?'mr10' :'mr10 has_cont'" v-show="input_show != item3.columnId && item3.isHasContent==0"  >{{item3.columnName}}</span>
									<span :class="item3.isHasContent== 0?'mr10' :'mr10 has_cont'" v-show="input_show != item3.columnId && item3.isHasContent==1"  @click="add_content(item3)">{{item3.columnName}}</span>
									<span class="input" v-show="input_show == item3.columnId">
										<!--v-on:click.stop="doThis"-->
										<el-input @click.native="prevent"  @keyup.enter.native="editName" @blur="editName" class="helpceninput" v-model="edit_name.columnName" placeholder="输入栏目名称"></el-input>
									</span>
									<i class="iconfont icon-ico_compile tb03 mr10" @click="inputShow(item3)"></i>
									<span class="show_hide" >
										<!--<a class="blue_xz mr30 tb04">＋新增三级栏目</a>-->
										<a class="yellow_add mr30 tb04" v-if="item3.isHasContent==0" @click="add_content(item3)" >＋添加内容</a>
										<span :class=" item2.status == 1 ? 'mr5':'mr33'">{{item3.status==1?'显示':'隐藏'}}</span>
										<i class="iconfont tb02 mr10 icon-ico_arrows_default"  v-show="item2.status == 1"  @click="showH(item3.columnId)"></i>
									</span>
									<!--移动-->
									<div class="poi2 Moving" v-show="Moving == item3.columnId">
										<div v-show="i3!=0"  @click="up_down(item3,item2.childs[i3-1])">上移</div>
										<div v-show="i3!=(item2.childs.length-1)" @click="up_down(item3,item2.childs[i3+1])">下移</div>
										<div @click="del_column(item3)">删除</div>
									</div>
								</div>
								<!--隐藏显示-->
								<div class="poi2 show_h"  v-show="showh == item3.columnId">
									<div><el-radio v-model="item3.status" :label="one" @change="show_hide(item3)">显示</el-radio></div>
									<div><el-radio v-model="item3.status" :label="zero" @change="show_hide(item3)">隐藏</el-radio></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-col>
		<!--添加内容-->  
		<el-dialog
		  title="内容编辑"
		  :visible.sync="addcontent"
		  @open="dialogOpen"
		  class="custom-dialog special-dialog"
		  width="890px"
		  center
		  :close-on-click-modal="false"
		  :modal-append-to-body="false"
		  :before-close="cancle_add_content">
		  <div class="contentbj">
			<el-form ref="form" :model="add_con" label-width="80px">
				<el-form-item label="标题">
					<el-input v-model="add_con.headLine" @blur="checkTitle(add_con.headLine)"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<UE id="myEditor" :defaultMsg=defaultMsg :config=config ref="ue"></UE>
				</el-form-item>
			</el-form>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="submit_add_content">确 定</el-button>
		  	<el-button class="yellowbg" v-show="add_con.isHasContent == 1" @click="del_content">删除</el-button>
		    <el-button @click="cancle_add_content">取 消</el-button>		    
		  </span>
		</el-dialog>
		<!--确定删除-->
		<!--<div class="help_delete" v-show="sure_delete"></div> -->
		<el-dialog
		  title="提示"
		  :visible.sync="sure_delete"
		  class="helpCenter_delDialog"
		  width="420px"
			:modal='false'
			:close-on-click-modal='false'
			:before-close="hide_helpDialog">
			<div class="context"><i class="el-icon-warning"></i>确定删除该栏目内容？</div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button size="small" type="primary" @click="sureDel_content">确 定</el-button>
		    <el-button size="small" @click="hide_helpDialog">取 消</el-button>		    
		  </span>
		</el-dialog>
		<div class="footer helpc_foot poi3">
			<el-button type="primary" class="mr30" @click="send_to_client">发布至客户端</el-button>
		</div>
  </div>
</template>

<script>
import UE from '../../../../components/ueditor/ue.vue'
 export default {
 	components: {UE},
	data() {
		return {
			// 确定删除弹窗
			sure_delete:false,
			compareShow:false,
			prompt:{name:'',num: 0},
			empty:{name: [],num: 0},
			autofocus:true,
			// 一级栏目
			firstcolumn:false,
			// 新增一级栏目名字
			firstcolumn_name:'',
			// 新增二级三级栏目参数
			sec_third:{parentId:'',columnName:''},
			sec_third_show:'',
			level:'',
			one:1,
			zero:0,
			// 二级菜单显示
			child_show2:'',
			// 三级菜单显示
			child_show3:'',
			// 输入框显示
			input_show:'',
			// 树级数据
			list:[],
			// 控制移动控件
			Moving: '',
			// 控制隐藏显示控件
			showh: '',
			// 控制弹窗显示
			addcontent:false,
			radio:'1',
			// 富文本编辑
			defaultMsg: '',
			config: {
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
			// 点击编辑的栏目
			eidt_column:'',
			// 添加内容的参数
			edit_name:{columnId:'',columnName:''},
			// 添加内容参数
			add_con:{columnId:'', headLine:'', content:'',isHasContent:''}
		}
	},
	watch: {
		"defaultMsg":{
			handler (v) {
				if (this.$refs.ue != undefined) {
					this.$refs.ue.setUEContent(v)
				}
			},
			deep: true
		}
	},
	methods: {
		hide_helpDialog () {
			this.sure_delete = false
			document.getElementsByClassName('help_mask')[0].style.display = 'none'
		},
		// 解决富文本编辑器多图上传图层被覆盖问题
		dialogOpen(){
			setTimeout(() => {
				$('.v-modal').css('z-index',2000)
			}, 100);
		},
		// 编辑栏目名称
		editName () {
			console.log('栏目名称',this.edit_name.columnName)
			if (!this.tool.validate.maxLength(this.edit_name.columnName,10)) {
				this.$message({
					message: '栏目名称最十个字，中英文数字不限',
					type: 'error'
				});
				return 
			}
			this.input_show = ''
			if (this.edit_name.columnName == this.eidt_column.columnName) return 
			this.api_businessManagePlatform_modifyCol({
					data:Object.assign(this.edit_name,{token:sessionStorage.getItem('access_token')}),
			}).then(res => {
				this.$message({
					message: '编辑成功',
					type: 'success'
				})
				this.get_all()
			})
		},
		// 验证栏目名字长度
		checkColumn (val) {
			if (!this.tool.validate.maxLength(val,10)) 
			this.$message({
				message: '栏目名称最多十个字，中英文数字不限',
				type: 'warning'
			});
		},
		checkTitle(val) {
			if (!this.tool.validate.maxLength(val,15)) 
			this.$message({
				message: '标题最多十五个字，中英文数字不限',
				type: 'warning'
			});
		},
		// 发送到客户端
		send_to_client(){
			let that = this
			this.empty= {name: [],num: 0}
			this.list.map((item,i) => {
				// empty:{name: [],num: 0},
				if (item.isHasChildCol == 0) {
					this.empty.name.push(item.columnName)
					this.empty.num++
				}
				if (item.childs.length > 0) {
					item.childs.map(val=>{
						if (val.isHasChildCol == 0 && val.isHasContent == 0) {
							this.empty.name.push(val.columnName)
							this.empty.num++
						}
						if (val.childs.length > 0) {
							val.childs.map(value=>{
								if (value.isHasContent == 0) {
									this.empty.name.push(value.columnName)
									this.empty.num++
								}
							})
						}
					})
				}
			})
			if (this.empty.num >= 1) {
				this.prompt.name = this.empty.name[0]
				this.prompt.num = this.empty.num
				let txt = ''
				if (this.empty.num == 1 ) {
					txt = this.prompt.name + "栏目为空，请添加后发布"
				}else if(this.empty.num > 1) {
					txt = this.prompt.name + "等"+ this.prompt.num +"个栏目为空，请添加后发布"
				}
				 this.open (txt)
			} else {
				this.$confirm('确认将内容发布至客户端?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.api_businessManagePlatform_sendToClient({
						data:{ 
							token:sessionStorage.getItem('access_token')
						}
					}).then(res => {
						this.compareShow = false
						this.$message({
							message: '发布成功',
							type: 'success'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消发布'
					})        
				})
			}
		
		},
		open (txt) {
			this.$message({
				message: txt,
				type: 'warning'
      });
		},
		// 新增二、三级栏目
		add_sec_third(n,item) {
			if (item.childs.length >= 10) {
				this.$message.error('最多只能新增十个同级栏目！')
				return
			}
			this.level = n
			this.sec_third.parentId = item.columnId
			this.sec_third_show = item.columnId
			let show = ''
			if (n==2) {
				this.child_show2 = item.columnId
			}else if (n==3) {
				this.child_show3 = item.columnId
			}
			// this.childShow (n,item.columnId)
		},
		// 提交新增级栏目
		submit_add() {
			let that = this
			let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
			console.log('级别', this.level)
			let name = this.level == 1 ? this.firstcolumn_name : this.sec_third.columnName
			name = name.replace(/(^\s*)|(\s*$)/g, '')
			console.log('mingche', name)
			
			if (name) {
				if ((!deg.test(name) || name.length > 10)) {
				this.$message.error('栏目名称最多10个字，中英文、数字不限！')
				return
				}
			}
			if (name== '') {
				this.$message.error('栏目名称不能为空！')
				return
			}
			this.api_businessManagePlatform_addColumn({
				data:{ 
					token:sessionStorage.getItem('access_token'),
					grade:this.level,
					parentId:this.level == 1 ? 0: this.sec_third.parentId,
					columnName: name
				}
			}).then(res => {
				this.cancle_add()
				this.get_all()
			})
		},
		// 取消新增一级栏目
		cancle_add () {
			if ( this.level == 1) {
				this.firstcolumn_name = ''
				this.firstcolumn = false
			} else if (this.level==2 || this.level==3) {
				this.sec_third = {parentId:'',columnName:''}
				this.sec_third_show = ''
			}
			this.level = ''
		},
		// 关闭所有弹窗
		close_all () {
			this.firstcolumn = false
			this.firstcolumn_name = ''
			// this.child_show2 = ''
			// this.child_show3 = ''
			this.input_show = ''
			this.Moving =  ''
			this.showh =  ''
			this.sec_third_show = ''
		},
		// 点击新增一级
		addcolumn (){
			if (this.list.length >= 10) {
				this.$message.error('最多只能新增十个同级栏目！')
				return
			}
			this.level = 1
			this.close_all()
			this.firstcolumn = true
			console.log('this.firstcolumn',this.firstcolumn)
		},
		// 隐藏显示
		show_hide(item) {
			this.api_businessManagePlatform_hiddenOrShow({
				data:{ 
					token:sessionStorage.getItem('access_token'),
					status:item.status,
					columnId:item.columnId
				}
			}).then(res => {
				this.$message({
					message: '操作成功',
					type: 'success'
				})
				this.get_all()
			}).catch(err=>{
				item.status = item.status == 0? 1:0
			})
		},
		// 上移下移
		up_down (item,nextItem) {
			this.api_businessManagePlatform_move({
				data:{ 
					token:sessionStorage.getItem('access_token'),
					sortId1:item.sortId,
					sortId2:nextItem.sortId
				}
			}).then(res => {
				this.$message({
					message: '移动成功',
					type: 'success'
				})
				this.get_all()
			})
		},
		// 删除
		del_column(item) {
			let that = this
      		this.$confirm('此操作将删除该目录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.api_businessManagePlatform_delColumn({
					data:{ 
						token:sessionStorage.getItem('access_token'),
						columnId:item.columnId
					}
				}).then(res => {
					this.$message({
						message: '删除目录成功',
						type: 'success'
					})
					this.get_all()
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})       
			})
		
		},
		// 点击添加内容
		add_content(item) {
			console.log('item.content', item)
			this.add_con.columnId = item.columnId
			this.add_con.headLine = item.headLine
			this.add_con.isHasContent = item.isHasContent
			this.addcontent=true
			// 关闭其他弹窗
			if (item.content == null) {
				this.defaultMsg = ''
			} else {
			 console.log('item.content', item.content)
				// 设置富文本内容
				this.defaultMsg = item.content
			}
			// _this.$refs.ue.setUEContent(item.content)
			
		},
		// 取消添加内容
		cancle_add_content () {
			this.add_con = {columnId:'', headLine:'', content:'',isHasContent:''}
			console.log(this.$refs.ue)
			// 清空富文本内容
			this.defaultMsg = ''
			if (this.$refs.ue) {
				this.$refs.ue.setUEContent('')
			}
			this.addcontent = false
		},
		// 提交添加内容
		submit_add_content () {
			this.add_con.content = this.$refs.ue.getUEContent()
			if (!this.add_con.headLine) {
				this.$message({
					message: '标题不能为空',
					type: 'warning'
				});
				return 
			}
			if (!this.tool.validate.maxLength(this.add_con.headLine,15)) {
				this.$message({
					message: '标题最多十五个字，中英文数字不限',
					type: 'warning'
				});
				return 
			}
			if (!this.add_con.content) {
				this.$message({
					message: '请填写内容再提交',
					type: 'warning'
				});
				return 
			}
			let data = Object.assign({},this.add_con)
			this.cancle_add_content()
			this.api_businessManagePlatform_addContent({
					data:Object.assign({
						token:sessionStorage.getItem('access_token'),
						isHasChildCol:0,
					},data)
				}).then(res => {
					this.$message({
						message: '内容编辑成功',
						type: 'success'
					})
					this.get_all()
				})
		},
		// 删除内容
		del_content () {
			this.sure_delete = true
			console.log(document.getElementsByClassName('help_mask'))
			document.getElementsByClassName('help_mask')[0].style.display = 'block'
		
		},
		sureDel_content() {
			let id = this.add_con.columnId
			this.sure_delete = false
			document.getElementsByClassName('help_mask')[0].style.display = 'none'
			this.cancle_add_content()
			this.api_businessManagePlatform_delContent({
				data:{
					token:sessionStorage.getItem('access_token'),
					columnId:id,
				},
			}).then(res => {
				this.$message({
					message: '删除内容成功',
					type: 'success'
				})

				this.get_all()
			})
		},
		// 阻止事件冒泡
		prevent() {
			event.stopPropagation()
		},
		// 显示输入框
		inputShow (item) {
			event.stopPropagation()
			if (this.input_show == '') {
				this.close_all()
				this.input_show = item.columnId
				this.edit_name.columnId = item.columnId
				this.edit_name.columnName = item.columnName
				this.eidt_column = item
			} else {
				this.input_show = ''
			}
		},
		// 隐藏所有弹出框
		hide() {
			this.showh = ''
			this.Moving = ''
			this.input_show = ''
		},
		// 二级菜单隐藏显示
		childShow (n,id) {
			event.stopPropagation()
			let show = ''
			if (n==2) {
				show = this.child_show2
			}else if (n==3) {
				show = this.child_show3
			}
			if (show != '') {
				if (show != id) {
					show = id
				} else if( show == id ) {
					show = ''
					this.sec_third_show = ''
				}
			} else if (show == '') {
				show = id
			}
			if (n==2) {
				this.child_show2 = show 
			}else if (n==3) {
				this.child_show3 = show 
			}
		},
		// 设置隐藏显示的弹出框
		showH (id) {
			event.stopPropagation()
			if (this.showh != '') {
				if (this.showh != id) {
					this.close_all()
					this.showh = id
				} else if( this.showh == id ) {
					this.showh = ''
				}
			} else if (this.showh == '') {
				this.close_all()
				this.showh = id
			}
		},
		move(id) {
			event.stopPropagation()
			if (this.Moving != '') {
				if (this.Moving != id) {
					this.close_all()
					this.Moving = id
				} else if( this.Moving == id ) {
					this.Moving = ''
				}
			} else if (this.Moving == '') {
				this.close_all()
				this.Moving = id
			}
		},
		// 获取数据
		get_all (){
			let that = this
			this.api_businessManagePlatform_helpList({
				data:{ 
					token:sessionStorage.getItem('access_token')
				}
			}).then(res => {
				this.list = res.content
			})
		},
		compare (){
			this.api_businessManagePlatform_compare({
				data:{ 
					token:sessionStorage.getItem('access_token')
				}
			}).then(res => {
				this.compareShow = res.content == 1 ?false :true
			})
		},
		re_list () {
			this.api_businessManagePlatform_recover({
				data:{ 
					token:sessionStorage.getItem('access_token')
				}
			}).then(res => {
				this.compareShow = false
				this.get_all()
			})
		}
	},
	mounted() {
	  this.get_all()
		this.compare()
	}
}
</script>

<style lang="scss" scoped>
  .context{
		line-height: 8px;
		i{
			font-size: 20px;
			color:#E6A23C;
			margin-right: 10px;
		 }
	}
	.restore {
		height:50px;
		background-color: #FFF9EE ;
		line-height: 50px;
		margin-bottom: 10px;
		padding-left: 20px;
		font-size: 16px;
		color:#F5A623;
		min-width:943px;
		.re_btn {
			height: 30px;
			line-height: 30px;
			padding: 0 18px;
			color:#0086FF;
			font-size: 14px;
			background-color: #F9FAFE;
			border:1px solid #E6E8F2;
			margin-left: 15px;
		}
	}
	.add_sec{
		// height: 45px;
		border-left: 1px solid #e6e8f2;
		border-right: 1px solid #e6e8f2;
		border-bottom: 1px solid #e6e8f2;
		.btn {
			width: 60px;
			height:26px;
			padding:0;
			text-align: center;
			line-height: 26px;
		}
		.sure {
			color:#fff;
			background-color:#11D2EB;
			border: none;
		}
		.cancle{
			border: 1px solid #cccccc;
			background-color:#fff;
		}
	}
	.add {
		width: 400px;
		height: 140px;
		border-radius: 3px 3px 0 0 ;
		border: 1px solid #ccc;
		position: absolute;
		background-color: #fff;
		box-shadow: 0px -1px 2px 1px rgba(0, 0,0,.1);
		z-index: 100; 
		.til{
			height:80px;
			padding: 8px 0 0 16px;
			border-bottom: 1px solid #ccc;
		}
		.add_footer {
			text-align: center;
			padding-top:7px;
			.btn {
				width:80px;
				height:30px;
			}
			.add_btn {
				background-color: #0086FF;
				color :#fff;
				margin-right:20px;
				border: none;
			}
			.cancle_btn{
				background-color: #fff;
				border:1px solid #ccc;
			}
		}
	}
	.has_cont{
		color:#7C9BBF;
		cursor: pointer;
	}
	.helpcenter{
		min-width: 910px;
		padding: 10px 26px;
		// background: #FFFFFF;
		.helpcenter_cen{
			background: #FFFFFF;
			border: 1px solid #E6E8F2;
			border-radius: 3px 3px 0 0;
			min-height: 80px;
			margin-bottom: 100px;
			padding-bottom: 20px;
			.helpcenter_top{
				width: 100%;
				height: 37px;
				line-height: 37px;
				padding-left: 13px;
				box-sizing:border-box;
				background: #E6E8F2;
				font-size: 14px;
				color: #666666;
			}
			.bord_l{
					border-left:1px solid rgb(230, 232, 242);
					border-right:1px solid rgb(230, 232, 242);
					border-bottom: 1px solid rgb(230, 232, 242);;
			}
			.helpcenter_ceb{
				box-sizing: border-box;
				padding-left: 13px;
				padding-right: 13px;
				line-height: 45px;
				min-height: 45px;
				width: 100%;
				font-size: 14px;
				.helpcenter_c01{
					display: block;
					width: 90px;
				}
				.helpcentext:hover{
					background:rgba(249,250,254,1);
				}
				
				.helpcentext{
					.Moving{
						width:70px;
						// height:96px; 
						background:rgba(255,255,255,1);
						border-radius: 2px ; 
						box-shadow: 3px 2px 2px #E5E5E5;
						z-index:99;
						border:1px solid #CCCCCC;
						div{
							text-align: center;
							line-height: 31px;
							font-size: 14px;
							border-bottom: 1px solid #CCCCCC;
							cursor: pointer;
							color:rgba(102,102,102,1);
						}
					}
					.show_h{
						width: 90px;
						height: 64px;
						background:rgba(255,255,255,1);
						border-radius: 2px ; 
						border:1px solid #CCCCCC;
						box-shadow: 3px 2px 2px #CCCCCC;
						right: 0px;
						z-index:99;
						div{
							text-align: center;
							line-height: 31px;
							font-size: 14px;
							border-bottom: 1px solid #CCCCCC;
							cursor: pointer;
							color:rgba(102,102,102,1);
						}
					}
					.hover_c:hover{
						.tb03{
							display: inline-block;				
						}
						.tb04{
							display: inline-block;	
						}					
					}
					.p10{
						padding:10px;
					}
					.p18{
						padding:10px 18px;
					}
					.tb01{
						font-size: 8px;
						color: #B3BBCB;
						cursor: pointer;
					}
						
					.tb02{
						font-size: 14px;
						color: #B3BBCB;
						cursor: pointer;
					}
					.tb03{
						font-size: 13px;
						color: #B3BBCB;
						display: none;
						cursor: pointer;
					}
					.tb04{
						display: none;	
					}		
				}
				.helpcenter_c02{
					background: #FFFFFF;
					border: 1px solid #E6E8F2;
					border-radius: 3px;
					height: 40px;
					line-height: 40px;
					margin-bottom: 16px;
					padding-left: 53px;
					.input{
						width: 120px;
						display: inline-block;
						.helpceninput{
							width: 120px;
							.el-input__inner{
								height: 25px;
							}
						}
					}
				}
				
			}
		}
		.input{
			width: 180px;
			display: inline-block;
			.helpceninput{
				width: 180px;
				.el-input__inner{
					height: 25px;
				}
			}
		}
		// .contentbj{
		// 	.editor-container{
		// 		.edui-default .edui-editor-iframeholder{
		// 			height: 400px!important;
		// 		}
		// 	}
		// }
		a{
			text-decoration: none;
		}
		.blue_xz{
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #0086FF;
		}
		.helpc_foot{
			width: 100%;
			height: 80px;
			background: #FFFFFF;
			bottom: 0px;
			left: 200px;
			text-align: center;
			padding-top: 20px;
			border: 1px solid #E6E8F2;
		}
	}
	.yellowbg{
		background: #F5BD23;
		border-color:#F5BD23;
		color: #fff;
	}
	.icon-intro {
		width: 15px;
		height: 15px;
		// background: url(../../../assets/images/icon-intro02.png) no-repeat center;
		background: url('../../../../../static/images/businessManage/icon-intro02.png') no-repeat center;
		display: inline-block;
		cursor: pointer;
	}
	.pl13{
		padding-left: 13px;
	}
	.pr13{
		padding-right: 13px;
	}
	.pl43{
		padding-left: 43px!important;
	}
	.pl116{
		padding-left: 116px!important;
	}
	.mt30 {
			margin-top: 30px;
		}

		.border_top {
			border-top: 1px solid #E5E5E5;
		}

		.pt3 {
			padding-top: 3px;
		}

		.marauto {
			margin: auto;
		}

		.widnone {
			width: initial!important;
		}

		.mr20 {
			margin-right: 20px;
		}

		.hght50 {
			height: 50px;
		}

		.mt5 {
			margin-top: 5px;
		}

		.wid180 {
			width: 180px;
		}

		.poi1 {
			position: relative;
		}

		.overflowy {
			overflow-y: auto;
		}

		.mb10 {
			margin-bottom: 10px;
		}

		.mr5 {
			margin-right: 5px;
		}
		.mr30{
			margin-right: 30px;
		}
		.poi2 {
			position: absolute;
		}

		.poi3 {
			position: fixed;
		}

		.wose {
			white-space: nowrap;
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.wose02 {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.bluecolor {
			background: #0086FF;
			color: #FFFFFF;
		}
			.yellow_add{
				color: #11D2EB;
				font-size:12px;
			}
		.bluecolor02 {
			color: #0086FF;
		}

		.wid280 {
			width: 280px;
		}

		.fl {
			float: left;
		}

		.show_hide {
			float: right;
			position: relative;
			font-size: 14px;
		}

		.clear {
			clear: both;
			overflow: hidden;
		}

		.mt10 {
			margin-top: 10px;
		}

		.mr10 {
			margin-right: 10px;
		}

		.mt20 {
			margin-top: 20px;
		}

		.ml10 {
			margin-left: 10px;
		}

		.ml100 {
			margin-left: 100px;
		}

		.ml75 {
			margin-left: 75px;
		}

		.linh35 {
			line-height: 35px;
			display: inline-block;
		}

		.ml60 {
			margin-left: 60px;
		}

		.mr10 {
			margin-right: 10px;
		}
		.mr33 {
			margin-right: 33px;
		}

	.fontstyle {
		font-style: normal;
	}
	/* 富文本输入框样式 */
	#myEditor {
		line-height: 20px!important;
	}
	.special-dialog{
		z-index:2001 !important
	}
	.v-modal{
		z-index:2000 !important
	}
	.fs12{
		font-size: 12px;
	}
	.pad5{
		padding: 10px;
	}
</style>
