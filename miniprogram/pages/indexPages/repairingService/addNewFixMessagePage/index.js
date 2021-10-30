import Notify from '../../../../miniprogram_npm/@vant/weapp/notify/notify.js';

const globalData = getApp().globalData

var util = require('../../../../util/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    columns: [],   //选择器的内容
    isShowPicker:false,    //是否显示选择器
    fixType:"请选择",
    fixAddress:"请选择",
    pickerFunxtion:"",       //选择器执行的函数
    submitTime:"",            //当前页面生成时的时间
    userName:"",
    userPhone:"",        //报修用户的手机号
    detailAddress:"",    //详细位置
    detailMessage:"",   //报修描述

    files:[],   //上传到云开发的图片文件名称
    localFiles:[],  //本地图片的地址

    savestatus: false,  //保存按钮禁用  防止多次提交
    dialogMessage:"",
    dialogShow:false
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
      submitTime:util.datePattern("yyyy-MM-dd HH:mm:ss")
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
   onClickIcon:function () {

  },

  showTypePicker(event){
    let columns = ['电子产品报修', '水电报修', '器材报修', '其他']
    this.setData({
      columns,
      pickerFunxtion:"onTypeChange",
      isShowPicker:true,
      fixType:"电子产品报修"
    })
    this
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
      isShowPicker:true,
      fixAddress:"教学楼A"
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
  },

  chooseImages: function (event) {
    var that = this;
    const { file, index } = event.detail;
    // 返回选定照片的本地文件路径列表
    let newFiles=[]
    let newLocalFiles = []
    for(let i =0;i<file.length;i++)
    {
      let url = file[i].url;
      let path = { url: url, name: "localFile" + i ,isImage: true}
      newLocalFiles = newLocalFiles.concat(path)
      let cloudPath = 'fixFiles/' + util.datePattern("yyyy-MM-dd") +'/fixImage' + url.replace(/[^0-9]/ig, "") + url.match(/\.[^.]+?$/);
      let json = { src: cloudPath, fileID: "" }
      newFiles = newFiles.concat(json)
    }
    that.setData({
      files:that.data.files.concat(newFiles),
      localFiles:that.data.localFiles.concat(newLocalFiles)
    });
  },

  deleteImages(event){
    const {index,file} = event.detail

    let newFiles = this.data.files
    let newLocalFiles = this.data.localFiles

    newFiles.splice(index, 1);
    newLocalFiles.splice(index, 1);

    //类似于java中的lambda表达式
    this.setData({
      files:newFiles,
      localFiles:newLocalFiles
      })
  },
  isPoneAvailable:function(phoneInput) {
    if (phoneInput == "" || phoneInput == undefined) {
      return false;
    }
    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phoneInput)) {
        return false;
    } else {
        return true;
    }
  },

  addFixMessageJudgment:function(){
    if (this.data.userName == "" ||this.data.userName == undefined) {
      Notify({ type: 'danger', message: '请输入联系人' });
      return false;
    }
    if (!this.isPoneAvailable(this.data.userPhone)) {
      Notify({ type: 'danger', message: '请输入正确的电话号码' });
      return false;
    }
    if (this.data.fixType == "请选择") {
      Notify({ type: 'danger', message: '请选择报修' });
      return false;
    }
    if (this.data.fixAddress == "请选择") {
      Notify({ type: 'danger', message: '请选择报修楼栋' });
      return false;
    }
    if (this.data.detailAddress == "" ||this.data.detailAddress == undefined) {
      Notify({ type: 'danger', message: '请输入详细位置' });
      return false;
    }
    if (this.data.detailMessage == "" ||this.data.detailMessage == undefined) {
      Notify({ type: 'danger', message: '请输入报修描述' });
      return false;
    }
    return true
  },

  uploadFixMessages:function(){
    const db = wx.cloud.database();
    var that = this;
    wx.showLoading({
      title: '正在上传信息',
      mask:true
    })
    let files = this.data.files.map(function(file) {
      return file.fileID
    })
    console.log(files)
    db.collection('fix_list').add({
      data: {
        userName:that.data.userName,
        userPhone:that.data.userPhone,      //报修用户的手机号
        userWXInfo:globalData.userInfo,
        submitTime: that.data.submitTime,
        fixType: that.data.fixType,
        fixAddress: that.data.fixAddress,
        detailAddress:that.data.detailAddress,   //详细位置
        detailMessage:that.data.detailMessage,  //报修描述
        files,
        fix_Status:"0",     //0 待修复  1 完成修复  2  推迟修复
        fixCompleteTime:"",
        fixCompletePersonName:"",
        fixCompletePersonWXInfo:"",
        fixCompletePerson_Phone:"",
        fixCompleteFiles:[],   // 完成修复上传的图片
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id 可以当作索引
        that.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        that.backBtnClick();
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        that.setData({
          dialogMessage: '新增报修失败，请检查网络',
          dialogShow:true,
          savestatus: false
        })
        wx.hideLoading()
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  addFixMessage:function () {
    if (!this.addFixMessageJudgment()) {
      return
    }
    var that = this;
    this.setData({
      savestatus:true
    },()=>{
      const length = this.data.localFiles.length;
      if (length == 0) {
        that.uploadFixMessages();
      }else{
        wx.showLoading({
          title: '正在上传图片',
          mask:true
        })
        //记录循环已经执行了的次数
        let filestimes = 0
        for (let j = 0; j < length; j++) {
          const cloudPath = that.data.files[j].src;
          const filePath = that.data.localFiles[j].url;
          wx.cloud.uploadFile({
            filePath,
            cloudPath,
            success: (res) => {
              console.log(res)
              const fID = 'files[' + j + '].fileID'
              that.setData({
                [fID]: res.fileID
              })
            },
            fail: (res) => {
              //上传文件失败
              console.error('[上传第' + j + '文件] 失败：', res)
              that.setData({
                dialogMessage: '[上传第' + j + '图片] 失败,请检查网络',
                dialogShow:true
              })
            },
            complete: (res) => {
              filestimes = filestimes + 1;
              if (filestimes == length) {
                that.uploadFixMessages();
              }
              else
                return
            },
          })
        }
      }
    })
  },

  onAddFixMessagesClick:function (event) {
    var that = this
    util.updateUserinfo().then(res =>{
      that.addFixMessage()
    })
  },

  backBtnClick:function (event) {
    wx.navigateBack({
      delta:1
    })
  }
})