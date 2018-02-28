<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="渠道名" :maxlength="100" v-model="search_params.channelName" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.channelType" placeholder="选择渠道类型" clearable>
              <el-option label="朋友圈" :value="1"></el-option>
              <el-option label="社交圈" :value="2"></el-option>
              <el-option label="业务合作" :value="3"></el-option>
              <el-option label="商家" :value="4"></el-option>
              <el-option label="媒体" :value="5"></el-option>
              <el-option label="公众号" :value="6"></el-option>
              <el-option label="其他" :value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnSee="onClickBtnSee"
      @onClickBtnDownload="onClickBtnDownload"
      @onClickBtnDelete="onClickBtnDelete"
      @see="see"
      @del="del"
      @download="download"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
		<el-dialog
      title="创建渠道"
      custom-class='dialog_static'
      :visible.sync="isShow"
      :before-close="handleClose">
      <el-col :span="24" >
        <el-form ref="form" :model="add_params" :rules="formRules" label-width="100px">
          <el-form-item label="渠道名" prop="channelName">
						<el-input :maxlength="50" v-model="add_params.channelName" ></el-input>
          </el-form-item>
          <el-form-item label="渠道类型" prop="channelType">
            <el-select v-model="add_params.channelType" placeholder="选择渠道类型" clearable>
              <el-option label="朋友圈" :value="1"></el-option>
              <el-option label="社交圈" :value="2"></el-option>
              <el-option label="业务合作" :value="3"></el-option>
              <el-option label="商家" :value="4"></el-option>
              <el-option label="媒体" :value="5"></el-option>
              <el-option label="公众号" :value="6"></el-option>
              <el-option label="其他" :value="7"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="dialog_static" title="下载二维码" @close="handleCloseBarcode" :visible.sync="show_barcode_dialog" :close-on-click-modal= "false">
      <div style='text-align:center;'>
        <!-- 二维码 -->
        <template>
          <!-- 单个 -->
          <template v-if="codes && codes.length === 1">
            <img style="width:200px;height:200px;" :src="'data:image/png;base64,'+codes[0].qrCode" >
            <div >URL: {{codes[0].url}} </div>
          </template>
          <!-- 多个 -->
          <template v-else>
            <div v-if="codes && codes.length > 1">
              <p v-for="(code,i) in codes" :key="i">{{ code.mresNo }}</p>
              <div style='margin-top:10px'>共选择{{codes.length}}条数据</div>
            </div>
          </template>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBarcode">取 消</el-button>
        <el-button type="primary" @click="saveCodeDownload" >保存到本地</el-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
import { tool } from "../../../utils/";
export default {
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 200,
            btns: [
              { text: "查看明细", eventName: "see" },
              { text: "下载二维码", eventName: "download" },
              { text: "删除", eventName: "del", style: "color:red" }
            ]
          },
          { key: "channelName", label: "渠道名" },
          { key: "channelType", label: "类型", formatter:function(row,column,cellValue) {
            if (row.channelType === 1) return "朋友圈"
						else if (row.channelType === 2) return "社交圈"
            else if (row.channelType === 3) return "业务合作"
						else if (row.channelType === 4) return "商家"
						else if (row.channelType === 5) return "媒体"
            else if (row.channelType === 6) return "公众号"
            else return '其他';
          } },
          { key: "iP", label: "IP" },
          { key: "uV", label: "UV" },
          { key: "pV", label: "PV" },
          { key: "downNum", label: "下载量" },
          { key: "registerNum", label: "注册数" },
          { key: "orderNum", label: "订单量" },
          {
            key: "createdDate",
            label: "创建时间",
            width: 150,
            formatter: function(row, column, cellValue) {
              return tool.date.format(row.createdDate, "yyyy-MM-dd hh:mm");
            }
          }
        ],
        ToolBar: [
          { text: "创建渠道", eventName: "onClickBtnAdd" },
          { text: "删除", eventName: "onClickBtnDelete", type: "danger" },
          { text: "下载二维码", eventName: "onClickBtnDownload" },
          { text: "查看明细", eventName: "onClickBtnSee" }
        ],
        Pagination: {
          current_page: 1,
          page_size: 20,
          total: 0
        }
			},
			formRules:{
				channelType:[
					{ required: true, message:'请选择渠道类型', trigger: 'change' }
				],
				channelName:[
					{ required: true, message:'请输入渠道名', trigger: 'blur' },
					{ min:2, max:50, message:'请输入2到50位的渠道名', trigger: 'blur' }
				],
      },
      form: {},
      add_params: {
        channelName: "",
        channelType: ""
      },
      add_modify_toggle: "",
      goods_all: [],
      publish_params: { id: "", androidTitle: "" },
      file_change: false,
      // 等待上传文字显示
      wait_upload: false,
      // 限制多次点击按钮只提交一次
      isSuccess: true,
      time: "",
      // 搜索参数
      search_params: {
        channelType: "",
        channelName: ""
      },
			isShow: false,
      data: null,
      imgSrc: false,
      forbid_show: false,
      show_barcode_dialog: false,
      codes: [],
      channelIds: ''
    };
  },
  methods: {
    handleClose() {
      this.isShow = false
    },
    handleCloseBarcode () {
      this.codes = []
      this.show_barcode_dialog = false
    },
    Save_Success() {
      console.log("保存成功")
    },
    onClickSearch() {
      this.init()
    },
    see(opts) {
			this.data = sessionStorage.setItem('channelInfo', JSON.stringify(opts.data))
			this.$router.push({path: '/m/detailData'})
    },
    // 新增保存
    save () {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.api_businessManagePlatform_addChannel ({
						data: Object.assign({}, {
							token: JSON.parse(sessionStorage.getItem("userInfo")).token
						}, this.add_params)
					}).then(res => {
						this.handleClose()
						this.init()
					})
				}
			})
    },
    // 删除
    del(opts) {
      this.$confirm("是否确认删除渠道："+ opts.data.channelName + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api_businessManagePlatform_deleteChannel({
            data: {
              token: sessionStorage.getItem("access_token"),
              channelId: opts.data.channelId
            }
          }).then(res => {
            this.init()
            this.datagrid.List = res.content
            this.datagrid.Pagination.total = res.totalCount
          })
        })
        .catch(() => {});
    },
    download (opts) {
      console.log(opts)
      this.channelIds = opts.data.channelId
      this.show_barcode_dialog = true
      this.api_businessManagePlatform_getQrcode({data:{ channelIds:opts.data.channelId} }).then(res=>{
        this.codes = res.content
      })
    },
    //新增
    onClickBtnAdd(opts) {
      this.add_params = { hannelName: "", channelType: "" } 
      this.isShow = true
    },
    //查看
    onClickBtnSee(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return
      } else if (selectItems.ids.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" })
        return
      } else {
        this.see({ data: selectItems.datas[0] })
      }
    },
    // 下载二维码
    onClickBtnDownload(data) {
      if( data.batch.datas.length === 0){
        this.$message({ type:'warning',message:'请选择一项' })
        return
      } else if (data.batch.datas.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" })
        return
      } else {
        this.data = data.batch.datas
        let channelIds = this.data.map(item=>{
          return item.channelId
        }).join(',')
        this.channelIds = channelIds
        this.show_barcode_dialog = true
        this.api_businessManagePlatform_getQrcode({data:{ channelIds:channelIds} }).then(res=>{
          this.codes = res.content
        })
      }
    },
    // 条码批量保存
    saveCodeDownload(){
      // let channelIds = this.codes.map(item=>{ return item.channelIds }).join(',')
      let str=`channelIds=${this.channelIds}`
      console.log('str', str)
      let a = document.createElement('a');
      let url = ''
      url = `${this.BASE_URL}m2c.operate/channel/bar/down?${str}`
      let iframe = document.createElement('iframe');
      iframe.src = url
      iframe.style.display= 'none'
      document.body.appendChild(iframe)
      iframe.onload = function(){
          document.body.removeChild(iframe)
      }
      this.handleCloseBarcode()
    },
    //删除
    onClickBtnDelete(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" })
        return;
      } else {
        this.del({ data: selectItems.datas[0] });
      }
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page;
      this.init();
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size = pageSize;
      this.init();
    },
    init() {
      this.form.rows = this.datagrid.Pagination.page_size;
      this.form.pageNum = this.datagrid.Pagination.current_page;
      this.api_businessManagePlatform_getChannelList({
        data: Object.assign(
          {},
          {
            token: JSON.parse(sessionStorage.getItem("userInfo")).token
          },
          this.form,
          this.search_params
        )
      }).then(res => {
        if (res.content !== '') {
					this.datagrid.List = res.content
        	this.datagrid.Pagination.total = res.totalCount
				} else {
					this.datagrid.List = []
        	this.datagrid.Pagination.total = res.totalCount
				}
      })
    }
  },
  mounted() {
    this.init()
  }
};
</script>

