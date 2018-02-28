<template>
  <div>
    <el-col :span="24" class="toolbar">
      <el-form ref="form" :rules="formRules" :inline="true" :model="form" >
        <el-form-item>
          <!--<el-select v-model="form.idphotoBgc" placeholder="证件照底色" clearable>
            <el-option v-for="(cell,i) in colorAdmin" :value="cell.colorName" :key='i'
                       :label="cell.colorName"></el-option>
          </el-select>-->
          <el-popover
            ref="popover_color"
            placement="bottom-start"
            width="450"
            trigger="click" @hide="init">
            <el-checkbox-group v-model="colors" >
              <el-checkbox v-for="(item,i) in colorAdmin" :key="i" :label="item.colorName"  style="line-height:50px;width:20%;margin-left:18px;">{{tool.str.textLength(item.colorName,4)}}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
          <el-button v-popover:popover_color size="medium" style="margin-right:8px;width:200px;text-align: left;" >证件照底色(可多选)</el-button>
        </el-form-item>
        <el-form-item>
          <!--<el-select v-model="form.idphotoFormat" placeholder="证件照格式" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-popover
            ref="popover_format"
            placement="bottom-start"
            width="450"
            trigger="click"
            @hide="init">
            <el-checkbox-group v-model="formats">
              <el-checkbox v-for="(item,i) in options" :key="i" :label="item.value"  style="line-height:50px;width:20%;margin-left:18px;">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
          <el-button v-popover:popover_format width="200px" size="medium" style="margin-right:8px;width:200px;text-align: left;">证件照格式(可多选)</el-button>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="periodic"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeCheck"
            @blur="init">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="specsName">
          <el-input  placeholder="规格名称(中文或数字)" :maxlength="100" v-model="form.specsName" class="form-input""></el-input>
        </el-form-item>
        <el-form-item prop="idphotoWH">
          <el-input  placeholder="打印尺寸（限数字和*号）" :maxlength="100" v-model="form.idphotoWH" class="form-input"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input placeholder=" 用户手机号码（11位数字）" :maxlength="11" v-model="form.mobile" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search" class='btn-search'>搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @onClickBtnDelete="onClickBtnDelete"
      @del="del"
      :DataGrid = 'datagrid'
    >
    </list-data>
  </div>
</template>
<script>
  import {tool} from '../../../../utils/'

  export default {

    data() {
      const specs_name = (rule,value,callback)=>{
        if(value == undefined || value.trim() == "") {
          callback();
        } else {
          if(/^[0-9\u4E00-\u9FA5]+$/i.test(value.trim())){
            callback()
          }else{
            callback(new Error('只能输入中文和数字'))
          }
        }
      }

      const idphotot_wh = (rule,value,callback) =>{
        if(value == undefined || value.trim() == "") {
          callback();
        } else {
          if(/^[0-9\*\.]+$/i.test(value.trim())){
            callback()
          }else{
            callback(new Error('只能输入数字和*号'))
          }
        }
      }

      const mobile_v = (rule,value,callback) =>{
        if(value == undefined || value.trim() == "") {
          callback();
        } else {
          if(/1[3,4,5,6,7,8,9]\d{9}/.test(value.trim())){
            callback()
          }else{
            callback(new Error('请输入正确的手机号'))
          }
        }
      }

      return {
        form:{},
        colors:[],
        formats:[],
        periodic:'',
        options: [
          {
          value: 'JPG',
          label: 'JPG'
        },
          {
          value: 'PNG',
          label: 'PNG'
        }, {
          value: 'JPEG',
          label: 'JPEG'
        }, {
          value: 'BMP',
          label: 'BMP'
        }
        ],
        pageCount:'',
        certificateClass:{},
        colorAdmin:{},
        datagrid:{
          List: [],
          FieldList: [
            { key: 'specsName', label: '规格名称',tooltip:true,formatter:function (row) {
                return tool.str.textLength(row.specsName,8)
              }},
            { key: 'idphotoUrl', label: '证件照片',type:'image'},
            { key: 'photoSize', label: '尺寸'},
            { key: 'pixel', label: '像素'},
            { key: 'idphotoBgc', label: '底色'},
            { key: 'idphotoFormat', label: '格式'},
            { key: 'idphotoResolution', label: '分辨率'},
            { key: 'idphotoSize', label: '文件大小'},
            { key: 'createTime', label: '保存时间',width:"100px",formatter:function(row,column,cellValue){
                return tool.date.format(row.createTime, "yyyy-MM-dd hh:mm:ss");
              }},
            { key: 'string', label: '适用于',tooltip:true,width:180,formatter:function (row) {
                return tool.str.textLength(row.string.join(" , "),20)
              }},
            { key: 'mobile', label: '用户手机号',width:150},
            { type:'operate',label: '操作',
              btns:[
                {text:'删除',eventName:'del'},
              ]
            }
          ],
          ToolBar:[
            {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          }
        },
        formRules:{
          specsName:[
            {validator:specs_name,trigger:"blur"}
          ],
          idphotoWH:[
            {validator:idphotot_wh,trigger:"blur"}
          ],
          mobile:[
            {validator:mobile_v,trigger:"blur"}
          ],
        }
      }
    },
    mounted() {
      this.init()
      this.bgColor()
    },
    methods:{
      search() {
        this.$refs.form.validate(valid=>{
          if(valid) {
            this.init();
          }
        })
      },

      // 时间赋值
      timeCheck () {
        let that = this
        if (that.periodic != null) {
          that.form.startTime = that.periodic[0]
          that.form.endTime = that.periodic[1]
        } else {
          that.form.startTime = ''
          that.form.endTime = ''
        }
      },
      //改变页码
      onChangeCurPage (page) {
        // this.$message('当前页是第' + page + '页')
        this.datagrid.Pagination.current_page = page
        this.init()
      },

      //改变每页显示条数
      onChangeCurPageSize (pageSize) {
        // this.$message('当前每页显示 ' + pageSize + ' 条')
        this.datagrid.Pagination.page_size  = pageSize
        this.init()
      },

      //删除时提示选择
      onClickBtnDelete(opts,selectItems){
        if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'error',message:'请至少选择一项'})
          return
        }else{
          let ids = [];
          for(let i=0 ; i< selectItems.datas.length;i++) {
            ids.push(selectItems.datas[i].idphotoId)
          }
          this.delbatch( {data:ids.join()} )
        }
      },

      //批量删除
      delbatch(opts) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let option={
            idPhotoIds:opts.data
          }
          this.api_customManagePlatform_delhistory({data:option,type:'post'}).then(res=>{
            this.init()
          })
        }).catch(() => {

        })
      },
      //单条删除
      del(opts) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let option={
            idPhotoIds:opts.data.idphotoId
          }
          this.api_customManagePlatform_delhistory({data:option,type:'post'}).then(res=>{
            this.init()
          })
        }).catch(() => {

        })
      },
      //加载底色
      bgColor(){
        this.api_customManagePlatform_getColors().then(res=>{
          this.colorAdmin=res.content ? res.content:[]
        })
      },
      //初始化
      init(){
        let option={
          idphotoFormat:this.formats.join(),
          idphotoBgc:this.colors.join(),
          specsName:this.form.specsName?this.form.specsName:'',
          idphotoWH:this.form.idphotoWH ? this.form.idphotoWH:'',
          mobile:this.form.mobile ? this.form.mobile:'',
          startTime:this.form.startTime ? this.form.startTime : '',
          endTime:this.form.endTime ? this.form.endTime : "",
          rows:this.datagrid.Pagination.page_size,
          pageNum:this.datagrid.Pagination.current_page,
        }
        this.api_customManagePlatform_history({data:option}).then(res=>{
          this.datagrid.List = res.content ? res.content:[];
          this.datagrid.List.forEach(item=>{
            item.pixel = Number(item.idphotoPxWidth)+' * '+ Number(item.idphotoPxHigth);
            item.photoSize = Number(item.photoWidth)+' * '+ Number(item.photoHeight);

          })
          this.datagrid.Pagination.total = res.totalCount;
          this.datagrid.photoSize = res.content;

        })
      },
    },

  }
</script>
<style lang="scss" scoped>

</style>
