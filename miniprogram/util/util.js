
const app = getApp()
const globalData = app.globalData


export function updateUserinfo(){
  return new Promise((resolve,reject) =>{
  var timeNow = this.datePattern("yyyy-MM-dd HH:mm:ss")
  var timeOut = (this.getDaysBetween(globalData.userInfoUpdataTime,timeNow) > 7)
  //如果授权了，数据库里有信息，并且时间没有超过七天，则返回
  if (globalData.authorized && !timeOut) {
    resolve("authorized && Not timeOut")
    return
  }
  var that = this
  const db = wx.cloud.database();
  //如果没有记录的话，就新增
  //如果时间太久了就更新
  wx.getUserProfile({ 
    desc: '用于显示用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      const {userInfo} = res
      if (!globalData.authorized) {
        wx.showLoading({
          title: '正在上传用户名字及头像',
          mask:true
        })
        //如果没有授权,即列表当中没有该用户的数据，则添加
        db.collection("userInfo_list").add({
          data:{
            userInfo:userInfo,
            userInfoUpdataTime:timeNow,
            openid:globalData.openid
          }
        }).then(res =>{
          globalData.userWXInfo = userInfo
          globalData.authorized = true
          globalData.userInfoUpdataTime = that.datePattern("yyyy-MM-dd HH:mm:ss")
          resolve(res)
        }).catch(console.error)
      }else if (timeOut){
        wx.showLoading({
          title: '正在更新用户名字及头像',
          mask:true
        })
        //有记录并且时间已经超过七天了
        db.collection("userInfo_list").where({
          openid:globalData.openid
        }).update({
          data:{
            userInfo:userInfo,
            userInfoUpdataTime:that.datePattern("yyyy-MM-dd HH:mm:ss")
          }
        }).then(res =>{
          globalData.userInfo = userInfo
          globalData.authorized = true
          globalData.userInfoUpdataTime = that.datePattern("yyyy-MM-dd HH:mm:ss")
          resolve(res)
        })
      }
    },
    fail:(res) =>{
      //用户拒绝授权的话，则不能发布
      console.log(res)
    }
  })
  })
  
}
/**
 * 将两个string类型的日期进行日期差值的比较
 * 
 * **/ 
export function  getDaysBetween(startDate,endDate){
  return (Date.parse(endDate) - Date.parse(startDate))/(1*24*60*60*1000);
}
/**
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 * Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
export function datePattern (fmt) {
  var data = new Date()
  var o = {
    "M+": data.getMonth() + 1,
    //月份
    "d+": data.getDate(),
    //日    
    "h+": data.getHours() % 12 == 0 ? 12 : data.getHours() % 12,
    //小时
    "H+": data.getHours(),
    //小时
    "m+": data.getMinutes(),
    //分
    "s+": data.getSeconds(),
    //秒
    "q+": Math.floor((data.getMonth() + 3) / 3),
    //季度
    "S": data.getMilliseconds() //毫秒
  };
  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[data.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
