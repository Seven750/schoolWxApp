// pages/indexPages/repairingService/index/index.js
Component({
  properties: {
    //属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: true
    }
  },
  data: {
    option1: [
      { text: '全部报修', value: 0 },
      { text: '电子产品报修', value: 1 },
      { text: '水电报修', value: 2 },
      { text: '器材报修', value: 2 },
      { text: '其他报修', value: 4 },
    ],
    option2: [
      { text: '暂未维修', value: 'a' },
      { text: '已维修', value: 'b' },
    ],
    value1: 0,
    value2: 'a',
    fix_Status:0,

    pos:{},
    moveX:0,
    moveY:0,
    animationData: {},
    animation: {},
    isNeedAnimation:false,
    SYSTEMINFO: ''
  },

  ready() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          SYSTEMINFO: res
        })
      }
    })
    var animation = wx.createAnimation({
      timingFunction: 'ease-in-out',
    })

  },
  methods: {
    addBtnMove(e) {
      // 下面的动画是在上一次移动超出边界执行了移动回弹动画之后，抹除掉动画里的偏移值，否则的话会在下一次移动的时候，这个偏移值会加载移动的图标上(此时图标的坐标是跟触摸的坐标一样的，但是就是有偏移值)
      if (this.data.isNeedAnimation) {
        var animation = wx.createAnimation({
          timingFunction: 'linear',
        })
        animation.translate(0,0).step({ duration: 0 })
        this.setData({
          animationData:animation.export(),
          isNeedAnimation:false
        })
      }
      let windowWidth = this.data.SYSTEMINFO.windowWidth
      let windowHeight = this.data.SYSTEMINFO.windowHeight
      let touches = e.touches[0]
      // 下面之所以要减30  是因为view的size为80  中心点为40  但是有padding为16的边界，所以要减去30才能使得移动的时候，显示是移动view的中心点
      let clientX = touches.clientX - 24
      let clientY = touches.clientY - 24

      console.log("move函数中的x和y" + clientX , clientY)
      console.log("datta函数中的x和y" + this.data.pos.left , this.data.pos.top)
      // 边界判断
      // if (clientX > windowWidth - 80) {
      //   clientX = windowWidth - 80
      // }
      // if (clientX <= 20) {
      //   clientX = 20
      // }
      // if (clientY > windowHeight - 90) {
      //   clientY = windowHeight - 90
      // }
      // if (clientY <= 60) {
      //   clientY = 60
      // }
      let pos = {
        left: clientX,
        top: clientY
      }
      this.setData({
        pos,
      })
    },

    addBtnTouchEnd(e){
      let isNeedAnimation = false
      let windowWidth = this.data.SYSTEMINFO.windowWidth
      let windowHeight = this.data.SYSTEMINFO.windowHeight

      let touches = e.changedTouches[0]
      let clientX = touches.clientX - 24
      let clientY = touches.clientY - 24

      let moveX = 0
      let moveY = 0

      if (clientX > windowWidth - 80) {
        moveX = windowWidth - 80 - clientX
        clientX = windowWidth - 80    
        isNeedAnimation = true
      }
      if (clientX <= 20) {
        moveX = 20 - clientX
        clientX = 20
        isNeedAnimation = true
      }
      if (clientY > windowHeight - 100) {
        moveY = windowHeight - 100 - clientY
        clientY = windowHeight - 100
        isNeedAnimation = true
      }
      if (clientY <= 60) {
        moveY = 60 - clientY
        clientY = 60
        isNeedAnimation = true
      }
      if (isNeedAnimation) {
        var animation = wx.createAnimation({
          timingFunction: 'ease-in-out',
        })
        animation.translate(moveX,moveY).step({ duration: 800 })
        // animation.top(clientY).left(clientX).step({duration:300})
        this.setData({
          animationData:animation.export(),
        })
      }
      setTimeout(() =>{
        this.setData({
            pos:this.data.pos,
            isNeedAnimation
          })
      }, 800)
      // this.setData({
      //   pos:pos
      // })
    },

    navigateToAddFixMessagePage(e){
      wx.navigateTo({
        url: '../addNewFixMessagePage/index',
      })
    }
  }
})