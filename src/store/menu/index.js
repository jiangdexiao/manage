import * as types from '../mutations_type'

const state = {
  menus: []
}

const mutations = {
  [types.GET_MENU](state, menus) {
    state.menus = menus
  }
}


const actions = {
  getMenuAction: (context, res) => {
    context.commit(types.GET_MENU, res)
  }
}

export default {
  state,
  mutations,
  actions
}