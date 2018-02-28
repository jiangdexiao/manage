<template>
  <div>
       <el-dialog
        title="商品列表"
        custom-class='dialog'
        :visible.sync="show_goodsList_Dialog" width="900px"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="form">
                    <el-form-item>
                        <el-input  placeholder="商品名/商品ID" :maxlength="50" v-model="form.goodsMessage" class="form-input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input  placeholder="商家名/商家ID" :maxlength="50" v-model="form.dealerMessage" class="form-input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.goodsLaunchStatus"  class="form-input" placeholder="选择投放状态" clearable>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <list-data
                ref='list-data'
                @select="select"
                @onChangeCurrentPage="onChangeCurPage"
                @onChangePageSize="onChangeCurPageSize"
                :DataGrid = 'datagrid'></list-data>
       </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        let tool =this.tool
        return {
            show_goodsList_Dialog:false,
            datagrid: {
                List: [],
                FieldList: [
                { key: 'goodsId', label: '商品ID',width:320,tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.goodsId,20)
                }},
                { key: 'goodsName', label: '商品名',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.goodsName,20)
                }},
                { key: 'dealerName', label: '商家名',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.goodsName,20)
                }},
                { key: 'goodsLaunchStatus', label: '是否投放',width:80,formatter: function(row) {
                    return row.goodsLaunchStatus===1?'是':'否'
                }},
                { type:'operate',label: '操作',width:100,
                  btns:[{ text:'选择',eventName:'select'}]
                }
                ],
                Pagination: {
                    current_page: 1,
                    page_size:10,
                    total: 0
                },
                Checkbox:false,
            },
            form: {
                goodsMessage: "",
                dealerMessage: "",
                goodsLaunchStatus: "",
            },
        }
    },
    props:['isShow'],
    methods: {
        select(row) {
            this.show_goodsList_Dialog = false;
            this.$parent.show_goodsList_Dialog = false;
            this.$emit('goodsSelected',row.data);
        },
        handleClose(){
            this.$parent.show_goodsList_Dialog = false;
            this.tool.dp.clearData(this.form)
        },
        onChangeCurPage(page) {
            this.datagrid.Pagination.current_page = page
            this.init()
        },
        onChangeCurPageSize(pageSize) {
            this.datagrid.Pagination.page_size  = pageSize
            this.init()
        },
        init() {
            this.form.rows = this.datagrid.Pagination.page_size
            this.form.pageNum = this.datagrid.Pagination.current_page
            this.form.pageOrNot = 1
            this.api_sellerManagePlatform_goodsInformation({ data:this.form }).then(data=>{
               this.datagrid.Pagination.total = data.totalCount;
               this.datagrid.List = data.content ? data.content : [];
            })
        }
    },
    watch: {
        isShow(v){
            this.show_goodsList_Dialog = v
            if( !v ) {return false}
            this.init();
        }
    }
}
</script>
