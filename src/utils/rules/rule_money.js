
/**验证金钱  */
/**例：false:  0.  ， 00  ， 050 ，  70.002  ，051.12*/
/**例：true:  0.0  ， 0  ， 50 ，  70.000  ，51.12  , 51.1*/
import validate from '../tool/validate.js'
export default function(rule, value, callback){
    if (value && !validate.money(value)){
        return callback(new Error('请输入有效的金额'));
    }
    callback()
}