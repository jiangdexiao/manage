<template>
  <div class="list">
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnView="onClickBtnView"
      @onClickBtnDelete="onClickBtnDelete"
      @onClickBtn = "onClickBtn"
      :List='list'
      :FieldList='fields'></list-data>
  </div>
</template>
<script>
  import FilterJs from './filter.js'

  export default FilterJs
</script>

