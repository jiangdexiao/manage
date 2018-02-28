/**验证年龄 */
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (!value) {
        return callback(new Error('请输入年龄'));
    }
    else if ( value <0 || value >100 || !validate.age(value)){
        return callback(new Error('年龄请输入0-100的整数'));
    }
    callback()
}