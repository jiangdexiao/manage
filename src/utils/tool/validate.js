const validate = {
    //验证非空
    isEmpty(value, text) {
        return value;
    },
    //验证身份证
    idCard(value) {
        return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
    },
    //验证最少字符
    minLength(value, num) {
        return value.length >= num;
    },
    //验证最大字符
    maxLength(value, num) {
        return value.length <= num;
    },
    email(value){
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i.test(value.trim())
    },
    //验证电话号码(固话)
    phone(value) { //  /(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/
        return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value.trim());
    },
    // 验证手机号码
    mobile(value) {
        return /^(13|14|15|18|17)\d{9}$/i.test(value.trim());
    },
    //验证电话和手机号码
    mobileAndTel(value) { ///^1\d{10}$|^(0\d{2,3}[-+]*|\(0\d{2,3}\))?[2-9]\d{4,7}([-+]*\d{1,8})?$/
        return /(^(\d{3,4}-)?\d{7,8})$|^1[3|4|5|7|8][0-9]\d{8}$/i.test(value.trim());
    },
    // 验证整数或小数
    intOrFloat(value) {
        return /^\d+(\.\d+)?$/i.test(value);
    },
    // 验证整数 可正负数
    integer(value) {
        return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
    },
    // 只能是正整数
    numOnly(value) {
        return /^[1-9]\d*$/.test(value);
    },
    //验证只能输入min - max 之间的正整数
    numRange(value, min, max) { //  /^([1-9]\d{0,3}|10000)$/
        return /^[1-9]\d*$/.test(value) && value >= min && value <= max;
    },
    // 验证货币
    currency(value) {
        return /^\d+(\.\d+)?$/i.test(value);
    },
    //验证有效的货币 可两位有效的小数 
    money(value) {
        return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value);
    }, 
    //验证分成金额  最多4位有效小数
    shareMoney(value) {
        return /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,4}?$)/.test(value);
    },
    // 验证QQ,从10000开始
    qq(value) {
        return /^[1-9]\d{4,9}$/i.test(value);
    },
    // 验证年龄
    age(value) {
        return /^(([1-9]\d?)|100)$/i.test(value);
    },
    //验证中文
    chinese(value) {
        return /^[\u4E00-\u9FA5]+$/i.test(value);
    },
    //验证是否包含中文
    isChinese(value){
        return /.*[\u4e00-\u9fa5]+.*$/.test(value);
    },
    // 验证英文
    english(value) {
        return /^[A-Za-z]+$/i.test(value);
    },
    // 验证是否包含空格和非法字符
    unnormal(value) {
        return /.+/i.test(value);
    },
    //验证密码
    password(value) {
        // return /^(?![^a-z]+$)(?![^A-Z]+$)(?!\D+$).{8,16}$/i.test(value);
        return /^[a-zA-Z\d\s~!@#$%^&*]+$/i.test(value);
    },
    // 验证邮政编码
    zip(value) {
        return /^[1-9]\d{5}$/i.test(value);
    },
    // 验证IP地址
    ip(value) {
        return /d+.d+.d+.d+/i.test(value);
    },
    //验证日期格式
    date(value) { //格式yyyy-MM-dd或yyyy-M-d
        return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
    }
}

export default validate