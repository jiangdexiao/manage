import api from '../../apis/index'
import * as types from '../mutations_type'
import Vue from 'vue'

const state = {
  menus: []
}

const mutations = {
  [types.GET_MENU](state, menus) {
    state.menus = menus
  }
}


const actions = {
  getMenuAction: (context, user) => {
    api.common.getMenu({
      userId: user.userId,
      accessToken: user.token,
      moduleId: user.moduleId
    }).then((res) => {
      context.commit(types.GET_MENU, res)
    })
  }
}

export default {
  state,
  mutations,
  actions
}