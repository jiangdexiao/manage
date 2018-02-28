<template>
  <div class="list">
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnDelete="onClickBtnDelete"
      @moduleClick="moduleClick"
      @funcClick="funcClick"
      @edit="edit"
      @del="del"
      @menuClick="menuClick"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
    <Edit :isShow="isShow" :data="data" :addModifyToggle="addModifyToggle" @saveSuccess="Save_Success" ></Edit>
    <MenuPerm :menuShow="menuShow" :roleId="roleId" :menuPerList="menu_per_list" :menuPerListChecked="menu_per_list_checked"></MenuPerm>
    <FuncPerm :funcShow="funcShow" :roleId="roleId" :menuPerList="menu_per_list" :menuPerListChecked="menu_per_list_checked"></FuncPerm>
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
        <el-button type="primary" @click="save_mod_per">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="是否覆盖"
      custom-class='dialog_static'
      :visible.sync="iscoverShow"
      :before-close="coverClose">
        有{{cover_num}}位用户有自定义权限是否覆盖 ？
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="save_module(1)">覆盖</el-button>
        <el-button @click="save_module(0)">不覆盖</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Edit from "./Edit.vue"
import MenuPerm from "./MenuPerm.vue"
import FuncPerm from "./FuncPerm.vue"
import { tool } from "../../../../utils/"
export default {
  components: {Edit, MenuPerm, FuncPerm},
  data() {
    return {
      roleL: ['1','2','3','4','5','6','7','8'],
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 100,
            condition:function({data}){//自定义列显示  返回null 则显示btns项
              if( data.roleId == 1 || data.roleId == 2 || data.roleId == 3 || data.roleId == 4 || data.roleId == 5 || data.roleId == 6 || data.roleId == 7 ||data.roleId == 8)
                return '内置'
              return null
            },
            btns: [
              { text: "修改", eventName: "edit", condition:function({data}){ return data.roleId != 1 && data.roleId !=2 && data.roleId !=3 && data.roleId !=4 && data.roleId !=5 && data.roleId !=6 && data.roleId !=7 && data.roleId !=8 } },
              { text: "删除", type: "danger", eventName: "del", style: 'color:red', condition:function({data}){ return data.roleId != 1 && data.roleId !=2 && data.roleId !=3 && data.roleId !=4 && data.roleId !=5 && data.roleId !=6 && data.roleId !=7 && data.roleId !=8 } }
            ]
          },
          {
            type: "operate",
            label: "模块权限",
            width: 100,
            condition:function({data}){//自定义列显示  返回null 则显示btns项
              if( data.roleId == 1 || data.roleId == 2 || data.roleId == 3 || data.roleId == 4 || data.roleId == 5 || data.roleId == 6 || data.roleId == 7 ||data.roleId == 8)
                return '内置'
              return null
            },
            btns: [
              { text: "模块权限", eventName: "moduleClick" }
            ]
          },
          {
            type: "operate",
            label: "菜单权限",
            width: 100,
            condition:function({data}){//自定义列显示  返回null 则显示btns项
              if( data.roleId == 1 )
                return '内置'
              return null
            },
            btns: [
              { text: "菜单权限", eventName: "menuClick" }
            ]
          },
          {
            type: "operate",
            label: "功能权限",
            width: 100,
            condition:function({data}){//自定义列显示  返回null 则显示btns项
              if( data.roleId == 1 )
                return '内置'
              return null
            },
            btns: [
              { text: "功能权限", eventName: "funcClick" }
            ]
          },
          { key: "roleId", label: "ID", tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.roleId, 5)
          }},
          { key: "roleName", label: "角色名" },
          { key: "note", label: "备注", formatter: function (row,column,cellValue) {
              if (row.note) {
                return row.note
              } else {
                return '-'
              }
          }},
          { key: "createTime", label: "新增时间", formatter: function (row,column,cellValue) {
              return tool.date.format(row.createTime, 'yyyy-MM-dd hh:mm')
          }}
        ],
        ToolBar: [
          { text: "添加", eventName: "onClickBtnAdd" },
          { text: "修改", eventName: "onClickBtnEdit" },
          { text: "删除", type: "danger", eventName: "onClickBtnDelete" }
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        }
      },
      form: {
      },
      // 模块权限列表
      mod_per_list: [],
      // 选中的权限模块
      mod_per_list_checked: [],
      // 模块权限弹框
      moduleShow: false,
      // 用户ID
      roleId: '',
      // 菜单权限列表
      menu_per_list: [],
      // 选中的菜单模块
      menu_per_list_checked: [],
      // 菜单权限弹框
      menuShow: false,
      // 功能权限弹框
      funcShow: false,
      // 覆盖的用户数量
      cover_num: 0,
      // 添加修改标识
      addModifyToggle: '',
      isShow: false,
      iscoverShow: false,
      data: null,
      defaultProps: {
        children: 'sysMenuNodes',
        label: 'name'
      }
    };
  },
  methods: {
    Save_Success() {
      console.log("保存成功")
    },
    onClickSearch() {
      this.init()
    },
    handleClose () {
      this.moduleShow = false
    },
    // 覆盖弹窗关闭
    coverClose () {
      this.iscoverShow = false
    },
    // 点击权限模块按钮
    moduleClick (opts, selectIems) {
      this.roleId = opts.data.roleId
      this.api_businessManagePlatform_getModule ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          roleId: opts.data.roleId
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
    // 递归获取菜单权限树结构中所有选中项
    getMenuArray (data, name) {
      for (var i in data) {
        if (data[i].checked === name && data[i].menuId && JSON.stringify(data[i].sysMenuNodes) === '[]') {
          this.menu_per_list_checked.push(data[i].menuId)
        }
        this.getMenuArray(data[i].sysMenuNodes, name)
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
      this.roleId = opts.data.roleId
      this.api_businessManagePlatform_getMenuRole ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          roleId: opts.data.roleId
        },
      }).then(res => {
        this.menu_per_list = res.content
        // 设置平台层级复选框为禁用状态
        for (let i = 0; i < this.menu_per_list.length; i++) {
          this.menu_per_list[i].disabled = true
        }
        this.menuShow = true
        this.menu_per_list_checked = []
        this.getMenuArray(this.menu_per_list, 1)
      })
    },
    // 功能权限
    funcClick (opts, selectIems) {
      this.roleId = opts.data.roleId
      this.api_businessManagePlatform_getFuncRole ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          roleId: opts.data.roleId
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
    // 确认是否覆盖后提交
    save_module (type) {
      this.mod_per_list_checked = this.$refs.moduleTree.getCheckedKeys()
      console.log('获取的', this.$refs.moduleTree.getCheckedKeys())
      console.log('获取的node', this.$refs.moduleTree.getCheckedNodes())
      this.api_businessManagePlatform_setRoleAuth ({
        data: {
          moduleIds: this.mod_per_list_checked.join(','),
          isCover: type
        },
        pathParams: `/${this.roleId}/modules`,
      }).then(res => {
        this.$message({ type:'success',message:'模块权限保存成功' })
        this.moduleShow = false
        this.coverClose()
      })
    },
    // 保存更改的模块菜单权限
    save_mod_per () {
      this.iscoverShow = true
      this.api_businessManagePlatform_countByRoleId ({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          roleId: this.roleId
        },
      }).then(res => {
        this.cover_num = res.content
      })
    },
    // 修改
    edit(opts, selectIems) {
      this.data = opts.data
      this.isShow = true
      this.addModifyToggle = 'modify'
    },
    //删除
    del(opts) {
      this.$confirm('确认删除角色' + ' ' + opts.data.roleName + ' ' + '?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_sysRoleSave({ 
          data: {
            systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
            roleId: opts.data.roleId,
            roleName: opts.data.roleName,
            note: opts.data.note,
            action: 'D'
          }
        }).then(res => {
          this.init()
        })
      }).catch(() => {})
    },
    //新增
    onClickBtnAdd(opts) {
      this.data = null
      this.isShow = true
      this.addModifyToggle = 'add'
    },
    //修改
    onClickBtnEdit(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        if (selectItems.datas[0].roleId == 1) {
          this.$message({ type: "warning", message: "超级管理员不能修改" })
          return
        }
        if (selectItems.datas[0].roleId == 2 || selectItems.datas[0].roleId == 3 || selectItems.datas[0].roleId == 4 || selectItems.datas[0].roleId == 5 || selectItems.datas[0].roleId == 6 || selectItems.datas[0].roleId == 7 || selectItems.datas[0].roleId == 8) {
          this.$message({ type: "warning", message: "系统角色不能修改" })
          return
        }
      }
      this.edit({ data: selectItems.datas[0] })
    },
    //删除
    onClickBtnDelete(opts, selectItems) {
      console.log(opts)
      console.log(selectItems.datas[0])
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        if (selectItems.datas[0].roleId == 1) {
          this.$message({ type: "warning", message: "超级管理员不能被删除" })
          return
        }
        if (selectItems.datas[0].roleId == 2 || selectItems.datas[0].roleId == 3 || selectItems.datas[0].roleId == 4 || selectItems.datas[0].roleId == 5 || selectItems.datas[0].roleId == 6 || selectItems.datas[0].roleId == 7 || selectItems.datas[0].roleId == 8) {
          this.$message({ type: "warning", message: "系统角色不能被删除" })
          return
        }
      }
      this.del({ data: selectItems.datas[0] })
    },
    // {type,data,dataIndex,list,btn,btnIndex}
    onChangeCurPage(page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page;
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size = pageSize;
      this.init()
    },
    init() {
      this.form.pageRows = this.datagrid.Pagination.page_size
      this.form.pageNo = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_sysRole({ 
        data: Object.assign({
          systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
          userName: JSON.parse(sessionStorage.getItem('userInfo')).name
        }, this.form)
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted () {
    this.init()
  }
};
</script>

<style lang="scss" scoped>
  .style_of_tree {
    width: 169px;
    margin: 0 auto;
  }
</style>
