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
import m_headLine from './modules/marketAdver/'

export default new Vuex.Store({
    state,
    actions,
    mutations,
    modules:{
        m_common,
        m_menu,
        m_user,
        m_headLine
    }
})