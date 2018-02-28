
/**验证密码 */
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (!value) {
        return callback(new Error('请输入登录密码'))
    }
    else if( value.length < 6){
        return callback(new Error('密码最少6位'))
    }
    else if( value.length > 16){
        return callback(new Error('密码最多16位'))
    }
    else if( !validate.password(value) ){
        return callback(new Error('密码只能输入英文,数字和特殊字符！@#￥%.&*'))
    }
    callback()
}