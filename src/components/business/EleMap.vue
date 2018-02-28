<template>
  <!-- 位置标注 -->
      <div class="frame frame_map">
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="search_params">
                <el-form-item>
                    <el-input  placeholder="输入地点" v-model="search_params.search_adress" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click='search' >搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24">
            <div class="map" :id="mapId"></div>
            <span>标注信息: {{ getAdress }}</span>
        </el-col>
        <el-col :span="24" class='footbar' style='text-align:center;' v-show="isEdit!==false">
            <el-button  type="primary" @click="save">保存</el-button>
            <el-button  type="default" @click="cancel">取消</el-button>
        </el-col>
    </div>
</template>
<script>
export default {
  data(){
      return{
        search_params:{
            search_adress:''
        },
        mark_adress:'',
        mark_longitude:'',
        mark_latitude:'',
        local:'',
        mapId:`map_`+new Date().getTime()
      }
  },
  props:['adress','longitude','latitude','isShow','option','isEdit'],
  computed:{
      getAdress(){
          return this.mark_adress+' '+ this.mark_longitude+' '+ this.mark_latitude
      }
  },
  methods:{
      save(){
        if( !this.mark_longitude && !this.mark_latitude && !this.mark_adress ){
            return
        }
        /* 标记经纬度和地址*/
        this.onSuccess({adress:this.mark_adress,longitude:this.mark_longitude,latitude:this.mark_latitude,option:this.option})
      },
      cancel(){
        this.$emit('cancel')
        this.search_params.search_adress=''
      },
      search(){
          if( this.local )
            this.local.search(this.search_params.search_adress);
      },
      onSuccess(mapObj){
          this.search_params.search_adress=''
          this.$emit('onSuccess',mapObj)
      },
      init() {
        // 百度地图API功能
        document.getElementById(this.mapId).style.height = document.querySelector(".frame_map").offsetHeight 
        - document.querySelector('.toolbar').offsetHeight 
        - document.querySelector('.footbar').offsetHeight - 20 +'px';
        let _this = this
        let BMap = window.BMap
        this.map = new BMap.Map(this.mapId)
        let point = new BMap.Point(116.331398, 39.897445);
        let gc = new BMap.Geocoder();
        this.map.centerAndZoom(point, 12);
        this.map.enableScrollWheelZoom(true); // 开启缩放

        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
                let mk = new BMap.Marker(r.point);
                _this.map.addOverlay(mk);
                _this.map.panTo(r.point);
            } else {
                console.log(' getStatus failed ')
            }
            },{ enableHighAccuracy: true }
        );
        // 搜索事件
        _this.local = new BMap.LocalSearch(_this.map, {
            renderOptions: { map: _this.map }
        });

        // 地图点击事件
        _this.map.addEventListener("click", function(e){
            let pt = e.point
            gc.getLocation(pt, function(rs) {
            let addComp = rs.addressComponents;
            let address =`${addComp.province} ${addComp.city} ${addComp.district} ${addComp.street} ${addComp.streetNumber}`
            if( rs.surroundingPois.length > 0){
                address += ` ${rs.surroundingPois[0].title}`
            }
            _this.mark_adress = address 
            _this.mark_longitude = pt.lng
            _this.mark_latitude = pt.lat
            })
            
            _this.map.clearOverlays();// 点击后将箭头移过去,并且创建标注
            let marker = new BMap.Marker(pt); // 创建标注
            _this.map.addOverlay(marker); // 将标注添加到地图中
            _this.map.panTo(pt);
        });
        this.addOverlay()
    },
    addOverlay(){
        if( this.longitude && this.latitude){
            let BMap = window.BMap;
            this.mark_adress = this.adress
            this.mark_longitude = this.longitude 
            this.mark_latitude = this.latitude
            setTimeout(() => {
                let point = new BMap.Point(this.longitude,this.latitude);
                this.map.clearOverlays();
                let marker = new BMap.Marker(point); // 创建标注
                this.map.addOverlay(marker); // 将标注添加到地图中
                this.map.panTo(point);
                this.map.panTo(point);
            }, 100);
            
        }else{
            this.mark_latitude = '';
            this.mark_longitude = '';
            this.mark_adress = '';
        }
    }

  },
  watch:{
      isShow(v){
          if( v === true ){
            if( this.map ){
                  this.addOverlay()
            }
          }
      }
  },
  mounted(){
     this.init()
  }
}
</script>
<style scope lang='scss'> 
  .frame {
    width: 98%;
  }
  .frame_map {
    padding:0px 0px 0px 5px;
  }
  .map {
    height:450px;
  }
</style>