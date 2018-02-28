<template>
	<!--列表-->
    <div class="section">
        <el-table ref="data_table" border :data="rows" :style="tabSty" @cell-mouse-enter="mouserEnter" @cell-click="openDialog" cell-class-name ="data_td" element-loading-text="加载中...">
            <el-table-column align="center" v-for="(col,i) in columns" :key="i" :prop="col.id" :label="col.name" v-if="i === 0" width="150">
              <template slot-scope="scope">
                <span>{{ getItemName(scope,i) }}</span>
              </template>
            </el-table-column>
            <el-table-column  v-else  align="center"  :key="i" :prop="col.id" :label="getColumnName(col.name)" width="150"  >
              <template slot-scope="scope">
                  <div class="tag" :index="i" :rowindex="getItemRowIndex(scope,i)" :mresid="getItemMresId(scope,i)" :value="getItemValue(scope,i)" :name="getItemName(scope,i)"  v-html="getItemName(scope,i,'split')"></div>
              </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="page" v-if="pagination.ispage">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="current"
              :current-page.sync="current"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              style="float:right;">
          </el-pagination>
        </el-col>
    </div>
</template>

<script>
export default {
  data() {
    return {
      url:'',
      current: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,
      rows: [],
      columns: [],
      params: null,
      option:'',
      height:500, //table 高度
      tabSty:{
        width: '100%',
        height:'',
      }
    };
  },
  computed: {},
  props: ["pagination"], //接收父组件传递的数据
  methods: {
    getItemName(scope, i,opt) {
      let name= scope.row.cols[i].name;
      if(!name){
        return scope.row.cols[i].name
      }
      let names = name.split(','), str ='';
      if(opt=='split' && names.length>1){
        for(let i=0; i<names.length; i++){
          if(i==0){
            str += names[i]
          }else{
            str += '<br>'+names[i] 
          }
        }
        return str
      }
      return scope.row.cols[i].name;
    },
    getItemMresId(scope, i) {
      return scope.row.mresId;
    },
    getItemValue(scope, i) {
      return scope.row.cols[i].id;
    },
    getItemRowIndex(scope, i) {
      return scope.row.rowindex;
    },
    getColumnName(name){
      return `${name.substring(0,4)}-${name.substring(4,6)}-${name.substring(6,8)}`;
    },
    initData(params,url,open,current) {
      let that = this;
      that.url= url
      this.current = (current && current===1)? 1 :this.current
      params.monthInt = params.monthInt.replace('-','');
      if( open )that.option = open;
      that.params = Object.assign({},params);
      if( this.pagination.ispage ){
        that.params.pageNumber = this.current;
        that.params.rows = this.pageSize;
      }
      if( url ==='scheduleMres' ){
        this.api_mediaManagePlatform_scheduleMres({data:that.params}).then(data=>{
          that.total = data.totalCount;
          that.rows = [];
          that.columns = [];
          if (data.status != 200 || !data.content || data.content.length == 0) return;
          if( that.option == 'mres')that.parseData(data); else that.s_Info_parseData(data);
        }).catch(err=>{
          console.log(err)
        })
      }else{
        this.api_mediaManagePlatform_scheduleSalesman({data:that.params}).then(data=>{
          that.total = data.totalCount;
          that.rows = [];
          that.columns = [];
          if (data.status != 200 || !data.content || data.content.length == 0) return;
          if( that.option == 'mres')that.parseData(data); else that.s_Info_parseData(data);
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    //按广告位查询的结果
    parseData(data) {
      let that = this;
      that.rows = [];
      that.columns = [{id:  "col0", name:'---广告位---'}];
      for (let [rowIndex, rowItem] of data.content.entries()) {
          let r = { cols: [{id: rowItem.mresName , name: rowItem.mresName}], mresId: rowItem.mresId , name: rowItem.mresName, rowindex: rowIndex};
          for (let [columnIndex,columnItem] of rowItem.mresScheduleList.entries()) {
            if(rowIndex==0){
              that.columns.push({id: "col" +(columnIndex+1), name: ""+columnItem.dayInt+""})
            }
            if(r.cols.length){
              if(columnItem.dayScheduleList.length){
                let ids ='', showNames= '', dataList=[]; 
                for(let [rowtowIndex,rowtowItem] of columnItem.dayScheduleList.entries()) {
                  let hourEnd= parseInt(rowtowItem.hourEnd)+1;
                  if(rowtowIndex==0){
                    ids += rowtowItem.salesmanId;
                    showNames += rowtowItem.salesmanName+'['+rowtowItem.hourStart+'-'+hourEnd +'点]';
                  }else{
                    ids += ','+rowtowItem.salesmanId;
                    showNames += ','+ rowtowItem.salesmanName+'['+rowtowItem.hourStart+'-'+hourEnd +'点]';
                  }
                  rowtowItem.hourEnd = hourEnd;
                  dataList.push(rowtowItem);
                }
                r.cols.push({ id:ids, name: showNames, dataList: dataList})
              }else{
                r.cols.push({id:  null, name: null, dataList:[]});
              }
            }
          }
          that.rows.push(r);
          r = null;
      }
    },
    //按促销员查询的结果
    s_Info_parseData(data) {
      let that = this;
      that.rows = [];
      that.columns = [{id:  "col0", name:'---促销员---'}];
      for (let [rowIndex, rowItem] of data.content.entries()) {
          let r = { cols: [{id: rowItem.salesmanId , name: rowItem.salesmanName}], mresId: rowItem.salesmanId, name: rowItem.salesmanName, salesmanNo: rowItem.salesmanNo, rowindex: rowIndex };
          for (let [columnIndex,columnItem] of rowItem.salesmanScheduleList.entries()) {
            if(rowIndex==0){
              that.columns.push({id: "col" +(columnIndex+1), name:""+columnItem.dayInt+""})
            }
            if(r.cols.length){
              if(columnItem.dayScheduleList.length){
                let ids ='', names= '', dataList= []; 
                for(let [rowtowIndex,rowtowItem] of columnItem.dayScheduleList.entries()) {
                  let hourEnd= parseInt(rowtowItem.hourEnd)+1;
                  if(rowtowIndex==0){
                    ids += rowtowItem.mresId;
                    names += rowtowItem.mresName+'['+rowtowItem.hourStart+'-'+hourEnd +'点]'
                  }else{
                    ids += ','+rowtowItem.mresId;
                    names += ','+ rowtowItem.mresName+'['+rowtowItem.hourStart+'-'+hourEnd +'点]'
                  }
                  rowtowItem.hourEnd = hourEnd;
                  dataList.push(rowtowItem)
                }
                r.cols.push({ id:ids, name: names, dataList: dataList})
              }else{
                r.cols.push({id:  null, name: null, dataList:[]});
              }
            }
          }
          that.rows.push(r);
          r = null;
      }
    },
    /****
     * 分页
     */
    handleSizeChange(val) {
      //修改每页条数
      this.pageSize = val;
      this.current = 1;
      this.initData(this.params,this.url);
    },
    handleCurrentChange(val) {
      //修改当前页码
      this.current = val;
      this.initData(this.params,this.url);
    },
    mouserEnter(row, column, cell, event) {
      let p = cell.parentNode;
      let chils = p.childNodes;
      for (let c of chils) {
        c.style.backgroundColor = "transparent";
      }
    },
    openDialog(row, column, cell, event) {
      const index = parseInt(column.property.replace('col',''));
      if( index === 0 ) return;
      let rowObj = {};
      if( this.open == 'mres' ){
        rowObj= { mresId:row.mresId, name:row.name, option:this.option }
      }else{
        rowObj = { mresId:row.mresId, name:row.name, salesmanNo:row.salesmanNo, option:this.option }
      }
      this.$emit('openEditDialogListener',column.label,rowObj,row.cols[index].dataList)
    },
    /** 
     * startTime  开始 时间点 0-1 
     * endTime  结束 时间点 2-3
     * rowId  每一行标识数组
     * cellIds  每个单元格标识数组
    */
    // openDialog(startTime, endTime, rowObj, cellArr) {
    //   this.$emit("openEditDialogListener", startTime, endTime, rowObj, cellArr);
    // },
    //拖动表格事件
    dragTableFn(elements){
      // let that = this;
      // //判断数组是否有不相同元素
      // let array = [],indexArray = [],mresIdArray = [],id_value= '', //即显示几个选项卡
      //    _rowindex= '', //行数
      //     isRepeat = false;
      // elements.forEach(function(element) {
      //   let target = element.querySelector(".tag");
      //   if (!target) return;
      //   let _name = target.getAttribute("name");
      //   _rowindex = target.getAttribute("rowindex");
      //   let _index = target.getAttribute("index");
      //   let _mresid = target.getAttribute("mresid");
      //   let values = target.getAttribute("value");
      //   if (_mresid && mresIdArray.indexOf(_mresid) < 0)mresIdArray.push(_mresid);
      //   if (array.indexOf(_name) < 0) array.push(_name);
      //   if (_index && indexArray.indexOf(_index) < 0) indexArray.push(_index);
      //   if(id_value=='' && values){
      //     id_value = values;
      //   }else {
      //     if(values && id_value.split(',').length < values.split(',').length){
      //       id_value = values;
      //     }
      //   }
      // });
      // //判断是否重复 如果array数组length>1 则有不同单元格内容
      // if (array.length > 1) {
      //   return;
      // }else if(mresIdArray.length>1){
      //   return;
      // } else {
      //   if (indexArray.length == 0) return;
      //   // console.log(id_value)
      //   let _max = Math.max.apply(null, indexArray);
      //   let _min = Math.min.apply(null, indexArray);
      //   //获取行的数据    //  option='mres'为位广告的查询   否则为 促销员的查询
      //   var rowObj= {};
      //   if(that.option=='mres'){
      //     rowObj= { mresId:that.rows[_rowindex].mresId, name:that.rows[_rowindex].name, option:that.option }
      //   }else {
      //     rowObj = { mresId:that.rows[_rowindex].mresId, name:that.rows[_rowindex].name, salesmanNo:that.rows[_rowindex].salesmanNo, option:that.option }
      //   }
      //   that.openDialog(that.columns[_min].name,that.columns[_max].name,rowObj,that.rows[_rowindex].cols[_min].dataList);
      // }
    },
    //表格点击时事件
    clickTableFn(target) {
      // let that = this;
      // let indexArray = [],
      //     id_value= '', //即显示几个选项卡
      //     _rowindex= ''; //行数
      // let _name = target.getAttribute("name");
      // _rowindex = target.getAttribute("rowindex");
      // let _index = target.getAttribute("index");
      // let _mresid = target.getAttribute("mresid");
      // let values = target.getAttribute("value");
      // if (_index && indexArray.indexOf(_index) < 0)indexArray.push(_index);
      // if (indexArray.length == 0) return;
      // let _max = Math.max.apply(null, indexArray);
      // let _min = Math.min.apply(null, indexArray);
      // //获取行的数据    //  option='mres'为位广告的查询   否则为 促销员的查询
      // var rowObj= {};
      // if(that.option=='mres'){
      //   rowObj= { mresId:that.rows[_rowindex].mresId, name:that.rows[_rowindex].name, option:that.option }
      // }else {
      //   rowObj = { mresId:that.rows[_rowindex].mresId, name:that.rows[_rowindex].name, salesmanNo:that.rows[_rowindex].salesmanNo, option:that.option }
      // }
      // that.openDialog(that.columns[_min].name,that.columns[_max].name,rowObj,that.rows[_rowindex].cols[_min].dataList);
    }
  },
  mounted() {
    let that = this;
    // let mousedown_up_starttime = 0; //鼠标按下到弹起的时间 超过 300 ms 默认为拖动操作
    const menuHeight = 125;
    let toolbarHeight = document.querySelector('.toolbar').offsetHeight;
    const paginationHeight = document.querySelector('.page').offsetHeight;
    that.tabSty.height = document.documentElement.clientHeight -toolbarHeight - paginationHeight - menuHeight +'px';//计算table高度
    let container = document.querySelector(".el-table__body-wrapper");
    container.style.height= parseFloat(that.tabSty.height)-40 + 'px';
    // let { containerLeft, containerTop } = getOffsetTop(container); //container相对于window 位置
    // let evt,startX,startY,selDiv,isSelect,_x,_y,selList,headerHeight,topY,leftX;
    // container.onmousedown = function() {
    //   mousedown_up_starttime = new Date();
    //   headerHeight = document.querySelector(".el-table__header-wrapper").offsetHeight;
    //   selList = [];
    //   let fileNodes = document.getElementsByTagName("td");
    //   for (let node of fileNodes) {
    //     if (node.className.includes("data_td")) {
    //       node.className = "data_td";
    //       selList.push(node);
    //     }
    //   }
    //   isSelect = true;
    //   evt = window.event || arguments[0];
    //   startX = evt.x || evt.clientX;
    //   startY = evt.y || evt.clientY;
    //   selDiv = document.createElement("div");
    //   topY = document.documentElement.scrollTop;//文档滚动条高度
    //   leftX = document.documentElement.scrollLeft;//相对容器横向滚动长度
    //   startX = startX + leftX;
    //   startY = startY + topY;
    //   selDiv.id = "selectDiv";
    //   selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
    //   document.body.appendChild(selDiv);
    //   selDiv.style.left = startX + "px";
    //   selDiv.style.top = startY + "px";
    //   console.log("鼠标起始位置x :" + startX + " y:" + startY);
    //   //debugger
    //   _x = null;
    //   _y = null;
    //   clearEventBubble(evt);
    // };
    // document.onmousemove = function() {
    //     evt = window.event || arguments[0];
    //     if (isSelect) {
    //       if (selDiv.style.display == "none")selDiv.style.display = "";
    //       _x = evt.x || evt.clientX;
    //       _y = evt.y || evt.clientY;

    //       _x = _x + leftX;
    //       _y = _y + topY;
    //       selDiv.style.left = Math.min(_x, startX) + "px";
    //       selDiv.style.top = Math.min(_y, startY) + "px";
    //       selDiv.style.width = Math.abs(_x - startX) + "px";
    //       selDiv.style.height = Math.abs(_y - startY) + "px";

    //       //计算滚动条
    //       let __y = _y - document.body.offsetHeight;
    //       if( _x >= document.body.offsetWidth ){
    //         container.scrollLeft += 30;
    //       }else if( _x < 350 ){//侧边导航宽度200 
    //         container.scrollLeft -= 30;
    //       }
    //       if( __y > 0){
    //         if( document.body.scrollTop){
    //           document.body.scrollTop = __y;
    //         }
    //         else{
    //           document.documentElement.scrollTop = __y;
    //         }
    //       }
    //       // ---------------- 关键算法 ---------------------
    //       let _l = selDiv.offsetLeft - containerLeft + container.scrollLeft, _t = selDiv.offsetTop - containerTop - headerHeight; //selDiv 相对 container 位置
    //       let _w = selDiv.offsetWidth, _h = selDiv.offsetHeight; //selDiv  框 高
    //       for (let sel of selList) {
    //         let sl = sel.offsetWidth + sel.offsetLeft;
    //         let st = sel.offsetHeight + sel.offsetTop;
    //         if (sl > _l && st > _t && sel.offsetLeft < _l + _w && sel.offsetTop < _t + _h) {
    //           if (!sel.className.includes("seled")){
    //             let tag = sel.querySelector('.tag');
    //             if(tag && tag.getAttribute('index')!=0){//不选择第一列
    //               sel.className = sel.className + " seled";
    //             }
    //           } 
    //         } else {
    //           //当出现滚动条 已经被选中的不取消  处理滚动过程已经选中 再滚动后 不在选区范围内 导致被取消
    //           if( container.scrollLeft > 0 ){
    //              console.log(container.scrollLeft)
    //              if (!sel.className.includes("seled")) sel.className = "data_td";
    //           }
    //           else
    //             if (sel.className.includes("seled")) sel.className = "data_td";
    //         }
    //       }
    //     }
    //     clearEventBubble(evt);
    //   };
    //   document.onmouseup = function(e) {
    //     isSelect = false;
    //     if (selDiv)document.body.removeChild(selDiv);
    //     selList = null,_x = null,_y = null,selDiv = null,startX = null,startY = null,evt = null;

    //   let diff = getDateDiff(mousedown_up_starttime, new Date());
    //   console.log('鼠标按下到弹起经过时间：'+diff + "e: "+ e.target);
    //   let elmsNum = [].slice.call(container.querySelectorAll(".seled"));
    //   // console.log(elmsNum.length + '------');
    //   if(elmsNum.length > 1 ){
    //     // that.$message('请选择')
    //     // [].slice.call(container.querySelectorAll(".seled")).forEach(function(element) {
    //     //   element.classList.remove("seled");
    //     // });
    //      return;
    //   };
    //   if (diff < 200 && elmsNum.length < 1) {
    //     let target = e.target;
    //     if (target.className.includes("data_td")) {
    //       target = target.querySelector(".tag");
    //     } else if (target.className.includes("cell")) {
    //       target = target.querySelector(".tag");
    //     }
    //     if (target && target.className.includes("tag")) {
    //        that.clickTableFn(target)
    //     }
    //   }else {
    //     let elements = [].slice.call(container.querySelectorAll(".seled"));
    //     let target = e.target;
    //     if (elements.length == 0){
    //         if (target.className.includes("data_td")) {
    //           target = target.querySelector(".tag");
    //         } else if (target.className.includes("cell")) {
    //           target = target.querySelector(".tag");
    //         }
    //         if (target && target.className.includes("tag")) {
    //           that.clickTableFn(target);
    //         }else {
    //           return;
    //         }
    //     }else{
    //        that.dragTableFn(elements);
    //     }
    //   }
    //   [].slice.call(container.querySelectorAll(".seled")).forEach(function(element) {
    //     element.classList.remove("seled");
    //   });
    // };
    // function getOffsetTop(obj) {
    //   let top = obj.offsetTop;
    //   let left = obj.offsetLeft;
    //   let val = obj.offsetParent;
    //   while (val != null) {
    //     top += val.offsetTop;
    //     left += val.offsetLeft;
    //     val = val.offsetParent;
    //   }
    //   return { containerTop: top, containerLeft: left };
    // }
    // function clearEventBubble(evt) {
    //   if (evt.stopPropagation) evt.stopPropagation();
    //   else evt.cancelBubble = true;
    //   if (evt.preventDefault) evt.preventDefault();
    //   else evt.returnValue = false;
    // }

    // function getDateDiff(start, end) {
    //   if (!start || !end) return 0;
    //   let diff = end.getTime() - start.getTime(); //相差毫秒数
    //   return diff;
    // }
  },
  // destroyed() {
  //   document.onmousedown = null;
  //   document.onmousemove = null;
  //   document.onmouseup = null;
  // }
};
</script>

<style>
.el-table {
  cursor: default !important;
}

::selection {
  background-color: none;
}
::-moz-selection {
  background-color: none;
}
::-webkit-selection {
  background-color: none;
}
.form-input {
  width: 200px;
}
.seled {
  background-color: #d6dff7 !important;
}
</style>