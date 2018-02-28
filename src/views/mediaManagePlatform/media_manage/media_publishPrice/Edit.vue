<template>
  <div>
       <el-dialog
        :title="optionPage=='view'? '查看广告位' : '绑定广告位'"
        custom-class='dialog'
        :visible.sync="isShow" width="900px"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :inline="true" :model="v_form">
                    <el-form-item>
                        <el-input  placeholder="广告位名/条码" :maxlength="40" v-model="v_form.mresNameOrMresNo" class="form-input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="v_form.cate"  placeholder="选择广告位位置"  clearable >
                            <el-option  v-for="(cell,i) in cateList" :value="cell.dicCode" :key='i' :label="cell.dicName" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <EleMediaCategory  v-on:selected="mediaType_sel"></EleMediaCategory>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <list-data
                ref='list-data'
                @onClickBtn="onClickBtn"
                @dialogTdClicks="dialogTdClicks"
                @onChangeCurrentPage="onChangeCurPage"
                @onChangePageSize="onChangeCurPageSize"
                :DataGrid = 'datagrid'></list-data>
       </el-dialog>
  </div>
</template>
<script>
import { EleMediaCategory } from '../../../../components/business/'
export default {
    components:{EleMediaCategory},
    data() {
        let tool =this.tool
        return {
            datagrid:{},
            datagridID: {
                List: [],
                FieldList: [
                { key: 'title', label: '绑定刊例',width:200,formatter: (y,column,cellValue) =>{
                    if(this.optionPage==='view' && this.v_form.publishPriceId){
                        return  tool.str.textLength(y.title,20)
                    }else if(this.optionPage==='view' && !this.v_form.publishPriceId){
                        return '未绑定'
                    }else if(this.optionPage==='binding'){
                        return '未绑定'
                    }
                }},
                { key: 'mresName', label: '广告位名',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.mresName,20)
                }},
                { key: 'mresNo', label: '条码值',width:200},
                { key: 'mediaName', label: '所属媒体',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.mediaName,20)
                }},
                { key: 'mediaType', label: '媒体分类',width:200,formatter: (y,column,cellValue) =>{
                    return y.parCateName + ' > ' + y.cateName
                }},
                { key: 'advCateName', label: '广告位位置',width:180},
                { key: 'size', label: '尺寸',width:200},
                { type:'operate',label: '操作',width:50,
                  btns:[
                       { text:'绑定',eventName:'dialogTdClicks',opt:'vbinding',condition:( row )=>{
                           if( !this.v_form.publishPriceId ){
                               return false
                           }
                           if( this.optionPage==='binding' ){
                               return true
                           }
                           return false
                       }},
                       { text:'删除',eventName:'dialogTdClicks',opt:'del',condition:( row )=>{
                           if( !this.v_form.publishPriceId ){
                               return false
                           }
                           if( this.optionPage !=='binding' ){
                               return true
                           }
                           return false
                       }}
                    ]
                }
                ],
                ToolBar:[
                    { text:'绑定',eventName:'onClickBtn',opt:'vbinding',condition: ( row )=>{
                        if(!this.v_form.publishPriceId){
                            return false
                        }
                        if(this.optionPage==='binding'){
                            return true
                        }
                        return false
                    }},
                    {text:'删除',eventName:'onClickBtn',opt:'del',condition: ( row )=>{
                        if(!this.v_form.publishPriceId){
                            return false
                        }
                        if(this.optionPage !=='binding'){
                            return true
                        }
                        return false
                    }}
                ],
                Pagination: {
                    current_page: 1,
                    page_size:10,
                    total: 0
                },
                Checkbox: true
            },
            datagridEndView: {
                List: [],
                FieldList: [
                { key: 'title', label: '绑定刊例',width:200,formatter: (y,column,cellValue) =>{
                    if(this.optionPage==='view' && this.v_form.publishPriceId){
                        return  tool.str.textLength(y.title,20)
                    }else if(this.optionPage==='view' && !this.v_form.publishPriceId){
                        return '未绑定'
                    }else if(this.optionPage==='binding'){
                        return '未绑定'
                    }
                }},
                { key: 'mresName', label: '广告位名',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.mresName,20)
                }},
                { key: 'mresNo', label: '条码值',width:200},
                { key: 'mediaName', label: '所属媒体',width:300, tooltip:true,formatter: function(row) {
                    return tool.str.textLength(row.mediaName,20)
                }},
                { key: 'mediaType', label: '媒体分类',width:200,formatter: (y,column,cellValue) =>{
                    return y.parCateName + ' > ' + y.cateName
                }},
                { key: 'advCateName', label: '广告位位置',width:180},
                { key: 'size', label: '尺寸',width:200}
                ],
                Pagination: {
                    current_page: 1,
                    page_size:10,
                    total: 0
                },
                Checkbox: false
            },
            optionPage:'',
            v_form: {
                publishPriceId:'',
                mresNameOrMresNo:'',
                cate:'',
                mediaType:''
            },

        }
    },
    props:['isShow','data','cateList'],
    methods: {
        dialogTdClicks(opts,selectItems) {
            let arrIds =[];
            if(opts.btnInfo.eventName=='dialogTdClicks'){
                arrIds.push(opts.data.mresId)
            }else if(opts.btnInfo.eventName=='onClickBtn'){
                opts.data.map(item => {
                    arrIds.push(item.mresId)
                })
            }
            if(opts.btnInfo.opt=='del'){
                this.binding_del(arrIds,arrIds.length)
            }else{
                this.binding_Fn(arrIds,arrIds.length)
            }
        },
        onClickBtn(opts,selectItems) {
            if( opts.btnInfo.opt!=='add'  && selectItems && selectItems.ids.length == 0){
                this.$message({type:'error',message:'请选择一项'})
                return
            }else{
                this.dialogTdClicks({data:selectItems.datas,btnInfo:opts.btnInfo} )
            }
        },
        //绑定
        binding_Fn(data,length) {
            this.api_mediaManagePlatform_publishBing({data:{AdvIds: JSON.stringify(data),publishPriceId: this.v_form.publishPriceId}}).then(res=>{
                this.$message({type:'success',message:length +' 个广告位绑定成功'});
                this.init()
                this.$parent.init()
            })
        },
        //解绑
        binding_del(data,length){
            this.$confirm('确认删除'+length+' 个广告位吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.api_mediaManagePlatform_publishNotBing({data:{AdvIds: JSON.stringify(data)}}).then(res=>{
                    this.$message({type:'success',message:length +' 个广告位删除成功'});
                    this.init()
                    this.$parent.init()
                })
            }).catch(() => {
                
            })
        },
        mediaType_sel(val){
            this.v_form.mediaType = val;
        },
        handleClose(){
            this.$parent.isShow = false;
            this.tool.dp.clearData(this.v_form)
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
            this.v_form.rows = this.datagrid.Pagination.page_size
            this.v_form.pageNumber = this.datagrid.Pagination.current_page
            if(this.optionPage=='view'){
                this.api_mediaManagePlatform_publishBingList({data:this.v_form}).then(res=>{
                    this.datagrid.List = res.content
                    this.datagrid.Pagination.total = res.totalCount;
                })
            }else{
                this.api_mediaManagePlatform_publishNotBingList({data:this.v_form}).then(res=>{
                    this.datagrid.List = res.content
                    this.datagrid.Pagination.total = res.totalCount;
                })
            }
        }

    },
    watch: {
        isShow(v){
            if( !v ) {return false}
            if(v && this.data){  
                this.datagrid = this.data.publishPriceId ? this.datagridID : this.datagridEndView ;
                this.optionPage= this.data.optionPage;
                this.v_form.publishPriceId = this.data.publishPriceId
            }
            this.init();
            this.$parent.isShow = v
        }

    }
}
</script>
