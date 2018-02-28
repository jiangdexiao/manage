import * as types from '../../types'

const state = {
  menus:null
}

const getters = {
  getMenus:state=>state.menus
}

const mutations = {
  [types.GET_MENU](state, menus) {
    let menu = sessionStorage.getItem('menus')
    state.menus = menu?JSON.parse(menu):{}
  }
}


const actions = {
  setMenu: (context, menus) => {
    
    context.commit(types.GET_MENU, menus)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}