export default{
    textLength:(value,length,tag)=>{
        tag = tag?tag:'...'
        let str= value
        if(value){
            if(value.length > length){
                str = value.substring(0,length) + tag
            }
        }else{
            str='-'
        }
        return  str
    },
    getStrLength:(str)=>{  
        let realLength = 0;  
        if( str && str.trim().length >0){
            str = str.trim()
            for (let i = 0; i < str.length; i++)   
            {  
                charCode = str.charCodeAt(i);  
                if (charCode >= 0 && charCode <= 128)   
                realLength += 1;  
                else   
                realLength += 2;  
            }  
        }
        return realLength;  
    }, 
    getAprStatusName(aprStatus) {
        let txt = "-";
        switch (aprStatus) {
          case "11":
            txt = "下线-待审批";
            break;
          case "12":
            txt = "下线-审批通过";
            break;
          case "13":
            txt = "下线-审批不通过";
            break;
          case "21":
            txt = "上线-待审批";
            break;
          case "22":
            txt = "上线-审批通过";
            break;
          case "23":
            txt = "上线-审批不通过";
            break;
        }
        return txt;
      },
      //截取小数点后x位， 保留x位小数
    twoDecimal(value,placeN) {
        let place = placeN? placeN : 2;
        if(!value){
            value = '0.';
            while(value.length < 2+place){
                value += '0'
            }
            return value
        }
        value = value.toString();
        let i = value.indexOf('.');
        if(i<0){
            i = value.length;
            value += '.'
        }else{
            value = value.substring(0,value.indexOf('.')+ place+1);
        }
        while(value.length <= i+place){
            value += '0'
        }
        return value
    },
    //去掉前后空格
    trim(str){
        if(str && str.length>0){
            return str.replace(/^\s+|\s+$/gm,'')
        }else{
            return str
        }
    }
}