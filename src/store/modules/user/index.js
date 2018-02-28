// userInfo = {
//     account :"13475656565",
//     age: 23,
//     areaCode: "430305",
//     areaName:"湘潭县",
//     bdId:"18BDF9C356C32CAF4C8DAE26AB3F57F1AF3B",
//     bdMobile:"13475656565",
//     bdName:"斯蒂芬",
//     cateCode:"120002",
//     cateName:"分类6",
//     cityCode:"430300",
//     cityName:"湘潭市",
//     createDate:null,
//     email:"",
//     followCount: null,
//     isValid :null,
//     lastLoginDate:1513330738968,
//     mediaCate:"120002",
//     orderNum:0,
//     orgId: "18ORE8A5D536D48D4FB9869F6DC548D59D1F",
//     orgInfoList:[],
//     parentBdAccount:"15966666666",
//     parentBdId:"18BDE584AB8F9A7344C6AA788FA8C2575997",
//     parentBdName :"广告",
//     parentCateCode:"120000",
//     parentCateName:"分类二",
//     proCode:"430000" ,
//     proName:"湖南省",
//     recordCount:null,
//     regionCode:"430305",
//     registerTime:1509365123147,
//     roleType: 1,
//     selfRatio:null,
//     sex :1,
//     subBdContributeMap:null,
//     subCount :7,
//     userId :"SYSA703F24ED3605461ABF1E995CC2AAE0E7"
// }
import * as types from '../../types'
const state = {
    //登录用户信息
    userInfo:null
}
const getters = {
    getUser:state=>state.userInfo
}

const mutations = {
    [types.SET_USER](state) {
        let user = sessionStorage.getItem('userInfo')
        state.userInfo = user?JSON.parse(user):{}
    },
    [types.SET_MODULEID](state,modules) {
        // let userjson = sessionStorage.getItem('userInfo')
        // let user = JSON.parse(userjson)
        // user.moduleId = modules
        // sessionStorage.setItem('userInfo',JSON.stringify(user))
    }
  }

  const actions = {
    setUser:(context)=>{
        context.commit(types.SET_USER)
    }
  }
export default { 
    state,
    mutations,
    actions,
    getters 
}