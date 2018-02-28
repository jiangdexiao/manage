<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  // 导入ueditor相关
  import '../../../static/UE/ueditor.config.js'
  import '../../../static/UE/ueditor.all.js'
  import '../../../static/UE/lang/zh-cn/zh-cn.js'
  import '../../../static/UE/ueditor.parse.min.js'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    watch:{
      defaultMsg(val) {
        const _this = this
        if( !this.editor ){
        
          this.editor = window.UE.getEditor('editor', this.config) // 初始化UE
        }
        this.editor.ready( function() {
            _this.editor.setContent(val); // 确保UE加载完成后，放入内容。
        } );
      }
    },
    mounted () {
      const _this = this
      if( !this.editor ){
        this.editor = window.UE.getEditor('editor', this.config) // 初始化UE
      }
      this.editor.ready( function() {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      })
      // this.editor.addListener('ready', function () {
      //   _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      // })
    },
    methods: {
      getUEContent () { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent (Msg) { // 设置内容方法
        return this.editor.setContent(Msg)
      }
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>

