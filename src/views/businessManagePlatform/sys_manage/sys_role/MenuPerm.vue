<template>
  <div class="edit-form">
    <el-dialog
      title="菜单权限"
      custom-class='dialog_static'
      :visible.sync="menuShow"
      :before-close="handleClose">
      <div class="style_of_tree">
        <el-tree
          :data="menuPerList"
          :default-checked-keys="menuPerListChecked"
          show-checkbox
          default-expand-all
          node-key="menuId"
          ref="menuTree"
          highlight-current
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="isCover">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="是否覆盖"
      custom-class='dialog_static'
      :visible.sync="iscoverShow"
      :before-close="coverClose">
        有{{cover_num}}位用户有自定义权限是否覆盖 ？
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="save(1)">覆盖</el-button>
        <el-button @click="save(0)">不覆盖</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'sysMenuNodes',
        label: 'name'
      },
      iscoverShow: false,
      cover_num: 0,
    }
  },
  props: ["menuShow", "roleId", "menuPerList" , "menuPerListChecked"],
  methods: {
    handleClose () {
      this.$parent.menuShow = false
    },
    coverClose () {
      this.iscoverShow = false
    },
    // 是否覆盖弹窗
    isCover () {
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
    save (type) {
      let that = this
      console.log('列表', this.menuPerList)
      console.log('获取的', this.$refs.menuTree.getCheckedKeys())
      console.log('获取的node', this.$refs.menuTree.getCheckedNodes())
      let menus = []
      let selnodes = this.$refs.menuTree.getCheckedNodes()
      for (let i = 0; i < this.menuPerList.length; i++) {
        menus.push({moduleId:this.menuPerList[i].moduleId, menuIds: []})
      }
      console.log('初始菜单', menus)
      selnodes.map((item, i) => {
        for (let k = 0; k < menus.length; k++) {
          if(item.moduleId === menus[k].moduleId && item.menuId) {
            menus[k].menuIds.push(item.menuId)
          }
        }
      })
      selnodes.map((item, i) => {
        for (let k = 0; k < menus.length; k++) {
          if (item.moduleId === menus[k].moduleId && JSON.stringify(menus).indexOf(item.parentId) === -1 && item.parentId !== '0' && item.parentId !== '-1') {
            menus[k].menuIds.push(item.parentId)
          }
        }
      })
      console.log('最终菜单', menus)
      console.log('ID', this.roleId)
      // this.api_businessManagePlatform_setRoleAuth ({
      //   data:JSON.stringify({
      //     authMenus: menus,
      //     isCover: type
      //   }),
      //   pathParams: `/${this.roleId}/menus`,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      // }).then(res => {
      //   this.$message({ type:'success',message:'菜单权限保存成功' })
      //   this.$parent.menuShow = false
      // })
      $.ajax ({
        type: 'post',
        url: this.BASE_URL + 'm2c.operate/role/auth/' + this.roleId + '/menus',
        data:JSON.stringify({
          authMenus: menus,
          isCover: type
        }),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
          if (res.status === 200) {
            that.$message({ type:'success', message:'菜单权限保存成功' })
            that.$parent.menuShow = false
            that.coverClose()
          } else {
            that.$message({ type:'success', message: res.errorMessage })
          }
        }
      })
    }
  },
	mounted () {
		console.log('列表', this.menuPerList)
	}
};
</script>

<style lang="scss" scoped>
  .style_of_tree {
    width: 200px;
    margin: 0 auto;
  }
</style>
