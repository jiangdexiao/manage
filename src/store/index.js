import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import state from './state'
import actions from './actions'
import mutations from './mutations'
//模块
import m_common from './modules/common/'
import m_menu from './modules/menu/'
import m_user from './modules/user/'

export default new Vuex.Store({
    // 开启严格模式 无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误...不要在发布环境下启用严格模式！
    strict: true,
    state,
    actions,
    mutations,
    modules:{
        m_common,
        m_menu,
        m_user
    }
})