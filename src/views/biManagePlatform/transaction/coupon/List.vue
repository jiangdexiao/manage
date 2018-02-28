<template>
  <div v-loading="loading">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm">
        <el-form-item prop="couponCoding">
          <el-input placeholder="请输入优惠券编号" v-model="ruleForm.couponCoding" class="form-input"></el-input>
        </el-form-item>
        <el-form-item prop="couponName">
          <el-input placeholder="请输入优惠券名称" v-model="ruleForm.couponName" class="form-input"></el-input>
        </el-form-item>
        <el-form-item prop="select">
          <el-select v-model="ruleForm.select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="periodic">
          <el-date-picker
            @change="changeDate"
            v-model="ruleForm.periodic"
            :picker-options="pickerOptions0"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="init">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="resetForm">重置搜索条件</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-form>
        <el-form-item>
           <el-button type="primary"  @click="exportSeller">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @toLink="toLink"
      :DataGrid='datagrid'></list-data>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      let tool = this.tool
      return {
        options: [{
          value: '3',
          label: '全部创建者'
        }, {
          value: '1',
          label: '平台'
        }, {
          value: '2',
          label: '商家'
        }],
        ruleForm: {
          select: '3',
          periodic: '',
          couponCoding: '',
          couponName: '',
          startTime: '',
          endTime: '',
        },
        loading: false,

        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        datagrid: {
          List: [],
          FieldList: [
            /* { key: 'url', label: '操作',type:'link'},*/
            {
              type: 'operate', label: '操作',
              btns: [
                {text: '详情', eventName: 'toLink'},
              ]
            },
            {key: 'couponNo', label: '编号'},
            {key: 'createType', label: '创建者'},
            {key: 'couponName', label: '名称'},
            {key: 'couponDesc', label: '优惠券简要说明'},
            {key: 'couponTotal', label: '发行数量'},
            {key: 'createTime', label: '生成时间',formatter:(row)=>{
              return tool.date.format(row.createTime,'yyyy-MM-dd mm:hh:ss')
            }},
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false,
        },
        localhost: '',

      }
    },
    mounted() {
      this.init()

      let href = window.location.href
      if (href.includes('m2c2017local') || href.includes('localhost')) {
        // 开发环境
        this.localhost = 'http://api.m2c2017test.com/'
      } else if (href.includes('m2c2017dev')) {
        // 开发环境
        this.localhost = 'http://api.m2c2017local.com/'
      } else if (href.includes('m2c2017test')) {
        // 测试环境
        this.localhost = 'http://api.m2c2017test.com/'
      } else if (href.includes('m2c2017final')) {
        // 预演环境
        this.localhost = 'http://api.m2c2017final.com/'
      } else {
        // 演示环境
        this.localhost = 'http://api.m2c2017.com/'
      }

    },
    methods: {
      toLink(opts) {
        this.$router.push({name: 'detail', query: {id: opts.data.couponId}})
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields();
      },
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.init()
      },
      changeDate() {
        if (this.ruleForm.periodic) {
          this.ruleForm.startTime = this.ruleForm.periodic[0];
          this.ruleForm.endTime = this.ruleForm.periodic[1];
        }


      },
      init() {
        let select=this.ruleForm.select;
        if (this.ruleForm.select == '3') {
          select = ''
        }
        this.loading = true
        this.api_biManagePlatform_couponsEffect({
          data: {
            rows: this.datagrid.Pagination.page_size,
            pageNo: this.datagrid.Pagination.current_page,
            couponName: this.ruleForm.couponName ? this.ruleForm.couponName : '',
            couponNo: this.ruleForm.couponCoding ? this.ruleForm.couponCoding : '',
            creatorType: select ? select : '',
            startTime: this.ruleForm.startTime ? this.ruleForm.startTime : "",
            endTime: this.ruleForm.endTime ? this.ruleForm.endTime : "",
          }
        }).then(res => {
          this.loading = false
          this.datagrid.List = res.content ? res.content : []
          this.datagrid.List.forEach(item => {
            if (item.createType === '1') {
              item.createType = '平台'
            } else if (item.createType === '2') {
              item.createType = '商家'
            }
          })

          this.datagrid.Pagination.total = res.totalCount;
        })

      },
      exportSeller () {
        let that = this
        let select=this.ruleForm.select;
        if (this.ruleForm.select == '3') {
          select = ''
        }
       let startTime = this.ruleForm.startTime?this.ruleForm.startTime:'';
       let endTime = this.ruleForm.endTime?this.ruleForm.endTime:'';
       let couponNo = this.ruleForm.couponCoding?this.ruleForm.couponCoding:'';
       let couponName = this.ruleForm.couponName?this.ruleForm.couponName:'';
       let creatorType = select ? select : '';

        let url=this.localhost+'m2c.bi/coupons/effect/export?startTime='+startTime+'&endTime='+endTime+'&couponNo='
          +couponNo+'&couponName='+couponName+'&creatorType='+creatorType;
        console.log(url)
        window.location.href=url
      }
    },


  }
</script>

<style lang="scss">
  .bi-export-btn {
    position: relative;
  a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: transparent;
  }
  }
</style>
