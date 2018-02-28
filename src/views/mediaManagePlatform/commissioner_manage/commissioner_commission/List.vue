<template>
    <div class="commission">
      <el-tabs v-model="activeTabName" @tab-click="tabClick">  
        <el-tab-pane label="业绩提成" name="first"></el-tab-pane>
        <el-tab-pane label="下载提成" name="second"></el-tab-pane>
        <el-tab-pane label="注册提成" name="third"></el-tab-pane>
      </el-tabs>

      <div v-show="activeTabName=='first'"> 
        <!-- 新增/修改/按钮 -->
        <el-col :span="24" class="toolbar btnbar">
            <el-button type="primary" size="medium" @click="button_click('modify')">提成设置</el-button>
        </el-col>
        <!-- 底部国家区域 -->
        <div class="largearea">
            <div class="currency">
                <span>国家</span>
                <div class="currency_box">
                    <div class="C_title"><span>标题</span><span class="text_center">自推提成</span><span class="text_center">&nbsp;</span></div>
                    <ul class="C_uli">
                        <li class="country_bgc" :index="i" :class="{sel_bgColor: i===isShowbg.a  , red_bgColor: 'a'+i==selectedItem }" v-for="(item,i) in search_bdorg_country" :key="i" :value="item.orgId" 
                            v-if="item.orgLevel===0" @click="switch_countries" @dblclick="button_click('0',item)"><span :title="item.orgName">{{item.orgName}}</span> 
                            <span class="text_center" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span> <span class="text_center">&nbsp;</span></li>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <span>大区</span>
                <div class="currency_box">
                    <div class="C_title"><span>标题</span><span class="text_center">自推提成</span><span class="text_center">上级提成</span></div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.b  , red_bgColor: 'b'+i==selectedItem }" v-for="(item,i) in search_bdorg_largearea" :key="i" :value="item.orgId" 
                            @click="Switching_large_area($event, item)" @dblclick="button_click('1',item)"><span :title="item.orgName">{{item.orgName}}</span> <span class="text_center" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span> <span class="text_center" :title="item.contributeRatio+'%'">{{item.contributeRatio}}%</span></li>
                    </ul>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <span>城市</span>
                <div class="currency_box">
                    <div class="C_title"><span>标题</span><span class="text_center">自推提成</span><span class="text_center">上级提成</span></div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.c  , red_bgColor: 'c'+i==selectedItem }" v-for="(item,i) in search_bdorg_city" :key="i" :value="item.orgId" @click="switching_city($event, item)"  
                            @dblclick="button_click('2',item)"><span :title="item.orgName">{{item.orgName}}</span><span class="text_center" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span>
                            <span class="text_center" :title="contributeArr[0]+'% - '+item.contributeRatio+'%'"><font v-if="contributeArr.length">{{contributeArr[0]}}%  -  </font>{{item.contributeRatio}}%</span>  
                        </li>
                    </ul>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <span>区域</span>   
                <div class="currency_box w_350">
                    <div class="C_title"><span class="maxW_92">标题</span><span class="text_center maxW_92">自推提成</span><span class="text_center">上级提成</span></div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.d  , red_bgColor: 'd'+i==selectedItem}" v-for="(item,i) in search_bdorg_region" :key="i" :value="item.orgId" 
                            @click="switching_region($event, item)" @dblclick="button_click('3',item)"><span class="maxW_92" :title="item.orgName">{{item.orgName}}</span>
                            <span class="text_center maxW_92" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span> 
                            <span class="text_center w_140" :title="contributeArr.slice(0,2).join('% - ')+'% - '+item.contributeRatio+'%'">
                                <font v-if="contributeArr.length && i<2" v-for="(list, i) in contributeArr" :key="i"> {{list}}%  -  </font>
                                {{item.contributeRatio}}%</span></li>
                    </ul>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <span>BDM</span>
                <div class="currency_box w_390">
                    <div class="C_title"><span class="maxW_92">标题</span><span class="text_center maxW_92">自推提成</span><span class="text_center">上级提成</span></div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.e  , red_bgColor: 'e'+i==selectedItem }" v-for="(item,i) in search_bdorg_bom" :key="i" :value="item.orgId" 
                            @click="switching_bom($event, item)"  @dblclick="button_click('4',item)"><span class="maxW_92"  :title="item.orgName">{{item.orgName}}</span>
                            <span class="text_center maxW_92" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span> 
                            <span class="text_center w_180" :title="contributeArr.slice(0,3).join('% - ')+'% - '+item.contributeRatio+'%'">
                                <font v-if="contributeArr.length && i<3" v-for="(list, i) in contributeArr" :key="i"> {{list}}%  -  </font>
                                {{item.contributeRatio}}%
                            </span></li>
                    </ul>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <span>普通BD</span>
                <div class="currency_box w_430">
                    <div class="C_title"><span class="maxW_92">标题</span><span class="text_center maxW_92">自推提成</span><span class="text_center">上级提成</span></div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.f  , red_bgColor: 'f'+i==selectedItem }" v-for="(item,i) in search_bdorg_ordinarybd" :key="i" :value="item.orgId" 
                            @click="switching_ordinarybd" @dblclick="button_click('5',item)"><span class="maxW_92" :title="item.orgName">{{item.orgName}}</span>
                            <span class="text_center maxW_92" :title="item.selfRatio+'%'">{{item.selfRatio}}%</span> 
                            <span class="text_center w_220" :title="contributeArr.slice(0,4).join('% - ')+'% - '+item.contributeRatio+'%'">
                                <font v-if="contributeArr.length && i<4" v-for="(list, i) in contributeArr" :key="i"> {{list}}%  -  </font>
                                {{item.contributeRatio}}%</span></li>
                    </ul>
                    </ul>
                </div>
            </div>
        </div>
      </div>
      <div v-if="activeTabName=='second'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每下载一个" prop="shareMoney" >
              <el-input :maxlength="5" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              同一台机器重复下载不计算分成，不对上级分成
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
      <div v-if="activeTabName=='third'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每注册一个" prop="shareMoney" >
              <el-input :maxlength="5" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              <p>同一台机器重复注册不计算分成，不对上级分成</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
            
        <!-- 修改提成设置  -->
        <div class="edit-form">
            <el-dialog
                title="提成设置"
                custom-class='dialog'
                :visible.sync="isShow"
                :close-on-click-modal="false"
                :before-close="clear_all_params">
                    <el-col :span="24" >
                        <el-form ref="form" :model="modify_params"  label-width="100px">
                            <el-form-item label="组织"  >
                                {{modify_params.orgListName}}
                            </el-form-item>
                            <el-form-item label="自推提成" > 
                                <el-input @keyup.native="modify_params.selfRatio = modify_params.selfRatio.toString().replace(/[^\d.]/g,'')" :maxlength="6" placeholder="可为0, 或0.0001-10的数" v-model="modify_params.selfRatio">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="上级分成" v-if="modify_params.orgInfoList.length>1">
                                <div  v-for="(item,i) in modify_params.orgInfoList" :key="i" v-if="i< modify_params.orgInfoList.length-1">
                                    <p :title="item.orgName"><template >{{item.orgName}}</template></p>
                                    <el-input @keyup.native="modify_params.orgInfoList[i+1].contributeRatio=modify_params.orgInfoList[i+1].contributeRatio.toString().replace(/[^\d.]/g,'')" :maxlength="6" placeholder="可为0, 或0.0001-10的数" v-model="modify_params.orgInfoList[i+1].contributeRatio">
                                        <template slot="append">%</template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="clear_all_params">取 消</el-button>
                        <el-button type="primary" @click="modify_save" >保 存</el-button>
                    </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    let tool = this.tool
    const rule_shareMoney = function(rule,value,callback){
      if(value.length && !tool.validate.money(value) ){
        callback(new Error('请输入整数或小数（小数最多两位）'))
      }else if(value > 99.99 ){
        callback(new Error('提成金额不能大于 99.99 元'))
      }else{
          callback()
      }
    }
    return {
      isShow: false,
      isShowbg: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0
      },
      selectedItem: "",
      //上级提成
      contributeArr: [],
      // 获取国家数据
      search_bdorg_country: [],
      // 获取大区数据
      search_bdorg_largearea: [],
      // 获取城市数据
      search_bdorg_city: [],
      // 获取区域数据
      search_bdorg_region: [],
      // 获取BOM数据
      search_bdorg_bom: [],
      //获取普通BD数据
      search_bdorg_ordinarybd: [],
      // 保存国家/大区/城市等id 以便修改
      save_all_orgid: { country: "" },
      //是否选中
      clkBool: false,
      // 弹窗数据
      modify_params: {
        // 组织名称
        orgListName: "",
        //自推
        selfRatio: "",
        orgInfoList: []
      },
      activeTabName:'first',
      formShare:{
        formerShareMoney:'',
        shareMoney:'',
        commissionId:''
      },
      formRules:{
        shareMoney:[
            { validator: rule_shareMoney, trigger: 'change' }
        ],
      },
      share_type:''

    };
  },
  methods: {
    tabClick(){
      this.tool.dp.clearData(this.formShare)
      if(this.activeTabName=='first'){
        this.get_country_data()
      }else{
        let data_type = this.activeTabName=='second' ? 1 :2
        this.api_mediaManagePlatform_commInfo({data: {type:  data_type,roleType:2 }}).then(result => {
          this.formShare.shareMoney = result.content.shareMoney===null ? '0.00' : this.tool.str.twoDecimal(result.content.shareMoney,2)
          this.formShare.formerShareMoney = result.content.shareMoney===null ? '0.00' : this.tool.str.twoDecimal(result.content.shareMoney,2)
          this.formShare.commissionId = result.content.commissionId
          this.share_type = result.content==='' ? 'add' :'update'
        })
      }
    },
    save() {
      this.$refs.formShare.validate((valid) => {
        if (valid) {
          let data_type = this.activeTabName=='second' ? 1 :2 ,
              msg =  data_type==1 ?'下载提成设置保存成功' :'注册提成设置保存成功' ;
              this.formShare.shareMoney= this.formShare.shareMoney=='' ? '0.00':this.formShare.shareMoney
          if(this.share_type=='add'){
            this.api_mediaManagePlatform_commissionAdd({type:'post', data: {type: data_type, roleType:2, shareMoney: this.formShare.shareMoney}}).then(result => {
                this.$message({type:'success',message:msg})
                this.tabClick()
            })
          }else{
            this.api_mediaManagePlatform_commissionUpdate({type:'post', data: this.formShare}).then(result => {
                 this.$message({type:'success',message:msg})
                 this.tabClick()
            })
          }
        }
      })
    },
    formerFn() {
      this.formShare.shareMoney = this.formShare.formerShareMoney
    },
    keyup(value) {
      // value.replace(/[^\d.]/g,'')
      // return false
    },
    // 默认查询第一级的数据
    get_country_data() {
      let that = this;
      this.api_common_bdorg({
        data: { orgLevel: 0, parentOrgId: 0 }
      }).then(result => {
        that.search_bdorg_country = result.content;
        if (!result.content.length) {
          return;
        }
        // 默认获取大区数据
        this.api_common_bdorg({
          data: { orgLevel: 1, parentOrgId: result.content[0].orgId }
        }).then(result => {
          that.search_bdorg_largearea = result.content;
          if (!result.content.length) {
            return;
          }
          //获取上级分成
          that.contributeArr = [];
          that.contributeArr.push(result.content[0].contributeRatio);
          // 默认获取城市数据
          this.api_common_bdorg({
            data: { orgLevel: 2, parentOrgId: result.content[0].orgId }
          }).then(result => {
            that.search_bdorg_city = result.content;
            if (!result.content.length) {
              return;
            }
            //获取上级分成
            that.contributeArr.push(result.content[0].contributeRatio);
            // 默认获取区域数据
            this.api_common_bdorg({
              data: { orgLevel: 3, parentOrgId: result.content[0].orgId }
            }).then(result => {
              that.search_bdorg_region = result.content;
              if (!result.content.length) {
                return;
              }
              //获取上级分成
              that.contributeArr.push(result.content[0].contributeRatio);
              // 默认获取乡镇数据
              this.api_common_bdorg({
                data: { orgLevel: 4, parentOrgId: result.content[0].orgId }
              }).then(result => {
                that.search_bdorg_bom = result.content;
                if (!result.content.length) {
                  return;
                }
                //获取上级分成
                that.contributeArr.push(result.content[0].contributeRatio);
                //默认获取普通BD专员数据
                this.api_common_bdorg({
                  data: { orgLevel: 5, parentOrgId: result.content[0].orgId }
                }).then(result => {
                  that.search_bdorg_ordinarybd = result.content;
                });
              });
            });
          });
        });
      });

      // 清空其他数据
      that.search_bdorg_largearea = [];
      that.search_bdorg_city = [];
      that.search_bdorg_region = [];
      that.search_bdorg_bom = [];
      that.search_bdorg_ordinarybd = [];
      that.isShowbg = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0
      };
    },
    getEventVal(event) {
      let value = "",
        selindex = "";
      if (event.target.localName == "span") {
        value = event.target.parentNode.getAttribute("value");
        selindex = event.target.parentNode.getAttribute("index");
      } else if (event.target.localName == "font") {
        value = event.target.parentNode.parentNode.getAttribute("value");
        selindex = event.target.parentNode.parentNode.getAttribute("index");
      } else {
        value = event.target.getAttribute("value");
        selindex = event.target.getAttribute("index");
      }
      var arr = [value, selindex];
      return arr;
    },
    // 默认触发国家事件 获取大区的内容
    switch_countries(event) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.a = parseInt(selindex);
      that.isShowbg.b = "";
      that.isShowbg.c = "";
      that.isShowbg.d = "";
      that.isShowbg.e = "";
      that.isShowbg.f = "";
      that.selectedItem = "a" + selindex;
      //保存orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
      // 清空其他数据
      that.search_bdorg_city = [];
      that.search_bdorg_region = [];
      that.search_bdorg_bom = [];
      that.search_bdorg_ordinarybd = [];
      //清空上级提成的数据
      that.contributeArr = [];
      this.api_common_bdorg({
        data: { orgLevel: 1, parentOrgId: value }
      }).then(result => {
        that.search_bdorg_largearea = result.content;
      });
    },
    // 触发大区事件 获取城市内容
    Switching_large_area(event, list) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.b = parseInt(selindex);
      that.isShowbg.c = "";
      that.isShowbg.d = "";
      that.isShowbg.e = "";
      that.isShowbg.f = "";
      that.selectedItem = "b" + selindex;
      //保存大区的orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
      that.search_bdorg_region = [];
      that.search_bdorg_bom = [];
      that.search_bdorg_ordinarybd = [];
      //清空上级提成的数据
      that.contributeArr = [];
      that.contributeArr.push(list.contributeRatio);
      this.api_common_bdorg({
        data: { orgLevel: 2, parentOrgId: value }
      }).then(result => {
        that.search_bdorg_city = result.content;
      });
    },
    // 触发城市  获取区域
    switching_city(event, list) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.c = parseInt(selindex);
      that.isShowbg.d = "";
      that.isShowbg.e = "";
      that.isShowbg.f = "";
      that.selectedItem = "c" + selindex;
      //保存城市的orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
      that.search_bdorg_bom = [];
      that.search_bdorg_ordinarybd = [];
      //上级提成的数据
      that.contributeArr = that.contributeArr.slice(0, 2);
      that.contributeArr[1] = list.contributeRatio;
      this.api_common_bdorg({
        data: { orgLevel: 3, parentOrgId: value }
      }).then(result => {
        that.search_bdorg_region = result.content;
      });
    },
    // 触发区域 获取BOM
    switching_region(event, list) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.d = parseInt(selindex);
      that.isShowbg.e = "";
      that.isShowbg.f = "";
      that.selectedItem = "d" + selindex;
      //保存区域的orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
      that.search_bdorg_ordinarybd = [];
      //上级提成的数据
      that.contributeArr = that.contributeArr.slice(0, 3);
      that.contributeArr[2] = list.contributeRatio;
      this.api_common_bdorg({
        data: { orgLevel: 4, parentOrgId: value }
      }).then(result => {
        that.search_bdorg_bom = result.content;
      });
    },
    //点击BOM 改变背景色
    switching_bom(event, list) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.e = parseInt(selindex);
      that.isShowbg.f = "";
      that.selectedItem = "e" + selindex;
      //保存城市的orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
      //上级提成的数据
      that.contributeArr = that.contributeArr.slice(0, 4);
      that.contributeArr[3] = list.contributeRatio;
      this.api_common_bdorg({
        data: { orgLevel: 5, parentOrgId: value }
      }).then(result => {
        that.search_bdorg_ordinarybd = result.content;
      });
    },
    //点击普通BD 改变背景色
    switching_ordinarybd(event) {
      let that = this;
      let valArr = that.getEventVal(event);
      let value = valArr[0],
        selindex = valArr[1];
      that.isShowbg.f = parseInt(selindex);
      that.selectedItem = "f" + selindex;
      //保存城市的orgid
      that.save_all_orgid.country = value;
      that.clkBool = true;
    },
    //双击事件
    button_click(num, list) {
      let that = this;

      if (num == "modify" && !that.clkBool) {
        that.$message({ type: "error", message: "请选择一项数据" });
        return;
      }
      if (num != "modify") {
        let value = "";
        if (event.target.localName == "span") {
          value = event.target.parentNode.getAttribute("value");
        } else if (event.target.localName == "font") {
          value = event.target.parentNode.parentNode.getAttribute("value");
        } else {
          value = event.target.getAttribute("value");
        }
        that.save_all_orgid.country = value;
      }
      // $('#modify_commis').modal('show');
      this.isShow = true;
      this.api_common_bdorg({
        pathParams: `/${this.save_all_orgid.country}`
      }).then(result => {
        that.modify_params = result.content;
        var arr = result.content.orgInfoList,
          str = "";
        for (var i = 0; i < arr.length; i++) {
          if (i == arr.length - 1) {
            str += arr[i].orgName;
          } else {
            str += arr[i].orgName + ">";
          }
        }
        that.modify_params.orgListName = str;
      });
    },
    //新增修改的验证
    verify_val(val) {
      let that = this;
      var bool = false;
      if (val != "") {
        if (val < 0.0001 || val > 10) {
          return false;
        }
      }
      bool = true;
      return bool;
    },
    //修改的保存
    modify_save() {
      let that = this;
      if (that.modify_params.selfRatio === "") {
        that.$message({
          type: "error",
          message: "自推提成不能为空，可为0, 或 0.0001 - 10 的数"
        });
        return;
      }
      if (
        that.modify_params.selfRatio &&
        that.modify_params.selfRatio !== "0" &&
        that.modify_params.selfRatio !== ""
      ) {
        var num = that.modify_params.selfRatio;
        if (isNaN(num)) {
          that.$message({
            type: "error",
            message: "请输入正确的格式，自推提成为：0.0001 - 10 的数"
          });
          return false;
        }
        that.modify_params.selfRatio = parseFloat(num);
        if (that.modify_params.selfRatio !== 0) {
          if (
            that.modify_params.selfRatio < 0.0001 ||
            that.modify_params.selfRatio > 10
          ) {
            that.$message({ type: "error", message: "自推提成为：0.0001 - 10 的数" });
            return false;
          }
        }
      }
      //上级分成
      var arr = that.modify_params.orgInfoList;
      var contributeRatio = [],
        cstr = "";
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].contributeRatio === "") {
          contributeRatio.push("");
        } else {
          contributeRatio.push(parseFloat(arr[i].contributeRatio));
        }
      }
      for (var e = 0; e < contributeRatio.length; e++) {
        if (contributeRatio[e] === "") {
          that.$message({
            type: "error",
            message: "上级分成不能为空，可为0, 或 0.0001 - 10 的数"
          });
          return;
        } else if (!that.verify_val(contributeRatio[e])) {
          that.message({ type: "error", message: "上级分成为：0.0001 - 10 的数" });
          return;
        }
        if (i == contributeRatio.length - 1) {
          cstr += contributeRatio[e];
        } else {
          cstr += contributeRatio[e] + ",";
        }
      }
      this.api_mediaManagePlatform_ratio({
        data: {
          selfRatio: that.modify_params.selfRatio,
          contributeRatioArrayStr: cstr
        },
        pathParams: `/${that.save_all_orgid.country}`,
        type: "put"
      }).then(result => {
        that.get_country_data();
        that.isShow = false;
      });
    },
    clear_all_params() {
      this.isShow = false;
      this.modify_params = {
        // 组织名称
        orgListName: "",
        //自推
        selfRatio: "",
        orgInfoList: []
      };
    }
  },
  mounted() {
    let that = this;
    // 获取国家数据
    that.get_country_data();
  }
};
</script>


<style lang="scss" scoped>
.commission {
    display: inline-block;
    background: #fff;
    padding: 20px;
    width: 100%;
    min-height: 700px;
    .mg_l150 {
      margin-left: 150px;
    }
    .mg_t40{
      margin-top: 40px;
    }
    .mg_r20 {
      margin-right: 20px;
    }
    .toolbar {
        .btn {
            margin: 30px 0 0 30px;
            width: auto;
            padding: 0 15px;
            color: white;
            border-radius: 14px;
            margin-right: 10px;
            border: none;
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
    }
    .text_center {
        text-align: center
    }
    .mg_l10 {
        margin-left:10px
    }
    .l_h30 {
        line-height: 30px
    }
    .l_h34 {
        line-height: 34px
    }
    .h_200 {
        height: 200px
    }
    .fl {
        float: left
    }
    .w_100 {
        width: 100px
    }
    .w_350{
        width: 350px !important
    }
    .w_390{
        width: 390px !important
    }
    .w_430{
        width: 430px !important
    }
    .w_140{
        width: 140px !important
    }
    .w_180{
        width: 180px !important
    }
    .w_220{
        width: 220px !important
    }
    .maxW_92{    
        width: 92px !important;
        max-width: 92px;
    }
    .sel_bgColor {
        background: #ecf5ff !important;
        color: #409EFF;
    }
    .red_bgColor {
        background: #ff6969 !important;
        color: #fff;
    }
    .div_ratio_box {
        float: left;
        margin-left: 15px;
        margin-right: 30px;
        p {
            width: 110px;
            white-space:nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        span {
            line-height: 30px;
            margin-left: 10px;
        }
    }
    .largearea {
        margin-top: 30px;
        .currency {
            float: left;
            margin: 10px 40px 10px 0;
            span {
                font-size: 16px;
            }
            .currency_box {
                position: relative;
                width: 300px;
                height: 220px;
                border: 1px solid #bad4f7;
                overflow: auto;
                .C_title {
                    position: absolute;
                    font-size: 16px;
                    height: 40px;
                    line-height: 40px;
                    width: 100%;
                    background-color: #DFE9F6;
                    padding-left: 10px;
                    span {
                        font-size: 14px;
                        float: left;
                        display: block;
                        width: 33%;
                        white-space:nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .C_uli {
                    position: absolute;
                    top: 41px;
                    width: 100%;
                    li {
                        background-color: white;
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        margin-bottom: 1px;
                        cursor: pointer;
                        padding: 0 0 0 10px;
                        span {
                            font-size: 12px;
                            float: left;
                            display: block;
                            width: 33%;
                            white-space:nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }
    #add_modify_del {
        .modal-body {
            .dropdown {
                .area_select:not(:first-child) {
                    margin-left: 30px;
                }
            }
        }
    }
}
</style>
