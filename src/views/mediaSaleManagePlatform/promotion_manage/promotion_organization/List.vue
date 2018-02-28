<template>
    <div class="framework">
        <!-- 底部国家区域 -->
        <div class="largearea">
            <div class="currency">
                <div class="currency_box">
                    <div class="C_title">国家</div>
                    <ul class="C_uli">
                        <li class="country_bgc" :index="i" :class="{sel_bgColor: i===isShowbg.a  , red_bgColor: 'a'+i==selectedItem }" v-for="(item,i) in search_country" :key="i" :value="item.orgId" @click="switch_countries">{{item.orgName}}</li>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <div class="currency_box">
                    <div class="C_title">大区</div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.b  , red_bgColor: 'b'+i==selectedItem }" v-for="(item,i) in search_largearea" :key="i" :value="item.orgId"  @click="Switching_large_area">{{item.orgName}}</li>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <div class="currency_box">
                    <div class="C_title">城市</div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.c  , red_bgColor: 'c'+i==selectedItem }" v-for="(item,i) in search_city" :key="i" :value="item.orgId"  @click="switching_city">{{item.orgName}}</li>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <div class="currency_box">
                    <div class="C_title">区域</div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.d  , red_bgColor: 'd'+i==selectedItem }" v-for="(item,i) in search_region" :key="i" :value="item.orgId"  @click="switching_region">{{item.orgName}}</li>
                    </ul>
                </div>
            </div>
            <div class="currency">
                <div class="currency_box">
                    <div class="C_title">BDM</div>
                    <ul class="C_uli">
                        <li :index="i" :class="{sel_bgColor: i===isShowbg.e  , red_bgColor: 'e'+i==selectedItem }" v-for="(item,i) in search_bom" :key="i" @click="switching_bom">{{item.orgName}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      // 获取国家数据
      search_country: [],
      // 获取大区数据
      search_largearea: [],
      // 获取城市数据
      search_city: [],
      // 获取区域数据
      search_region: [],
      // 获取BDM数据
      search_bom: [],
      isShowbg: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0
      },
      selectedItem:'',
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    // 获取国家数据
    get_country_data () {
      this.api_common_bdorg({ data:{orgLevel: 0,parentOrgId: 0,operateBdId: this.getUser.bd.bdId }}).then(result=>{
        this.search_country = result.content
        if(!result.content.length){ return }
        // 默认获取大区数据
        this.api_common_bdorg({data:{orgLevel: 1,parentOrgId: result.content[0].orgId,operateBdId: this.getUser.bd.bdId }  }).then(result=>{
          this.search_largearea = result.content
          if(!result.content.length){ return }
          // 默认获取城市数据
          this.api_common_bdorg({data:{orgLevel: 2,parentOrgId: result.content[0].orgId,operateBdId: this.getUser.bd.bdId }  }).then(result=>{
            this.search_city = result.content
            if(!result.content.length){ return }
             // 默认获取区域数据
             this.api_common_bdorg({data:{orgLevel: 3,parentOrgId: result.content[0].orgId,operateBdId: this.getUser.bd.bdId }  }).then(result=>{
                this.search_region = result.content
                if(!result.content.length){ return }
                // 默认获取乡镇数据
                this.api_common_bdorg({data:{orgLevel: 4,parentOrgId: result.content[0].orgId,operateBdId: this.getUser.bd.bdId }  }).then(result=>{
                  this.search_bom = result.content
                  if(!result.content.length){ return }
                  // 默认获取乡镇数据
                })
              })
          })
        })
      })
    },
    // 默认触发国家事件 获取大区的内容
    switch_countries (event) {
      let that = this;
      let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
      that.isShowbg.a= parseInt(selindex) ; that.isShowbg.b= '';  that.isShowbg.c= ''; that.isShowbg.d= ''; that.isShowbg.e= '';
      that.selectedItem = 'a'+selindex;
      // 清空其他数据
      that.search_city= [];
      that.search_region= [];
      that.search_bom=[];
      this.api_common_bdorg({data: {
          orgLevel: 1,
          parentOrgId: value,
          operateBdId: this.getUser.bd.bdId
        }}).then(result=>{
          this.search_largearea = result.content
        })
    },
    // 触发大区事件 获取城市内容
    Switching_large_area () {
      let that = this
      let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
      that.isShowbg.b= parseInt(selindex) ; that.isShowbg.c= ''; that.isShowbg.d= ''; that.isShowbg.e= '';
      that.selectedItem = 'b'+selindex;
      // 清空其他数据
      that.search_region= [];
      that.search_bom=[];
      this.api_common_bdorg({data: {
          orgLevel: 2,
          parentOrgId: value,
          operateBdId: this.getUser.bd.bdId
        }}).then(result=>{
          this.search_city = result.content
        })
    },
    switching_city () {
      let that = this
      let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
      that.isShowbg.c= parseInt(selindex) ; that.isShowbg.d= ''; that.isShowbg.e= '';
      that.selectedItem = 'c'+selindex;
      // 清空其他数据
      that.search_bom=[];
      this.api_common_bdorg({data: {
          orgLevel: 3,
          parentOrgId: value,
          operateBdId: this.getUser.bd.bdId
        }}).then(result=>{
          this.search_region = result.content
        })
    },
    switching_region () {
      let that = this
      let value = event.target.getAttribute('value'), selindex = event.target.getAttribute('index');
      that.isShowbg.d= parseInt(selindex) ; that.isShowbg.e= '';
      that.selectedItem = 'd'+selindex;
      this.api_common_bdorg({data: {
          orgLevel: 4,
          parentOrgId: value,
          operateBdId: this.getUser.bd.bdId
        }}).then(result=>{
          this.search_bom = result.content
        })
    },
    //点击BOM 改变背景色
    switching_bom(event) {
        let that = this;
        let selindex = event.target.getAttribute('index');
        that.isShowbg.e= parseInt(selindex); 
        that.selectedItem = 'e'+selindex;
    },
  },
  mounted () {
    let that = this
    // 获取国家数据
    that.get_country_data()
  }
}
</script>

<style lang="scss" scoped>
.framework {
    display: inline-block;
    background: #fff;
    padding: 0 20px;
    width: 100%;
    min-height: 700px;
    margin-top: 15px;
    .sel_bgColor {
        background: #ecf5ff !important;
        color: #409EFF;
    }
    .red_bgColor {
        background: #ff6969 !important;
        color: #fff;
    }
    .largearea {
       margin-top: 30px;
        .currency {
            float: left;
            margin: 20px 40px 20px 0;
            span {
                font-size: 16px;
            }
            .currency_box {
                position: relative;
                width: 180px;
                height: 220px;
                border: 1px solid #bad4f7;
                overflow-x: hidden;
                .C_title {
                    position: absolute;
                    font-size: 16px;
                    height: 40px;
                    line-height: 40px;
                    width: 100%;
                    background-color: #DFE9F6;
                    text-align: center;
                }
                .C_uli {
                    position: absolute;
                    top: 41px;
                    width: 100%;
                    li {
                        background-color: white;
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        margin-bottom: 1px;
                        cursor: pointer;
                        padding: 0 0 0 10px;
                        font-size:14px;
                    }
                }
            }
        }
    }
}
</style>

