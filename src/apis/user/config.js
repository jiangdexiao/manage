
/**
 * 用户模块
 */
export default [
    { name: '登录', method: 'login', path: 'm2c.operate/sys/user/login',type: 'post'},
    { name: '登出', method: 'loginout', path: 'm2c.operate/sys/user/logout',type: 'post'},
    { name: '获取模块权限',method: 'modules',path: 'm2c.operate/permission/auth/modules',type: 'get'},
    { name: '重置密码',method: 'resetPassword',path: 'm2c.operate/sys/user/resetPassword',type: 'get'},
    { name: '修改密码',method: 'modpwd',path: 'm2c.operate/sys/user/modpwd',type: 'post'},
    { name: '新增用户',method: 'add',path: 'm2c.users/user/add',type: 'post'},
    { name: '媒体用户登录',method: 'bdLogin',path: 'm2c.media/bd/login',type: 'get'},
]
