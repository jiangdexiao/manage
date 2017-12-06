import * as types from '../../types'
const mutations = {
    [types.SET_USER](state) {
        let user = sessionStorage.getItem('user')
        state.userInfo = user?JSON.parse(user):{}
    }
  }
export default mutations