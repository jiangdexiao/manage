<template>
  <div class="list">
    
    <div class="switch_show">
    <!--<div>-->
      <el-switch
        v-model="value3"
        active-text=""
        inactive-text="是否展示"
        @change="change_show">
      </el-switch>
    </div>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @edit="edit"
      @detail="detail"
      @del="del"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import { tool } from "../../../../../utils/";
// import { mapActions } from 'vuex'
export default {
  data() {
    let _this = this
    return {
      value3:false,
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 230,
            btns: [
              { text: "详情", eventName: "detail", style: 'color:#0078E4' },
              { text: "编辑", eventName: "edit", style: 'color:#18DCF6 ' },
              { text: "删除", eventName: "del", style: 'color:#F56C6C'},
              { text: "上移↑", eventName: 'onClickBtnMove',
                control:{
                  display:true,
                  type:'drowdown',//下拉形式
                  children:[
                    {name:'上移',type:'input',value:'',prefix:'位',class:'drowdown-default',
                      callback:( row,data,index)=>{
                        let type = 'top'
                        this.move (row.value,data,index,type)
                        row.value = '' }
                      }
                  ] 
                },
                condition:function({dataIndex}){ return dataIndex == 0?false:true  },
                style: 'color:#73A9E8' },
              { text: "下移↓", eventName: 'onClickBtnMove',
                control:{
                  display:true,
                  type:'drowdown',//下拉形式
                  children:[
                    {name:'下移',type:'input',value:'', prefix:'位',class:'drowdown-default',
                      callback:( row,data,index)=>{
                        let type = 'down' 
                        this.move (row.value,data,index,type)
                        row.value = '' }
                      }
                  ] 
                }, 
                condition:function({dataIndex}){ return dataIndex == _this.datagrid.List.length -1?false:true},
                style: 'color:#73A9E8' }
            ]
          },
          {key: '', label: '序号',type:'index', width: 80,indexMethod:(index)=>{
            return index++
          }},
          { key: "serialNumber", width: 100, label: "编号" },
          { key: "headLine", label: "标题", tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.headLine, 11)
            } },
          { label: "展示时间", formatter:function(row,column,cellValue){
              if (row.endTime) {
                return _this.tool.date.format(row.startTime,'yyyy-MM-dd hh:mm:ss') + ' ~ ' + _this.tool.date.format(row.endTime,'yyyy-MM-dd hh:mm:ss')
              } else {
                return _this.tool.date.format(row.startTime,'yyyy-MM-dd hh:mm:ss')
              }
          }},
          { key: "displayStatus", label: "展示状态", width: 100, formatter: function (row,column,cellValue) {
            return row.displayStatus == 1 ? '展示中' :row.displayStatus == 2 ? '已失效':row.displayStatus == 0 ? '隐藏':''
          }}
        ],
        ToolBar: [
          { text: "新增头条内容", eventName: "onClickBtnAdd" },
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        },
        Checkbox: false,
      },
      form: {
      },
      add_modify_params: {versionNo: '', phoneType: '', upgTip: '', isMust: 0, fileUrl: '', isRedirect: 0, redirectUrl: ''},
      add_modify_toggle: '',
      goods_all: [],
      publish_params: {topLineId: '', androidTitle: ''},
      fileChange: false,
      // 等待上传文字显示
      wait_upload: false,
      // 限制多次点击按钮只提交一次
      isSuccess: true,
      time:'',
      // 搜索参数
      search_params: {versionNo: '', phoneType: '',publishDateStart:'',publishDateEnd:''},
      addModifyToggle: '',
      isShow: false,
      data: null
    };
  },
  watch: {
  },
  methods: {
    // ...mapActions(['setHeadLineInfo','setType']),
    
    hide_show (val) {
      let status = ''
      if(this.value3) {
        status = 1
      } else {
        status = 2
      }
      this.api_businessManagePlatform_advLocationEdit({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          advType:3,
          displayStatus:status
        }
      }).then(res => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        });
      })
    },
    //新增
    onClickBtnAdd() {
      sessionStorage.setItem('headLineType','add')
      this.goto('/m/marketAdvertise/headLine/headLineEdit')
    },
    // 详情
    detail(opts) {
      sessionStorage.setItem('headLineId',opts.data.topLineId)
      this.goto('/m/marketAdvertise/headLine/headLineInfo')
    },
    // 编辑
    edit(opts) {
      console.log('点击的',opts.data)
      sessionStorage.setItem('headLineId',opts.data.topLineId)
      sessionStorage.setItem('headLineType','edit')
      this.goto('/m/marketAdvertise/headLine/headLineEdit')
    },
    move (value,data,index,type) {
      let reg = /^[1-9]\d*$/
      let moveStatus =''
      if (!reg.test(value)){
        this.$message.error('移动位数只能是正整数');
        return
      }
      value = parseInt(value)
      let len = this.datagrid.List.length - 1
      let id1 =''
      let id2 =''
      id1 = this.datagrid.List[index].sortId
      console.log('*****',this.datagrid.List[index].sortId)
      if (type == 'top' ) {
        moveStatus  = 1
        if (index - value < 0 ) {
          id2 = this.datagrid.List[0].sortId
        } else {
          id2 = this.datagrid.List[index - value].sortId
        }
        
      } else if (type == 'down' ) {
        moveStatus  = 2
        if (index + value > len ) {
          id2 = this.datagrid.List[len].sortId
        } else {
          id2 = this.datagrid.List[index + value].sortId
        }
      }
      this.api_businessManagePlatform_moveHeadLine({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          sortId1:id1,
          sortId2:id2,
          moveStatus:moveStatus
        })
      }).then(res => {
        this.init()
      })
    },
    //删除
    del(opts) {
      this.$confirm("确定删除此头条?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_delHeadLine ({ 
          data: Object.assign({} ,{
            topLineId: opts.data.topLineId,
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          }),
        }).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.init()
        })
      }).catch(() => {})
    },
    goto (path) {
      this.$router.push({path: path})
    },
    onChangeCurPage(page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.init();
    },
    onChangeCurPageSize(pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size = pageSize
      this.init();
    },
    init() {
      this.api_businessManagePlatform_headLineList({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          pageNumber:this.datagrid.Pagination.current_page,
          rows:this.datagrid.Pagination.page_size
        })
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
        this.all_show_hide()
      })
    },
    all_show_hide () {
      this.api_businessManagePlatform_headLineShowOrHide({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        }
      }).then(res => {
        if (res.content == 1 ) {
          this.value3 = true 
        } else if (res.content == 2) {
          this.value3 = false
        }
      })
    },
    // 展示或隐藏
    change_show (val) {
      this.api_businessManagePlatform_headLineIsToShow({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        }
      }).then(res => {
        if (res.content) {
          if (this.value3) {
            this.$confirm("确定在客户端展示该模块?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.hide_show (val)
            }).catch(() => {
              this.value3 = false
            })
          } else {
            this.$confirm("确定在客户端隐藏该模块?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.hide_show (val)
            }).catch(() => {
              this.value3 = true
            })
          }
        } else {
          this.$message({
            message: '当前头条信息均为失效中，不可设置为展示！',
            type: 'warning'
          });
          this.value3 = false
        }
      })
    },
  },
  mounted () {
    this.init()
    // this.all_show_hide()
  }
};
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  .switch_show{
    position: absolute;
    z-index: 10;
    right: 10px;
    top:10px;
  }
}
</style>

