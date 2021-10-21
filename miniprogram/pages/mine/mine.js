// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    _openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    const updateManager = wx.getUpdateManager()
    // updateManager.onCheckForUpdate(function (res) {
    //   if(res.hasUpdate==true)
    //     updateManager.onUpdateReady(function () {
    //       wx.showModal({
    //         title: '更新提示',
    //         content: '新版本已经准备好，是否重启应用？',
    //         success: function (res) {
    //           if (res.confirm) {
    //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //             updateManager.applyUpdate()
    //           }
    //         }
    //       })
    //     })
      // updateManager.onUpdateFailed(function () {
      //   wx.showModal({
      //     title: '出现问题',
      //     content: '小程序更新出现问题，请检查网络',
      //     showCancel: false
      //   })
      // })
    // })
    // const that = this;
    // wx.getSetting({
    //   success: res => {
    //     console.log(res)
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     this.setData({
          //       username:res.userInfo.nickName,
          //       avatarUrl: res.userInfo.avatarUrl,
          //       userInfo: res.userInfo
          //     })
          //   }
          // })
        // }
    //   }
    // })
  },
})