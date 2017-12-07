import * as types from '../../types'
const mutations = {
    [types.SET_USER](state) {
        let user = sessionStorage.getItem('userInfo')
        state.userInfo = user?JSON.parse(user):{}
    }
  }
export default mutations