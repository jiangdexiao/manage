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
      :Checkbox='true'
      :List='list'
      :FieldList='fields'
      :BtnInfo='btn_info'></list-data>
  </div>
</template>
<script>
  import ListJs from './list.js'

  export default ListJs
</script>

