<template>
  <div class="list">
    <div v-if='!changeGoodShow' >
      <div class="toolbar" >
         <el-button class=""  type="primary"  style="margin-left:38px;height:36px;width:70px;line-height:2px"  @click="addFirstSubCategory(1,-1)">新增</el-button>
      </div>
      <table class="notetable">
        <thead>
            <tr>
                <td class="a1">商品分类</td>
                <td class="a2">操作</td>
            </tr>
        </thead>

        <tbody>
        <!-- 折叠面板表格 -->
         <el-tree
           v-if ="dataTree!==''"
            :data="dataTree"
            :props="defaultProps"
            node-key="id"
            :default-expand-all='false'
            :render-after-expand	='true'
            :expand-on-click-node="false"
            :indent=26
            :render-content="renderContent">
            </el-tree>
           <tr v-else style="height:50px; text-align:center;">
              <td width='100%'>暂无数据</td>
            </tr>
        </tbody>
      </table>
    </div>
    <!-- //新增一级分页 -->
    <div v-if="changeGoodShow">
      <div v-if="one" class="updataPage">
        <div class="panel panel-default">
          <div class="panel-body">
            <form class="form-horizon" style="width:50%  ">
              <div class="form-group">
                <div id="CategoryFirst" v-show='one'  >
                  <label for="exampleInputName2" > <i class='red'>*</i>分类名称：</label>
                <el-input v-model="firstName2" :maxlength="10"  placeholder="1-10字符" >  </el-input>
                </div>
              </div>
              <div id="addSortSection" style="padding-left:10px " >
                  <span style="cursor:pointer; display:block" @click='addSortLis()'>新增子分类+</span>
                <template v-for="(item,index) in newRows" v-show="newRows.length!=0">
                   <el-input  style="margin-left:76px" v-model="item.firstName" :maxlength="10"  placeholder="1-10字符" ></el-input>
                  <span class ='iconfont icon-ico_del' @click="deleteRows(index)" > </span><br />
                </template>
              </div>
              <br/>
             <el-button style="margin:0 10px 0 86px " type="primary" size="medium" @click='saveAddClassify()'>保存</el-button>
            <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
            </form>
          </div>
        </div>
      </div>
      <!-- //新增二级分页 -->
      <div v-if="two" class="updataPage ">
        <div class="panel panel-default">
          <div class="panel-body">
            <form class="form-horizon" style="width:50%">
              <div class="form-group">
                <div id="CategorySecond" >
                  <label for="subClassifyNames" style="display:inline; width:30%;"> <i class='red'>*</i>上级分类：</label>
                  <el-select  v-model="oneLevel" >
                    <el-option v-for='(items,index) in dataTree'  :key='items.classifyId' :value="items.classifyName"></el-option>
                  </el-select>
                </div>
                <div id="CategoryThird">
                  <label for="exampleInputName2"> <i class='red'>*</i>分类名称：</label>
                    <el-input  v-model="firstName2" type="text"  class="mt10" :maxlength="10" placeholder="1-10字符"  > </el-input>
                </div>
              </div>
              <div id="addSortSection" style="padding-left:10px ">
                <span id="#sortLis" style="cursor:pointer; display:block" @click='addSortLis()'>新增子分类+</span>
                <template v-for="(item,index) in newRows" v-show="newRows.length!=0">
                  <el-input v-model="item.firstName" type="text" style="margin-left:76px" class="form-control mt10" :maxlength="10" placeholder="1-10字符" > </el-input>
                  <span class ='iconfont icon-ico_del' @click="deleteRows(index)"></span><br />
                </template>
                <br>
              </div>
              <el-button style="margin:0 10px 0 86px " type="primary" size="medium" @click='saveAddClassify()'>保存</el-button>
            <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
            </form>

          </div>

        </div>

      </div>

      <!-- 新增三级分页 -->

      <div v-if="three" class="updataPage">
        <div class="panel panel-default">
          <div class="panel-body">
            <form class="form-horizon" style="width:50%">
              <div class="form-group">
                <div id="CategorySecond">
                  <label for="subClassifyNames" style="display:inline; width:30%;"> <i class='red'>*</i>上级分类：</label>
                  <el-select  v-model="oneLevel">
                    <el-option v-for='(val,index) in secondTree'  :key='val.classifyId'  :value="val.classifyName"></el-option>
                  </el-select>
                </div>
                </br>
                <div id="CategoryThird">
                  <label for="exampleInputName2"><i class='red'>*</i>分类名称：</label>
                   <el-input  v-model="firstName2" type="text"  class="mt10" :maxlength="10" placeholder="1-10字符"  > </el-input>
                </div>
              </div>
            <el-button style="margin:0 10px 0 86px " type="primary" size="medium" @click='saveAddClassify()'>保存</el-button>
            <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
            </form>
          </div>
        </div>
      </div>
         <!-- 编辑分类面板 s -->
      <div v-if="four" class="updataPage">
        <div class="panel panel-default">
          <div class="panel-body">
            <form class="form-horizon" style="width:50%">
              <div class="form-group">
                <div id="CategorySecond">
                  <h4 style="font-weight:700 ">编辑分类</h4>
                  <label> <i class='red'>*</i>分类名称：</label>
                    <el-input v-model="modifyClassifyName"   :maxlength="10"  > </el-input>
                     <input  type="hidden" v-model="modifyClassifyId" > </input>
                </div>
              </div>
            <el-button style="margin:0 10px 0 86px " type="primary" size="medium"  @click="saveClassifyModify(modifyClassifyId,modifyClassifyName)">保存</el-button>
            <el-button size="medium" @click="changeGoodShow=!changeGoodShow">取消</el-button>
            </form>
          </div>
        </div>
      </div>
         <!-- 编辑分类面板 e -->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
         dataTree: [], // 树形结构数据
        defaultProps: {
          children: 'subClassify',
          label: 'classifyName'
        },
        modifyClassifyName : '',
        modifyClassifyId :'',
        oneLevel:'',
        one: false,
        two: false,
        three: false,
        four:false,// 编辑按钮 面板
        showImage:true,
        btnShow: true,
        changeGoodShow: false,
        delectSizeBg: false, // 弹窗背景
        selected: '[]',
        // 新增/修改的数据
        add_modify_params: {
          unitId: "",
          unitName: "",
          unitNameEn: "",
          firstAreaName: "",
          twoAreaName: "",
          threeAreaName: "",
        },

        // 控制新增/修改的参数
        handle_toggle: "",
        firstCategoryName: "",
        subClassifyNames: [],
        newRows: [],
        secondTree: [],
        firstName2: '',
        row: [],
        selectedL: '',
        classifyId: '', // 要删除的id
      }
    },
    methods: {
      jumpTo(){
        let that = this
         that.$goRoute({path:'/s/rate'})
      },
      handleSelect (item) {
        console.log('item=' + item)
      },
      // 渲染树结构
     renderContent:function(createElement, { node, data, store }) {  
        let  self  = this;  // 将vue 实例存到self 变量
        // console.log('data',data)
        // console.log('store',store)
        // console.log('node',node)

        // 判断第三级无新增按钮 
          let a = node.level ===3 ?'none':'block'
        return createElement('span',{attrs:{  
                style:"width:60%",
            }} ,[  
            createElement('span', node.label),  
            createElement('span', {attrs:{  
                style:"; margin-right: 200px"  
            }}, [  ]),
            createElement('el-button',{attrs:{  
                     style:"float: right;width:112px;height:38px",
                     type:"danger",
                },on:{  
                    click:function() {  
                       self.classifyId = data.classifyId
                         self.$confirm('是否删除该分类?', '', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning',
                          closeOnClickModal:false,
                        }).then(() => {
                            // 发送删除请求
                            self.deleteClassify(data.classifyId)
                        }).catch(() => {
                          self.$message({
                            type: 'info',
                            message: '已取消删除'
                          });          
                        });

              console.info("点击了节点" + data.classifyId + "的删除子分类按钮");  
                    }  
                }},'删除'),
                createElement('el-button',{attrs:{  
                     style:"float: right; margin：0 4px",
                     plain:"plain",
                    
                },on:{  
                    click:function() {  
                      self.detailsBtn(data.classifyId,data.classifyName )
                        console.info("点击了节点" + data.classifyId + "的编辑按钮");  
                    }  
                }},[
                   createElement('span', {attrs:{  
                 class:'iconfont icon-ico_details',
            }},"编辑",),
                ],),
                createElement('el-button',{attrs:{  
                     style:"float: right; display:"+a,
                     type:"primary"
                },on:{  
                    click:function() {  
                      console.log('store', store)
                      console.log('node',node)
                      console.log('node.level',node.level)
                          //   新增二 三级子分类
                    if(node.level === 1 ){
                      self.addSencondSubCategory(2,data.classifyId,data.classifyName)
                    }else if(node.level === 2){
                       self.addThirdSubCategory(3,data.classifyId,data.classifyName)
                    }
                    console.info("点击了节点" + data.classifyId + "的新增子分类按钮");  
                    }  
                }},"新增子分类")
            
        ]);   
      },
    saveClassifyModify(id,name){
         if (name== '') {
          this.$message('请输入分类名称');
          return
        }
       this.api_sellerManagePlatform_saveClassifyModify({
          data:{classifyName: name},
          path:'m2c.scm/goods/classify/mng/'+id+'/name'
          }).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
          this.getGoodsClassifyTree()
          this.$message.success('修改分类成功');
          this.changeGoodShow = false
              return
          }
      })
      },
   deleteRows (index) {
        this.newRows.splice(index, 1)
      },
    addSortLis ($event, index) {
        let that = this
        let newRow = {
          firstName: ''
        }
        that.newRows.push(newRow)
      },
      // 新增一级
   addFirstSubCategory (level, parentClassifyId) {
        let that = this
        that.firstName2 = ''
        that.changeGoodShow = true
        that.level = level
        that.parentClassifyId = parentClassifyId
        that.newRows = []
        that.one = true
        that.two = false
        that.three = false
        that.four = false
      },
      // 新增二级
   addSencondSubCategory (level,classifyId,classifyname) {
        // 只显示隐藏的新增界面
        let that = this
        that.firstName2 = ''
        that.changeGoodShow = true
        that.one = false
        that.two = true
        that.three = false
        that.four = false
        that.level = level
        that.parentClassifyId = classifyId
        that.newRows = []
        that.oneLevel = classifyname
      },
      // 新增三级
      addThirdSubCategory (level, classifyId,classifyname) {
        // 只显示隐藏的新增界面
        let that = this
        that.firstName2 = ''
        that.newRows = []
        that.changeGoodShow = true
        that.one = false
        that.two = false
        that.three = true
        that.four = false
        that.oneLevel = classifyname
        that.level = level
        that.parentClassifyId = classifyId
        // 获取二级树结构
        this.api_sellerManagePlatform_getGoodsSecondClassifyTree({}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
            //  获取到全部数据
          that.secondTree = res.content
          }
      })
      },
      // 编辑按钮
      detailsBtn (classifyId,classifyName) {
          let that = this;
          that.changeGoodShow = true
          that.one = false;
          that.two = false;
          that.three = false;
          that.four = true;
          that.modifyClassifyName = classifyName
          that.modifyClassifyId = classifyId
      },
      // 新增提交保存
      saveAddClassify () {
        console.log(this.parentClassifyId)
        if (this.firstName2 == '') {
          this.$message('分类名称不能为空');
          return
        }
         this.row =[]
         let newArr =[]
        for (var i = 0; i < this.newRows.length; i++) {
          if (this.newRows[i].firstName == '') {
             this.$message('子分类名称不能为空');
            return
          }
          if(newArr.indexOf(this.newRows[i].firstName)===-1 && newArr.indexOf(this.firstName2)===-1){
            console.log('newArr',newArr)
            console.log('this.newRows[i].firstName',this.newRows[i].firstName)
            console.log(' this.row', this.row)
            newArr.push(this.newRows[i].firstName)
            //需要的数据带双重引号   newArr判断条件  this.row存储参数
            this.row.push(JSON.stringify(this.newRows[i].firstName))
          }else{
            this.$message("商品分类名称重复")
             return
          }
        }

        let  parameter ={
            classifyName: this.firstName2,
            parentClassifyId: this.parentClassifyId ,
            level: this.level,
            subClassifyNames: '[' + this.row + ']'
        }
          this.api_sellerManagePlatform_saveAddClassify({data:parameter}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200' ||result.status === 200 ){
            this.changeGoodShow = false
            this.getGoodsClassifyTree()
            if(res.content===true || res.content==='true'){
                this.setRateTiops('新增成功，是否设置费率？')
            }
            }else {
              this.row = []
              this.$message(result.errorMessage);
              return
            }
      })
      
      },
      // 获取品种分类
      getGoodsClassifyTree () {
        this.subClassifyNames = ''
        this.row = []
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
      })
      },
      // 删除确认
      deleteClassify (classifyId) {
        this.api_sellerManagePlatform_deleteClassify({
           pathParams: `/`+classifyId,
          }).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
            this.$message({
                       type: 'success',
                       message: '删除成功!'
                        });
              // 刷新页面
          this.getGoodsClassifyTree();
          }else{
             this.$message(res.errorMessage);
          }
      })
      },
      // 设置费率 提示
      setRateTiops(tipsContent){
        this.api_sellerManagePlatform_queryRate({}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
          this.$confirm( tipsContent, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false,
          }).then(() => {
            this.$router.push('rate')
          }).catch(() => {
            this.$message('已取消');          
          });
       }
    })
      }

    },

    mounted() {
      let that = this;
      that.getGoodsClassifyTree();
      that.setRateTiops('您有未设置费率的分类，是否前往设置？')
    }

  };
</script>
'/* eslint-disable */'
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
  .notetable{
      width:100%;
      height: 40px; border-collapse:collapse;
          .a1{ width: 20%;}
          .a2{ width: 20%;}
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
  .ico_details{
    // background: url(../../../assets/images/ico_details.png) center center;
    width: 16px;
    height: 14px;
    display: inline-block;
  }
  .ico_classify_default {
    background: url(./../../../../../static/images/sellerManage/css_sprites.png) no-repeat  -726px -292px;
  }
  .ico_classify_packup {
    background: url(./../../../../../static/images/sellerManage/css_sprites.png) no-repeat   left center ;
  }
      .ico_classify_unfold {
    background: url(./../../../../../static/images/sellerManage/css_sprites.png) no-repeat    -170px -716px  ;
  }
  /*删除*/

  .delectSizeBg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1500px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .setRateTips,.delectSizeWrap {
    position: fixed;
    width: 380px;
    height: 280px;
    padding: 10px;
    border-radius: 10px;
    top: 40%;
    left: 50%;
    margin-left: -200px;
    background: #fff;
    z-index: 999;
  }
  .setRateTips P,.delectSizeWrap p {
    line-height: 200px;
    font-size: 18px;
    color: #333333;
    text-align: center;
  }

  .colseDelectBox {
    position: absolute;
    left: 335px;
    top: 25px;
    border-radius: 5px;
  }

  .blueBtn,
  .defultBtn {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    border: none !important;
  }

  .blueBtn {
    background: #0086FF;
    border-radius: 2px;
    color: #FFFFFF;
    margin-left: 85px;
  }
  .defultBtn {
    background: #ccc;
    border-radius: 4px;
    text-align: center;
    color: #fff;
  }

    .addsort {
      width: 100%;
      min-height: 341px;
      background: #fff;
      z-index: 99;
      left: 0px;
      top: 0px;
      padding: 20px;
      .tit {
        font-size: 18px;
        color: #333333;
      }
    }
//  点击后跳转的面板
.updataPage{
      
      padding: 15px;
      box-sizing: border-box;
       border-radius:4px;
       border: 1px solid #ccc;
       font-size: 14px;
}


</style>
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
.icon-ico_details:before {
    content: "\e676";
    margin-right: 6px!important;
    color:#879CB8 !important;
    background-color: transparent;
}
.icon-ico_details{
 font-size: 14px!important;
}
.el-button+.el-button {
    margin-left: 1px;
}
</style>
