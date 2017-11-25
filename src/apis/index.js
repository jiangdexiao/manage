
/**
 * 所有接口配置模块
 */
import common from './common/'
import user from './user/'

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
    }
]