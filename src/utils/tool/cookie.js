const cookie = {
    setCookie (cname,cvalue,exdays,path,domin) {
        let d = new Date();
        d.setTime(d.getTime()+(exdays*12*60*60*1000));
        let expires = `expires=${d.toGMTString()};`;
        if( path ){
            expires += `path=${path};`
        }
        if( domin ){
            expires += `domin=${ domin };`
        }
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie (cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        let _cookie = null
        for(var i=0; i<ca.length; i++) 
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                _cookie = c.substring(name.length,c.length) 
                break
            }  
        }
        return _cookie;
    },
    delCookie(cname){
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = cookie.getCookie(cname);
        if(cval!=null)
            document.cookie= cname + "="+cval+";expires="+exp.toGMTString();
    }
}

export default cookie