<template>
    <div class="organization">
        <!-- 新增/修改/按钮 -->
        <el-col :span="24" class="toolbar btnbar">
            <el-button type="primary" size="medium" @click="button_click('add')">新增</el-button>
            <el-button type="primary" size="medium" @click="button_click('modify')">修改</el-button>
            <el-button type="danger" size="medium" @click="button_click('delete')">删除</el-button>
        </el-col>

        <!-- 底部国家区域 -->
        <div class="largearea">
            <div class="currency">
                    <div class="currency_box">
                        <div class="C_title">国家</div>
                        <ul class="C_uli">
                            <li class="country_bgc" :index="i" :class="{sel_bgColor: i===isShowbg.a  , red_bgColor: 'a'+i==selectedItem }" v-for="(item,i) in search_bdorg_country" :key="i" :value="item.orgId" v-if="item.orgLevel===0" @click="switch_countries">{{item.orgName}}</li>
                        </ul>
                    </div>
                </div>
                <div class="currency">
                    <div class="currency_box">
                        <div class="C_title">大区</div>
                        <ul class="C_uli">
                            <li :index="i" :class="{sel_bgColor: i===isShowbg.b  , red_bgColor: 'b'+i==selectedItem }" v-for="(item,i) in search_bdorg_largearea" :key="i" :value="item.orgId" @click="Switching_large_area">{{item.orgName}}</li>
                        </ul>
                    </div>
                </div>
                <div class="currency">
                    <div class="currency_box">
                        <div class="C_title">城市</div>
                        <ul class="C_uli">
                            <li :index="i" :class="{sel_bgColor: i===isShowbg.c  , red_bgColor: 'c'+i==selectedItem }" v-for="(item,i) in search_bdorg_city" :key="i" :value="item.orgId" @click="switching_city"  @dblclick="button_click('modify')">{{item.orgName}}</li>
                        </ul>
                    </div>
                </div>
                <div class="currency">
                    <div class="currency_box">
                        <div class="C_title">区域</div>
                        <ul class="C_uli">
                            <li :index="i" :class="{sel_bgColor: i===isShowbg.d  , red_bgColor: 'd'+i==selectedItem }" v-for="(item,i) in search_bdorg_region" :key="i" :value="item.orgId" @click="switching_region">{{item.orgName}}</li>
                        </ul>
                    </div>
                </div>
                <div class="currency">
                    <div class="currency_box">
                        <div class="C_title">BDM</div>
                        <ul class="C_uli">
                            <li :index="i" :class="{sel_bgColor: i===isShowbg.e  , red_bgColor: 'e'+i==selectedItem }" v-for="(item,i) in search_bdorg_bom" :key="i" :value="item.orgId" @click="switching_bom" v-if="item.orgLevel===4">{{item.orgName}}</li>
                        </ul>
                    </div>
                </div>
        </div>

        <!-- 新增/修改/删除组织管理 -->
        <div class="edit-form">
            <el-dialog
                :title="add_modify_delete_toggle=='add'?'新增组织':'编辑组织'"
                custom-class='dialog'
                :visible.sync="isShow"
                :close-on-click-modal="false"
                :before-close="clear_all_params">
                    <el-col :span="24" >
                        <el-form ref="form" :model="add_organize_params"  label-width="100px">
                            <el-form-item label="组织级别"  >
                                <el-select :disabled="add_modify_delete_toggle=='modify'?true:false" @change="level_change" clearable v-model="add_organize_params.orgLevel">
                                    <el-option :value='0' label="国家"></el-option>
                                    <el-option :value='1' label="大区"></el-option>
                                    <el-option :value='2' label="城市"></el-option>
                                    <el-option :value='3' label="区域"></el-option>
                                    <el-option :value='4' label="BDM"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属组织" v-if="add_organize_params.orgLevel-1===0 || add_organize_params.orgLevel-1===1 || add_organize_params.orgLevel-1===2 || add_organize_params.orgLevel-1===3" > 
                                <el-select  clearable :disabled="isDisabled" placeholder="请选择国家"  @change="national_district" id="country" v-model="parentOrgId">
                                    <el-option v-for="(item,index) in switch_country" :key="index" :value="item.orgId" :label="item.orgName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  v-if="(add_organize_params.orgLevel-1===1 || add_organize_params.orgLevel-1===3 || add_organize_params.orgLevel-1===2 )">
                                <el-select clearable :disabled="isDisabled" placeholder="请选择大区" @change="large_city" id="city" v-model="parentOrgId1">
                                    <el-option v-for="(item,index) in switch_large_area" :key="index" :value="item.orgId" :label="item.orgName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  v-if="(add_organize_params.orgLevel-1===2 || add_organize_params.orgLevel-1===3)">
                                <el-select clearable :disabled="isDisabled" placeholder="请选择城市"  @change="zone_switching" id="region" v-model="parentOrgId2">
                                    <el-option v-for="(item,index) in switch_city" :key="index" :value="item.orgId" :label="item.orgName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="(add_organize_params.orgLevel-1===3)">
                                <el-select clearable :disabled="isDisabled" placeholder="请选择区域"  v-model="parentOrgId3">
                                    <el-option v-for="(item,index) in switch_region" :key="index" :value="item.orgId" :label="item.orgName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="组织名" prop="orgName">
                                <el-input v-model="add_organize_params.orgName" :maxlength="15"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="clear_all_params">取 消</el-button>
                        <el-button v-if="add_modify_delete_toggle !== 'modify'" type="primary" @click="add_preservation" >保 存</el-button>
                        <el-button v-if="add_modify_delete_toggle === 'modify'" type="primary" @click="modify_preservation" >保 存</el-button>
                    </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: '',
    data() {
        return {
            isShow:false,
            // 新增要获取的 parentID
            parentOrgId: '',
            parentOrgId1: '',
            parentOrgId2: '',   
            parentOrgId3: '',
            middle_value: '',
            isShowbg: {
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0
            },
            selectedItem:'',
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
            // 新增删除标识
            add_modify_delete_toggle: '',
            // 新增组织名所需参数
            add_organize_params: { orgId: '', orgName: '', orgLevel: '', parentOrgId: '' },
            // 所属组织切换的内容
            add_dynamic_modification: [],
            //保存通用接口获取的orgid 用与新增
            add_orgid: { orgId: '' },

            //显示的时大区下面的数据  执行在v-if上
            // 组织切换显示国家
            switch_country: [],
            // 国家切换显示大区
            switch_large_area: [],
            switch_city: [],
            switch_region: [],
            // 修改时 判断有没有点击事件
            clkBool: false,
            // 保存国家/大区/城市等id 以便修改
            save_all_orgid: { country: '' },
            // 删除数据使用
            delete_orgid: [],
            //修改时，保存的id
            modify_parentOrgId:'',
            //新增时为false ， 修改时为 true
            isDisabled :false
        }
    },
    computed:{
        ...mapState(['prefix_18OR'])
    },
    methods: {
        clear_all_params(){
            this.isShow = false
        },
        // 默认获取国家数据
        get_country_data() {
            let that = this;
            that.selectedItem='';
            that.isShowbg= {
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0
            };
            this.api_common_bdorg({data:{orgLevel: 0,parentOrgId: 0}}).then(result=>{
                that.search_bdorg_country = result.content;
                if(!result.content.length){ return }
                // 默认获取大区数据
                this.api_common_bdorg({data:{orgLevel:1,parentOrgId: result.content[0].orgId}}).then(result=>{
                    that.search_bdorg_largearea = result.content;
                    if(!result.content.length){ return }
                    // 默认获取城市数据
                    this.api_common_bdorg({data:{orgLevel:2,parentOrgId: result.content[0].orgId}}).then(result=>{
                        that.search_bdorg_city = result.content
                        if(!result.content.length){ return }
                        // 默认获取区域数据
                        this.api_common_bdorg({data:{orgLevel: 3,parentOrgId: result.content[0].orgId}}).then(result=>{
                            that.search_bdorg_region = result.content
                            if(!result.content.length){ return }
                            // 默认获取乡镇数据
                            this.api_common_bdorg({data:{orgLevel: 4,parentOrgId: result.content[0].orgId}}).then(result=>{
                                that.search_bdorg_bom = result.content
                            })
                        })
                    })
                })
            })
            
            // 清空其他数据
            that.search_bdorg_largearea = ''
            that.search_bdorg_city = ''
            that.search_bdorg_region = ''
            that.search_bdorg_bom = ''
        },
        // 默认触发国家事件 获取大区的内容
        switch_countries(event) {
            let that = this;
            let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
            that.isShowbg.a= parseInt(selindex) ; that.isShowbg.b= '';  that.isShowbg.c= ''; that.isShowbg.d= ''; that.isShowbg.e= '';
            that.selectedItem = 'a'+selindex;
            // 按钮点击时触发的事件
            if ($(event.currentTarget)) {
                that.clkBool = true
            }
            that.save_all_orgid.country = value
            // 清空其他数据
            that.search_bdorg_city = ''
            that.search_bdorg_region = ''
            that.search_bdorg_bom = ''
            this.api_common_bdorg({data:{orgLevel: 1,parentOrgId: value}}).then(result=>{
                that.search_bdorg_largearea = result.content
            })
        },
        // 触发大区事件 获取城市内容
        Switching_large_area(event) {
            let that = this;
            let value = event.target.getAttribute('value'),
            selindex = event.target.getAttribute('index');
            that.isShowbg.b= parseInt(selindex);  that.isShowbg.c= ''; that.isShowbg.d= ''; that.isShowbg.e= '';
            that.selectedItem = 'b'+selindex;
            //保存大区的orgid
            that.save_all_orgid.country = value
            that.clkBool = true
            that.search_bdorg_region = ''
            that.search_bdorg_bom = ''
            // console.log('获取到大区的id', that.save_all_orgid.country)
            this.api_common_bdorg({data:{orgLevel:2,parentOrgId: value}}).then(result=>{
                that.search_bdorg_city = result.content
            })
        },
        // 触发城市  获取区域
        switching_city(event) {
            let that = this;
            let value = event.target.getAttribute('value'),selindex = event.target.getAttribute('index');
            that.isShowbg.c= parseInt(selindex); that.isShowbg.d= ''; that.isShowbg.e= '';
            that.selectedItem = 'c'+selindex;
            //保存城市的orgid
            that.save_all_orgid.country = value
            that.clkBool = true;
            that.search_bdorg_bom = ''
            // console.log('获取到城市的id', that.save_all_orgid.country)
            this.api_common_bdorg({data:{orgLevel:3,parentOrgId: value}}).then(result=>{
                that.search_bdorg_region = result.content
            })
        },
        // 触发区域 获取BOM
        switching_region(event) {
            let that = this;
            let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
            that.isShowbg.d= parseInt(selindex); that.isShowbg.e= '';
            that.selectedItem = 'd'+selindex;
            //保存区域的orgid
            that.save_all_orgid.country = value
            that.clkBool = true;
            this.api_common_bdorg({data:{orgLevel:4,parentOrgId: value}}).then(result=>{
                that.search_bdorg_bom = result.content
            })
        },
        //点击BOM 改变背景色
        switching_bom(event) {
            let that = this;
            let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
            that.isShowbg.e= parseInt(selindex); 
            that.selectedItem = 'e'+selindex;
            //保存城市的orgid
            that.save_all_orgid.country = value
            that.clkBool = true;
        },
        button_click(toggle) {
            let that = this
            if (toggle === 'add') { // 新增按钮
                that.add_modify_delete_toggle = 'add';
                that.isDisabled =false;
                // that.$('#add_modify_del').modal('show')
                this.isShow = true
                // 新增时把内容清空
                that.add_organize_params.orgLevel = ''
                that.parentOrgId = ''
                that.parentOrgId1 = ''
                that.parentOrgId2 = ''
                that.parentOrgId3 = ''
                that.add_organize_params.orgName = ''
                // 通过通用接口获取的ID 新增时使用
                this.api_common_mediaId({data:{prefix:this.prefix_18OR}}).then(result=>{
                    that.add_orgid.orgId = result.content
                })
            } else if (toggle === 'modify') {
                if (that.clkBool) {
                    that.add_modify_delete_toggle = 'modify';
                    that.isDisabled =true;
                    // that.$('#add_modify_del').modal('show')
                    this.isShow = true
                    this.api_common_bdorg({pathParams:`/${that.save_all_orgid.country}`}).then(result=>{
                        that.add_organize_params = result.content;
                        that.modify_parentOrgId = result.content.parentOrgId;
                        if (result.content.orgInfoList[0]) {
                        that.parentOrgId = result.content.orgInfoList[0].orgId
                        }
                        if (result.content.orgInfoList[1]) {
                            that.parentOrgId1 = result.content.orgInfoList[1].orgId
                            // console.log('获取二', that.parentOrgId1)
                        }
                        if (result.content.orgInfoList[2]) {
                            that.parentOrgId2 = result.content.orgInfoList[2].orgId
                            // console.log('获取三', that.parentOrgId2)
                        }
                        if (result.content.orgInfoList[3]) {
                            that.parentOrgId3 = result.content.orgInfoList[3].orgId;
                            // console.log('获取四', that.parentOrgId3)
                        }
                        this.api_common_bdorg({data:{orgLevel: 2,parentOrgId: that.parentOrgId1}}).then(result=>{
                            that.switch_city = result.content
                        })
                        this.api_common_bdorg({data:{orgLevel: 3,parentOrgId: that.parentOrgId2}}).then(result=>{
                            that.switch_region = result.content
                        })
                        this.api_common_bdorg({data:{orgLevel: 0}}).then(result=>{
                            that.switch_country = result.content
                        })
                        this.api_common_bdorg({data:{orgLevel: 1,parentOrgId: that.parentOrgId}}).then(result=>{
                            that.switch_large_area = result.content
                        })
                    })
                } else {
                    that.$message({type:'error',message:'请选择一项数据'})
                }
                // that.add_modify_delete_toggle = 'modify'
                // that.$('#add_modify_del').modal('show')     
            } else if (toggle === 'delete') {
                if (that.clkBool) {
                    that.delete_orgid = []
                    that.api_common_bdorg({pathParams:`/${that.save_all_orgid.country}`}).then(result=>{
                        that.delete_orgid.orgId = result.content.orgInfoList
                        //  console.log('获取对应的修改参数', that.delete_orgid.orgId)
                        for (let values of that.delete_orgid.orgId) {
                            that.delete_orgid.push(values.orgName)
                            // console.log('放在数组中', that.delete_orgid)
                        }
                        this.$confirm(`${this.delete_orgid.join(' > ')}`, '您确认删除以下数据吗？', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.api_common_bdorg({
                                type:'delete',
                                pathParams:`/${this.save_all_orgid.country}`
                            }).then(result=>{
                                this.get_country_data()
                            })
                        }).catch(() => {
                            
                        })
                    })
                } else {
                    that.$message({type:'error',message:'请选择一项数据'})
                }
            }
        },
        // 新增保存
        add_preservation() {
            let that = this
            let reg = /[\u4e00-\u9fa5]/
            // let refs = parseInt(this.$refs.reference.value)
            if (that.add_organize_params.orgLevel == 0) {
                that.add_organize_params.parentOrgId = 0
            }
            if(!that.save_validate()){
                return
            }
            if (that.parentOrgId && that.parentOrgId1 && that.parentOrgId2 && that.parentOrgId3) {
                that.add_organize_params.parentOrgId = that.parentOrgId3
            } else if (that.parentOrgId && that.parentOrgId1 && that.parentOrgId2) {
                that.add_organize_params.parentOrgId = that.parentOrgId2
            } else if (that.parentOrgId && that.parentOrgId1) {
                that.add_organize_params.parentOrgId = that.parentOrgId1
            } else if (that.parentOrgId) {
                that.add_organize_params.parentOrgId = that.parentOrgId
            }
            this.api_common_bdorg({
                data:{orgId: that.add_orgid.orgId,
                        orgName: that.add_organize_params.orgName,
                        orgLevel: that.add_organize_params.orgLevel,
                        parentOrgId: that.add_organize_params.parentOrgId},
                type:'post'
                }).then(result=>{
                    that.get_country_data();
                    that.$message({type:'success',message:'保存成功'});
                    // that.$('#add_modify_del').modal('hide')
                    this.isShow = false
                })
        },
        //保存验证
        save_validate(){
            let that = this;
            var bool = false;
            if (that.add_organize_params.orgLevel==='') {
                that.$message({type:'error',message:'请选择组织级别'});
                return  bool
            }
            if(that.add_organize_params.orgLevel==0){
                that.add_organize_params.orgLevel=0;
            }
            if(that.add_organize_params.orgLevel == 1 && (!that.parentOrgId || that.parentOrgId=='')){
                 that.$message({type:'error',message:'请选择所属组织'});
                 return bool
            }
            if(that.add_organize_params.orgLevel == 2 && (that.parentOrgId=='' || that.parentOrgId1=='')){
                 that.$message({type:'error',message:'请选择所属组织'});
                 return bool
            }
            if(that.add_organize_params.orgLevel == 3 && (that.parentOrgId=='' || that.parentOrgId1=='' || that.parentOrgId2=='')){
                  that.$message({type:'error',message:'请选择所属组织'});
                 return bool
            }
            if(that.add_organize_params.orgLevel == 4 && (that.parentOrgId=='' || that.parentOrgId1=='' || that.parentOrgId2=='' || that.parentOrgId3=='')){
                 that.$message({type:'error',message:'请选择所属组织'});
                 return bool
            }
            if (!that.add_organize_params.orgName) {
                that.$message({type:'error',message:'请输入组织名'});
                return bool
            }
            if (that.add_organize_params.orgName.length < 2) {
                that.$message({type:'error',message:'组织名最少2位'});
                return bool
            }
            if  (that.add_organize_params.orgName.length > 15) {
                that.$message({type:'error',message:'组织名最多15位'});
                return  bool  
            }
            bool= true
            return bool
        },
        // 修改数据
        modify_preservation() {
            let that = this;
            // 需求为可以修改所属组织时用这个
            // if(!that.save_validate()){
            //     return
            // }
            // var p_id= '';
            // switch (that.add_organize_params.orgLevel) {
            //     case 4:
            //       p_id = that.parentOrgId3;
            //       break;
            //     case 3:
            //       p_id = that.parentOrgId2;
            //       break;
            //     case 2:
            //       p_id = that.parentOrgId1;
            //       break;
            //     case 1:
            //       p_id = that.parentOrgId;
            //       break;
            //     case 0:
            //       p_id = 0;
            //       break;
            // }
            //that.add_organize_params.parentOrgId = p_id;
            that.add_organize_params.parentOrgId = that.modify_parentOrgId;
            this.api_common_bdorg({
                data:{orgName: that.add_organize_params.orgName,
                    orgLevel: that.add_organize_params.orgLevel,
                    parentOrgId: that.add_organize_params.parentOrgId},
                type:'put',
                pathParams:`/${that.save_all_orgid.country}`
            }).then(result=>{
                that.get_country_data()
                // $('#add_modify_del').modal('hide')
                this.isShow = false
            })
        },

        // 根据组织级别的切换显示所属组织
        level_change() {
            let that = this
            this.api_common_bdorg({data:{orgLevel: 0}
            }).then(result=>{
                that.switch_country = result.content
            })
        },
        // 当下拉框选择对应国家出现对应大区
        national_district(val) {
            let that = this;
            that.parentOrgId1 ='';
            that.parentOrgId2 ='';
            that.parentOrgId3 ='';
            that.switch_large_area = [];
            that.switch_city =[];
            that.switch_region = [];
            // let val = $('#country').val();
            // let val = this.parentOrgId;
            if(!val || val==''){
                return
            }
            this.api_common_bdorg({data:{orgLevel: 1,parentOrgId:val}
            }).then(result=>{
                that.switch_large_area = result.content;
            })
        },
        // 大区切换显示显示城市
        large_city(val) {
            let that = this
            that.parentOrgId2 ='';
            that.parentOrgId3 ='';
            that.switch_city =[];
            that.switch_region = [];
            // let val = $('#city').val();
            if(!val || val==''){
                return
            }
            this.api_common_bdorg({data:{orgLevel: 2,parentOrgId:val}
            }).then(result=>{
                that.switch_city = result.content;
            })
        },
        // 城市切换区域
        zone_switching(val) {
            let that = this;
            that.parentOrgId3 ='';
            that.switch_region = [];
            // let val = $('#region').val();
            if(!val || val==''){
                return
            }
            this.api_common_bdorg({data:{orgLevel: 3,parentOrgId:val}
            }).then(result=>{
                that.switch_region = result.content;
            })
        }
    },
    mounted() {
        let that = this
        // 获取国家数据
        that.get_country_data()
    }
}
</script>

<style lang="scss" scoped>
.organization {
    display: inline-block;
    background: #fff;
    padding: 20px;
    width: 100%;
    min-height: 700px;
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
    .sel_bgColor {
        background: #ecf5ff !important;
        color: #409EFF;
    }
    .red_bgColor {
        background: #ff6969 !important;
        color: #fff;
    }
    .largearea {
        margin-top: 30px;
        .currency {
            float: left;
            margin: 20px 40px 20px 0;
            span {
                font-size: 16px;
            }
            .currency_box {
                position: relative;
                width: 180px;
                height: 220px;
                border: 1px solid #bad4f7;
                overflow-x: hidden;
                .C_title {
                    position: absolute;
                    font-size: 16px;
                    height: 40px;
                    line-height: 40px;
                    width: 100%;
                    background-color: #DFE9F6;
                    text-align: center;
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
                        font-size:14px;
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


