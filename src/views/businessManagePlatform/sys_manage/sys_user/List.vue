<template>
  <!--<div>系统用户2222</div>-->
  <div> 
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form" >
        <el-form-item>
          <el-input  placeholder="账号"  :maxlength="20" v-model="form.searchUserName"  class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input  placeholder="姓名"  :maxlength="20" v-model="form.name"  class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.roleId" placeholder="选择角色" clearable>
            <el-option
              v-for="(item, i) in search_all_roles_match_toArray"
              :key="i"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            unlink-panels
            v-model="time"
            :editable = "false"
            width="350"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="get_role_info">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
    ref='list-data'
    checkbox
    @onClickBtnAdd="onClickBtnAdd"
    @onClickBtnEdit="onClickBtnEdit"
    @onClickBtnDelete="onClickBtnDelete"
    @moduleClick="moduleClick"
    @menuClick="menuClick"
    @funcClick="funcClick"
    @edit="edit"
    @del="del"
    @onChangeCurrentPage="onChangeCurPage"
    @onChangePageSize="onChangeCurPageSize"
    :DataGrid = 'datagrid'></list-data>
    <Edit :isShow="isShow" :data="data" :rolesArray="all_roles_match" :addModifyToggle="addModifyToggle" :allRolesMatch="all_roles_match" @saveSuccess="saveSuccess" ></Edit>
    <MenuPerm :menuShow="menuShow" :userId="userId" :menuPerList="menu_per_list" :menuPerListChecked="menu_per_list_checked"></MenuPerm>
    <FuncPerm :funcShow="funcShow" :userId="userId" :menuPerList="menu_per_list" :menuPerListChecked="menu_per_list_checked"></FuncPerm>
    <el-dialog
      title="模块权限"
      custom-class='dialog_static'
      :visible.sync="moduleShow"
      :before-close="handleClose">
      <div class="style_of_tree">
        <el-tree
          :data="mod_per_list"
          :default-checked-keys="mod_per_list_checked"
          show-checkbox
          default-expand-all
          node-key="moduleId"
          ref="moduleTree"
          highlight-current
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save_module">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import base64 from 'base-64'
import utf8 from 'utf8'
import Edit from './Edit.vue'
import MenuPerm from "./MenuPerm.vue"
import FuncPerm from "./FuncPerm.vue"
import { tool } from "../../../../utils/"
export default {
  components:{Edit, MenuPerm, FuncPerm},
  data() {
    let that = this
    return {
      datagrid:{
        List: [],
        FieldList: [
          { type:'operate',label: '操作',
            width:100,
            condition:function({data}){//自定义列显示  返回null 则显示btns项
              if( data.roleId == 1 ||data.roleId == 8)
                return '内置'
              return null
            },
            btns:[
              {text:'修改', eventName:'edit'},
              {text:'删除', type:'danger',eventName:'del', style: 'color:red'}
            ]
          },
          { type:'operate', label: '模块权限',
            width:100,
            btns:[
              {text:'模块权限', eventName: 'moduleClick'}
            ]
          },
          { type:'operate', label: '菜单权限',
            width:100,
            btns:[
              { text:'菜单权限', eventName: 'menuClick' }
            ]
          },
          { type:'operate', label: '功能权限',
            width:100,
            btns:[
              { text:'功能权限', eventName: 'funcClick' }
            ]
          },
          { key: 'userId', label: 'ID', tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.userId, 5)
          }},
          { key: 'userNo', label: '编号', formatter: function (row,column,cellValue) {
            if (row.userNo === null) {
              return '-'
            }
          }},
          { key: 'userName', label: '电话/账号' },
          { key: 'name', label: '姓名' },
          // { key: 'roleId', label: '角色' },
          { label: '角色', formatter: function (row,column,cellValue) {
            return that.all_roles_match_list[row.roleId]
          }},
          { key: 'telNo', label: '联系电话' },
          { key: 'email', label: '邮箱', formatter: function (row,column,cellValue) {
            if (row.email === null || row.email === '') {
              return '-'
            }
          }},
          { key: 'updateTime', label: '最近活跃', formatter:function(row,column,cellValue){
              return tool.date.format(row.updateTime,'yyyy-MM-dd hh:mm')
          }},
          { key: 'createTime', label: '新增时间', formatter:function(row,column,cellValue){
              return tool.date.format(row.createTime,'yyyy-MM-dd hh:mm')
          }},
        ],
        ToolBar:[
          {text:'添加',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'删除',type:'danger',eventName:'onClickBtnDelete'}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:true
      },
      isShow:false,
      data:null,
      // 搜索参数
      form:{
        searchUserName: '',
        name: '',
        roleId: '',
        startCreateDate: '',
        endCreateDate: ''
      },
      time:null,
      all_roles:[],
      // 所有的角色(key是角色ID,value是角色名称)
      all_roles_match: {},
      // 搜索所有的角色数据形式(key是角色ID,value是角色名称)
      search_all_roles_match_toArray: [],
      // 所有的角色数据形式(key是角色ID,value是角色名称)
      all_roles_match_toArray: [],
      // 列表所有角色
      all_roles_match_list: {},
      addModifyToggle:'',
      // 模块权限列表
      mod_per_list: [],
      // 选中的权限模块
      mod_per_list_checked: [],
      // 模块权限弹框
      moduleShow: false,
      // 用户ID
      userId: '',
      // 菜单权限列表
      menu_per_list: [],
      // 选中的菜单模块
      menu_per_list_checked: [],
      // 菜单权限弹框
      menuShow: false,
      // 功能权限弹框
      funcShow: false,
      defaultProps: {
        children: 'sysMenuNodes',
        label: 'name'
      }
    }
  },
  watch: {
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.form.startCreateDate = ''
          that.form.endCreateDate = ''
        }
      },
      deep: true
    }
  },
  methods:{
    handleClose () {
      this.moduleShow = false
    },
    // 点击权限模块按钮
    moduleClick (opts) {
      console.log(1)
      this.userId = opts.data.userId
      this.api_businessManagePlatform_getUserModule ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userId: opts.data.userId
        },
      }).then(res => {
        this.mod_per_list = res.content
        this.moduleShow = true
        this.mod_per_list_checked = []
        this.mod_per_list.map((item, i) => {
          if (item.checked === 1) {
            this.mod_per_list_checked.push(item.moduleId)
          }
        })
      })
    },
    // 模块权限提交
    save_module (type) {
      this.mod_per_list_checked = this.$refs.moduleTree.getCheckedKeys()
      console.log('获取的', this.$refs.moduleTree.getCheckedKeys())
      this.api_businessManagePlatform_setUserAuth ({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
          moduleIds: this.mod_per_list_checked.join(',')
        },
        pathParams: `/${this.roleId}/modules`,
      }).then(res => {
        this.$message({ type:'success',message:'模块权限保存成功' })
        this.moduleShow = false
      })
    },
    // 递归获取菜单权限树结构中所有选中项
    getMenuArray (data, name) {
      for (var i in data) {
        if (data[i].checked === name && data[i].menuId && JSON.stringify(data[i].menus) === '[]') {
          this.menu_per_list_checked.push(data[i].menuId)
        }
        this.getMenuArray(data[i].menus, name)
      }
    },
    // 递归获取功能权限取树结构中所有选中项
    getFuncArray (data, name) {
      for (var i in data) {
        if (data[i].checked === name && data[i].menuId && JSON.stringify(data[i].menus) === '[]') {
          this.menu_per_list_checked.push(data[i].menuId)
        }
        this.getFuncArray(data[i].menus, name)
      }
    },
    // 递归功能权限取树结构中所有选中项
    setFuncArray (data) {
      for (var i in data) {
        if (data[i].type === undefined) {
          this.setFuncArray(data[i].menus)
        } else if (data[i].type === 0 || (data[i].type === 1 && data[i].menus.length === 0)) {
          data[i].disabled = true
        }
        this.setFuncArray(data[i].menus)
      }
    },
    // 菜单权限
    menuClick (opts, selectIems) {
      this.userId = opts.data.userId
      this.api_businessManagePlatform_getUserRole ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userId: opts.data.userId
        },
      }).then(res => {
        this.menu_per_list = res.content
        console.log('所有数据', this.menu_per_list)
        // 设置平台层级复选框为禁用状态
        for (let i = 0; i < this.menu_per_list.length; i++) {
          this.menu_per_list[i].disabled = true
        }
        this.menuShow = true
        this.menu_per_list_checked = []
        this.getMenuArray(this.menu_per_list, 1)
        console.log('所有选中', this.menu_per_list_checked)
      })
    },
    // 功能权限
    funcClick (opts, selectIems) {
      this.userId = opts.data.userId
      this.api_businessManagePlatform_getFuncUser ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userId: opts.data.userId
        },
      }).then(res => {
        this.menu_per_list = res.content
        // 设置平台层级复选框为禁用状态
        for (let i = 0; i < this.menu_per_list.length; i++) {
          this.menu_per_list[i].disabled = true
        }
        this.setFuncArray(this.menu_per_list)
        this.funcShow = true
        this.menu_per_list_checked = []
        this.getFuncArray(this.menu_per_list, 1)
      })
    },
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.get_role_info()
    },
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.get_role_info()
    },
    // 获取用户信息
    get_role_info () {
      let that = this
      if (that.time !== null && that.time !== '') {
        that.form.startCreateDate = this.tool.date.format(new Date(that.time[0]), "yyyy-MM-dd")
        that.form.endCreateDate = this.tool.date.format(new Date(that.time[1]), "yyyy-MM-dd")
      }
      let params = Object.assign({}, {
        systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
        userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
        pageRows: that.datagrid.Pagination.page_size,                          // 每页多少条数据
        pageNo: that.datagrid.Pagination.current_page         // 请求第几页
      }, that.form)
      that.api_businessManagePlatform_userList({data:params}).then(res=>{
        that.datagrid.List = JSON.parse(utf8.decode(base64.decode(res.content)))
        that.datagrid.Pagination.total = res.totalCount
      })
    },
    // 获取所有角色
    get_all_role () {
      let that = this 
      let form = {
        systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
        userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
        pageRows: 9999,                          // 每页多少条数据
        pageNo: 1                                // 请求第几页
      }
      that.api_businessManagePlatform_roleList({data:form}).then(res=>{
        let result = res.content
        result.map(function (x) {
          if (x.roleName !== '经销商业务员' && x.roleName !== '媒体业务员') {
            that.all_roles_match[x.roleId] = x.roleName
            that.all_roles_match_toArray.push({roleId: x.roleId, roleName: x.roleName})
          }
          that.all_roles_match_list[x.roleId] = x.roleName
          that.search_all_roles_match_toArray.push({roleId: x.roleId, roleName: x.roleName})
        })
      })
    },
    onClickBtnAdd (opts) {
        this.data = null
        this.isShow = true
        this.addModifyToggle = 'add'
    },
    onClickBtnEdit (opts,selectItems) {
        if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'warning',message:'请选择一项'})
          return
        } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
        } else {
          if (selectItems.datas[0].roleId == 1 || selectItems.datas[0].roleId == 8) {
            this.$message({type:'warning',message:'此用户不能修改'})
            return
          }
          this.edit( {data:selectItems.datas[0]} )
        }
        this.addModifyToggle = 'edit'
    },
    onClickBtnDelete (opts,selectItems) {
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'warning',message:'请选择一项'})
        return
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        if (selectItems.datas[0].roleId == 1 || selectItems.datas[0].roleId == 8) {
          this.$message({type:'warning',message:'此用户不能删除'})
          return
        }
        this.del( {data:selectItems.datas[0]} )
      }
      this.addModifyToggle = 'del'
    },
    edit (opts) {
      let  that = this
       this.data =  {...opts.data}
       this.addModifyToggle = 'edit'
       this.isShow = true
    },
    del (opts) {
      this.addModifyToggle = 'del'
      this.$confirm('确认删除用户' + ' ' + opts.data.userName + ' ' + '?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_sysUserSave ({ 
          data: Object.assign({}, opts.data, {
            systemAccessToken: sessionStorage.getItem('access_token'),
            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            roleName: this.all_roles_match[opts.data.roleId],
            editUserName: opts.data.userName,
            passwd: '',
            userId: opts.data.userId,
            action: 'D'
          }),
        }).then(res => {
          this.get_role_info()
        })
      }).catch(() => {})
    },
    saveSuccess(){
      console.log('保存成功')
      this.get_role_info()
    }
  },
  mounted () {
    this.get_role_info()
    this.get_all_role()
  }
}
</script>