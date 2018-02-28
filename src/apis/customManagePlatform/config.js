/**c端客户端 */

export default [
  /******** 证件管理 ********/
  {name: '分类管理+分类搜索', method: 'certificateClass', path: 'm2c.tools/web/idphoto/manage/sort/search', type: 'get'},
  {name: '底色管理+搜索', method: 'colorAdim', path: 'm2c.tools/web/idphoto/backgroundcolor/query', type: 'get'},
  {name: '证件管理规格列表+搜索', method: 'idphotoList', path: 'm2c.tools/web/idphoto/manage/specs/query', type: 'get'},
  {name:'证件照管理+获取底色',method:'getColors',path:'m2c.tools/web/idphoto/backgroundcolor/list',type:'get'},
  {name:'证件照规格管理+删除',method:'delSpecs',path:'m2c.tools/web/idphoto/manage/specs/del',type:'post'},
  {name:'证件照规格管理+修改',method:'modifySpecs',path:'m2c.tools/web/idphoto/manage/specs/modify',type:'post'},
  {name:'证件照规格管理+新增',method:'addSpecs',path:'m2c.tools/web/idphoto/manage/specs/add',type:'post'},

  /*************** 证件照管理-历史记录 ****************/
  {name: '历史记录管理+搜索', method: 'history', path: 'm2c.tools/web/idphoto/manage/history/search', type: 'get'},
  {name: '历史记录管理+删除', method: 'delhistory', path: 'm2c.tools/web/idphoto/manage/history/del', type: 'get'},

  /*************** 证件照管理-底色管理 ****************/
  {name: '底色管理+搜索', method: 'initcolor', path: 'm2c.tools/web/idphoto/backgroundcolor/query', type: 'get'},
  {name:'底色管理+删除',method:'delcolor',path:'m2c.tools/web/idphoto/backgroundcolor/delete',type:'get'},
  {name:'底色管理+新增',method:'addcolor',path:'m2c.tools/web/idphoto/backgroundcolor/add',type:'post'},

  /**************** 证件照管理-分类管理 *****************/
  {name:'分类管理+搜索',method:'initsort',path:'m2c.tools/web/idphoto/manage/sort/search',type:'get'},
  {name:'分类管理+删除',method:'delsort',path:'m2c.tools/web/idphoto/manage/sort/del',type:'post'},
  {name:'分类管理+新增',method:'addsort',path:'m2c.tools/web/idphoto/manage/sort/add',type:'post'},
]
