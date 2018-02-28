
/**手机和固话 */
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (!value) {
        return callback(new Error('请输入联系电话'));
    }
    else if ( !validate.mobileAndTel(value)){
        return callback(new Error('联系电话格式不正确，请输入正确的固定电话或手机号'));
    }
    callback()
}