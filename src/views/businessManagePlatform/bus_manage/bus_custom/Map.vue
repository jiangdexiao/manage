<template>
  <div class="m85xbdt">
    <div class="content_c">
      <el-tabs v-model="setType" @tab-click="typeToggle">
        <el-tab-pane label="广告位设置" name="billboard">
          <div class="billboard">
              <el-col :span="24">
                <el-form :inline="true" :form="search_params">
                  <el-form-item>
                    <el-select
                      v-model="search_params.mediaId"
                      filterable
                      remote
                      :clearable = "true"
                      placeholder="请输入媒体名称或ID"
                      :remote-method="get_media_names"
                      :loading="load.media">
                      <el-option
                        v-for="(item,index) in media_names"
                        :key="index"
                        :label="(item.mediaName.length > 12)?(item.mediaName.slice(0,12)+'...'):item.mediaName"
                        :value="item.mediaId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="search_params.mresId"
                      filterable
                      remote
                      reserve-keyword
                      :clearable = "true"
                      placeholder="输入广告位名称或ID"
                      :remote-method="get_mres_names"
                      :loading="load.mres">
                      <el-option
                        v-for="(item,index) in mres_names"
                        :key="index"
                        :label="(item.mresName.length > 12)?(item.mresName.slice(0,12)+'...'):item.mresName"
                        :value="item.mresId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!--<el-form-item>
                    <el-input @keydown.enter="get_buscircle_list" v-model="search_params.id" placeholder="请输入广告位、媒体名称或ID进行搜索"></el-input>
                  </el-form-item>-->
                  <el-form-item>
                    <el-button type="primary" size="medium" class='btn-search' @click="get_buscircle_list" >搜索</el-button>
                    <el-button size="medium" type="primary" @click="re_clear">重置搜索条件</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="24">
                <div class="info">
                  <div class="search">
                    <div class="search_cell">
                        批量操作
                      <el-select v-model="batch_edit_value" class="batch" @change="batch_edit">
                        <el-option label="隐藏" value="0"> </el-option>
                        <el-option label="展示" value="1"></el-option>
                      </el-select>
                    </div>
                    <div class="operation_btn">
                      <button class="btn_hd bg_bl " @click="get_Icon">更换地图展示图标</button>
                      <button class="btn_hd sky_blue " @click="goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing')" >寻宝营销</button>
                      <button class="btn_hd sea_blue" @click="goto('/m/clientFunManage/mapTreasureHunt/mediaNameEdit')" >客户端媒体管理</button>
                    </div>
                  </div>
                  <list-data
                    ref='list-data'
                    checkbox
                    @edit="edit"
                    @onSelectAll="sel"
								    @onSelect="sel"
                    @onChangeCurrentPage="onChangeCurPage"
                    @onChangePageSize="onChangeCurPageSize"
                    :DataGrid = 'datagrid'>
                  </list-data>
                </div>
              </el-col>
                
          </div>
        </el-tab-pane>
        <el-tab-pane label="商圈设置" name="business_circle">
          <div class="business_circle">
            <div class="box">
              <el-col :span="24">
                <el-form :inline="true" :form="search_params" class="demo-form-inline">
                  <el-form-item label="选择查询的城市">
                    <el-select v-model="demand_business_circle_params.province" @change="province_change">
                      <el-option
                        v-for="(item, i) in province_all"
                        :key="i"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                    <el-select v-model="demand_business_circle_params.city" 
                        @change="city_change">
                       <el-option
                        v-for="(item, i) in city_all"
                        :key="i"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label='选择查询类型' >
                    <el-select  v-model="advertise_business_circles" @change="toggle_billboard">
                        <el-option label="商圈" value="1" ></el-option>
                        <el-option label="广告位" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  v-show ="advertise_business_circles == '1'">
                    <el-form-item>
                        <!--:label="(item.circleName.length > 15)?(item.circleName.slice(0,15)+'...'):item.circleName"-->
                      <el-select
                        v-model="cir_Id"
                        filterable
                        remote
                        reserve-keyword
                        :clearable="true"
                        placeholder="输入商圈名称"
                        no-data-text="无搜索结果"
                        :remote-method="get_circle"
                        :loading="load.cir"
                        @change="get_focus">
                        <el-option
                          v-for="(item,index) in cir_names"
                          :key="index"
                          :label="item.circleName"
                          :value="item.circleId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <!--<div class="cir_search">
                      <input class="cir_input" type="text" placeholder="请输入商圈名称">
                      <div class="btn" @click="get_focus">搜索</div>
                    </div>-->
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="24">
                <div class="map_circle">
                    <div id="allmap" class="map"></div>
                    <div :class="not_map_click?'add':'add cancel_circle'" @click="open_map_monitor">
                      <span v-show="not_map_click" >+创建商圈</span>
                      <span v-show="!not_map_click">退出创建商圈</span>
                    </div>
                    <div class="message" v-show="!(not_map_click)">
                      <p>将鼠标移入地图，点击地图上任意位置，既可以该位置为中心创建商圈</p>
                    </div>
                </div>
              </el-col>
            </div>
            <el-col :span="24" class="toolbar ml20">
                <el-form :inline="true" :form="search_params">
                  <el-form-item>
                    <el-select
                      v-model="search_params.mediaId"
                      filterable
                      remote
                      :clearable="true"
                      placeholder="请输入媒体名称或ID"
                      :remote-method="get_media_names"
                      :loading="load.media">
                      <el-option
                        v-for="(item,index) in media_names"
                        :key="index"
                        :label="(item.mediaName.length > 12)?(item.mediaName.slice(0,12)+'...'):item.mediaName"
                        :value="item.mediaId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="search_params.mresId"
                      filterable
                      remote
                      reserve-keyword
                      :clearable="true"
                      placeholder="输入广告位名称或ID"
                      :remote-method="get_mres_names"
                      :loading="load.mres">
                      <el-option
                        v-for="(item,index) in mres_names"
                        :key="index"
                        :label="(item.mresName.length > 12)?(item.mresName.slice(0,12)+'...'):item.mresName"
                        :value="item.mresId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!--<el-form-item>
                    <el-input @keydown.enter="get_buscircle_list" v-model="search_params.id" placeholder="请输入广告位、媒体名称或ID进行搜索"></el-input>
                  </el-form-item>-->
                   <el-form-item>
                    <el-button type="primary" size="medium" class='btn-search' @click="get_buscircle1_list" >搜索</el-button>
                    <el-button size="medium" type="primary" @click="re_clear">重置搜索条件</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            <div class="info">
                <list-data
                  ref='list-data'
                  checkbox
                  @add="add"
                  @editCircle="editCircle"
                  @locateAd="locateAd"
                  @onChangeCurrentPage="onChangeCurPage"
                  @onChangePageSize="onChangeCurPageSize"
                  :DataGrid = 'datagrid2'>
                </list-data>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--创建商圈-->
    <el-dialog
      title="创建商圈"
      custom-class='dialog_static'
      :visible.sync="isShow"
      :before-close="cancle_add_circle">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="商圈名称" prop="circleName">
              <el-input v-model="form.circleName" :maxlength="6" placeholder="请填写商圈名称"></el-input>
            </el-form-item>
            <el-form-item label="广告位归属" prop="rangeLimit" class="batch">
               比例尺5公里下，以商圈为中心，<el-input  v-model="form.rangeLimit" :maxlength="4" ></el-input>米范围内的归入该商圈
            </el-form-item>
             <el-form-item label="广告位归属" class="show_num" prop="rangeLimit">
                <span class="infs" v-show="circle_res.infoStr">{{circle_res.infoStr}}</span>
                <a :class="form.rangeLimit=== ''?'un can':'can'" @click="show_mres_num">
                  {{circle_res.infoStr?'重新获取':'点击获取该距离下的广告位数量'}}
                </a>
            </el-form-item>
          </el-form>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle_add_circle">取 消</el-button>
          <el-button type="danger" v-if="add_modify_toggle == 'modify'" @click="del_business_circle">删 除</el-button>
          <el-button type="primary" @click="save" >保 存</el-button>
        </span>
    </el-dialog>
    <!--添加商圈-->
    <el-dialog
      title="添加商圈"
      custom-class='dialog_static'
      :visible.sync="add_join_circle_show"
      :before-close="cancle_join_circle">
        <el-col :span="24" >
          <div class="circle">
            <div class="nothing" v-show="circles.add.length===0">附近暂无可添加商圈</div>
            <ul v-show="circles.add.length>0">
              <li v-for="(item,i) in circles.add" :key="i" :value="item.circleId" :title="item.circleName" class="" @click="join_to">{{item.circleName.slice(0, 12)}}</li>
            </ul>
            <el-pagination
              layout="prev, pager, next"
              @current-change="join_circle_page"
              :page-size="9"
              :total="page_params.pageCount"
               v-show="page_params.pageCount>9">
            </el-pagination>
          </div>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle_join_circle">取 消</el-button>
          <el-button type="primary" @click="confirm_join_to" >保 存</el-button>
        </span>
    </el-dialog>
    <!--编辑商圈-->
    <el-dialog
      title="编辑商圈"
      custom-class='dialog_static'
      :visible.sync="join_circle_show"
      :before-close="cancle_join_circle">
        <el-col :span="24" >
          <div class="circle">
            <h5 v-show="circles.belong.length > 0">所属商圈</h5>
            <ul >
              <li v-for="(item,i) in circles.belong" :key="i" :value="item.circleId" :title="item.circleName">{{item.circleName.slice(0, 12)}}<i class="del" @click="show_del_belong_circle(item)"></i></li>
            </ul>
            <h5 v-show="circles.add.length > 0">添加商圈</h5>
            <div class="nothing" v-show="circles.add.length===0">附近暂无可添加商圈</div>
            <ul v-show="circles.add.length>0">
              <li v-for="(item,i) in circles.add" :key="i" :value="item.circleId" :title="item.circleName" :class="circle_params.circleIds.includes(item.circleId)?'choose':''" @click="join_to">{{item.circleName.slice(0, 12)}}</li>
            </ul>
            <el-pagination
              layout="prev, pager, next"
              @current-change="join_circle_page"
              :page-size="9"
              :total="page_params.pageCount"
              v-show="page_params.pageCount>9">
            </el-pagination>
          </div>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle_join_circle">取 消</el-button>
          <el-button type="primary" @click="confirm_join_to" >保 存</el-button>
        </span>
    </el-dialog>
    <!--客户端展示媒体名称编辑-->
    <!--<NameEdit :isShow="isShowMediaName"></NameEdit>-->
    <!--批量上传广告位图标-->
    <el-dialog
      title="更换地图展示图标"
      custom-class='dialog_batch_ad'
      :visible.sync="batch_ad_icon"
      :before-close="close_ad"
      center>
        <el-col :span="24" style="margin-bottom:30px;" >
          <p class="choosen_ad">尺寸限制64px*64px，PNG/JPG格式，10K以内</p>
          <div class="fl up">
            <p>更换广告位地图展示图标</p>
            <input type="file" id="ad_img_upload" style="display:none" @change="upload_img('ad')" accept="image/png;image/jpeg">
            <div class="img_up">
              <img width="40" height="40"  id="ad_img" v-show="img_ad_show">
            </div>
            <button class="upload_btn" @click="show_upload('ad')" v-show="!img_ad_show">点击上传</button>
            <button class="upload_btn" @click="show_upload('ad')" v-show="img_ad_show">重新上传</button>
          </div>
          <div class="fr up">
            <p>更换媒体地图展示图标</p>
            <input type="file" id="media_img_upload" style="display:none" @change="upload_img('media')" accept="image/png;image/jpeg">
            <div class="img_up">
              <img width="40" height="40"  id="media_img" v-show="img_media_show">
            </div>
            <button class="upload_btn" @click="show_upload('media')" v-show="!img_media_show">点击上传</button>
            <button class="upload_btn" @click="show_upload('ad')" v-show="img_media_show">重新上传</button>
            
          </div>
          
          
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close_ad">取 消</el-button>
          <el-button type="primary" @click="batch_upload_icon" >保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  // import { tool } from "../../../../utils/" 
  // import NameEdit from './MediaNameEdit.vue'
  export default {
    // name: '',
    // components: {NameEdit},
    data () {
      let tool = this.tool
      let _this = this
      var checkName = (rule, value, callback) => {
        let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
        value = value.replace(/(^\s*)|(\s*$)/g,"")
        if (!value) {
          return callback(new Error('名称不能为空'));
        }
        if (!deg.test(value)) {
          return callback(new Error('标题只能输入只能输入中英文和数字,中间不能有空格！'));
        }
      };
      var checkLimit = (rule, value, callback) => {
        let reg = /^[1-9]\d*$/
        if (!value) {
          return callback(new Error('范围值不能为空'));
        }
        if (value < 500 || value > 3000 || !reg.test(value)) {
          return callback(new Error('范围值为500-3000之间的正整数'));
        }
      };
      return {
        cir_Id:'',
        cir_names:[],
        load:{media:false,mres:false,cir:false},
        img_width:false,
        img_ad_show:false,
        img_media_show:false,
        adObjUrl:'',
        mediaObjUrl:'',
        // 批量上传广告位图标弹窗显示
        batch_ad_icon:false,
        // 广告位设置表格数据
        datagrid:{
          List: [],
          FieldList: [
            { type: 'operate',label: '设置',
              width: 100,
              btns:[
                { text: '显示', eventName:'edit', condition:function({data}){ return data.isShowApp == 0 }},
                { text: '隐藏', eventName:'edit', condition:function({data}){ return data.isShowApp == 1 }}
              ]
            },
            { key: 'mediaName', label: '所属媒体', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mediaName, 15)
            }},
            { key: 'mresName', label: '广告位名', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mresName, 15)
            }},
            { key: 'mresAlias', label: '客户端展示广告位名', tooltip: true, formatter: function (row,column,cellValue) {
              let n = ''
              if (row.mresAlias) {
                n = row.mresAlias
              } else {
                n = row.mediaName + '-' + row.mresName
              }
              return tool.str.textLength(n, 5)
            },control:{type:'input',blur:function(row) {
              // 修改广告位别名提交
              _this.api_businessManagePlatform_editMresAlias({ 
                data: {mresAlias: row.mresAlias},
                pathParams: `/${row.mresId}`
              }).then(res => {
                _this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                _this.get_buscircle_list()
              })
            }}},
            { key: 'mresId', label: '广告牌ID', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mresId, 5)
            }},
            { key: 'tagAddr', label: '广告位位置'},
            { key: 'busCircleNames', label: '所属商圈', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.busCircleNames, 15)
            }},
            { key: 'isShowApp', label: '状态', tooltip: true, formatter:function(row,column,cellValue){
             let show = ''
              if (row.isShowApp === 1) {
                show = '显示'
              } else if (row.isShowApp === 0 || !row.isShowApp) {
                show = '隐藏'
              }
              return show
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox: true,
        },
        // 商圈设置表格数据
        datagrid2:{
          List: [],
          FieldList: [
            { type: 'operate',label: '操作',
              width: 200,
              btns:[
                { text: '添加商圈', eventName:'add',condition:function({data}){ return data.busCircleNames == '' }},
                { text: '编辑商圈', eventName:'editCircle',condition:function({data}){ return data.busCircleNames != '' }},
                { text: '查看地图位置', eventName:'locateAd'}
              ]
            },
            { key: 'mediaName', label: '所属媒体', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mediaName, 15)
            }},
            { key: 'mresName', label: '广告牌名', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mresName, 15)
            }},
            { key: 'mresId', label: '广告牌ID', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mresId, 5)
            }},
            { key: 'tagAddr', label: '广告位位置'},
            { key: 'busCircleNames', label: '所属商圈', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.busCircleNames, 15)
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox: false,
        },
        // 批量操作切换
        batch_toggle:false,
        // 名称模糊搜索参数
        // name:{mediaName:'',mresName: ''},
        // 广告位搜索参数
        search_params: {mediaId: '', mresId: '', id: ''},
        // 切换广告牌，商圈设置
        // setType: 'business_circle',
        setType: 'billboard',
        // 所有的省份(供新增修改使用)
        province_all: [],
        // 可选的城市(供新增修改使用)
        city_all: [],
        // 创建商圈时查询广告位结果
        circle_res: {num: '', infoStr: ''},
        // 地图
        map: {},
        // 控制创建和编辑商圈弹窗
        isShow:false,
        // 新增商圈参数
        form: {circleName: '', circleId: '', rangeLimit: '', longitude: '',latitude:'', provinceName: '', cityName: ''},
        map_param:{zoom: 12, point: null},
        formRules:{
          circleName:[{ required: true, validator: checkName, trigger: "blur"}],
          rangeLimit:[{ required: true, validator:checkLimit, trigger: "blur" }]
        },
        // 查询附近商圈数
        num: '',
        media_names: [],
        mres_names: [],
        // 是否显示编辑媒体别名
        isShowMediaName : false,
        // 搜索添加商圈的参数
        join_circle_params: {pageNo: '1', pageRows: '9', pageCount: '', pages: ''},
        // 添加商圈的数据列表
        circles: {belong:[],add:[],test:[]},
        add_join_circle_show: false,
        join_circle_show: false,
        // 选择添加的商圈
        circle_params: {circleIds: [], mresId: ''},
        // 翻页功能参数row
        row: null,
        // 新增、修改模态框的类型
        add_modify_toggle: '',
        // 修改广告位别名参数
        mresAlias: '',
        mresId: '',
        // 修改媒体别名参数
        media_alias: [],
        // 添加选择的项到编辑媒体别名的参数
        media_alias_params:{mediaId: '', alias: ''},
        // 别名类型
        alias_type: '',
        // 批量操作的值
        batch_edit_value: '',
        // 批量操作的mresIds数组
        batch_edit_mresIds: [],
        // 用于支持模糊搜索的媒体名称
        mediaName: '',
        // add_modify_params: {longitude: '', latitude: ''},
        // 查询商圈的参数
        demand_business_circle_params: {province: '', city: ''},
        // 标注位置界面是否显示
        address_show: false,
        // 广告位和商圈切换
        advertise_business_circles: '1',
        // 批量解析列表的地址
        adds: [],
        // 地图中心城市
        center: '',
        center_change: false,
        // 地图是否监听点击事件
        not_map_click: true,
        pageno1: 1,
        pageno: 1,
        // 是否显示删除商圈模态框
        del_circle_show: false,
        // 删除商圈的id
        del_circle:{id: '', name: ''},
        // 搜索商圈列表名称类型
        // nameType:''
        defaultHand:null,
        page_params:{pageNo:1,pageRows:9,pageCount:0},
      }
    },
    watch: {
    },
    methods: {
      // 点击创建商圈的事件
      open_map_monitor () {
        this.not_map_click = !this.not_map_click
        if (this.advertise_business_circles !== '1') {
          this.advertise_business_circles = '1'
          this.self_Overlay()   // 获取商圈标注列表
        }
        // 设置鼠标样式
        if (!this.not_map_click) {
          // this.map.setDefaultCursor('url("../../../../assets/images/businessManage/icon_sq_setup.png")')
          this.defaultHand = this.map.getDefaultCursor();
          this.map.setDefaultCursor('crosshair')
          this.map.addEventListener('click', this.map_click)
        } else {
          this.map.setDefaultCursor(this.defaultHand)
          this.map.removeEventListener('click', this.map_click)
        }
      },
      // 模糊搜索商圈
      get_circle (query) {
         if (query !== '') {
          this.load.cir= true
          this.api_businessManagePlatform_getCircle({
            data:{
              systemAccessToken:JSON.parse(sessionStorage.getItem('userInfo')).token,
              circleName: query,
            }
          }).then(res => {
            this.load.cir= false
            if (res.content.length > 0) {
              this.cir_names = res.content
            } else {
              this.cir_names = []
            }
          })
        } else {
          this.cir_names  = []
        }
      },
      // 广告位定位地图位置
      locateAd (data) {
        if (this.advertise_business_circles !== '2') {  
          this.advertise_business_circles = '2'
          this.maker_of_adver()  // 获取广告位列表
          setTimeout(()=>{
            this.locateAd_fun(data.data)
          },1000)
        } else {
          this.locateAd_fun(data.data)
        }
      },
      locateAd_fun (data) {
        let point = new BMap.Point()
        point.lng = data.longitude
        point.lat = data.latitude
        data.mresName = data.mresName ? data.mresName : '-'
        data.mediaName = data.mediaName ? data.mediaName : '-'
        data.mresAlias = data.mresName ? data.mresAlias : '-'
        data.busCircleNames = data.busCircleNames ? data.busCircleNames : '-'
        var opts = {  
          width: 250,     // 信息窗口宽度  
          height: 100,     // 信息窗口高度  
          title: '<span style="font-size:14px;color:#666666">' + data.mresName + '</span>'   // 信息窗口标题  
        }  
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE);  
        var content = '<span style="font-size:12px;color:#666666">所属媒体: '+ data.mediaName +"<br/>广告牌别名:"+ data.mresAlias +"<br/>所属商圈:"+ data.busCircleNames
        var info_Window = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象  
        this.map.openInfoWindow(info_Window,point);
      },
      // 搜索商圈
      get_focus () {
        this.clear_focus()
        this.cir_names.some((item)=>{
          if(item.circleId === this.cir_Id) {
            this.map.centerAndZoom(new BMap.Point(item.longitude,item.latitude),11)
          }
        })
        if (this.cir_Id) {
          document.getElementById(this.cir_Id).className = 'map_cir'
        }
      },
      // 清除搜索商圈结果
      clear_focus () {
        if (document.getElementsByClassName('map_cir').length != 0) {
          document.getElementsByClassName('map_cir')[0].className = ''
        }
      },
      // 获取地图图标
      get_Icon () {
        let that = this
        this.batch_ad_icon = true
         this.api_businessManagePlatform_getBatchIcon({
          data:{
            token:JSON.parse(sessionStorage.getItem('userInfo')).token
          },
        }).then(res =>{
          if (res.content.length == 0) return 
          res.content.map (item => {
            if (item.type == 1) {
              that.adObjUrl = item.icon
              that.img_ad_show = true
              document.querySelector('#ad_img').src = item.icon
            } else if (item.type == 0) {
              that.mediaObjUrl = item.icon
              that.img_media_show = true
              document.querySelector('#media_img').src = item.icon
            }
          })
          
        })
      },
      show_upload (type) {
        if (type == 'ad') {
          document.querySelector('#ad_img_upload').click()
        } else if (type =='media') {
          document.querySelector('#media_img_upload').click()
        }
      },
      // 上传头像时获取本地地址
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
      // 上传头像
      upload_img (type) {
        let that = this
        let target = event.target
        if (!(target.files[0].type == 'image/jpeg' || target.files[0].type == 'image/png')) {
          this.$message({
            message: '图片格式不正确',
            type: 'warning'
          });
          if (type == 'ad') {
            document.querySelector('#ad_img_upload').value =''
          } else if (type == 'media') {
            document.querySelector('#media_img_upload').value =''
          }
          return
        }
        let objUrl = this.getObjectURL(target.files[0])
        let size = target.files[0].size
        let img = new Image()
        img.src = objUrl
        if (size >= 1024*10) {
          this.$message({
            message: '图片大小不超过10k',
            type: 'warning'
          });
          return
        }
        if (objUrl) {
         
        let textImg = document.createElement("img")
        textImg.src = objUrl
        setTimeout(() => {
          let img = new Image()
          img.src = textImg.src
          console.log('图片', img)
          console.log('宽', img.width, '高',img.height )
          if (img.width!==64 || img.height!==64) {
            this.$message({
              message: '图片尺寸不对',
              type: 'warning'
            })
            return 
          } else {
             // 上传图片
            let formData = new FormData()
            if (type == 'ad') {
              formData.append('img', document.querySelector('#ad_img_upload').files[0])
            } else if (type == 'media') {
              formData.append('img', document.querySelector('#media_img_upload').files[0])
            }
            formData.append('img', objUrl)
            formData.append('token', sessionStorage.getItem('access_token'))
            formData.append('imgGroup', 5)
            $.ajax({
              type: 'post',
              url: that.BASE_URL + 'm2c.support/img/upload',
              data: formData,
              processData: false,
              contentType: false,
              success: function (res) {
                res = JSON.parse(res)
                if (res.errorMessage && res.errorMessage !== '') {
                  that.$message({ type: "warning", message: res.errorMessage })
                  return
                }
                if (type == 'ad') {
                  that.adObjUrl = res.content.url
                  that.img_ad_show = true
                  document.querySelector('#ad_img').src = res.content.url
                } else if (type == 'media') {
                  that.mediaObjUrl = res.content.url
                  that.img_media_show = true
                  document.querySelector('#media_img').src = res.content.url
                }
              }
            })
          }
        },100)
        }
        
      },
      // 取消批量上传广告位图片
      close_ad () {
          this.batch_ad_icon = false
          this.img_ad_show = false
          this.img_media_show = false
          this.adObjUrl = ''
          this.mediaObjUrl = ''
      },
      // 批量上传广告位和媒体图标
      batch_upload_icon() {
        if ( this.adObjUrl == '' && this.mediaObjUrl == '') {
          this.$message({ type: "warning", message: "请上传图片" })
          return
        }
        let jsonData=''
        if (this.adObjUrl != '' && this.mediaObjUrl == '') {
          jsonData={"1":this.adObjUrl}
          // jsonData=JSON.stringify({"1":this.adObjUrl})
        } else if (this.adObjUrl == '' && this.mediaObjUrl != '') {
          jsonData={"0":this.mediaObjUrl}
        } else {
          jsonData={"1":this.adObjUrl,"0":this.mediaObjUrl}
        }
        this.api_businessManagePlatform_editIconBatch({
          data:JSON.stringify(jsonData),
          headers:{'Content-Type': 'application/json;'}
        }).then(res => {
          this.batch_toggle = false
          this.batch_ad_icon = false
          this.$message({
            message: '设置成功',
            type: 'success'
          });
          this.get_buscircle_list()
        })
        // let _this = this
        // $.ajax({
        //   type: 'post',
        //   url: this.BASE_URL+'m2c.operate/app/icon/setting',
        //   data:JSON.stringify(jsonData),
        //   contentType: 'application/json; charset=utf-8',
        //   dataType: 'json',
        //   success: function (result) {
        //     if (result.status == 200) {
        //       _this.batch_toggle = false
        //       _this.batch_ad_icon = false
        //       _this.$message({
        //         message: '设置成功',
        //         type: 'success'
        //       });
        //       _this.get_buscircle_list()
        //     }
        //   }
        // })
      },
      toggle_billboard () {
        if (this.advertise_business_circles === '1') {
          this.self_Overlay()   // 获取商圈标注列表
        } else if (this.advertise_business_circles === '2') {  
          this.maker_of_adver()  // 获取广告位列表
        }
        this.cir_Id = ''
      },
      // 设置显示隐藏
      edit (opts) {
        this.api_businessManagePlatform_showOrHideApp({ 
          data: {isShow: opts.data.isShowApp=== 1 ? 0 : 1},
          pathParams: `/${opts.data.mresId}`
        }).then(res => {
          this.$message({
            message: '设置成功',
            type: 'success'
          });
          this.get_buscircle_list()
        })
      },
      // 省改变事件
      province_change(val) {
        this.api_businessManagePlatform_allCityList({ 
          data: {
            token: sessionStorage.getItem('access_token'),
            province: val
          },
        }).then(result => {
            this.city_all = result.content
            if (val == '440000') {
              this.demand_business_circle_params.city = '440200'
              this.center = '深圳市'
            } else if (val === '810000') {
              this.demand_business_circle_params.city = '810100'
              this.center = '香港'
            } else {
              this.demand_business_circle_params.city = result.content[0].code
              this.center = result.content[0].name
            }
            this.locate_center()
        })
      },
      // 市改变事件
      city_change(val) {
        this.city_all.some(item=>{
          if (item.code === val) {
            this.center = item.name 
            this.locate_center()
            return 
          }
        })
      },
      // 地图定位事件
      locate_center() {
        let BMap = window.BMap 
        let local = new BMap.LocalSearch(this.map, {
          renderOptions: {map: this.map}
        })
        local.search(this.center)
      },
      // 获取省市区列表    
      get_addres () {
        let that = this
        // 获取省市区列表
        this.api_businessManagePlatform_allProvList({ 
          data: {
            token: sessionStorage.getItem('access_token')
          },
        }).then(result => {
          this.province_all = result.content
          this.demand_business_circle_params.province = '440000'
          this.api_businessManagePlatform_allCityList({ 
            data: {
              token: sessionStorage.getItem('access_token'),
              province: this.demand_business_circle_params.province
            },
          }).then(res => {
              this.city_all = res.content
              this.demand_business_circle_params.city = '440200'
              this.center = '深圳市'
          })
        })
      },
      // 获取广告位设置页面商圈资源列表
      get_buscircle_list () {
        this.api_businessManagePlatform_circleList({ 
          data: Object.assign({},this.search_params, {
            systemAccessToken: sessionStorage.getItem('access_token'),
            pageRows: this.datagrid.Pagination.page_size,     // 每页多少条数据
            pageNo: this.datagrid.Pagination.current_page           // 请求第几页
          }, this.add_modify_delete_params),
        }).then(res => {
            if (res.content != '') {
              this.datagrid.List = res.content
          } else {
            this.datagrid.List = []
          }
          this.datagrid.Pagination.total = res.totalCount
        })
      },
      // 获取商圈设置页面商圈资源列表
      get_buscircle1_list () {
        this.api_businessManagePlatform_circleList({ 
          data: Object.assign({},this.search_params, {
            systemAccessToken: sessionStorage.getItem('access_token'),
            pageRows: this.datagrid2.Pagination.page_size,     // 每页多少条数据
            pageNo: this.datagrid2.Pagination.current_page           // 请求第几页
          }, this.add_modify_delete_params),
        }).then(res => {
          if (res.content != '') {
            this.datagrid2.List = res.content
          } else {
            this.datagrid2.List = []
          }
          this.datagrid2.Pagination.total = res.totalCount
        })
      },
      // 翻页功能
      onChangeCurPage (page) {
        // this.$message('当前页是第' + page + '页')
        if (this.setType =="billboard") {
          this.datagrid.Pagination.current_page = page
          this.get_buscircle_list()
        } else {
          this.datagrid2.Pagination.current_page = page
          this.get_buscircle1_list()
        }
      },
      onChangeCurPageSize (pageSize) {
        // this.$message('当前每页显示 ' + pageSize + ' 条')
        if (this.setType =="billboard") { 
          this.datagrid.Pagination.page_size  = pageSize
          this.get_buscircle_list()
        } else {
          this.datagrid2.Pagination.page_size  = pageSize
          this.get_buscircle1_list()
        }
      },
      goto (path) {
        this.$router.push({path: path})
      },
      typeToggle () {
        // 清空搜索参数
        // this.search_params = {mediaId: '', mresId: ''}
        this.re_clear()
        // 清空缩放值和中心点
        this.map_param.zoom = ''
        this.map_param.point = null
        // 清空搜索值
        this.media_names = []
        this.mres_names = []
        // 第一次切换默认搜索所有商圈
        if (!this.center_change) {
          // 地图定位
          this.locate_center()
          this.self_Overlay()
          this.center_change = true
        }
      },
      // 批量渲染广告位地址标注
      maker_of_adver () {
        let _this = this
        let BMap = window.BMap
        // var tubiao = require('../../../../../static/images/businessManage/photo_ico_ad.png')
        // var myIcon = new BMap.Icon(tubiao, new BMap.Size(36, 36))
        this.api_businessManagePlatform_billboardAddrs({ 
            data: {
              systemAccessToken: sessionStorage.getItem('access_token')
              // regionCode: this.demand_business_circle_params.city
            },
          }).then(result => {
            // 广告位列表组
            this.adds = result.content
            // 清空其他所有标注
            this.map.clearOverlays()
            if (this.adds.length > 0) { 
              if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                  var points = [];  // 添加海量点数据
                  for (var i = 0; i < this.adds.length; i++) {
                    points.push(new BMap.Point(this.adds[i].longitude, this.adds[i].latitude));
                  }
                  var options = {
                      size: BMAP_POINT_SIZE_NORMAL,
                      shape: BMAP_POINT_SHAPE_WATERDROP,
                      color: '#18DCF6'
                  }
                  var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                  pointCollection.addEventListener("click", function (e) { 
                    console.log(e)
                    _this.api_businessManagePlatform_getMresInfo({ 
                      data: {
                        longitude: e.point.lng,
                        latitude: e.point.lat,
                        systemAccessToken: sessionStorage.getItem('access_token')
                      },
                    }).then(result => {
                      console.log(result)
                      _this.locateAd_fun(result.content[0])
                    })
                  }); 
                  this.map.addOverlay(pointCollection);  // 添加Overlay
              } else {
                  alert('请在chrome、safari、IE8+以上浏览器查看本示例');
              }
            }
          })
      },
      //  批量创建自定义地图覆盖物
      self_Overlay () {
        let _this = this
        let BMap = window.BMap
        function ComplexCustomOverlay (point, text,id) {
          this._point = point
          this._text = text
          this._id = id
          // this._overText = mouseoverText
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay()
        ComplexCustomOverlay.prototype.initialize = function (map) {
          this._map = map
          var div = this._div = document.createElement('div')
          
          // div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
          // div.style.zIndex = '3000'
          div.id = this._id
          // div.className = "map_cir"
          div.style.position = 'absolute'
          div.style.backgroundColor = '#fff'
          div.style.border = '1px solid #777777 '
          div.style.color = '#777777'
          div.style.height = '32px'
          div.style.padding = '0 14px'
          div.style.lineHeight = '32px'
          div.style.whiteSpace = 'nowrap'
          div.style.MozUserSelect = 'none'
          div.style.fontSize = '14px'
          div.style.cursor = 'pointer'
          div.style.borderRadius = '35px'
          var span = this._span = document.createElement('span')
          span.className = 'map_txt'
          div.appendChild(span)
          span.appendChild(document.createTextNode(this._text))
          var arrow = this._arrow = document.createElement('div')
          arrow.className = 'map_arr'
          arrow.style.borderLeft = '5px solid transparent'
          arrow.style.borderRight = '10px solid transparent'
          arrow.style.borderTop = '10px solid #777777'
          arrow.style.position = 'absolute'
          arrow.style.width = '1px'
          arrow.style.height = '18px'
          arrow.style.top = '32px'
          arrow.style.left = '20px'
          arrow.style.overflow = 'hidden'
          div.appendChild(arrow)
          // 将div添加到覆盖物容器中
          map.getPanes().markerPane.appendChild(div)
          return div
        }
        ComplexCustomOverlay.prototype.draw = function () {
          var map = this._map
          var pixel = map.pointToOverlayPixel(this._point)
          this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + 'px'
          this._div.style.top = pixel.y - 30 + 'px'
        }
        // 添加监听事件
        ComplexCustomOverlay.prototype.addEventListener = function (event, fun) {
          this._div['on' + event] = fun
        }
        this.api_businessManagePlatform_businessCircleAddrs({ 
          data: {
            systemAccessToken: sessionStorage.getItem('access_token')
          },
        }).then(result => {
            // 商圈列表组
            this.adds = result.content
            // 清空其他所有标注
            this.map.clearOverlays()
            if (this.adds.length > 0) {
              this.adds.map((item, i) => {
                let address = new BMap.Point(item.longitude, item.latitude)
                let txt = item.circleName
                if (txt.length > 6) {
                  txt = txt.slice(0,6)
                  this.adds[i].circleName = txt
                  console.log('商圈名称',txt)
                }
                let id = item.circleId
                var myCompOverlay = new ComplexCustomOverlay(address, txt, id)
                _this.map.addOverlay(myCompOverlay)
                myCompOverlay.addEventListener('click', function () {
                  _this.add_modify_toggle = 'modify'
                  _this.form.circleName = item.circleName
                  _this.form.rangeLimit = item.rangeLimit
                  _this.form.circleId = item.circleId
                  _this.form.longitude = item.longitude
                  _this.form.latitude = item.latitude
                  // 获取当前地图的缩放值
                  // console.log('缩放', _this.map.getZoom())
                  _this.map_param.zoom = _this.map.getZoom()
                  // console.log('中心', _this.map.getCenter())
                  _this.map_param.point = _this.map.getCenter()
                  _this.isShow = true
                })
              })
              // 设置中心点
              _this.map.setCenter(this.map_param.point)
              // 设置缩放
              _this.map.setZoom(this.map_param.zoom)
            }
        })
      },
      // 新增自定义地图覆盖物
      add_SelfOverlay (item) {
        let _this = this
        let BMap = window.BMap
        function ComplexCustomOverlay (point, text) {
          this._point = point
          this._text = text
          // this._overText = mouseoverText
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay()
        ComplexCustomOverlay.prototype.initialize = function (map) {
          this._map = map
          var div = this._div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.backgroundColor = '#fff'
          div.style.border = '1px solid #777777 '
          div.style.color = '#777777'
          div.style.height = '32px'
          div.style.padding = '0 14px'
          div.style.lineHeight = '32px'
          div.style.whiteSpace = 'nowrap'
          div.style.MozUserSelect = 'none'
          div.style.fontSize = '14px'
          div.style.cursor = 'pointer'
          div.style.borderRadius = '35px'
          var span = this._span = document.createElement('span')
          span.className = 'map_txt'
          div.appendChild(span)
          span.appendChild(document.createTextNode(this._text))
          var arrow = this._arrow = document.createElement('div')
          arrow.className = 'map_arr'
          arrow.style.borderLeft = '5px solid transparent'
          arrow.style.borderRight = '10px solid transparent'
          arrow.style.borderTop = '10px solid #777777'
          arrow.style.position = 'absolute'
          arrow.style.width = '1px'
          arrow.style.height = '18px'
          arrow.style.top = '32px'
          arrow.style.left = '20px'
          arrow.style.overflow = 'hidden'
          div.appendChild(arrow)
          // 将div添加到覆盖物容器中
          map.getPanes().markerPane.appendChild(div)
          return div
        }
        ComplexCustomOverlay.prototype.draw = function () {
          var map = this._map
          var pixel = map.pointToOverlayPixel(this._point)
          this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + 'px'
          this._div.style.top = pixel.y - 30 + 'px'
        }
        // 添加监听事件
        ComplexCustomOverlay.prototype.addEventListener = function (event, fun) {
          this._div['on' + event] = fun
        }
         var address = new BMap.Point(item.longitude, item.latitude)
          let txt = item.circleName
          var myCompOverlay = new ComplexCustomOverlay(address, txt)
          this.map.addOverlay(myCompOverlay)
          myCompOverlay.addEventListener('click', function () {
            _this.add_modify_toggle = 'modify'
            _this.form.circleName = item.circleName
            _this.form.rangeLimit = item.rangeLimit
            _this.form.circleId = item.circleId
            _this.form.longitude = item.longitude
            _this.form.latitude = item.latitude
            // 获取当前地图的缩放值
            _this.map_param.zoom = _this.map.getZoom()
            _this.map_param.point = _this.map.getCenter()
            _this.isShow = true
          })
        // 设置中心点
        _this.map.setCenter(this.map_param.point)
        // 设置缩放
        _this.map.setZoom(this.map_param.zoom)
      },
      // 地图点击事件
      map_click (e) {
        let _this = this
        let BMap = window.BMap
        let gc = new BMap.Geocoder()
        // 新增、修改模态框的类型切换
        this.add_modify_toggle = 'add'
        // 获取经纬度
        // console.log('点击位置(经纬度): ', e.point.lng + ', ' + e.point.lat)
        // 赋值给新增商圈的参数
        this.form.longitude = e.point.lng
        this.form.latitude = e.point.lat
        // var point = new BMap.Point(e.point.lng, e.point.lat)
        // 获取省市区中文名称
        gc.getLocation(new BMap.Point(e.point.lng, e.point.lat), function (rs) {
          let addComp = rs.addressComponents
          // console.log('点击位置: ', rs.addressComponents)
          _this.form.provinceName = addComp.province
          _this.form.cityName = addComp.city
        })
        // console.log('地图的当前缩放值', this.map.getZoom())
        this.map_param.zoom = this.map.getZoom()
        this.map_param.point = this.map.getCenter()
        // 显示创建商圈模态框
        this.isShow= true
      },
      // 创建商圈
      save () {
        var that = this
        let limit = that.form.rangeLimit
        let reg = /^[1-9]\d*$/
        let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
        that.form.circleName = that.form.circleName.replace(/(^\s*)|(\s*$)/g, '')
        if (!that.form.circleName) {
          this.$message({
            message: '商圈名称不能为空',
            type: 'warning'
          });
            return
        } else if (that.form.circleName && !deg.test(that.form.circleName)) {
          this.$message({
            message: '标题只能输入只能输入中英文和数字,中间不能有空格',
            type: 'warning'
          });
          return
        } else if(!limit) {
          this.$message({
            message: '范围值不能为空！',
            type: 'warning'
          });
          return
        } else if (limit < 500 || limit > 3000 || !reg.test(limit)) {
          this.$message({
            message: '范围为500-3000之间的整数',
            type: 'warning'
          });
          return
        }
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        let url = ''
        if (that.add_modify_toggle === 'add') {
          this.api_businessManagePlatform_createCircle({ 
            data: Object.assign({
              userId: userInfo.userId,
              userName: userInfo.userName,
              systemAccessToken: sessionStorage.getItem('access_token')
            },this.form),
          }).then(result => {
              // 清空创建商圈模态框内的值
              this.cancle_add_circle()
              this.add_SelfOverlay (result.content) 
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
          })
        } else if (that.add_modify_toggle === 'modify') {
          this.api_businessManagePlatform_editCircle({ 
            data: Object.assign({
              userId: userInfo.userId,
              userName: userInfo.userName,
              systemAccessToken: sessionStorage.getItem('access_token')
            },this.form),
          }).then(result => {
              // 清空创建商圈模态框内的值
              this.cancle_add_circle()
              // 设置鼠标样式
              // this.map.setDefaultCursor('hand')
              this.self_Overlay()
              this.isShow = false
          })
        }
      },
      // 删除商圈
      del_business_circle () {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        
        this.$confirm('确定删除此商圈, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api_businessManagePlatform_delCircle({ 
            data: {
              userId: userInfo.userId,
              userName: userInfo.userName,
              systemAccessToken: sessionStorage.getItem('access_token'),
              circleId: this.form.circleId
            },
          }).then(result => {
            this.self_Overlay()
            this.isShow = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 取消创建商圈
      cancle_add_circle () {
        // 清空创建商圈模态框内的值
        this.form.circleName = ''
        this.form.rangeLimit = ''
        this.circle_res.num = ''
        this.circle_res.infoStr = ''
        // 关闭模态框
        this.isShow = false
      },
      // 获取附近的广告位数量
      show_mres_num () {
        let limit = this.form.rangeLimit
        let reg = /^[1-9]\d*$/
        if (limit < 500 || limit > 3000 || !reg.test(limit)) {
          this.$message.error('请输入500-3000之间的整数')
          // this.form.rangeLimit = ''
          return
        }
        this.api_businessManagePlatform_getMresNum({ 
          data: {
            longitude: this.form.longitude,
            latitude: this.form.latitude,
            distance: parseInt(this.form.rangeLimit)
          },
        }).then(result => {
          this.circle_res.num = result.content.mresCount
          this.circle_res.infoStr = this.form.rangeLimit + '米范围内共有' + result.content.mresCount + '广告位'
        })
      },
      // 关闭创建或编辑商圈
      handleClose () {
        this.isShow = false
      },
      // 初始化百度地图
      map_f () {
        // 百度地图API功能
        let BMap = window.BMap
        this.map = new BMap.Map('allmap', {enableMapClick: true, minZoom: 4}) // 创建实例 并开启缩放,最小缩放4级
        // 初始化地图,设置中心点坐标和地图级别
        let point = new BMap.Point(116.331398, 39.897445)
        this.map.centerAndZoom(point, this.map_param.zoom)
        this.map.enableScrollWheelZoom(true) // 开启缩放
        // 添加工具条、比例尺控件
        this.map.addControl(new BMap.ScaleControl())
        this.map.addControl(new BMap.NavigationControl())
        this.map.addControl(new BMap.NavigationControl())
        // 取消地图监听点击事件
        this.not_map_click = true
        this.map.setDefaultCursor(this.defaultHand)
        this.map.removeEventListener('click', this.map_click)

      },
      // 获取媒体名称
      get_media_names (query) {
        if (query !== '') {
          this.load.media= true
          this.api_businessManagePlatform_allMedia({
            data:{
              // mediaName: this.name.mresName,
              mediaName: query,
            }
          }).then(res => {
            this.load.media= false
            if (res.content.length > 0) {
              this.media_names = res.content
            } else {
              this.media_names = []
            }
          })
        } else {
          this.media_names  = []
        }
       
      },
      // 获取广告位名称
      get_mres_names (query) {
         if (query !== '') {
          this.load.mres= true
          this.api_businessManagePlatform_allMres({
            data:{
              mresName:query
            }
          }).then(res => {
            this.load.mres= false
            if (res.content.length > 0) {
              this.mres_names = res.content
            } else {
              this.mres_names = []
            }
          })
        } else {
          this.mres_names  = []
        }
       
      },
      // 重置搜索条件
      re_clear () {
        this.search_params = {mediaId:'',mresId:''}
         if (this.setType =="billboard") {
           this.datagrid2.Pagination.current_page = 1
            this.get_buscircle_list()
          } else {
            this.datagrid2.Pagination.current_page = 1
            this.get_buscircle1_list()
          }
      },
      // 批量操作隐藏或显示
      batch_edit (val) {
        if (this.batch_edit_mresIds.length === 0) {
          this.$message({
            message: '请选择至少一项',
            type: 'warning'
          });
          this.batch_edit_value = ''
          return 
        }
        this.api_businessManagePlatform_showOrHide({ 
          data: {
            token: sessionStorage.getItem('access_token'),
            mresIds: JSON.stringify(this.batch_edit_mresIds),
            isShow: this.batch_edit_value
          },
        }).then(result => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            // 获取商圈资源列表
            this.get_buscircle_list()
            // 清空批量操作的mresIds数组
            this.batch_edit_mresIds = []
            // 把批量操作的值改为空
            this.batch_edit_value = ''
        })
      },
      //   点击表格选择
      sel (selection,row) {
        this.batch_edit_mresIds = []
        selection.map(item => {
          this.batch_edit_mresIds.push(item.mresId)
        })
      },
      join_circle_page (val) {
        this.page_params.pageNo = val
        this.get_can_join(this.row)
      },
      // 添加商圈
      add (opts) {
        let that = this
        this.add_join_circle_show = true
        this.circle_params.mresId = opts.data.mresId
        this.row = opts
        this.get_can_join (opts)
      },
      // 获取可添加的商圈
      get_can_join (opts) {
        this.api_businessManagePlatform_canAddCircle({ 
          data: {
            systemAccessToken: sessionStorage.getItem('access_token'),
            longitude: opts.data.longitude,
            latitude: opts.data.latitude,
            pageNo: this.page_params.pageNo,
            pageRows: this.page_params.pageRows
          },
        }).then(result => {
          this.circles.add = result.content
          this.page_params.pageCount = result.totalCount
        })
      },
      // 编辑商圈
      editCircle (opts) {
        this.join_circle_show = true
        this.row = opts
        this.circle_params.mresId = opts.data.mresId
        this.api_businessManagePlatform_addedCircle({ 
          data: {
            systemAccessToken: sessionStorage.getItem('access_token'),
            mresId: opts.data.mresId,
          },
        }).then(result => {
          this.circles.belong = result.content
          if(this.circles.belong.length > 0) {
            this.circles.belong.map(item=>{
              this.circle_params.circleIds.push(item.circleId)
            })
            // 此数组用来验证与初始值相比，所属商圈是否发生改变，若没有发生改变则不发送请求
            this.circles.test = this.circles.belong
          }
          this.get_can_join (opts)
        })
      },
      // 选择商圈加入
      join_to (e) {
        let that = this
        if (e.target.getAttribute('class') === null || e.target.getAttribute('class') === '') {
          e.target.setAttribute('class','choose')
          let id = e.target.getAttribute('value')
          that.circle_params.circleIds.push(id)
        } else {
          e.target.setAttribute('class','')
          let _id = e.target.getAttribute('value')
          that.circle_params.circleIds.some((item,i)=>{
            if(item === _id) {
              that.circle_params.circleIds.splice(i,1)
              return
            }
          })
        }
      },
      // 提交选择加入的商圈
      confirm_join_to () {
        let that = this
        if (this.circles.length === 0) {
          this.join_circle_show = false
          this.add_join_circle_show = false
          return
        }
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.api_businessManagePlatform_joinCircle({ 
          data: {
            userId: userInfo.userId,
            userName: userInfo.userName,
            systemAccessToken: sessionStorage.getItem('access_token'),
            circleIdJson: JSON.stringify(this.circle_params.circleIds),
            mresId: this.circle_params.mresId
          },
        }).then(result => {
          this.cancle_join_circle()
          this.get_buscircle1_list()
          this.$message({
            type: 'success',
            message: '编辑成功!'
          });
        })
      },
      // 取消添加商圈
      cancle_join_circle () {
        this.join_circle_show = false
        this.add_join_circle_show = false
        this.circle_params= {circleIds: [], mresId: ''}
        this.circles.add = []
        this.circles.belong = []
      },
      // 显示删除已所属商圈
      show_del_belong_circle (item) {
        this.del_circle.id = item.circleId
        this.del_circle.name = item.circleName
        // this.del_circle_show = true
        this.$confirm('确定删除此商圈, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 从视图上删除
            this.circles.belong.some((val, i) => {
              if (this.del_circle.id === val.circleId) {
                this.circles.belong.splice(i, 1)
                return
              }
            })
            // 从发送的数据里面删除
            this.circle_params.circleIds.some((value, i) => {
              if (this.del_circle.id == value) {
                this.circle_params.circleIds.splice(i, 1)
                return
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });  
        })
      }
    },
    mounted () {
      // 获取商圈资源列表
      this.get_buscircle_list()
      // this.get_buscircle1_list ()
      // 获取省市列表
      this.get_addres()
      // 初始化地图
      this.map_f()
    },
  }
</script>

<style lang="scss"  scoped>
  // 地图自定义图标样式
  .map_cir{
    position: absolute;
    background-color: #fff;
    border : 1px solid #777777 ;
    height: 32px;
    line-height: 32px;
    padding:0 14px;
    white-space: nowrap;
    -moz-user-select: none;
    font-size:14px;
    cursor: pointer;
    border-radius: 35px;
    .map_txt {
      .map_arr {
        position: absolute;
        border-left:5px solid transparent;
        border-right:10px solid transparent;
        border-top : 10px solid #777777;
        width:1px;
        height:18px;
        top:32px;
        left:20px;
      }
    }
  }
  .cir_search{
    width:360px;
    height:32px;
    border:1px solid #E6E8F2;
    border-radius: 3px;
    background: #fff;
    margin-top:10px;
    padding:0 60px 0 10px;
    box-sizing: border-box;
    position: relative;
    .cir_input {
      position: absolute;
      left:0;
      width:300px;
      height:32px;
      height:100%;
      border:none;
      margin:none;
      outline: none;
      padding-left: 10px;
    }
    .btn {
      cursor: pointer;
      width:60px;
      height:30px;
      border-left:1px solid #E6E8F2;
      // border-radius: 0 3px 3px 0 ;
      position: absolute;
      right:0;
      text-align: center;
      line-height: 30px;
      color:#0086FF;
    }
  }
  .up{
    p{
      font-size: 12px;
      color:#000;
      margin-bottom:12px;
    }
  }
  .operation_btn{
    position: absolute;
    top:10px;
    left:200px;
  }
  .choosen_ad{
    color:#F5BD23;
    text-align:center;
    padding-bottom: 20px;
  }
  .img_up{
    width:40px;
    height:40px;
    // margin-left:57px;
    float: left;
    // border:1px solid #ccc;
    background-color: #ECECEC ;
  }
  .upload_btn{
      width:80px;
      height:32px;
      background: #F9FAFE;
      border:1px solid #E6E8F2;
      color:#0086FF;
      font-size:14px;
      margin-left:10px;
  }
  .ml20 {
    margin-left: 20px;
    margin-top:13px;
  }
  .batch_font{
    font-size: 14px;
    float: left;
    height: 40px;
    line-height: 30px;
  }
  .colorWarn {
    color:#F5BD23;
  }
  .batch_style {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    width:200px;
    float: left;
    margin-left: 20px;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #E6E8F2;
  }
  .batch_upload {
    width:240px;
    height: 200px;
    border:1px solid #ccc;
    border-radius: 3px;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,.1);
    z-index:10;
    background-color: #fff;
    position: absolute;
    top:34px;
    left:105px;
    padding:3px 12px;
    box-sizing: border-box;
  }
  .m85xbdt {
    // padding: 20px 0 0 32px;
    color: #000;
    display: flex;
    width:100%;
    .content_c{
        width:100%;
        // margin-left:10px;
        .billboard{
            .search{
                margin:0;
                margin-bottom: 10px;
                padding:30px 22px;
                background-color: #fff;
                position: relative;
                min-width: 650px;
                .btn_hd{
                  background-color: transparent;
                  color: #fff;
                  border: none;
                  border-radius: 2px;
                  margin-right:5px;
                }
                .sky_blue {
                  background-color: #11D2EB;
                }
                .bg_bl {
                  background-color: #F9FAFE ;
                  color:#0086FF ;
                  border:1px solid #E6E8F2;
                }
                .sea_blue {
                 background-color: #88BAF4 ;
                }
            }
            
        }
        .business_circle{
          .box{
            // background: #fff;
            height: 520px;
            .search{
              margin-left:15px;
              margin-bottom:10px;
              color:#777777 ;
              // background-color: #fff;
              .search_cell{
                input{
                  margin-left:10px;
                  width:160px;
                }
              }
              
              select{
                  width:110px;
                  height: 40px;
                  font-size:14px;
                  color:#000;
              }
            }
            .map_circle{
                width:100%;
                height:440px;
                position: relative;
                padding-left: 15px;
                .map{
                    width:80%;
                    height:100%;
                    background-color: #ccc;
                }
                .add{
                    position: absolute;
                    cursor: pointer;
                    font-size: 12px;
                    width:80px;
                    height:30px;
                    right: 10%;
                    top:5%;
                    background-color: #0086FF;
                    color:#fff;
                    line-height: 30px;
                    text-align: center;
                }
                .message{
                    position: absolute;
                    width:100px;
                    right: 8%;
                    top:15%;
                    font-size: 14px;
                    p{
                      color:#777777 ;
                      line-height: 20px;
                    }
                }
                .cancel_circle {
                  background-color: #F5BD23 ;
                }

            }
          }
          .choose{
             width:100%;
             height:70px;
             margin:10px 0 0 0;
             padding:23px 26px;
             color:#000;
             background-color: #fff;
             .search_cell{
               margin:0 40px 0 0;
                select{
                  height:24px;
                  color:#777777;
                }
                input{
                  margin-left:10px;
                  width:160px;
                }
             }
          }
        }
        .info{
          width:100%;
          // padding:10px;
          padding-bottom: 50px;
          // background-color: #fff;
          margin-top: 10px;
          box-sizing: border-box;
          .search{
            margin:0;
            padding:0 0 0 10px ;
          }
          button{
            border-radius: 0;
            height:30px;
            padding:0 20px;
          }
        }
        
    }
    #show_medianame_edit{
      .inp{
        width: 250px;
        height: 24px;
        border-radius: 2px;
        border:1px solid #BFC1CB;
        margin-left:30px;
      }
      .btn_ser{
        width: 60px;
        height: 24px;
        border-radius: 2px;
        background-color: #0086FF;
        margin-left: 20px;
        border:none;
        color:#fff;
        font-size: 12px;
      }
    }
  }
  .modal .modal-dialog .modal-body{
    .limit{
      width:60px;
      height: 24px;
      border: 1px solid #BFC1CB;
      box-sizing: border-box;
      margin: 0 6px;
    }
  }
  .show_num {
    .infs{
      margin-right:20px;
    }
    .un{
      opacity: 0.5;
    }
    .can{
      color:#0086FF;
      cursor: pointer;
      line-height: 28px;
    }
    .can:hover{
      text-decoration: none;
    }
  }
  .fr{
    float: right;
  }
  // 添加商圈样式
  .circle{
    .nothing{
      text-align: center;
      opacity: 0.5;
      // color:#f5f5f5;
    }
    .join{
      min-height: 120px;
    }
    ul {
      list-style: none;
      margin:0;
      padding: 0;
      min-height: 30px;
      li{
        width:31%;
        height:30px;
        margin:0 10px 10px 0;
        line-height: 30px;
        background-color: #F5F5F5;
        color:#000;
        font-size:12px;
        text-align: center;
        float: left;
        position: relative;
        .del{
          width:20px;
          height: 20px;
          position: absolute;
          background:url("../../../../../static/images/businessManage/icon_delet.png");
          background-size: cover;
          //  border: 1px solid #DFE9F6;
          border-radius: 50%;
          right:-7px;
          top:-7px;
          display:none;
        }
      }
      li:hover{
        .del{
          display: block;
        }
      }
      li.choose{
        background-color: #BBD2F1;
        color:#fff;
      }
    }
    ul::after {
      display: block;
      content: '';
      clear: both;
      width:0;
    }
  }
  .fl{
    float:left;
  }
  .fr{
    float:right;
  }
  .modal-open{
        #add_business_circle,#preview{display:flex;}
        #add_business_circle.in,#edit_mresAlias.in,#show_medianame_edit.in,#join_business_circle.in,#edit_business_circle.in,#edit_media_alias.in,#preview.in{z-index:2000}
  }
</style>