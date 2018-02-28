<template>
  <div class="list">
    <div class="rate_tit">
      * 服务费率（即商品的扣点），平台根据现有商品分类，设置统一的服务费率；商家结算方式为按供货价结算时，本设置不受影响。
    </div>
<!-- element ui -->
    <table class="notetable" >
        <thead>
            <tr>
                <td class="a1">商品分类</td>
                <td class="a2">服务费率</td>
            </tr>
        </thead>
        <tbody>
            <el-tree
           v-if ="dataTree!==''"
            :data="dataTree"
            :props="defaultProps"
            node-key="id"
            :default-expand-all='false'
            :render-after-expand	='false'
            :expand-on-click-node="false"
            :indent = 26
            :render-content="renderContent">
            </el-tree>
             <tr  v-cloak v-else style="height:50px; text-align:center;">
                <td width='100%'>暂无数据</td>
            </tr>
        </tbody>
    </table>
    <!-- <div class="rate_content poi2 " v-show="twoConfimShow" id="divRateTwo">
      <input type="number" class="form-control mt20 mb20 " v-model='newRate' min="0" max="100"
             placeholder="请输入0-100的数 ">
      <button type="button" class="btn btn-default queren fl" @click="changeRateYes()"
              data-dismiss="modal">确认
      </button>
      <button type="button" class="btn btn-primary ml20 del" @click="changeRateNo()"
              data-dismiss="modal">取消
      </button>
    </div> -->
     <!-- <el-popover
        placement="top" width="160" v-model="visible2"  ref=popover  trigger='click' >
        <p>这是一段内容这是一段内容确定删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" >取消</el-button>
        </div>
      </el-popover> -->
  </div> 
</template>

<script>
  export default {
      data() {
    let id = 1000;
      return {
        visible2:false,
        popover:'',
        thisValue: [],         //二级分类
        newRate: '',  // 费率更新值
        classifyId: '',  // 分类ID
        twoConfimShow: false ,  // 修改弹框显示
        dataTree: [], //获取目录结构树数据
        defaultProps: {
          children: 'subClassify',
          label: 'classifyName'
        },
      }
    },
    methods: {

    // renderContent:function(createElement, { node, data, store }) {  
    //     // 将vue 实例存到self 变量
    //     var self = this;  
    //     // console.log('data',data)
    //     // console.log('store',store)
    //     // 第一级无设置按钮
    //     let a = data.parentClassifyId==-1?'none':'block'
    //     let  serviceRate = data.serviceRate === null? '点击设置': data.serviceRate+'%'
    //     return createElement('span',{attrs:{  
    //             style:"width:55%",
    //         }} ,[  
    //         createElement('span', node.label),  
    //         createElement('span', {attrs:{  
    //             style:"float: right; margin-right: 200px"  
    //         }}, []),
    //          createElement('el-button',{attrs:{  
    //                  style:"float: right;margin-top:20px;border:transparent; display:"+a,
    //                  class:'iconfont icon-ico_compile',
    //                  'v-popover':data.classifyId
    //             },on:{  
    //                 click:function() {  
    //                   self.popover = data.classifyId
    //                     self.newRate = ''
    //                     self.classifyId = data.classifyId
    //                     self.twoConfimShow = true
    //                     self.showRateDiv(event);
    //                     console.log(node,store)
    //                     self.thisValue = data.subClassify
    //                     console.info("点击了节点" + data.classifyId + "的添加按钮");  
    //                 }  
    //             }},serviceRate),
    //     ]);  
    //   },
       renderContent(h, { node, data, store }) {
        let a = data.parentClassifyId==-1?'none':'block'
        let  serviceRate = data.serviceRate === null? '点击设置': data.serviceRate+'%'
        //  console.log("node,",node)
        // console.log('store',store)
        //  console.log('data',data)
         if(data.parentClassifyId==-1){
              return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{node.label}</span>
              </span>
              <span></span>
              <span></span>
          </span>); 
         }else{
            return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{node.label}</span>
              </span>
              <span style='position:relative;width:200px;'>
                <el-button  style="font-size: 14px;color:#333;" type="text"   class='iconfont icon-ico_compile' on-click={ () => this.showRateDiv(node, data.classifyId,event) }>{serviceRate}</el-button>
                  <span  style='display:none;height:136px;width:206px;background-color:#fff;position:absolute; transform:scale(1.0,1.0) ; top:10px;left:160px;  border-radius: 5;padding-left: 10px;padding-right: 10px;box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.20);'  class='clearfix'  id="divRateTwo">
                      <el-input type="number"  min='0'  placeholder="请输入0-100的数 "></el-input>
                     <br> </br>
                      <el-button  type="primary" style='height:28px;width:80px; border-radius: 2px;line-height:28px;text-align: center; padding: 0px;color: #fff;margin-left: 12px;' on-click={ () => this.changeRateYes( data,event) } >确认 </el-button >
                      <el-button style='height:30px;width:80px; border-radius: 2px;line-height: 30px;text-align: center; padding: 0px;color: #000;margin-left: 12px;' on-click={ () => this.changeRateNo() }  >取消 </el-button >
                      
                  </span>
              </span>
             <span></span>
          </span>); 
         }

      },

     // 修改后保存
      changeRateYes(data, event) {
        let that = this
        // 获取input框的值
        let el =event.target.parentNode.firstChild.childNodes[1] || event.target.parentNode.parentNode.firstChild.childNodes[1]
         that.newRate=parseInt(el.value)
        let reg = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/
        if (!reg.test(that.newRate)) {
           that.$message('请输入0-100的数(保留1~2位小数)');
          return
        }
      that.api_sellerManagePlatform_changeRateYes({
        // path: 'm2c.scm/goods/classify/mng/'+data.classifyId+'/service/rate',
        data:{serviceRate: parseFloat(that.newRate)},
        pathParams:"/"+data.classifyId+"/service/rate"
        }).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
          that.classifyId = ''
          that.twoConfimShow = false
          that.getGoodsClassifyTree()
          that.changeRateNo()
        }
    })
      },
      changeRateNo($event) {
         let divList = document.querySelectorAll('#divRateTwo')
        for(let i = 0;i<divList.length;i++){
            divList[i].style.display="none";
        }
      },
     //  获取商品分类列表(树结构)
      getGoodsClassifyTree() {
          let parameter ={
          token:this.tool.cookie.getCookie('access_token'),
          parentClassifyId: -1
        }
        this.api_sellerManagePlatform_getGoodsClassifyTree({data:parameter}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
            //  获取到全部数据
          this.dataTree = res.content
          }
      })},
      showRateDiv(node, classifyId,event) {
        // 点击到按钮 其他弹框收起
        let divList = document.querySelectorAll('#divRateTwo')
        for(let i = 0;i<divList.length;i++){
            divList[i].style.display="none";
        }
       let el =event.target.nextSibling ||event.target.parentNode.nextSibling
       el.style.display="block";
      },
      },
    mounted() {
      //  获取商品库列表(树结构)
      this.getGoodsClassifyTree()
      window.onscroll = function () {
        // console.log(window.scrollY)
      }
    },
  };
</script>
<style lang="scss" scoped>
// 提示语
.rate_tit{
    font-size: 14px;
    color: #FD3242;
    line-height: 50px;
    width: 100%;
    padding-left: 20px;
    }
  // 表头
.notetable{
    width:100%;
    height: 40px; border-collapse:collapse;
        .a1{
            width: 20%;
        }
        .a2{
            width: 20%;
            text-indent: -69px;
        }
    thead{
    background: #DFE9F6;
    tr{
        height: 40px;
        line-height: 40px;
        td{
        color:#333;
        padding-left: 30px;font-size:14px;
        }
     }
    }
}
// 费率设置弹框
 .rate_content {
            width: 223px;
            height: 128px;
            position: absolute;
            left: 50px;
            top: 260px;
            background: #fff;
            border-radius: 5;
            border:1px solid red;
            padding-left: 10px;
            padding-right: 10px;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.20);
          }
  .form-control {
  width: 197px;
  height: 31px;
  position: absolute;
  top: 12px;
  left: 17px;
  border-radius: 4px;
  border: 1px solid #ccc;
  }
.poi2 {
  position: absolute;
  left: 1026px;
  top: 172px;
  
}
  .mt20 {
  margin-top: 20px;
}
  .mb20 {
  margin-bottom: 20px;
}
  .ml20 {
  margin-left: 20px;
}
.queren {
  border-radius: 2px;
  line-height: 20px;
  text-align: center;
  margin-top: 80px;
  padding: 0px;
  border: none;
  color: #fff;
  margin-left: 12px;
}
  .del {
border-radius: 2px;
width: 80px;
height: 30px;
line-height: 30px;
text-align: center;
margin-top: 80px;
padding: 0px;
border: none;
border: 1px solid #CCCCCC;
background: #fff;
color: #444;
}
</style >
<style>
.el-tree{
    width: 200%;
}
 .el-tree-node__content{
    height: 60px !important;
    line-height: 60px;
 }
  .el-tree-node__content>.el-icon-caret-right{
     width: 30px;
     height: 30px;
     margin-top: 18px;
     margin-left:20px;
     transform: rotate(0deg);
     background: url('./../../../../../static/images/sellerManage/css_sprites.png') -530px -716px  no-repeat;
  }

.el-tree-node__content>.is-leaf{
   width: 30px;
   height: 30px;
   margin-top: 18px;
   background: url('./../../../../../static/images/sellerManage/css_sprites.png') -726px -292px no-repeat;
}
.el-tree-node__content>.expanded{
    width: 30px;
   height: 30px;
   transform: rotate(0deg);
   margin-top: 18px;
   background: url('./../../../../../static/images/sellerManage/css_sprites.png') -170px -716px no-repeat;
}
.el-icon-caret-right:before{
  color:transparent;
  
}
.icon-ico_compile{
  background-color:transparent;
}
.clearfix:before,
.clearfix:after {
    display: block;
    content: " ";
}
.clearfix:after {
    clear: both;
}
.clearfix{
    *zoom: 1;
}
.el-tree-node>.el-tree-node__children {
    overflow: visible;

}

</style>
