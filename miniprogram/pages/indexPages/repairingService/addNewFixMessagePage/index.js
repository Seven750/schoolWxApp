Page({
  /**
   * 页面的初始数据
   */
  data: {
    columns: [],
    isShowPicker:false,
    fixType:"请选择",
    fixAddress:"请选择",
    pickerFunxtion:"",
    submitTime:"",
    userName:"",
    userPhone:"",
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
    this.setData({
      submitTime:this.formatDateTime()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
   onClickIcon:function () {

  },
  // 时间格式转换
  // 用new Date().toLocaleString( )也可以，但是有上午下午，不是24小时制
  formatDateTime() { 
    var date = new Date();
    var y = date.getFullYear(); 
    var m = date.getMonth() + 1; 
    m = m < 10 ? ('0' + m) : m; 
    var d = date.getDate(); 
    d = d < 10 ? ('0' + d) : d; 
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute; 
    second = second < 10 ? ('0' + second) : second; 
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
   },

  showTypePicker(){
    let columns = ['电子产品报修', '水电报修', '器材报修', '其他']
    this.setData({
      columns,
      pickerFunxtion:"onTypeChange",
      isShowPicker:true
      
    })
  },
  onTypeChange(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      fixType:value
    })
  },

  showAddressPicker(){
    let columns = ['教学楼A', '教学楼B', '教学楼C', '实训楼A','实训楼B','艺术楼','美术书法楼','女生宿舍一栋','女生宿舍二栋','男生宿舍','青年公寓','体育馆','其他位置']
    this.setData({
      columns,
      pickerFunxtion:"onAddressChange",
      isShowPicker:true
    })
  },

  onAddressChange(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      fixAddress:value
    })
  },

  onClose(){
    this.setData({
      isShowPicker:false
    })
  }

})