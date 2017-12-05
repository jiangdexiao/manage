<template>
  <el :span="24" >
    <el-form style=""
            label-width="100px"
            :ref="primary_key"
            :inline="setting.inline || 'inline'"
            :rules='rules'
            :model='submit_data'>
        <el-form-item
            class='edit-form'
            v-for='(field,index) in fields'
            v-bind="field.attrs || {}"
            :key='index'
            :label="field.label"
            :prop='field.key'>

            <component
                :Data="field"
                :SubmitData="submit_data"
                :SubmitInfo="submit_info"
                :TempFieldObj="temp_field_obj"
                :is="getComponent(field.type)"></component>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" size="medium" @click='onSubmit(primary_key)'>查询</el-button>
        </el-form-item>
    </el-form>
  </el>
</template>

<script>
  import FormDataJs from './FormData.js'

  export default FormDataJs
</script>
