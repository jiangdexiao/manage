let BASEURL = 'http://api.m2c2017local.com:80/'
let BI_BASEURL = 'http://api.m2c2017local.com:80/'

let href = window.location.href
if (href.includes('m2c2017local') || href.includes('localhost')) { 
    // 开发环境
    BASEURL = 'http://api.m2c2017local.com:80/'
    BI_BASEURL = 'http://api.m2c2017test.com:80/'
} else if (href.includes('m2c2017dev')) { 
    // 开发环境
    BASEURL = 'http://api.m2c2017local.com:80/'
    BI_BASEURL = 'http://api.m2c2017local.com:80/'
} else if (href.includes('m2c2017test')) { 
    // 测试环境
    BASEURL = 'http://api.m2c2017test.com:80/'
    BI_BASEURL = 'http://api.m2c2017test.com:80/'
} else if (href.includes('m2c2017final')) {
     // 预演环境  
     BASEURL = 'http://api.m2c2017final.com:80/'
     BI_BASEURL = 'http://api.m2c2017final.com:80/'
} else { 
    // 演示环境
    BASEURL = 'http://api.m2c2017.com:80/'
    BI_BASEURL = 'http://api.m2c2017.com:80/'
}
export {
    BASEURL,
    BI_BASEURL
} 
