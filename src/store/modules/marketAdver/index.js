import * as types from '../../types'
const state = {
	//头条信息
	headLineInfo:null,
	type:''
}
const mutations = {
	[types.SET_HEADLINEINFO](state,data) {
			state.headLineInfo =data
			console.log(">"+state.headLineInfo)
	},
	[types.SET_TYPE](state,type) {
			state.type = type
	}
}
const actions = {
	setHeadLineInfo:(context,data)=>{
			context.commit(types.SET_HEADLINEINFO,data)
	},
	setType:(context,type)=>{
			context.commit(types.SET_TYPE,type)
	},
}
export default { 
	state,
	mutations,
	actions
}