<template>
  <div class="edit-form">
    <!--<el-dialog
      title=""
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">-->
        <el-col :span="24" >
					  <el-form :inline="true"  >
            <el-form-item>
                <el-input  placeholder="请输入媒体名称进行搜索"  :maxlength="20" v-model="title"  class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" class='btn-search' @click="get_media_names" >搜索</el-button>
            </el-form-item> 
        </el-form>
					<list-data
					ref='list-data'
					@onChangeCurrentPage="onChangeCurPage"
					@onChangePageSize="onChangeCurPageSize"
					:DataGrid = 'datagrid'></list-data>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goto('/m/clientFunManage/mapTreasureHunt')">返回</el-button>
          <el-button type="primary" @click="save" >保 存</el-button>
        </span>
    <!--</el-dialog>-->
  </div>
</template>
<script>
export default {
	name: '',
  data() {
		let tool = this.tool
		let _this = this
    return {
			title:'',
			datagrid:{
        List: [],
        FieldList: [
          { key: 'mediaName', label: '媒体名称', tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.mediaName, 15)
          }},
          { key: 'mediaAlias', label: '客户端展示名称',tooltip: true, formatter:function(row,column,cellValue){
						return tool.str.textLength(row.mediaAlias, 15)
          },control:{type:'input',blur:function(row) {
							// 将编辑过的别名添加到修改列表中
							console.log(row)
							_this.media_alias.push({
								mediaId: row.mediaId,
								alias: row.mediaAlias
							})
            }}
					}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox: false,
      },
			// 修改媒体别名参数
			media_alias: [],
    };
  },
  props: ["isShow"],
  methods: {
    handleClose() {
      this.$parent.isShowMediaName = false
			this.media_alias = []
			this.get_media_names()
			this.title = ''
		},
    goto (path) {
      this.$router.push({path: path})
    },
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.get_media_names()
    },
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.get_media_names()
    },
    // 获取媒体列表
    get_media_names () {
      let _this = this
      this.api_businessManagePlatform_mediaCombList({ 
        data: {
          token: sessionStorage.getItem('access_token'),
					mediaName: this.title,
					rows: this.datagrid.Pagination.page_size ,                          // 每页多少条数据
					pageNumber: this.datagrid.Pagination.current_page    // 请求第几页
        },
      }).then(result => {
          this.datagrid.List = result.content
				  if (this.media_alias.length > 0) {
						this.media_alias.map( (m, i) =>{
							_this.datagrid.List.some((item,j) => {
								if(item.mediaId === _this.media_alias[i].mediaId) {
									_this.datagrid.List[j].mediaAlias = _this.media_alias[i].alias
									return
								}
							})
						})
					}
				 this.datagrid.Pagination.total = result.totalCount
          console.log('媒体列表', this.media_list)
      })
    },
    // 活动新增/修改/删除提交
    save () {
			this.api_businessManagePlatform_editMediaAlias({ 
				data: {mediaIdAndAlias: JSON.stringify(this.media_alias)}
			}).then(result => {
					this.handleClose()
			})
		}
  },
  watch: {
    isShow(v) {
			console.log('是否显示',v)
      this.$parent.isShow = v
    }
  },
  mounted () {
    this.get_media_names()
  }
};
</script>

<style lang="scss" scoped>
.edit-form {
}
</style>
