<template>
	<div class="edit-form">
        <el-dialog title="媒体信息" @close="dialogClose" :visible.sync="show_media_dialog" :close-on-click-modal= "false" width="600px">
            <el-form label-width="150px" :model="data" class="form_box">
                <el-form-item label="媒体名称 :" >
                    <span>{{media.mediaName}}</span>
                </el-form-item>
                <el-form-item label="地理位置 :" >
                    <span>{{ media.tagAddr }}<a @click="showMap">&nbsp;&nbsp;查看</a></span>
                </el-form-item>
                <el-form-item label="详细地址 :" >
                    <span>{{ media.detailAddr }}</span>
                </el-form-item>
                <el-form-item label="联系人 :" >
                    <span>{{ media.contactMan }}</span>
                </el-form-item>
                <el-form-item label="联系电话 :" >
                    <span>{{ media.contactTel }}</span>
                </el-form-item>
                <el-form-item label="媒体分类 :" >
                    <span>{{ media.parCateName+' > '+media.cateName }}</span>
                </el-form-item>
                <el-form-item label="资源描述 :" >
                    <span>{{ media.mresDisc }}</span>
                </el-form-item>
                <el-form-item label="BD专员 :" >
                    <span>{{ media.bdStaffName }} / {{media.bdStaffNo}}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog  custom-class="dialog map-dialog" append-to-body :visible.sync="show_map_dialog">
            <EleMap :isShow="show_map_dialog" v-on:cancel="show_map_dialog=false" :isEdit="false" mapId="map1"
                :adress='media.tagAddr' 
                :longitude='media.longitude' 
                :latitude='media.latitude'></EleMap>
        </el-dialog>
	</div>
</template>
<script>
import { EleMap } from '../../../../components/business/'
export default {
  components:{EleMap},
  data() {
    return {
      show_media_dialog: false,
      show_map_dialog:false,
      media: {}
    };
  },
  methods: {
    dialogClose() {
      this.show_media_dialog = false;
      this.$parent.show_media_dialog = false;
    },
    showMap(){
      this.show_map_dialog = true
    }
  },
  computed: {
    cooperWay() {
      if (this.data) {
        if (this.data.cooperWay === 1) return "分成合作";
        else if (this.data.cooperWay === 2) return "租赁合作";
      }
      return "";
    }
  },
  mounted() {},
  props: {
    isShow: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  watch: {
    isShow(v) {
      this.show_media_dialog = v;
      if (v === true) {
        this.api_mediaManagePlatform_mediaDetail({
          pathParams: `/${this.data.mediaId}`
        }).then(res => {
          this.media = res.content || {};
        });
      } else {
          this.media = {}
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>