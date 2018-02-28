export default {
    format:(date,fmt)=>{
        if( !date )
            return '-'
        else if( typeof date !== Date)
            date = new Date(date)
        let o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
        return fmt
    },
    //获取该月的最后一天
    getDateDay:(date)=>{
        let new_date = new Date(date);
        let end_date = new Date(new_date.getFullYear(),new_date.getMonth()+1,1);
        let time = (new Date(end_date.getTime()-1000*60*60*24)).getDate();
        return date+"-"+time;
    },
    //获取后一个月时间
    getLastMonth:()=>{
        let date = new Date(), year, month;
        if( date.getMonth()===0){
            month = 12;
            year = date.getFullYear()-1
        }else {
            month = date.getMonth();
            year = date.getFullYear()
        }
        let time = year+"-"+month+"-"+date.getDate();
        return time
    },
    //验证日期大小
    compareDate:(dateStart, dateEnd)=> {
        let d1 = new Date(Date.parse(dateStart));
        let d2 = new Date(Date.parse(dateEnd));
        return d2 >= d1;
    },
    //检验是不是同一个月
    compareDateToMomth:(dateStart, dateEnd)=> {
        let d1 = new Date(Date.parse(dateStart));
        let d2 = new Date(Date.parse(dateEnd));
        return d2 <= d1;
    },
    //计算时间差天数
    diffDate:(maxDate,minDate)=>{
        let date = maxDate - minDate
        let days=Math.floor(date/(24*3600*1000))
        return days
    },
    //计算两个日期相隔天数，通用  //sDate1和sDate2是 2018-01-18格式  
    dateDiff:(sDate1,  sDate2)=> {    
        let  aDate,  oDate1,  oDate2,  iDays ; 
        //转换为12-18-2002格式
        aDate  =  sDate1.split("-")  
        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])      
        aDate  =  sDate2.split("-")  
        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
         //把相差的毫秒数转换为天数  
        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)   
        return  iDays  
    },
    /**
     * 获得今天为本年的第几周
     * 以周一为每周的第一天。
     */
    getWeekOfYear:(date)=>{
            var today = date?date:new Date()
            var firstDay = new Date(today.getFullYear(),0, 1);
            var dayOfWeek = firstDay.getDay(); 
            var spendDay= 1;
            if (dayOfWeek !=0) {
            spendDay=7-dayOfWeek+1;
            }
            firstDay = new Date(today.getFullYear(),0, 1+spendDay);
            var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
            var result =Math.ceil(d/7);
            return result+1;
    },
    /** 
    * 获得相对当前周AddWeekCount个周的起止日期 
    * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
    * **/ 
    getWeekStartAndEnd:(AddWeekCount)=>{ 
        //起止日期数组   
        var startStop = new Array(); 
        //一天的毫秒数   
        var millisecond = 1000 * 60 * 60 * 24; 
        //获取当前时间   
        var currentDate = new Date();
        //相对于当前日期AddWeekCount个周的日期
        currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
        //返回date是一周中的某一天
        var week = currentDate.getDay(); 
        //返回date是一个月中的某一天   
        var month = currentDate.getDate();
        //减去的天数   
        var minusDay = week != 0 ? week - 1 : 6; 
        //获得当前周的第一天   
        var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay)); 
        //获得当前周的最后一天
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
        //添加至数组   
        startStop.push(currentWeekFirstDay); 
        startStop.push(currentWeekLastDay); 
    
        return startStop; 
    } 
}