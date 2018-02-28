<template>
  <div class="client_search">
    <div class="client_search_content">
      <div class="client_search_top">
        <div class="public_span">搜索引导文字设置</div>
        <input type="text" placeholder="请输入引导文字" v-model="guideWords">
      </div>
      <div class="client_search_middle">
        <div class="public_span" style="margin:0px;">热门搜索设置</div>
        <div style="color: #777777;font-size:14px;">
          <div :class='["public_button",click_style_random?"click_button":""]' @click="click_button_style('random')">随机展示<div :class="{click_button_show:click_style_random}"><div class="triangle-right"></div></div></div>{{click_style_random?'将从商品品类、商家关键词中随机挑选12个展示于客户端，3天更新一次。':''}}
        </div>
        <div style="color: #777777;font-size:14px;">
          <div :class='["public_button",click_style_hand?"click_button":""]' @click="click_button_style('hand')">手动添加<div :class="{click_button_show:click_style_hand}"><div class="triangle-right"></div></div></div>{{click_style_hand?'手动选择关键词入库，最多选择30个，随机展示12个于客户端。':''}}
        </div>
        <div style="color: #777777;font-size:14px;">
          <div :class='["public_button",click_style_all?"click_button":""]' @click="click_button_style('all')">手动+随机<div :class="{click_button_show:click_style_all}"><div class="triangle-right"></div></div></div>{{click_style_all?'手动选择关键词，最多5个，手动关键词将于随机关键词之前展示':''}} 
        </div>
        <div class="client_search_top50_hand" :style="click_style_hand?'display:block':'display:none'">
          <p>关键词TOP50</p>
          <button @click="click_keywords_top50(search_keywords_top50[index])" :id="'set_hotwords_hand'+index" class="public_keyWords" v-for="(cell,index) in search_keywords_top50" :value="cell" :key="index">{{cell}}</button>
        </div>
        <div class="client_search_top50_all" :style="click_style_all?'display:block':'display:none'">
          <p>关键词TOP50</p>
          <button @click="click_keywords_top50(search_keywords_top50[index])" :id="'set_hotwords_all'+index" class="public_keyWords" v-for="(cell,index) in search_keywords_top50" :value="cell" :key="index">{{cell}}</button>
        </div>
      </div>
      <button class="submit_button" style="background:#11D2EB;" @click="submit_top50_keywords">确认</button>
      <button class="submit_button" style="background:#B7C9E1;" path="/m/clientFunManage" @click="goto">返回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      // 点击控制样式标识
      click_style_random: '',
      click_style_hand: '',
      click_style_all: '',
      // 获取到的top50关键词列表
      search_keywords_top50: [],
      // 选中的关键字猎豹
      select_keywords_top50: [],
      // 引导词
      guideWords: '',
      // 搜索方式
      searchWay: '',
      toggle_searchWay: 'random'
    }
  },
  watch: {
  },
  methods: {
    goto (event) {
      // alert(1)
      let that = this
      let path = event.target.getAttribute('path')
      if (!path) return
      if (that.active_path === path) {
        that.$router.go(0)
        return
      }
      that.$router.push({path: path})
    },
    // 点击展示方式选中样式
    click_button_style (toggle) {
      this.toggle_searchWay = toggle
      if (toggle === 'random') {
        this.click_style_random = true
        this.click_style_hand = false
        this.click_style_all = false
        this.searchWay = 0
      } else if (toggle === 'hand') {
        this.click_style_random = false
        this.click_style_hand = true
        this.click_style_all = false
        this.searchWay = 1
      } else if (toggle === 'all') {
        this.click_style_random = false
        this.click_style_hand = false
        this.click_style_all = true
        this.searchWay = 2
      }
    },
    // 点击关键词添加样式
    click_keywords_top50 (content) {
      console.log(content)
      let that = this
      console.log($('.click_keyWords'))
      if ($(event.target).hasClass('click_keyWords')) {
        $(event.target).removeClass('click_keyWords')
      } else {
        if (that.click_style_hand && $('.client_search_top50_hand .click_keyWords').length === 30) {
          that.$message({ type: "warning", message: "最多选择30个" })
          return
        }
        if (that.click_style_all && $('.client_search_top50_all .click_keyWords').length === 5) {
          that.$message({ type: "warning", message: "最多选择5个" })
        return
      }
        $(event.target).addClass('click_keyWords')
      }
    },
    // 给设置的关键词添加样式
    // set_select_keyword () {
    // },
    // 设置关键词提交
    submit_top50_keywords () {
      // 获取选中状态的关键词内容
      let that = this
      that.select_keywords_top50 = []
      $('.click_keyWords')
      if (that.click_style_hand) {
        let arr = $('.client_search_top50_hand .click_keyWords')
        for (let i = 0; i < arr.length; i++) {
          that.select_keywords_top50.push(arr[i].innerText)
        }
      }
      if (that.click_style_all) {
        let arr = $('.client_search_top50_all .click_keyWords')
        for (let i = 0; i < arr.length; i++) {
          that.select_keywords_top50.push(arr[i].innerText)
        }
      }
      console.log(that.select_keywords_top50)
      $.ajax({
        url: that.BASE_URL + 'm2c.operate/search/setkeywords.web',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          searchWay: that.searchWay,
          keywords: that.select_keywords_top50.join(','),
          guideWords: that.guideWords
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (result) {
          if (result.status === 200) {
            that .get_select_hotwords()
            that.$message({ type: "success", message: "设置成功" })
          }
        }
      })
    },
    // 获取设置的热搜词
    get_select_hotwords () {
      let that = this
      $.ajax({
        url: that.BASE_URL + 'm2c.operate/search/getkeywords.web',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (result) {
          console.log('获得的设置的热搜词: ', result)
          // 给搜索方式添加样式
          that.searchWay = result.content.searchWay
          if (result.content.searchWay === 0) {
            that.click_style_random = true
            that.click_style_hand = false
            that.click_style_all = false
          } else if (result.content.searchWay === 1) {
            that.click_style_random = false
            that.click_style_hand = true
            that.click_style_all = false
            $('.client_search_top50_all .public_keyWords').removeClass('click_keyWords')
            // 给设定的热搜词添加样式
            that.select_keywords_top50 = result.content.hotkeywords
            that.guideWords = result.content.guideword
            console.log('获得的设置的热搜词处理后: ', that.select_keywords_top50)
            // that.search_keywords_top50 = result.content.keywords.split(',')
            $('.click_keyWords')
            console.log('所有的top50', $('.client_search_top50_hand .public_keyWords'))
            let arr = $('.client_search_top50_hand .public_keyWords')
            console.log('arr', arr[0])
            for (let j = 0; j < that.select_keywords_top50.length; j++) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].innerText === that.select_keywords_top50[j]) {
                  console.log(arr[i].className)
                  arr[i].className = 'click_keyWords' + ' ' + 'public_keyWords'
                  console.log('添加后', arr[i].className)
                }
              }
            }
          } else if (result.content.searchWay === 2) {
            that.click_style_random = false
            that.click_style_hand = false
            that.click_style_all = true
            $('.client_search_top50_hand .public_keyWords').removeClass('click_keyWords')
            // 给设定的热搜词添加样式
            that.select_keywords_top50 = result.content.hotkeywords
            that.guideWords = result.content.guideword
            console.log('获得的设置的热搜词处理后: ', that.select_keywords_top50)
            // that.search_keywords_top50 = result.content.keywords.split(',')
            $('.click_keyWords')
            console.log('所有的top50', $('.client_search_top50_all .public_keyWords'))
            let arr = $('.client_search_top50_all .public_keyWords')
            console.log('arr', arr[0])
            for (let j = 0; j < that.select_keywords_top50.length; j++) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].innerText === that.select_keywords_top50[j]) {
                  console.log(arr[i].className)
                  arr[i].className = 'click_keyWords' + ' ' + 'public_keyWords'
                  console.log('添加后', arr[i].className)
                }
              }
            }
          }
        }
      })
    }
  },
  mounted () {
    let that = this
    // 获取top50关键字
    $.ajax({
      url: that.BASE_URL + 'm2c.operate/search/gettop50.web',
      data: {
        systemAccessToken: sessionStorage.getItem('access_token'),
        userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
      },
      headers: {
        'access_token': sessionStorage.getItem('access_token')
      },
      success: function (result) {
        console.log('获得的top50关键字列表: ', result)
        that.search_keywords_top50 = result.content.keywords.split(',')
        console.log('关键字列表处理后: ', that.search_keywords_top50)
        that.get_select_hotwords()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .client_search {
    .client_search_content {
      margin: 26px 79px 0px 21px;
      .public_span {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 9px;
      }
      .client_search_top {
        // width:1200px;
        height: 93px; 
        background:#fff;
        padding-left: 32px;
        padding-top: 24px;
        input {
          width:400px;
          height:24px; 
          background:#F5F5F5;
          border-radius: 2px ;
          padding-left: 8px;
          color: #777777;
          border: 1px solid #BFC1CB;
          font-size: 12px;
          outline: none;
        }
      }
    }
    .client_search_middle {
      padding-left: 32px;
      padding-top: 24px;
      padding-bottom: 35px;
      margin-top: 18px;
      background:#fff;
      .public_button {
        display: inline-block;
        text-align: center;
        width:110px;
        line-height:30px;
        border: 1px solid #BFC1CB;
        margin-top: 20px;
        font-size: 12px;
        border-radius: 0px;
        color: #000;
        margin-right: 25px;
        cursor: pointer;
        position: relative;
        .click_button_show {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 0px;
          right: 0px;
          background: #0086FF url('../../../../../static/images/businessManage/ico_select.png') no-repeat 8px 0px; 
          .triangle-right {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 0;
            height: 0;
            border-bottom: 20px solid #fff;
            border-right: 20px solid transparent;
          }
        }
      }
      .click_button {
        border: 1px solid #0078E4;
        color: #0078E4;
      }
      .client_search_top50_hand {
        width: 700px;
        // height: 210px;
        background: #EDF0F7;
        margin-top: 20px;
        font-size: 14px;
        color: #6C83BC;
        padding: 15px 0px 10px 18px;
      }
      .client_search_top50_all {
        width: 700px;
        // height: 210px;
        background: #EDF0F7;
        margin-top: 20px;
        font-size: 14px;
        color: #6C83BC;
        padding: 15px 0px 10px 18px;
      }
      .public_keyWords {
        // cursor: pointer;
        // float: left;
        cursor: pointer;
        outline: none;
        color: #6C83BC;
        background: #fff;
        font-size: 12px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #6C83BC;
        border-radius: 10px;
        padding: 0 13px;
        line-height: 18px;
      }
      .click_keyWords {
        background: #6C83BC;
        color: #fff;
      }
    }
    .submit_button {
      margin: 20px 20px 0 0;
      width:110px;
      height:40px; 
      border-radius: 2px;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  }
</style>
