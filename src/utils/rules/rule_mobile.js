
/**验证手机 */
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (!value) {
        return callback(new Error('请输入登录手机号'));
    }
    else if ( !validate.mobile(value)){
        return callback(new Error('登录手机号格式不正确，请输入正确的手机号'));
    }
    callback()
}