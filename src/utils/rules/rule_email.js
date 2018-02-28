
/**验证邮箱 */
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (value && !validate.email(value)){
        return callback(new Error('请输入正确邮箱地址'));
    }
    callback()
}