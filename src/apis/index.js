
/**
 * 所有接口配置模块
 */
import common from './common/'
import user from './user/'
import mediaManagePlatform from './mediaManagePlatform/'
import mediaSaleManagePlatform from './mediaSaleManagePlatform/'
import sellerManagePlatform from './sellerManagePlatform/'
import businessManagePlatform from './businessManagePlatform/'
import biManagePlatform from './biManagePlatform/'
import customManagePlatform from './customManagePlatform/'

export default [
    {
        module: 'common',
        name: '公共模块',
        list: common
    },
    {
        module: 'user',
        name: '用户模块',
        list: user
    },
    {
        module: 'mediaManagePlatform',
        name: '媒体管理',
        list: mediaManagePlatform
    },
    {
        module: 'mediaSaleManagePlatform',
        name: '媒体行销',
        list: mediaSaleManagePlatform
    },
    {
        module: 'sellerManagePlatform',
        name: '商家管理',
        list: sellerManagePlatform
    },
    {
        module: 'businessManagePlatform',
        name: '运营管理',
        list: businessManagePlatform
    },
  {
        module: 'biManagePlatform',
        name: 'BI系统',
        list: biManagePlatform
    },
  {
        module: 'customManagePlatform',
        name: 'C端工具组',
        list: customManagePlatform
    }
]
