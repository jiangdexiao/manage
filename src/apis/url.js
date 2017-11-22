let URL;
let href = window.location.href;
if (href.includes('m2c2017dev')) { // 开发环境
    URL = {
        base: 'http://api.m2c2017dev.com:80/',
        localbase: 'http://api.m2c2017local.com:80/'
    };
} else if (href.includes('m2c2017test')) { // 测试环境
    URL = {
        base: 'http://api.m2c2017test.com:80/',
        localbase: 'http://api.m2c2017test.com:80/'
    };
} else if (href.includes('localhost')) { // 本地环境
    URL = {
        base: 'http://api.m2c2017dev.com:80/',
        localbase: 'http://api.m2c2017local.com:80/'
    };
} else if (href.includes('http://10.0.40.90')) { // 本地环境
    URL = {
        base: 'http://api.m2c2017dev.com:80/',
        localbase: 'http://api.m2c2017local.com:80/'
    };
} else { // 演示环境
    URL = {
        base: 'http://api.m2c2017.com:80/',
        localbase: ''
    };
}

export default URL;