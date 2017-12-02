<template>
  <div class="list">
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnView="onClickBtnView"
      @onClickBtnDelete="onClickBtnDelete"
      @onClickBtn = "onClickBtn"
      :Pagination = 'pagination'
      :List='list'
      :FieldList='fields'
      :BtnInfo='btn_info'></list-data>
  </div>
</template>
<script>
  import ListJs from './list.js'

  export default ListJs
</script>
<style scoped lang='scss'>
  .demo-form-inline {
    display: inline-block;
    float: right;
  }

  .btm-action {
    margin-top: 20px;
    text-align: center;
  }

  .actions-top {
    height: 46px;
  }

  .pagination {
    display: inline-block;
  }
</style>
