<template>
  <div class="list">
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnView="onClickBtnView"
      @onClickBtnDelete="onClickBtnDelete"
      @onClickBtn = "onClickBtn"
      :DataGrid='datagrid'></list-data>
  </div>
</template>
<script>
  import FilterJs from './filter.js'

  export default FilterJs
</script>

