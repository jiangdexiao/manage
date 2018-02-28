<template>
  <div class="abstract_right_box">
        <div class="bg_c1">
            <p class="top_text"><span class="text_red">{{countOfApr}}条</span><span>待审核广告位变更请求</span></p>
            <div class="item_sty1 bg_c2">
                <p class="tit_sty1 bg_c3 border_r1">本月签约媒体</p>
                <p class="num_sty1">{{countOfNewMedia}}&nbsp;<span>个</span></p>
            </div>
            <div class="item_sty1 bg_c4">
                <p class="tit_sty1 bg_c5 border_r1">本月新增备案</p>
                <p class="num_sty1">{{recordNum}}&nbsp;<span>个</span></p>
            </div>
        </div>
        <div class="project-list ">
            <div class="p_item">
                <p class="tit_sty1 bg_c6 font_c1">媒体信息</p>
                <div class="p_con_box">
                    <div class="w50 fl">
                        <p class="p_text bg_c7">媒体</p>
                        <p class="text_num">{{countOfMedia}}<span>个</span></p>
                    </div>
                    <div class="w50 fr">
                        <p class="p_text bg_c8">广告位</p>
                        <p class="text_num">{{countOfMres}}<span>个</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-list pad0">
            <div class="p_item">
                <p class="tit_sty1 bg_c6 font_c1">我的信息</p>
                <div class="p_con_box">
                    <div class="w50 fl">
                        <p class="p_text bg_c9">本月提成</p>
                        <p class="text_num text_c"><span>￥</span>&nbsp;{{curMonthAmount}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
   data() {
        return {
            operateBdId: '',
            token: sessionStorage.getItem('access_token'),
            //本月待审核
            countOfApr:'',
            //本月签约媒体
            countOfNewMedia: '',
            //本月新增备案
            recordNum: '',
            //媒体信息
            countOfMedia: '',
            //广告数量
            countOfMres: '' ,
            //本月提成
            curMonthAmount: '',
        }
    },
    methods: {
        getDataInfo () {
            let that = this ;
            //获取媒体信息
            this.api_mediaManagePlatform_staff({data:{bdStaffId: 0}}).then(result=>{
              that.countOfMedia = result.content.countOfMedia;
              that.countOfMres = result.content.countOfMres;
              that.countOfApr = result.content.countOfApr;
              that.countOfNewMedia = result.content.countOfNewMedia;
            })
            //获取当月时间
            let date_ = new Date();    
            let year = date_.getFullYear();    
            let month = date_.getMonth() + 1;    
            let firstdate = year + '-' + month + '-01 00:00:00'; 
            let day = new Date(year,month,0); 
            let lastdate = year + '-' + month + '-' + day.getDate() + ' 23:59:59';   
            //获取备案数量  increment
            this.api_mediaManagePlatform_increment({data:{
                    token: that.token,
                    startTime: firstdate,
                    endTime: lastdate
                }}).then(res=>{
                  that.recordNum = res.content;
            })
            //本月提成 
            this.api_mediaManagePlatform_curMonthAmount({data:{systemAccessToken: that.token}}).then(result=>{
                that.curMonthAmount = this.tool.str.twoDecimal(result.content,4);
            }) 
        }
    },
    mounted() {
        this.getDataInfo()
    }
}
</script>

<style lang="scss" scoped>
.abstract_right_box{
    position: relative;
 @import '../../../../static/css/abstract.css';
}
</style>

