/**
 * 运营管理平台
 */
export default [
    // 登录校验
    { name: '推送版本', method: 'secret', path: 'm2c.operate/sys/user/hold/secret', type: 'post' },
    // 新增时获取用户ID
    { name: '推送版本', method: 'getId', path: 'm2c.operate/getid', type: 'post' },
    // 系统管理
    { name: '获取角色权限列表', method: 'sysRole', path: 'm2c.operate/sys/role/pages', type: 'get' },
    { name: '角色权限保存（新增/修改）', method: 'sysRoleSave', path: 'm2c.operate/sys/role/save', type: 'post' },
    { name: '获取模块权限', method: 'getModule', path: 'm2c.operate/role/auth/get/modules', type: 'get' },
    { name: '角色权限保存', method: 'setRoleAuth', path: 'm2c.operate/role/auth', type: 'post' },
    { name: '角色下用户数', method: 'countByRoleId', path: 'm2c.operate/sys/user/countByRoleId', type: 'post' },
    { name: '获取菜单权限', method: 'getMenuRole', path: 'm2c.operate/role/auth/get/menus', type: 'get' },
    { name: '获取功能权限', method: 'getFuncRole', path: 'm2c.operate/role/auth/get/buttons', type: 'get' },
    { name: '所有角色名称', method: 'roleList', path: 'm2c.operate/sys/role/pages', type: 'post' },
    { name: '新增修改角色提交', method: 'sysUserSave', path: 'm2c.operate/sys/user/save', type: 'post' },
    { name: '获取用户模块权限', method: 'getUserModule', path: 'm2c.operate/user/auth/get/modules', type: 'get' },
    { name: '用户权限保存', method: 'setUserAuth', path: 'm2c.operate/user/auth', type: 'post' },
    { name: '获取用户菜单权限', method: 'getUserRole', path: 'm2c.operate/user/auth/get/menus', type: 'get' },
    { name: '获取用户功能权限', method: 'getFuncUser', path: 'm2c.operate/user/auth/get/buttons', type: 'get' },
    { name: '所有用户信息', method: 'userList', path: 'm2c.operate/sys/user/page', type: 'get' },
    { name: '编辑用户信息', method: 'userInfo', path: 'm2c.operate/sys/user/save', type: 'post' },
    { name: '升级管理列表', method: 'updateList', path: 'm2c.support/app/list', type: 'get' },
    { name: '新增版本', method: 'addVersion', path: 'm2c.support/app/add', type: 'post' },
    { name: '修改版本', method: 'updVersion', path: 'm2c.support/app/upd', type: 'post' },
    { name: '发布版本', method: 'pubVersion', path: 'm2c.support/app/pub', type: 'post' },
    { name: '推送管理列表', method: 'msgList', path: 'm2c.support/jpush/msg/list', type: 'get' },
    { name: '新增推送', method: 'msgAdd', path: 'm2c.support/jpush/msg/add', type: 'post' },
    { name: '修改推送', method: 'msgUpd', path: 'm2c.support/jpush/msg/upd', type: 'post' },
    { name: '推送版本', method: 'msgPull', path: 'm2c.support/jpush/msg/push', type: 'post' },
    // 系统管理m2c.operate/getid
    { name: '获取媒体一级分类', method: 'catePar', path: 'm2c.media/cate/par', type: 'get' },
    { name: '获取媒体二级分类', method: 'cateChd', path: 'm2c.media/cate/chd', type: 'get' },
    { name: '获取禁用词汇列表', method: 'forbidList', path: 'm2c.operate/forbid/page', type: 'get' },
    { name: '编辑禁用词汇', method: 'forbidEdit', path: 'm2c.operate/forbid/save', type: 'post' },
    // 内容管理
    { name: '静态内容', method: 'scontent', path: 'm2c.operate/scontent/list', type: 'get' },
    { name: '帮助中心所有数据', method: 'helpList', path: 'm2c.operate/helpcenter/list/menus', type: 'get' },
    { name: '发送至客户端', method: 'sendToClient', path: 'm2c.operate/helpcenter/sendtoclient/', type: 'get' },
    { name: '新增栏目', method: 'addColumn', path: 'm2c.operate/helpcenter/add/column/', type: 'get' },
    { name: '隐藏显示', method: 'hiddenOrShow', path: 'm2c.operate/helpcenter/hiddenorshow/', type: 'get' },
    { name: '上移下移', method: 'move', path: 'm2c.operate/helpcenter/move/', type: 'get' },
    { name: '删除栏目', method: 'delColumn', path: 'm2c.operate/helpcenter/delete/', type: 'get' },
    { name: '添加内容', method: 'addContent', path: 'm2c.operate/helpcenter/addormod/content/', type: 'get' },
    { name: '删除内容', method: 'delContent', path: 'm2c.operate/helpcenter/delete/content/', type: 'get' },
    { name: '编辑栏目名称', method: 'modifyCol', path: 'm2c.operate/helpcenter/modifycol/', type: 'get' },
    { name: '判断是否有修改', method: 'compare', path: ' m2c.operate/helpcenter/compare/', type: 'get' },
    // 结算管理
    { name: '结算列表', method: 'PendingList', path: 'm2c.trading/web/settle/platform/admin/pager.web', type: 'get' },
    { name: '获取结算分成列表', method: 'getDetails', path: 'm2c.trading/web/settle/platform/admin/detail.web', type: 'get' },
    { name: '获取结算详情', method: 'getRemark', path: 'm2c.trading/web/settle/query/remark.web', type: 'get' },
    { name: '修改结算备注', method: 'remarkUpdate', path: 'm2c.trading/web/settle/update/remark.web', type: 'get' },
    { name: '结算', method: 'toSettle', path: 'm2c.trading/web/settle/tosettle.web', type: 'get' },
    { name: '结算明细表格数据', method: 'exportList', path: 'm2c.trading/web/settle/export/settle.list', type: 'get' },
    { name: '导出结算明细', method: 'exportSettle', path: 'm2c.trading/web/settle/export/settle.web', type: 'get' },
    { name: '重新导出', method: 'resExportSettle', path: 'm2c.trading/web/settle/reExport/settle', type: 'get' },
    { name: '获取表格数据', method: 'getSettleList', path: 'm2c.trading/web/settle/export/settle.list', type: 'get' },
    { name: '恢复数据', method: 'recover', path: 'm2c.operate/helpcenter/recover/', type: 'get' },
    // 运营管理
    { name: '获取商城首页', method: 'getHome', path: 'm2c.operate/index/getset.web', type: 'get' },
    { name: '获取底部菜单', method: 'getMenus', path: 'm2c.operate/index/getmenus.web', type: 'post' },
    { name: '获取展示banner', method: 'getBannerShow', path: 'm2c.operate/picword/banner/getshow.web', type: 'post' },
    { name: '设置底部菜单', method: 'setMenus', path: 'm2c.operate/index/setmenus.web', type: 'post' },
    { name: '商家一级分类', method: 'firstClassify', path: 'm2c.scm/dealerclassify/sys/firstClassify', type: 'get' },
    { name: '获取店铺信息', method: 'getShop', path: 'm2c.scm/shop/sys/shop', type: 'get' },
    { name: '商品分类', method: 'goodsTree', path: 'm2c.scm/goods/classify/tree', type: 'get' },
    { name: '商品列表', method: 'goodsList', path: 'm2c.scm/goods/choice', type: 'get' },
    { name: '商城首页设置', method: 'setHome', path: 'm2c.operate/index/saveset.web', type: 'post' },
    { name: '商城首页设置', method: 'setBannerShow', path: 'm2c.operate/picword/banner/setshow.web', type: 'post' },
    { name: '上传图片', method: 'imgUpload', path: 'm2c.support/img/upload', type: 'post' },
    { name: '选中商品查询', method: 'checkedGoods', path: 'm2c.scm/goods/detail', type: 'get' },
    { name: '选中店铺查询', method: 'checkedShop', path: 'm2c.scm/shop/sys/detail', type: 'get' },
    { name: '选中店铺查询', method: 'getBannerList', path: 'm2c.operate/picword/banner/page.web', type: 'get' },
    { name: '获取商圈资源数据', method: 'circleList', path: 'm2c.operate/web/buscircle/list/bymres.web', type: 'get' },
    { name: '根据商圈名称模糊搜索', method: 'getCircle', path: 'm2c.operate/web/buscircle/buscircles', type: 'get' },
    { name: '获取寻宝地图相关省列表', method: 'provinceList', path: 'm2c.media/media/prov', type: 'get' },
    { name: '获取寻宝地图相关市列表', method: 'cityList', path: 'm2c.media/media/city', type: 'get' },
    { name: '修改广告位别名', method: 'editMresAlias', path: 'm2c.media/mres/alias', type: 'put' },
    { name: '设置是否在App显示', method: 'showOrHideApp', path: 'm2c.media/mres/show', type: 'put' },
    { name: '获取商圈地址信息', method: 'businessCircleAddrs', path: 'm2c.operate/web/buscircle/list.web', type: 'get' },
    { name: '获取广告位地址信息', method: 'billboardAddrs', path: 'm2c.media/mres/mres/region', type: 'get' },
    { name: '获取附近的广告位数量', method: 'getMresNum', path: 'm2c.media/mres/count/mres/addr', type: 'get' },
    { name: '根据经纬度查找广告位', method: 'getMresInfo', path: 'm2c.operate/web/buscircle/list/bymres1.web', type: 'get' },
    { name: '获取活动数据', method: 'activeList', path: 'm2c.operate/web/activity/page.web', type: 'get' },
    { name: '删除活动', method: 'delActive', path: 'm2c.operate/web/activity/del.web', type: 'post' },
    { name: '获取活动详细信息', method: 'detailActive', path: 'm2c.operate/web/activity/detail.web', type: 'get' },
    { name: '新增活动', method: 'addActive', path: 'm2c.operate/web/activity/add.web', type: 'post' },
    { name: '修改活动', method: 'editActive', path: 'm2c.operate/web/activity/edit.web', type: 'post' },
    { name: '通过标签查询用户列表', method: 'getUserByTag', path: 'm2c.users/user/queryUserByTag', type: 'get' },
    { name: '通过标签查询用户列表', method: 'importUserList', path: 'm2c.users/user/importUser', type: 'get' },
    { name: '推送消息记录', method: 'pushMsgList', path: 'm2c.support/jpush/msg/list', type: 'get' },
    { name: '获得寻宝领券数据', method: 'couponList', path: 'm2c.market/admin/seek/coupon/page', type: 'get' },
    { name: '删除寻宝领券数据', method: 'delCoupon', path: 'm2c.market/admin/seek/coupon/delete', type: 'post' },
    { name: '寻宝领券优惠券列表', method: 'voucherlist', path: 'm2c.market/admin/coupon/activity/coupon/page', type: 'get' },
    { name: '寻宝领券优惠券详情', method: 'seekCouponDetail', path: 'm2c.market/admin/seek/coupon/detail', type: 'get' },
    { name: '寻宝领券媒体广告位列表', method: 'Advertisinglist', path: 'm2c.media/admin/media/mres/comb', type: 'get' },
    { name: '新增寻宝广告位', method: 'addcoupon', path: 'm2c.market/admin/seek/coupon/creation', type: 'POST' },
    { name: '编辑寻宝广告位', method: 'editcoupon', path: 'm2c.market/admin/seek/coupon/modify', type: 'POST' },
    { name: '编辑详情寻宝广告位', method: 'editdetailcoupon', path: 'm2c.market/admin/seek/coupon/modify/detail', type: 'get' },
    { name: '获取所有省列表', method: 'allProvList', path: 'm2c.support/regn/provs', type: 'get' },
    { name: '获取所有市列表', method: 'allCityList', path: 'm2c.support/regn/cits', type: 'get' },
    { name: '获取媒体列表', method: 'mediaList', path: 'm2c.media/media/comb', type: 'get' },
    { name: '获取客户端展示名称列表', method: 'mediaCombList', path: 'm2c.media/media/comb', type: 'get' },
    { name: '批量编辑媒体别名', method: 'editMediaAlias', path: 'm2c.media/media/alias/all', type: 'put' },
    { name: '已添加商圈列表', method: 'addedCircle', path: 'm2c.operate/web/buscircle/list/mres/id.web', type: 'get' },
    { name: '可添加商圈列表', method: 'canAddCircle', path: 'm2c.operate/web/buscircle/page.web', type: 'get' },
    { name: '获取所有媒体名称', method: 'allMedia', path: 'm2c.media/media/comb', type: 'get' },
    { name: '获取所有广告位名称', method: 'allMres', path: 'm2c.media/mres/comb', type: 'get' },
    { name: ' 批量操作隐藏或显示', method: 'showOrHide', path: 'm2c.media/mres/show/all', type: 'put' },
    { name: '创建商圈', method: 'createCircle', path: 'm2c.operate/web/buscircle/add.web', type: 'post' },
    { name: ' 编辑商圈', method: 'editCircle', path: 'm2c.operate/web/buscircle/edit.web', type: 'post' },
    { name: ' 删除商圈', method: 'delCircle', path: 'm2c.operate/web/buscircle/del.web', type: 'post' },
    { name: ' 加入商圈', method: 'joinCircle', path: 'm2c.operate/web/buscircle/addMres.web', type: 'post' },
    { name: ' 批量编辑广告位、媒体icon', method: 'editIconBatch', path: 'm2c.operate/app/icon/setting', type: 'post' },
    { name: ' 查询广告位、媒体icon', method: 'getBatchIcon', path: 'm2c.operate/app/icon/res', type: 'get' },
    { name: ' 特惠价角标', method: 'setIcon', path: 'm2c.scm/admin/config', type: 'post' },
    { name: ' 查询特惠价角标', method: 'getIcon', path: 'm2c.scm/admin/config', type: 'get' },
    { name: ' 修改特惠价角标', method: 'editIcon', path: 'm2c.scm/admin/config', type: 'put' },
    { name: ' 营销广告位列表', method: 'advLocationList', path: 'm2c.operate/adv/location/list/', type: 'get' },
    { name: ' 单个广告位信息', method: 'advLocationSingle', path: 'm2c.operate/adv/location/single/', type: 'get' },
    { name: ' 编辑广告位信息', method: 'advLocationEdit', path: 'm2c.operate/adv/location/edit/', type: 'get' },
    { name: ' 头条内容列表', method: 'headLineList', path: 'm2c.operate/adv/location/topline/list/', type: 'get' },
    { name: ' 头条内容列表是否全部隐藏', method: 'headLineShowOrHide', path: 'm2c.operate/adv/location/showorhidden', type: 'get' },
    { name: ' 头条内容列表判断是否全部已失效', method: 'headLineIsToShow', path: 'm2c.operate/adv/location/topline/istoshow', type: 'get' },
    { name: ' 新增头条内容', method: 'addHeadLine', path: 'm2c.operate/adv/location/topline/add/', type: 'get' },
    { name: ' 编辑头条内容', method: 'editHeadLine', path: 'm2c.operate/adv/location/topline/edit/', type: 'get' },
    { name: ' 删除头条内容', method: 'delHeadLine', path: 'm2c.operate/adv/location/topline/delete/', type: 'get' },
    { name: ' 移动头条内容', method: 'moveHeadLine', path: 'm2c.operate/adv/location/topline/move/', type: 'get' },
    { name: ' 查询头条内容详情', method: 'HeadLineInfo', path: 'm2c.operate/adv/location/topline/details/', type: 'get' },
    { name: ' 根据商品名模糊查询商品', method: 'getGoodsList', path: 'm2c.scm/goods-out/pioneer/ten', type: 'get' },
    { name: ' 标签列表', method: 'getTagList', path: 'm2c.users/tag/list', type: 'get' },
    { name: ' 为用户打标签', method: 'setTag', path: 'm2c.users/tag/addUserTag', type: 'post' },
    { name: ' 新增标签', method: 'addTag', path: 'm2c.users/tag/add', type: 'post' },
    // 用户管理
    { name: '用户组列表', method: 'userGroupList', path: 'm2c.users/userGroup/list', type: 'get' },
    { name: '禁用', method: 'forbid', path: 'm2c.users/user/forbid', type: 'post' },
    { name: '解禁', method: 'unForbid', path: 'm2c.users/user/unforbid', type: 'post' },
    { name: '用户列表', method: 'userListAll', path: 'm2c.users/user/list', type: 'get' },
    { name: '新增用户', method: 'userAdd', path: 'm2c.users/user/add', type: 'post' },
    { name: '修改用户', method: 'userEdit', path: 'm2c.users/user/update', type: 'post' },
    // 营销管理(满减)
    { name: '商品品类搜索', method: 'goodsClassifyTree', path: 'm2c.scm/goods/classify/tree', type: 'get' },
    { name: '商家店铺搜索', method: 'dealerShopSelect', path: 'm2c.scm/shop/sys/shop', type: 'get' },
    { name: '获取商家二级分类', method: 'dealerSecondClassify', path: 'm2c.scm/dealerclassify/sys/dealer/all/second/classify', type: 'get' },
    { name: '创建满减', method: 'fullcutCreation', path: 'm2c.market/admin/fullcut/creation', type: 'post' },
    { name: '商品搜索', method: 'goodsSelect', path: 'm2c.scm/goods/choice', type: 'get' },
    { name: '终止满减', method: 'stopFullcut', path: 'm2c.market/admin/fullcut/stop', type: 'post' },
    { name: '获取满减列表', method: 'fullcutList', path: 'm2c.market/web/fullcut/page', type: 'get' },
    { name: '修改满减', method: 'modifyFullcut', path: 'm2c.market/admin/fullcut/modify', type: 'post' },
    { name: '满减详情', method: 'fullcutDetail', path: 'm2c.market/web/fullcut/detail', type: 'get' },
    { name: '多个商品详情', method: 'goodsMultiple', path: 'm2c.scm/goods/detail/multiple', type: 'get' },
    // 营销管理(优惠券)
    { name: '创建优惠券', method: 'couponCreation', path: 'm2c.market/admin/coupon/creation', type: 'post' },
    { name: '修改优惠券', method: 'couponModify', path: 'm2c.market/admin/coupon/modify', type: 'post' },
    { name: '优惠券详情', method: 'couponDetail', path: 'm2c.market/admin/coupon/detail', type: 'get' },
    { name: '获取优惠券列表', method: 'couponPage', path: 'm2c.market/web/coupon/page', type: 'get' },
    { name: '终止优惠券', method: 'stopCoupon', path: 'm2c.market/admin/coupon/end', type: 'post' },
    { name: '优惠券个性化编辑', method: 'editSettings', path: 'm2c.market/admin/coupon/share/edit/settings', type: 'post' },
    { name: '获取优惠券个性化设置', method: 'querySettings', path: 'm2c.market/admin/coupon/share/query/settings', type: 'get' },
    { name: '优惠券消息提醒', method: 'remindMessage', path: 'm2c.market/admin/coupon/push/remind/message', type: 'get' },
    { name: '优惠券派发记录列表', method: 'sendRecordPage', path: 'm2c.market/admin/coupon/send/record/page', type: 'get' },
    { name: '发送选定优惠券给选定用户', method: 'sendSelected', path: 'm2c.market/admin/coupon/platform/batch/send/user', type: 'post' },
    { name: '获取分享优惠券列表', method: 'shareList', path: 'm2c.market/admin/coupon/shareCoupon/page', type: 'get' },
    { name: '获取代金或折扣券列表', method: 'cashAndDiscountList', path: 'm2c.market/admin/coupon/cashAndDiscount/page', type: 'get' },
    { name: '查询优惠券页面内容详情', method: 'ruleCouponDetail', path: 'm2c.market/admin/coupon/content/detail', type: 'get' },
    { name: '删除支付成功领取的优惠券规则', method: 'delPaidRule', path: 'm2c.market/admin/coupon/rule/paid/delete', type: 'post' },
    { name: '删除分享领取的优惠券规则', method: 'delRecommendRule', path: 'm2c.market/admin/coupon/rule/recommend/delete', type: 'post' },
    { name: '确认生效规则', method: 'effectRecommendRule', path: 'm2c.market/admin/coupon/rule/recommend/switch', type: 'post' },
    { name: '编辑支付领取规则', method: 'editRecommendRule', path: 'm2c.market/admin/coupon/rule/recommend/modify', type: 'post' },
    { name: '获取推荐领取规则列表', method: 'recommendList', path: 'm2c.market/admin/coupon/rule/recommend/page', type: 'get' },
    { name: '获取支付领取规则列表', method: 'paidList', path: 'm2c.market/admin/coupon/rule/paid/page', type: 'get' },
    { name: '支付成功常量查询', method: 'constantInfo', path: 'm2c.market/admin/coupon/rule/paid/constant', type: 'get' },
    { name: '支付成功常量编辑', method: 'constantEdit', path: 'm2c.market/admin/coupon/rule/paid/constant', type: 'post' },
    // 营销管理(新人礼包)
    { name: '创建新人礼包', method: 'packetCreation', path: 'm2c.market/admin/packet/creation', type: 'post' },
    { name: '修改新人礼包', method: 'packetModify', path: 'm2c.market/admin/packet/modify', type: 'post' },
    { name: '新人礼包详情', method: 'packetDetail', path: 'm2c.market/admin/packet/detail', type: 'get' },
    { name: '获取新人礼包列表', method: 'packetPage', path: 'm2c.market/admin/packet/page', type: 'get' },
    { name: '终止新人礼包', method: 'stopPacket', path: 'm2c.market/admin/packet/end', type: 'post' },
    { name: '生效新人礼包', method: 'effectFullcut', path: 'm2c.market/admin/packet/effected', type: 'post' },
    { name: '获取优惠券作用商品', method: 'couponApplyGoods', path: 'm2c.scm/goods-out/coupon/apply', type: 'get' },
    { name: '获取活动优惠券列表', method: 'activityCouponPage', path: 'm2c.market/admin/coupon/activity/coupon/page', type: 'get' },
    // 订单管理
    { name: '订单列表', method: 'getOrderList', path: 'm2c.scm/admin/order', type: 'get' },
    // 票据管理
    { name: '票据列表', method: 'getInstrList', path: 'm2c.operate/ticket/list/', type: 'get' },
    // 客服管理
    { name: '获取业绩列表', method: 'getAchievement', path: 'm2c.operate/rep/staff', type: 'get' },
    { name: '投诉反馈列表', method: 'complaintList', path: 'm2c.operate/complaint/list', type: 'get' },
    { name: '获取用户ID', method: 'getUserId', path: 'm2c.users/user/list', type: 'get' },
    { name: '获取用户ID', method: 'addComplaint', path: 'm2c.operate/complaint/add', type: 'get' },
    { name: '投诉跟进', method: 'getComplaint', path: 'm2c.operate/complaint/det', type: 'get' },
    { name: '跟进提交', method: 'setComplaint', path: 'm2c.operate/complaint/rev', type: 'get' },
    { name: '删除静态内容', method: 'scontentDel', path: 'm2c.operate/scontent/del', type: 'post' },
    { name: '新增静态内容', method: 'scontentAdd', path: 'm2c.operate/scontent/add', type: 'post' },
    { name: '新增静态内容', method: 'scontentUpd', path: 'm2c.operate/scontent/upd', type: 'post' },
    // 财务管理
    { name: '获取收款列表', method: 'getAmountList', path: 'm2c.trading/web/account/platform/admin/amountList.web', type: 'get' },
    { name: '获取资金详情', method: 'getAmountDetails', path: 'm2c.trading/web/account/platform/admin/amount.web', type: 'get' },
    { name: '获取收款信息', method: 'getHering', path: 'm2c.trading/web/order/pay/gethering', type: 'get' },
    { name: '获取退款信息', method: 'getRefund', path: 'm2c.trading/web/order/pay/refund', type: 'get' },
    { name: '资金明细列表', method: 'getInoutDetail', path: 'm2c.trading/web/accounting/platform/inout/detail/page', type: 'get' },
    { name: '订单结算列表', method: 'getPlatformList', path: 'm2c.trading/web/withdrawal/platform/list', type: 'post' },
    { name: '打印凭证信息', method: 'getPrintDetail', path: 'm2c.trading/web/withdrawal/print/certificate', type: 'get' },
    { name: '打印凭证信息', method: 'printRecord', path: 'm2c.trading/web/withdrawal/add/printNum', type: 'post' },
    { name: '拒绝提现', method: 'applicationRefuse', path: 'm2c.trading/web/withdrawal/reject', type: 'post' },
    { name: '同意提现', method: 'applicationAgree', path: 'm2c.trading/web/withdrawal/approve', type: 'post' },
    { name: '财务备注', method: 'setRemarks', path: 'm2c.trading/web/withdrawal/comment', type: 'post' },
    { name: '租赁资金列表', method: 'leaseList', path: 'm2c.trading/web/account/rentAccountList.web', type: 'get' },
    { name: '租赁资金概括', method: 'rentAccount', path: 'm2c.trading/web/account/rentAccount.web', type: 'get' },
    // 渠道管理
    { name: '渠道列表', method: 'getChannelList', path: 'm2c.operate/channel/getChannelListByNameAndType', type: 'get' },
    { name: '创建渠道', method: 'addChannel', path: 'm2c.operate/channel/addChannel', type: 'post' },
    { name: '删除渠道', method: 'deleteChannel', path: 'm2c.operate/channel/deleteChannel', type: 'post' },
    { name: '明细数据列表', method: 'getchannelDetailsList', path: 'm2c.operate/channelDetails/list', type: 'get' },
    { name: '下载二维码', method: 'getQrcode', path: 'm2c.operate/channel/getQRCode/gen', type: 'get' }
]