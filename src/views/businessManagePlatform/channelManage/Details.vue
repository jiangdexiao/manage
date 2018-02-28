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
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnForbid="onClickBtnForbid"
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @del="del"
      @forbid="forbid"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
  </div>
</template>
<script>
import { tool } from "../../../utils/"
export default {
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
					{
            key: "accessTime",
            label: "访问时间",
            width: 150,
            formatter: function(row, column, cellValue) {
              return tool.date.format(row.accessTime, "yyyy-MM-dd hh:mm");
            }
          },
          { key: "channelName", label: "渠道名" },
          { key: "channelType", label: "类型", formatter:function(row,column,cellValue) {
            if (row.channelType == 1) return "朋友圈"
						else if (row.channelType == 2) return "社交圈"
            else if (row.channelType == 3) return "业务合作"
						else if (row.channelType == 4) return "商家"
						else if (row.channelType == 5) return "媒体"
            else if (row.channelType == 6) return "公众号"
            else return '其他';
          }},
          { key: "ip", label: "IP", width: 120 },
          { key: "ipRegion", label: "ip地区", width: 120 },
          { key: "downloaded", label: "是否下载", formatter:function(row,column,cellValue) {
            if (row.downloaded == 1) return "是"
						else if (row.downloaded == 0) return "否"
            else if ((row.downloaded == null) )return '-';
          }},
          { key: "registered", label: "是否注册", formatter:function(row,column,cellValue) {
            if (row.registered == 1) return "是"
						else if (row.registered == 0) return "否"
            else if ((row.registered == null) )return '-';
          }},
					{ key: "ordered", label: "是否下单", width: 150, formatter:function(row,column,cellValue) {
            if (row.ordered == 1) return "是"+"（"+row.orderPrice+"元）"
						else if (row.ordered == 0) return "否"
            else if ((row.ordered == null) )return '-';
          }},
					{ key: "browser", label: "浏览器" },
					{ key: "osInfo", label: "操作系统" },
					{ key: "resolvingPower", label: "分辨率" },
					{ key: "network", label: "网络接入" },
        ],
        Pagination: {
          current_page: 1,
          page_size: 20,
          total: 0
				},
				Checkbox: false
			},
      // 搜索参数
      search_params: {
        channelName: JSON.parse(sessionStorage.getItem('channelInfo'))?JSON.parse(sessionStorage.getItem('channelInfo')).channelName:"",
        channelType: JSON.parse(sessionStorage.getItem('channelInfo'))?JSON.parse(sessionStorage.getItem('channelInfo')).channelType:""
			},
			form: {}
    }
  },
  methods: {
    handleClose() {
      this.isShow = false
    },
    Save_Success() {
      console.log("保存成功")
    },
    onClickSearch() {
      this.init();
    },
    edit(opts, selectIems) {
      if (opts.data.upgStatus === 2) {
        this.$message({ type: "error", message: "目标已发布,无法修改" })
        return
      }
      this.data = opts.data
      this.isShow = true
      this.addModifyToggle = "modify"
    },
    forbid(opts) {
      this.forbid_show = true;
      this.add_params = {
        userId: opts.data.userId,
        mobile: opts.data.mobile,
        username: opts.data.username || "",
        forbidType: ""
      };
    },
    // 保存
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
          this.api_businessManagePlatform_unForbid({
            data: {
              token: sessionStorage.getItem("access_token"),
              userId: opts.data.userId
            }
          }).then(res => {
            this.init()
            this.datagrid.List = res.content
            this.datagrid.Pagination.total = res.totalCount
          })
        })
        .catch(() => {});
    },
    //新增
    onClickBtnAdd(opts) {
      this.data = null;
      this.isShow = true;
      this.addModifyToggle = "add";
      this.imgSrc = false;
    },
    //修改
    onClickBtnEdit(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" });
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" });
        return;
      } else {
        this.edit({ data: selectItems.datas[0] });
      }
    },
    // 禁用
    onClickBtnForbid(opts, selectItems) {
      console.log(2);
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" });
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" });
        return;
      } else {
        this.forbid({ data: selectItems.datas[0] });
      }
    },
    //解禁
    onClickBtnDelete(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" });
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({ type: "warning", message: "只能选择一项" });
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
      this.api_businessManagePlatform_getchannelDetailsList({
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
    this.init();
  }
};
</script>

