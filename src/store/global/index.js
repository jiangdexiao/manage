
import * as types from '../mutations_type'

const state = {
    ajax_loading: false
}

const mutations = {
    [types.SHOW_LOADING] (state) {
      state.ajax_loading = true
    },
  
    [types.HIDE_LOADING] (state) {
      state.ajax_loading = false
    }
}

const actions = {
    show_loading: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.SHOW_LOADING)
            resolve()
        })
    },
    hide_loading: ({commit}) => {
        return new Promise((resolve, reject) => {
            commit(types.HIDE_LOADING)
            resolve()
        })
    }
}

export default {
    state,
    mutations,
    actions
  }
  