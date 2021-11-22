//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        env: 'yzsf-database-6g3s2gge179f5313'
      })
    }
    //初始化
    this.globalData = {
      // appid,
      // openid,
      // authorized,
      // userWXInfo,
      // userInfoUpdataTime
      //that.globalData.management  是否为管理员
    }

    let that = this
    wx.cloud.callFunction({
      name:"login"
    }).then(res =>{
      that.globalData.appid = res.result.appid;
      that.globalData.openid = res.result.openid;
      //查询该openid是否为管理人员

      wx.cloud.callFunction({
        name:"searchDatabaseByList",
        data:{
          listName:"management_list",
          searchLimit:{
            _openid:res.result.openid
          }
        }
      }).then(res =>{
        if (res.result.data.length > 0) {
          const {managerName,managerPhone} = res.result.data[0]
          that.globalData.management = true;
          that.globalData.managerName = managerName;
          that.globalData.managerPhone = managerPhone;
        }else{
          that.globalData.management = false;
        }
      })
    })
  }
})
