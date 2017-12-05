<template>
  <div class="list">
    <list-data
      ref='list-data'
      :List='list'
      :Expand="expand"
      :FieldList='fields'>
      <template
        slot-scope="scope"
        slot="expand">
        <div>索引：{{scope.index}}</div>
        <div>地址：{{scope.data.address}}</div>
        <div>行数据：{{JSON.stringify(scope.data)}}</div>
      </template>
    </list-data>
  </div>
</template>

<script>
  import ExpandJs from './expand.js'

  export default ExpandJs
</script>