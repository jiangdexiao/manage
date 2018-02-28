<template>
	<!--列表-->
    <div class="section">
        <el-table ref="data_table" border :data="rows" :style="tabSty" @cell-mouse-enter="mouserEnter"  cell-class-name ="data_td" element-loading-text="加载中...">
            <el-table-column align="center" v-for="(col,i) in columns" :key="i" :prop="col.id" :label="col.name" v-if="i === 0" width="150">
              <template slot-scope="scope">
                <span>{{ getItemName(scope,i) }}</span>
              </template>
            </el-table-column>
            <el-table-column  v-else  align="center"  :key="i" :prop="col.id" :label="col.name" width="150"  >
              <template slot-scope="scope">
                  <div class="tag" :index="i" :mresid="getItemMresId(scope,i)" :value="getItemValue(scope,i)" >{{ getItemName(scope,i)}}</div>
              </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="page"  v-if="pagination.ispage">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="current"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              style="float:left;">
          </el-pagination>
        </el-col>
    </div>
</template>

<script>

export default {
  data() {
    return {
        current:1,
        pageSize:10,
        pageSizes:[10, 20, 30, 40],
        total:0,
        rows:[],
        columns:[],
        params:null,
        height:500, //table高度
        tabSty:{
          width: '100%',
          height:'',
        }
    }
  },
  computed:{

  },
  props: ["pagination","url"], //接收父组件传递的数据
  methods: {
    getItemName(scope,i){
      return scope.row.cols[i].name;
    },
    getItemMresId(scope,i){
      return scope.row.mresId;
    },
    getItemValue(scope,i){
      return scope.row.cols[i].id;
    },

    initData(params){
      let that = this;
      that.params = Object.assign({},params);
      if( this.pagination.ispage ){
        that.params.pageNumber = this.current;
        that.params.rows = this.pageSize;
      }
      this.api_mediaManagePlatform_adScheduleList({ data: this.params }).then(data=>{
          that.rows = [];
          that.columns = [];
          that.total = data.totalCount;
          if (data.status != 200 || data.content.length == 0) return;
          if( that.methods && that.methods.parseData ){
            that.methods.parseData(data);
          }else{
            that.parseData(data);
          }
      })
    },
    parseData(data){
      let that = this, hasColumns = false;
      for(let [rowIndex,rowItem] of data.content.entries()){
        if( rowItem.jsonMap && rowItem.jsonMap.length>0){
          let row = {cols:[],mresId:''};
          for(let [columnIndex,columnItem] of rowItem.jsonMap.entries()){
            if(columnIndex === 0){
              row.cols.push({id:'',name:'['+rowItem.cateName+']'+ '['+rowItem.mresName + '][' +rowItem.mediaName +']'});
              row.mresId = rowItem.mresId;
              if( !hasColumns )that.columns.push({id: "col"+columnIndex , name:'' });
            }
            var goodsname = "";
            if(columnItem.dealerName != undefined){
               goodsname='['+columnItem.goodsName+']['+columnItem.dealerName+']';
            }
            row.cols.push({id:columnItem.goodsId,name:goodsname});
            if( !hasColumns )that.columns.push({id: "col"+ (++columnIndex),name: columnItem.day});
          }
          that.rows.push(row);
          hasColumns = true
          row = null;
        }
      }
    },
    /****
     * 分页
     */
    handleSizeChange(val){
      //修改每页条数
      this.pageSize = val;
      this.current = 1;
      this.initData(this.params);
      // console.log("修改每页条数:"+val)
    },
    handleCurrentChange(val){
      //修改当前页码
      this.current = val;
      this.initData(this.params);
      // console.log("修改当前页码:"+val)
    },
    mouserEnter(row, column, cell, event) {
      let p = cell.parentNode;
      var chils = p.childNodes;
      for (let c of chils) {
        c.style.backgroundColor = "transparent";
      }
    },
    openDialog(startTime,endTime,mresid,ids){
      this.$emit('openEditDialogListener',startTime,endTime,mresid,ids);
    }
  },
  mounted() {
    let that = this;
    let mousedown_up_starttime = 0;//鼠标按下到弹起的时间 超过 300 ms 默认为拖动操作
    const menuHeight = 125;
    let toolbarHeight = document.querySelector('.toolbar').offsetHeight;
    const paginationHeight = document.querySelector('.page').offsetHeight;
    that.tabSty.height = document.documentElement.clientHeight -toolbarHeight - paginationHeight - menuHeight +'px';//计算table高度
    let container = document.querySelector(".el-table__body-wrapper");
    container.style.height= parseFloat(that.tabSty.height)-40 + 'px';
    let { containerLeft, containerTop } = getOffsetTop(container); //container相对于window 位置
    let evt,startX,startY,selDiv,isSelect,_x,_y,selList,headerHeight,topY,leftX;

     //原始滚动条坐标
    let containerLeft_window = 0 ,containerTop_window=0;
    const addScrollWidth = 30 , addScrollHeight = 20;//x y 滚动增量
    let cWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let cHeight = document.documentElement.clientHeight || document.body.clientHeight;
    container.onmousedown = function() {
      containerLeft_window = container.scrollLeft;
      containerTop_window = container.scrollTop;
      mousedown_up_starttime = new Date();
      headerHeight = document.querySelector(".el-table__header-wrapper").offsetHeight;
      selList = [];
      let fileNodes = document.getElementsByTagName("td");
      for (let node of fileNodes) {
        if (node.className.includes('data_td')) {
          node.className = 'data_td';
          selList.push(node);
        }
      }
      isSelect = true;
      evt = window.event || arguments[0];
      topY = document.documentElement.scrollTop;//文档滚动条高度
      leftX = document.documentElement.scrollLeft;//相对容器横向滚动长度
      startX = (evt.x || evt.clientX)+leftX;
      startY = (evt.y || evt.clientY)+topY;
      selDiv = document.createElement("div");
      selDiv.id = "selectDiv";
      selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
      document.body.appendChild(selDiv);
      selDiv.style.left = startX + "px";
      selDiv.style.top = startY + "px";
      // console.log("鼠标起始位置x :" + startX + " y:" + startY);
      _x = null;
      _y = null;
      clearEventBubble(evt);
    };
    document.onmousemove = function(e) {
        evt = window.event || arguments[0];
        if (isSelect) {
          if (selDiv.style.display == "none")selDiv.style.display = "";
          _x = (evt.x || evt.clientX)+leftX;
          _y = (evt.y || evt.clientY)+topY;
          let _minX = Math.min(_x, startX);
          let _minY = Math.min(_y, startY);
          let _absX = Math.abs(_x - startX);
          let _absY = Math.abs(_y - startY);

          let diffScrollWidth = Math.abs(container.scrollLeft - containerLeft_window);//滚动过的长度
          let diffScrollHeight =  Math.abs(container.scrollTop - containerTop_window);//滚动过的高度
          if( _x >= cWidth-10 ){
            container.scrollLeft += addScrollWidth;
            selDiv.style.left = _minX - diffScrollWidth  + "px";
            selDiv.style.width = _absX + diffScrollWidth + "px";
          }else if( _x < 350 ){
            container.scrollLeft -= addScrollWidth;
            selDiv.style.left = _minX + diffScrollWidth + 'px';
            selDiv.style.width = _absX + diffScrollWidth + 'px';
          }
          else{
            selDiv.style.left = _minX + "px";
            selDiv.style.width =_absX + "px";
          }
          if( _y >= cHeight ){
            container.scrollTop += addScrollHeight;
            selDiv.style.top = _minY - diffScrollHeight + "px";
            selDiv.style.height = _absY +  diffScrollHeight + "px";

          }else if( _y < toolbarHeight + 120 ){
            container.scrollTop += addScrollHeight;
            selDiv.style.top = _minY + diffScrollHeight + 'px';
            selDiv.style.height = _absY + diffScrollHeight + 'px';
          }
          else{
            selDiv.style.top = _minY + "px";
            selDiv.style.height = _absY + "px";
          }

          //计算滚动条
          // if( _x >= document.body.offsetWidth ){
          //   container.scrollLeft += 30;
          // }else if( _x < 350 ){//侧边导航宽度200
          //   container.scrollLeft -= 30;
          // }
          // let cHeight = document.documentElement.clientHeight || document.body.clientHeight;
          // // console.log(" _y:"+ _y +" clientHeight: "+  cHeight+ " offsetHeight:"+ document.body.offsetHeight +" clientY: "+ e.clientY +" scrollHeight:"+ document.documentElement.scrollHeight + " selDiv-top:"+selDiv.style.top)
          // if( _y > document.documentElement.clientHeight){
          //   container.scrollTop += 20;
          // }else if(_y < toolbarHeight + 120){
          //   container.scrollTop -=20;
          // }
          // ---------------- 关键算法 ---------------------
          let _l = selDiv.offsetLeft - containerLeft + container.scrollLeft , _t = selDiv.offsetTop - containerTop - headerHeight+ container.scrollTop ; //selDiv 相对 container 位置
          let _w = selDiv.offsetWidth, _h = selDiv.offsetHeight; //selDiv  框 高
          for (let sel of selList) {
            let sl = sel.offsetWidth + sel.offsetLeft;
            let st = sel.offsetHeight + sel.offsetTop;
            if (sl > _l && st > _t && sel.offsetLeft < _l + _w  && sel.offsetTop < _t + _h) {
              if (!sel.className.includes("seled")){
                let tag = sel.querySelector('.tag');
                if(tag && tag.getAttribute('index')!=0){//不选择第一列
                  sel.className = sel.className + " seled";
                }
              }
            } else {
              //当出现滚动条 已经被选中的不取消  处理滚动过程已经选中 再滚动后 不在选区范围内 导致被取消
              // if( container.scrollLeft > 0 ){
              //   //  console.log(container.scrollLeft)
              //    if (!sel.className.includes("seled")) sel.className = "data_td";
              // }
              // else
                if (sel.className.includes("seled")) sel.className = "data_td";
            }
          }
        }
        clearEventBubble(evt);
      };
      document.onmouseup = function(e) {
        isSelect = false;
        if (selDiv)document.body.removeChild(selDiv);
        selList = null,_x = null,_y = null,selDiv = null,startX = null,startY = null,evt = null;

        let diff = getDateDiff(mousedown_up_starttime,new Date());
        // console.log('鼠标按下到弹起经过时间：'+diff + "e: "+ e.target)
        if( diff <= 200 ){
            let target = e.target;
            if( target.className.includes('data_td')){
              target = target.querySelector('.tag');
            }else if( target.className.includes('cell')){
              target = target.querySelector('.tag');
            }
            if( target && target.className.includes('tag')){
              let _val = target.getAttribute("value");//获取
              let _index = target.getAttribute('index');
              let _mresid = target.getAttribute('mresid');
              // console.log('当前点击项目 value='+_val +" index="+ _index + " mresid=" + _mresid)
              that.openDialog(that.columns[_index].name,that.columns[_index].name,_mresid,[_val]);
            }
        }else{
           let elements = [].slice.call(container.querySelectorAll('.seled'));
           if(elements.length==0)return;
           //判断数组是否有不相同元素
           let array = [],indexArray=[],mresIdArray=[],isRepeat = false;
           elements.forEach(function(element) {
              let target = element.querySelector('.tag');
              if( !target )return;
               let _val = target.getAttribute('value');
               let _index = target.getAttribute('index');
               let _mresid = target.getAttribute('mresid');
              //  console.log("多行index:"+_index);
               if( _mresid && mresIdArray.indexOf(_mresid) < 0)mresIdArray.push(_mresid);
               if( array.indexOf(_val) < 0 )array.push(_val);
               if( _index && indexArray.indexOf(_index) < 0)indexArray.push(_index);
           });
           //判断是否重复 如果array数组length>1 则有不同单元格内容
           if(array.length > 1){
               that.$message({type:'error',message:'请选择相同的进行编辑'});
           }else{
              if( indexArray.length == 0) return;
               let _max =  Math.max.apply(null, indexArray);
               let _min =  Math.min.apply(null, indexArray);
               console.log('_max:'+_max +" - "+ that.columns[_min]+" _min:"+_min +" - "+that.columns[_max])
               that.openDialog(that.columns[_min].name,that.columns[_max].name,mresIdArray.join(','),array);
           }
           [].slice.call(container.querySelectorAll('.seled')).forEach(function(element) {
               element.classList.remove('seled');
           });
        }
      };
    function getOffsetTop(obj) {
      let top = obj.offsetTop;
      let left = obj.offsetLeft;
      let val = obj.offsetParent;
      while (val != null) {
        top += val.offsetTop;
        left += val.offsetLeft;
        val = val.offsetParent;
      }
      return { containerTop: top, containerLeft: left };
    }
    function clearEventBubble(evt) {
      if (evt.stopPropagation) evt.stopPropagation();
      else evt.cancelBubble = true;
      if (evt.preventDefault) evt.preventDefault();
      else evt.returnValue = false;
    }

    function getDateDiff(start,end){
      if( !start || !end )return 0;
      let diff=(end.getTime()-start.getTime());   //相差毫秒数
      return diff;
    }
  },
  destroyed() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
  }
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
