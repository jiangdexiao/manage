<template>
  <div class="list">
    <list-data
      ref='list-data'
      @edit="edit"
      :DataGrid = 'datagrid'>
    </list-data>
  </div>
</template>
<script>
export default {
  data() {
    let tool = this.tool;
    return {
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 100,
            btns: [
              { text: "编辑", eventName: "edit"}
            ]
          },
          { key: "advName", label: "营销广告名称"},
          { key: "advLocation", label: "营销广告位位置"},
          { key: "picUrlCommon", label: "图片预览", type: "image",width:80,height:35,previewWidth:240,previewHeight:105,formatter: function (row,column,cellValue) {
             if (row.picUrlCommon) {
               return row.picUrlCommon
             }else if (row.picUrlIphone) {
               return row.picUrlIphone
             }else if (row.picUrlIphoneX) {
               return row.picUrlIphoneX
             } else if (row.picUrlAndroid) {
               return row.picUrlAndroid
             } else {
               return ''
             }
          }},
          { label: "跳转",formatter: function (row,column,cellValue) {
            if (row.advType == 1 || row.advType == 3) {
              return '-'
            } else if (row.advType == 2) {
              if (row.jumpSet == 1) {
                return row.goodsName
              } else if (row.jumpSet == 2){
                return row.jump
              } else {
                return '-'
              }
            }
          }},
          { key: "displayStatus", label: "展示状态",type:'html', formatter: function (row,column,cellValue) {

             if (row.timingSet == 1 && row.advType != 3) {
                 return '<span>定时生效中</span>  <i class="iconfont icon-dingshi" title="'+tool.date.format(row.timing, 'yyyy-MM-dd hh:mm')+'"></i>'
             } else {
                 if (row.advType == 3) {
                   if(row.displayStatus == 2) {
                        return '已失效'
                    }
                    return '展示中'
                 } else {
                    if(row.displayStatus == 2) {
                        return '不展示'
                    }
                    return '展示中'
                 }
                
             }
          }},
          { key: "updateTime", label: "生成时间", formatter: function (row,column,cellValue) {
              return tool.date.format(row.updateTime, 'yyyy-MM-dd hh:mm')
          }}
        ],
        Checkbox: false,
      }
    };
  },
  methods: {
    // 修改
    edit(opts) {
      if(opts.data.advName=="启动广告") {
        this.goto('/m/marketAdvertise/startAdver')
      } else if (opts.data.advName=="主页开屏广告"){
        this.goto('/m/marketAdvertise/homeAdver')
      } else {
        this.goto('/m/marketAdvertise/headLine')
        // sessionStorage.setItem('headline_show',opts.data.displayStatus)

      }
    },
    goto (path) {
        this.$router.push({path: path})
    },
    init() {
      this.api_businessManagePlatform_advLocationList({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token
        }
      }).then(res => {
        this.datagrid.List = res.content
      })
    }
  },
  mounted () {
    this.init()
  }
};
</script>

<style lang="scss" scoped>
  .style_of_tree {
    width: 169px;
    margin: 0 auto;
  }
</style>
