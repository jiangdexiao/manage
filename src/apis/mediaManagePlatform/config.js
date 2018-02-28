
/**
 * 媒体管理平台
 */
export default [
    //首页 
    { name: '获取首页媒体数据',method: 'staff',path: 'm2c.media/media/media/staff',type: 'get'},
    { name: '获取首页备案数据',method: 'increment',path: 'm2c.media/record/increment',type: 'get'},
    { name: '获取首页本月提成',method: 'curMonthAmount',path: 'm2c.trading/web/accounting/media/marketing/media/home/statistics.web',type: 'get'},
    //bd管理
    { name: '获取bd专员列表',method: 'bd',path: 'm2c.media/bd',type: 'get'},
    { name: '获取bd专员combox列表',method: 'getBdList',path: 'm2c.media/admin/bd/getBdList',type: 'get'},
    { name: '获取媒体分类',method: 'catePar',path: 'm2c.media/cate/par',type: 'get'},
    { name: '获取媒体子分类',method: 'cateChd',path: 'm2c.media/cate/chd',type: 'get'},
    { name: '客户拜访统计列表',method: 'customerCallCountList',path: 'm2c.media/bd/customerCallCountList',type: 'get'},
    { name: '客户业绩统计列表',method: 'achievement',path: 'm2c.media/bd/achievement',type: 'get'},
    { name: '提成管理',method: 'ratio',path: 'm2c.media/bdorg/ratio',type: 'get'},
    { name: '登录',method: 'bdLogin',path: 'm2c.media/bd/login',type: 'get'},
    { name: '查询分成信息',method: 'commInfo',path: 'm2c.media/admin/commission/commInfo',type: 'get'},
    { name: '分成新增',method: 'commissionAdd',path: 'm2c.media/admin/commission/add',type: 'get'},
    { name: '分成修改',method: 'commissionUpdate',path: 'm2c.media/admin/commission/update',type: 'get'},
    






    //客户管理
    { name:'业务进度列表', method:'progress', path:'m2c.media/bd/schedule', type:'get'},
    { name:'跟进日志列表', method:'followUpLog', path:'m2c.media/record/log', type:'get'},
    { name:'备案客户列表', method:'record', path:'m2c.media/record', type:'get'},
    { name:'检测备案客户是否存在', method:'checkRecordName', path:'m2c.media/record/check/name', type:'get'},
    //促销员管理 
    { name:'促销员分成列表', method:'divide', path:'m2c.media/divide', type:'get'},  
    { name:'商品分类', method:'goodsClassify', path:'m2c.scm/goods/classify/level', type:'get'},  
    { name:'促销员收益列表', method:'income', path:'m2c.media/salesman/income', type:'get'},
    { name:'促销员排行榜列表', method:'rank', path:'m2c.media/salesman/rank', type:'get'},
    { name:'促销员列表', method:'salesman', path:'m2c.media/salesman', type:'get'},
    { name:'媒体list', method:'mediaList', path:'m2c.media/media/comb', type:'get'},
    { name:'手机号检测', method:'bymobile', path:'m2c.users/user/get/grouptype/bymobile', type:'get'},
    { name:'广告位分类', method:'mresCateList', path:'m2c.support/dic/list', type:'get'},
    { name:'广告位列表', method:'mresList', path:'m2c.media/mres/comb', type:'get'}, 
    { name:'促销员下拉列表', method:'salesmanList', path:'m2c.media/salesman/comb', type:'get'}, 
    { name:'广告位详情', method:'scheduleInfo', path:'m2c.media/mres/schedule/info', type:'get'},
    { name:'按广告位排班', method:'scheduleMres', path:'m2c.media/mres/schedule/mres', type:'get'},
    { name:'按促销员排班', method:'scheduleSalesman', path:'m2c.media/mres/schedule/salesman', type:'get'},
    



    //财务
    { name:'提现记录', method:'cash', path:'m2c.media/media/cash', type:'get'},  
    { name:'资金流水', method:'flow', path:'m2c.media/media/flow', type:'get'},  
    { name:'资金流水', method:'deductMonth', path:'m2c.media/bd/deduct/month', type:'get'},  
    { name:'bd流水', method:'deductStream', path:'m2c.media/bd/deduct/stream', type:'get'}, 
    { name:'租赁媒体资金', method:'rentList', path:'m2c.media/admin/media/rent/list', type:'get'},
    { name:'租赁媒体资金明细列表', method:'rentDetailList', path:'m2c.media/admin/media/rent/flow/list', type:'get'},  

    //媒体
    { name:'排行榜', method:'mediaRank', path:'m2c.media/media/rank', type:'get'},  
    { name:'分成管理', method:'divide', path:'m2c.media/divide', type:'get'},  
    { name:'媒体管理', method:'medias', path:'m2c.media/media/medias', type:'get'},  
    { name:'媒体管理', method:'media', path:'m2c.media/admin/media', type:'get'}, 
    { name:'识别图查询', method:'recognizeds', path:'m2c.scm/goods/recognizeds', type:'get'},  
    { name:'媒体详情', method:'mediaDetail', path:'m2c.media/media/detail', type:'get'},  
    { name:'媒体用户列表', method:'listForUserUnbind', path:'m2c.users/user/listForUserUnbind', type:'get'}, 
    { name:'广告位刊例价列表', method:'publishList', path:'m2c.media/admin/publish', type:'get'},  
    { name:'刊例价绑定', method:'publishBing', path:'m2c.media/admin/publish/is/bing', type:'get'},
    { name:'刊例价解绑', method:'publishNotBing', path:'m2c.media/admin/publish/is/not/bing', type:'get'},
    { name:'刊例价已绑定的', method:'publishBingList', path:'m2c.media/mres/publish', type:'get'},
    { name:'刊例价未绑定的', method:'publishNotBingList', path:'m2c.media/mres/no/publish', type:'get'},
    { name:'转化率列表', method:'conversionRateList', path:'m2c.media/admin/conrate/find/conversionRate', type:'get'},
    { name:'转化率详细列表', method:'conversionDetailList', path:'m2c.media/admin/conrate/rate/condition/list', type:'get'},
    { name:'广告位空置率统计', method:'adsenseVacancyCount', path:'m2c.media/admin/adsense/adsenseVacancyCount', type:'get'},
    { name:'获取媒体等级', method:'getLevel', path:'m2c.media/admin/media/check/level', type:'get'},
    { name:'获取广告位尺寸', method:'advSizeList', path:'m2c.media/admin/adsense/findAdvSize', type:'get'},
    { name:'广告位形式租金设置', method:'setRent', path:'m2c.media/admin/ad/form/rent', type:'get'},
    { name:'广告位稽查列表', method:'auditsList', path:'m2c.media/admin/audits', type:'get'},
    { name:'广告位稽查列表下载', method:'auditsDownLoad', path:'m2c.media/admin/audits/xls', type:'get'},
    { name:'稽查任务查询', method:'getAuditPara', path:'m2c.media/admin/audit/para/read', type:'get'},
    { name:'稽查任务设置', method:'auditPara', path:'m2c.media/admin/audit/para', type:'get'},
    { name:'查看审核照片', method:'photoAudit', path:'m2c.media/admin/audit/photos', type:'get'},
    { name:'查看历史照片', method:'photoHis', path:'m2c.media/admin/audit/photo/his', type:'get'},
    { name:'二次审核', method:'photoRechk', path:'m2c.media/admin/audit/photo/rechk', type:'get'},
    { name:'稽查任务列表', method:'auditParaList', path:'m2c.media/admin/audit/nos', type:'get'},
    { name:'广告位成本', method:'advCost', path:'m2c.media/admin/adv/cost', type:'get'},
    
    
    
    
    
   

    //广告管理
    { name:'广告列表', method:'mres', path:'m2c.media/mres', type:'get'},  
    { name:'获取条码', method:'barcode', path:'m2c.media/mres/bar', type:'get'},  
    { name:'获取二维码', method:'qrcode', path:'m2c.media/mres/qr/gen', type:'get'},  
    { name:'广告位上下架', method:'mresAdv', path:'m2c.media/mres/adv', type:'get'},  
    { name:'广告位详情', method:'mresDetail', path:'m2c.media/mres/detail', type:'get'},  
    { name:'广告位审核', method:'mresApr', path:'m2c.media/mres/apr', type:'get'}, 
    { name:'广告位批量审核', method:'mresAprBatch', path:'m2c.media/admin/ad/batch/approve', type:'get'},  
    { name:'广告位上下线', method:'mresLine', path:'m2c.media/mres/line', type:'get'},  
    { name:'广告形式', method:'formList', path:'m2c.media/admin/adsense/formList', type:'get'},  
    { name:'查询排班', method:'querySchedule', path:'m2c.media/adSchedule/querySchedule', type:'get'},  
    { name:'添加排班', method:'adScheduleAdd', path:'m2c.media/adSchedule/add', type:'get'},  
    { name:'排班表', method:'adScheduleList', path:'m2c.media/adSchedule/list', type:'get'},  
    { name:'排班表', method:'adScheduleDel', path:'m2c.media/adSchedule/scheduleDel', type:'get'},
    { name:'批量投放广告位详情', method:'findBatchDeliveryInfo', path:'m2c.media/admin/adsense/findBatchDeliveryInfo', type:'get'}, 
    { name:'批量投放', method:'batchDelivery', path:'m2c.media/admin/adsense/batchDelivery', type:'get'},   

    //数据报表   
    { name:'广告位明细', method:'advertisingDet', path:'m2c.media/admin/media/mres/dets', type:'get'}, 
    { name:'广告位明细下载', method:'advertisingDownLoad', path:'m2c.media/admin/media/mres/dets/xls', type:'get'},
    { name:'媒体明细', method:'mediaDetailReport', path:'m2c.media/admin/media/report/media', type:'get'},
    { name:'媒体明细下载', method:'mediaDetailDownLoad', path:'m2c.media/admin/media/report/media/xls', type:'get'},
    { name:'订单明细', method:'orderDetailReport', path:'m2c.scm/admin/order-out/orderdetail', type:'get'},
    { name:'订单明细下载', method:'orderDetailDownLoad', path:'m2c.scm/admin/order-out/orderdetail/export', type:'get'},
    { name:'媒体和促销员激活列表', method:'activatedList', path:'m2c.media/admin/salseman/activated', type:'get'},
    { name:'媒体和促销员激活列表下载', method:'activatedDownLoad', path:'m2c.media/admin/salseman/activated/port/xls', type:'get'},

    //市场激励  
    { name:'市场激励列表', method:'rewardList', path:'m2c.media/admin/reward/list', type:'get'},
    { name:'市场激励新增', method:'rewardAdd', path:'m2c.media/admin/reward/addReward', type:'get'},
    { name:'市场激励单条详情', method:'rewardInfo', path:'m2c.media/admin/reward/findRewardInfo', type:'get'},
    { name:'市场激励修改', method:'rewardUpdate', path:'m2c.media/admin/reward/updateReward', type:'get'},
    { name:'关闭市场激励', method:'closeReward', path:'m2c.media/admin/reward/updateStatus', type:'get'},
    { name:'激励排行榜', method:'rewardRanking', path:'m2c.media/admin/reward/rewardRanking', type:'get'},
    { name:'激励明细列表', method:'rewardDetail', path:'m2c.media/admin/reward/rankingDetailed', type:'get'},
    
    
    
    
    


    


]