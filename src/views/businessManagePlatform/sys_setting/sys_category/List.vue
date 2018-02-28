<template>
  <div class="sys_category">
    <h4>媒体分类</h4>
    <div class="goods_type">
      <div class="first public_content">
        <span>一级分类</span>
        <div class="first_content">
          <ul>
              <li v-bind:class='{active:i===active}' v-for="(cell,i) in shangpinfenlei_first" :value="cell.cateCode" :key="i" @click="click_firstClassify(i)">{{cell.cateName}}<span>></span></li>
          </ul>
        </div>
      </div>
      <div class="second public_content">
        <span>二级分类</span>
        <div class="first_content">
          <ul>
              <li v-for="(cell,i) in shangpinfenlei_second" :key="i" :value="cell.cateCode">{{cell.cateName}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        // 一级商品分类列表(所有)
        shangpinfenlei_first: [],
        // 二级商品分类列表(所有)
        shangpinfenlei_second: [],
        // 二级商品分类列表(增删改)
        shangpinfenlei_second_add_modify: [],
        add_modify_params: {firstClassify: '', secondClassify: ''},
        active: 0
      }
    },
    methods: {
      // 点击一级分类
      click_firstClassify (index) {
        this.active = index
        this.shangpinfenlei_second_add_modify = []
        let value = event.target.getAttribute('value')
        this.shangpinfenlei_second.forEach(function ({goodsClassifyId, goodsClassifyName, isParent, parentId}) {
          if (parentId === value) {
            this.shangpinfenlei_second_add_modify.push({parentId: parentId, goodsClassifyId: goodsClassifyId, goodsClassifyName: goodsClassifyName})
          }
        })
        this.api_businessManagePlatform_cateChd({ 
          data: {
            token: JSON.parse(sessionStorage.getItem('userInfo')).token,
            parentCateCode: value
          }
        }).then(res => {
          this.shangpinfenlei_second = res.content
        })
      }
    },
    mounted () {
      // 获取媒体分类列表
      this.api_businessManagePlatform_catePar({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token
        },
      }).then(res => {
        this.shangpinfenlei_first = res.content
        this.api_businessManagePlatform_cateChd({ 
          data: {
            token: JSON.parse(sessionStorage.getItem('userInfo')).token,
            parentCateCode: res.content[0].cateCode
          }
        }).then(res => {
          this.shangpinfenlei_second = res.content
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
.sys_category {
  h4 {
    margin: 10px 30px;
  }
  .active {
    background: #E0E1E1;
  }
  .goods_type {
    margin: 10px 30px;
    padding-left: 50px;
    font-size: 14px;
    .public_content {
      float: left;
      margin: 0px 20px;
    }
    .first_content {
      margin-top: 10px;
      width: 250px;
      border: 1px solid #ccc;
      height: 500px;
      span {
        position: absolute;
        right: 40px;
      }
      ul {
        list-style: none;
        li {
          position: relative;
          padding-left: 20px;
          line-height: 30px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
