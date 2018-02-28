
/**
 * 媒体管理平台
 */
export default [
    //提成管理
    { name: '计算方式列表',method: 'ratio',path: 'm2c.media/bd/ratio',type: 'get'},
    { name: '员工提成',method: 'bdDeduct',path: 'm2c.media/bd/deduct',type: 'get'},
    { name: '我的提成',method: 'bdMyDeduct',path: 'm2c.media/admin/bd/mydeduct',type: 'get'},
    { name: '获取bd专员账号详情',method: 'bdAccounting',path: 'm2c.trading/web/accounting/media/marketing/mydeduct/statistics.web',type: 'get'},
    { name: '排行榜',method: 'bdRanking',path: 'm2c.media/bd/ranking',type: 'get'},
    { name: 'BD信息',method: 'bdInfo',path: 'm2c.media/bd/ranking/info',type: 'get'},
    { name: '新增媒体用户',method: 'adminMediaAdd',path: 'm2c.media/admin/media',type: 'get'},
    { name: '媒体用户',method: 'adminMediaDetail',path: 'm2c.media/admin/media/detail',type: 'get'},
    { name: '客户签约',method: 'recordSign',path: 'm2c.media/record/keyword',type: 'get'},
  
]