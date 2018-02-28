/**
 * 公共模块
 */

export default [
  { name: '菜单', method: 'menu', path: 'm2c.operate/permission/auth/resources', type: 'get'},
  { name: '获取省市区',method: 'bdorg',path: 'm2c.media/bdorg',type: 'get'},
  { name: '获取省',method: 'provs',path: 'm2c.support/regn/provs',type: 'get'},
  { name: '获取市',method: 'cits',path: 'm2c.support/regn/cits',type: 'get'},
  { name: '获取区',method: 'areas',path: 'm2c.support/regn/areas',type: 'get'},
  { name: '新增时获取编号',method: 'mediaId',path: 'm2c.media/media/id',type: 'get'},
  { name: '发送验证码',method: 'sendSms',path: 'm2c.operate/sys/user/sendSms',type: 'get'},
  { name: '广告位分类',method: 'dicList',path: 'm2c.support/dic/list',type: 'get'},
]


