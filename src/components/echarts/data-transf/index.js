var utils = {
  /*
  *时间切割 如：
  *  20171231 切为 12-31
  *
  */
  formatTime: function (d) {
    let formatDate = d.slice(4);
    let formatDateM = formatDate.slice(0, 2);
    let formatDateD = formatDate.slice(2);
    return formatDateM + '-' + formatDateD;
  },
  /*
  * 百分比转换
  * */
  toPercent: function (point) {
    var str = Number(point * 100).toFixed(2);
    return str
  },
  /*
  *
  * 将时间换成毫秒
  * */
  forTime(t) {
    if (t) {
      let d = new Date(t);
      let currentTime = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + (Number(d.getDate()));
      let unixTime = Date.parse(new Date(currentTime)) / 1000;
      return unixTime;
    } else {
      return ""
    }
  },

}
export default utils
