export default{
    // 清除对象中的值  
    clearData: (obj) => {
        for (let pro in obj) {
            if(obj[pro] instanceof Array){
                obj[pro] = [];
            }else {
                obj[pro] = "";
            }
        }
        return obj
    },
    //对象参数赋值,   obj：将要赋值的 （空对象），  dataObj：从此对象中取值（有值）
    assignData: (obj, dataObj) => {
        for (var key in obj) {
            if (dataObj[key]===0 || (dataObj[key]!==null && dataObj[key]!==undefined)) {
                obj[key] = dataObj[key];
            } else {
                if(obj[key] instanceof Array){
                    obj[key] = []
                }else {
                    obj[key] = "";
                }

            }
        }
        return obj
    },
    //对象或数组 或数组对象的深拷贝
    objDeepCopy: (source) => {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.a.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy
    },    
}