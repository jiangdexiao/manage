<template>
  <div class="list">
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnView="onClickBtnView"
      @onClickBtnDelete="onClickBtnDelete"
      @onClickBtn = "onClickBtn"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
  import ListJs from './list.js'

  export default ListJs
</script>

