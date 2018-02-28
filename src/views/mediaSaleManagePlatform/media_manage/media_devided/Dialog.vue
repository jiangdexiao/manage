<template>
    <div class="eidt-form">
        <el-dialog title="查看" :visible.sync="dialog.dialogVisible" @close="edit_close"   custom-class='dialog'>
            <el-col :span="12">
                <el-form :model="form">
                <el-form-item label="商品">
                    <span>{{ good.goodsName }}</span>
                </el-form-item>
                <el-form-item label="商家">
                <span>{{good.dealerName}}</span>
                </el-form-item>
                <el-form-item label="商家ID">
                    <span>{{good.dealerId}}</span>
                </el-form-item>
                <el-form-item label="识别图">
                    <img  :src="imgUrl?imgUrl:(good.imageUrl?good.imageUrl:'')" class="avatar">
                </el-form-item>
                <el-form-item label="开始" >
                    <el-date-picker
                        v-model="dialog.startTime"
                        type="date"  :readonly="true">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束" >
                    <el-date-picker
                        v-model="dialog.endTime"
                        type="date" :readonly="true">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            </el-col>
            <el-col class="line" :span="2">&nbsp;&nbsp;</el-col>
            <el-col :span="10">
                <el-form :model="form" label-position="top">
                    <el-form-item label="广告位">
                        <span>{{good.mresNmae}}</span>
                    </el-form-item>
                    <el-form-item label="条码值">
                        <span v-html="getCode" ></span>
                    </el-form-item>
                    <el-form-item label="行业">
                        <span>{{good.mediaCode}}</span>
                    </el-form-item>
                    <el-form-item label="位置">
                        <div v-html="getAdrress" ></div>
                    </el-form-item>
                    <el-form-item label="属性">
                        <span>{{good.typeName}}</span>
                    </el-form-item>
                    <el-form-item label="形式">
                        <span>{{good.exhibitName}}</span>
                    </el-form-item>
                    <el-form-item label="区域">
                        <span v-html="getRegion" ></span>
                    </el-form-item>
                    <el-form-item label="媒体">
                        <span>{{good.mediaName}}</span>
                    </el-form-item>
                </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edit_close">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl:'',
      showGoodsListDialog: false,
      goods: [],
      sellers: [],
      flagTime: 0,
      form: {
        goodsMessage: "",
        dealerMessage: "",
        goodsLaunchStatus: "",
        pageOrNot: 1,
        pageNum: 1,
        rows: 10
      },
      myTable: {
        totalCount: 0,
        tableData: [],
        pageSize: 10,
        pageNumber: 1
      }
    };
  },
  props: ["dialog", "good"],
  computed: {
    getAdrress() {
      let adrress = "";
      if (this.good.tagAddr) {
        this.good.tagAddr.split(",").forEach(element => {
          if (element) adrress += `${element}<br>`;
        });
      }
      return adrress;
    },
    getCode() {
      let codes = "";
      if (this.good.mresNo) {
        this.good.mresNo.split(",").forEach(element => {
          if (element) codes += `${element}<br>`;
        });
      }
      return codes;
    },
    getRegion(){
        let region = '';
        if( this.good.tagRegion ){
            this.good.tagRegion.split(';').forEach(element=>{
                if(element) region +=`${element}<br>`;
            });
        }
        return region;
    }
  },
  methods: {
    //编辑对话框关闭
    edit_close() {
      this.$parent.dialog.dialogVisible = false;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


