// pages/indexPages/repairingService/fixDetailPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fixInformationList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取指定数据列表信息
    let that = this;
    wx.cloud.callFunction({
      name:"searchDatabaseByList",
      data:{
        listName:"fix_list",
        searchLimit:{
          _id:options.id
        }
      }
    }).then(res =>{
      console.log(res)
      that.setData({
        fixInformationList:res.result.data[0]
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})