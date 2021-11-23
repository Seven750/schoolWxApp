// pages/indexPages/reservationService/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    noticeList:[
      '   预约系统仅供在读永州师专学生使用。',
      '   预约成功后若无法前往请及时取消，若预约成功后违约，一个月仅能违约三次，超出则无法再次预约。'
    ],
    routers: [
      {
        name: '琴房预约',
        url: '',
        icon: '../../../../images/piano_reservation.png'
      },
      {
        name: '电子阅览室预约',
        url: '',
        icon: '../../../../images/readingRoom_reservation.png'
      },
       {
        name: '教室预约',
        url:'',
        icon:'../../../../images/classroom_reservation.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

})