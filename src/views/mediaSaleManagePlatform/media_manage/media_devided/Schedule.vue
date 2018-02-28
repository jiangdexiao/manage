<template>
	<!--列表-->
    <section class="section">
        <el-table ref="data_table" border :data="rows" style="width: 100%" @cell-mouse-enter="mouserEnter"  cell-class-name ="data_td" element-loading-text="加载中..." :height="height" >
            <el-table-column align="center" fixed v-for="(col,i) in columns" :key="i" :prop="col.id" :label="col.name" v-if="i === 0" width="150">
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
    </section>
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
        height:500 //table高度
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
      this.params = Object.assign({},params);
      if( this.pagination.ispage ){
        this.params.pageNumber = this.current
        this.params.rows = this.pageSize
      }
      this.api_mediaManagePlatform_adScheduleList({ data:this.params }).then(res=>{
          this.rows = []
          this.columns = []
          this.total = res.totalCount
          this.parseData(res)
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
      this.page.pageSize = val;
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
    that.height = document.documentElement.clientHeight -toolbarHeight - paginationHeight - menuHeight;//计算table高度
    let container = document.querySelector(".el-table__body-wrapper");
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
      document.onmouseup = function(e) {
        isSelect = false;
        if (selDiv)document.body.removeChild(selDiv);
        selList = null,_x = null,_y = null,selDiv = null,startX = null,startY = null,evt = null;

        let diff = getDateDiff(mousedown_up_starttime,new Date());
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
              that.openDialog(that.columns[_index].name,that.columns[_index].name,_mresid,[_val]);
            }
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