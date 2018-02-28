<template>
	<div>
        <el-dialog title="个人信息" @close="dialogClose" :visible.sync="show_userinfo_dialog" :close-on-click-modal= "false" width="550px">
            <el-form  :model="getUser" class="form_box">
                <el-form-item label="姓名 :" label-width="120px">
                    <span>{{ getUser.name }}</span>
                </el-form-item>
                <el-form-item v-if="!getUser.bd || !getUser.bd.bdId" label="角色 :" label-width="120px">
                    <span>{{ getUser.roleName }}</span>
                </el-form-item>
                <el-form-item v-if="getUser.bd && getUser.bd.bdId" label="组织 :" label-width="120px">
                    <span>{{ getOrg }}</span>
                </el-form-item>
                <el-form-item v-if="getUser.bd && getUser.bd.bdId" label="职责 :" label-width="120px">
                    <span>{{ getDuty }}</span>
                </el-form-item>
                <el-form-item label="登录账号 :" label-width="120px">
                    <span>{{ getUser.userName }}</span>
                </el-form-item>
                <el-form-item v-if="getUser.bd && getUser.bd.bdId" label="管理下属 :" label-width="120px">
                    <span>{{ getUser.bd.subCount }}</span>
                </el-form-item>
                <el-form-item label="最近登录 :" label-width="120px">
                    <span>{{ getUser.updateTime}}</span>
                </el-form-item>
                <el-form-item label="注册时间 :" label-width="120px">
                    <span>{{ getUser.createTime }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data(){
      return {
          show_userinfo_dialog:false
      }
  },
  computed:{
      ...mapGetters(['getUser']),
      getOrg(){
          let obj = this.getUser.bd
          return obj.orgInfoList.map(p=>{ return p.orgName }).join('>')
      },
      getDuty(){
          let obj = this.getUser.bd
          return obj.orgInfoList.length==6 ? obj.orgInfoList[5].orgName :
                            obj.orgInfoList.length==5 ? obj.orgInfoList[4].orgName+'  BDM负责人' :
                            obj.orgInfoList.length==4 ? obj.orgInfoList[3].orgName+'  区域负责人' :
                            obj.orgInfoList.length==3 ? obj.orgInfoList[2].orgName+'  城市负责人' :
                            obj.orgInfoList.length==2 ? obj.orgInfoList[1].orgName+'  区负责人' :
                            obj.orgInfoList.length==1 ? obj.orgInfoList[0].orgName+'  国家负责人' :'' ;
      }
  },
  methods:{
        dialogClose(){
          this.show_userinfo_dialog = false
          this.$parent.show_userinfo_dialog = false
      }
  },
  mounted(){
      console.log(this.getUser)
  },
  props:{
      isShow:{
          type:Boolean
      }
  },
  watch:{
      isShow(v){
          this.show_userinfo_dialog = v
      }
  }
}
</script>

<style lang="scss" scoped>

</style>