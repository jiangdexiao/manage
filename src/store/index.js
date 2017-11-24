import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import m_menu from './menu/index'
import m_user from './user/index'

export default new Vuex.Store({
    modules:{
        m_menu,
        m_user
    }
})