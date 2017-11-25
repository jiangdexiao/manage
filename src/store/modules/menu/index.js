import * as types from '../../types'

const state = {
  menus: []
}

const mutations = {
  [types.GET_MENU](state, menus) {
    console.log(`mutations:${types.GET_MENU+JSON.stringify(menus)}`)
    state.menus = menus
  }
}


const actions = {
  getMenuAction: (context, res) => {
    console.log('getMenuAction')
    context.commit(types.GET_MENU, res)
  }
}

export default {
  state,
  mutations,
  actions
}