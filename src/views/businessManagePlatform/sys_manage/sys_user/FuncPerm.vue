<template>
  <div class="edit-form">
    <el-dialog
      title="功能权限"
      custom-class='dialog_static'
      :visible.sync="funcShow"
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
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'menus',
        label: 'name'
      }
    }
  },
  props: ["funcShow", "userId", "menuPerList" , "menuPerListChecked"],
  methods: {
    handleClose () {
      this.$parent.funcShow = false
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
          if(item.moduleId === menus[k].moduleId && item.type === 2) {
            menus[k].menuIds.push(item.menuId)
          }
        }
      })
      console.log('最终菜单', menus)
      console.log('ID', this.userId)
      // this.api_businessManagePlatform_setRoleAuth ({
      //   data:JSON.stringify({
      //     authMenus: menus,
      //     isCover: type
      //   }),
      //   pathParams: `/${this.userId}/menus`,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      // }).then(res => {
      //   this.$message({ type:'success',message:'菜单权限保存成功' })
      //   this.$parent.menuShow = false
      // })
      $.ajax ({
        type: 'post',
        url: this.BASE_URL + 'm2c.operate/user/auth/' + this.userId + '/buttons',
        data: JSON.stringify(menus),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
          if (res.status === 200) {
            that.$message({ type:'success', message:'功能权限保存成功' })
            that.$parent.funcShow = false
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
