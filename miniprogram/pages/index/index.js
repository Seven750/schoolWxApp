//index.js
const app = getApp()


Page({

  data: {
    background: ['../../images/home-page1.jpg', '../../images/home-page2.jpg', '../../images/home-page3.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular:true,
    interval: 2000,
    duration: 500,
    swiperHeight:'',

    inputShowed: false,
    inputVal: "",

    routers: [
      {
        name: '官方网站',
        url: 'http://www.hnyznc.com/',
        icon: '../../images/official-icon.png'
      },
      {
        name: '一卡通',
        url: '',
        icon: '../../images/card-icon.png'
      },
      {
        name: '预约系统',
        url: '',
        icon: '../../images/order-icon.png'
      },
       {
        name: '资源平台',
        url:'',
        icon:'../../images/platform-icon.png' 
      },
       {
        name: '综合服务',
        url:'',
        icon:'../../images/integrated-services-icon.png' 
      },
       {
        name: '故障报修',
        url:'../indexPages/repairingService/index/index',
        icon:'../../images/breakdown-icon.png' 
      }
    ]
  },
  imgH:function(e){
        var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
        var imgh=e.detail.height;　　　　　　　　　　　　　　　　//图片高度
        var imgw=e.detail.width;
        var swiperH=winWid*imgh/imgw + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
        this.setData({
            swiperHeight:swiperH　　　　　　　　//设置高度
        })
    },

  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      this.setData({
          inputVal: e.detail.value
      });
  },
  onChange(event) {
    wx.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: 'none',
    });
  },
})