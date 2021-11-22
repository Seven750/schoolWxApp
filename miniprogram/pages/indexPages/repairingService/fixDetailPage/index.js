// pages/indexPages/repairingService/fixDetailPage/index.js

const globalData = getApp().globalData
var util = require('../../../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fixInformationList:{},
    active:0,
    management:false,
    fixReason:"",
    localFiles:[],   //本地照片路径
    files:[],
    radio:"0",
    savestatus:false,  //预防用户多次点击上传按钮
    steps: [
      {
        text: '上报维修',
      },
      {
        text: '维修接单',
      },
      {
        text: '维修完成',
      },
    ],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
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
      let active = 0;
      if (res.result.data[0].fix_Status > 0) {
        active = 2;
      }else{
        active = res.result.data[0].fixAccepted ? 1 : 0;
      }
      that.setData({
        fixInformationList:res.result.data[0],
        management:globalData.management,
        active
      },()=>{
        wx.hideLoading({
          success: (res) => {},
        })
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

  },

   //预览图片，放大预览
   previewPic:function(event) {
    let currentUrl = event.currentTarget.dataset.src
    // let currentFileId = event.currentTarget.dataset.fileid
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: event.currentTarget.id == "fixCmplImage" ? this.data.fixInformationList.fixCompleteFiles :this.data.fixInformationList.files // 需要预览的图片http链接列表
    })
  },

  fixBtnRequest:function (e) {
    //update数据库，将自己的openid写入进去
    const db = wx.cloud.database();
    var that = this;
    db.collection('fix_list').where({
      _id:that.data.fixInformationList._id
    }).update({
      data: {
        fixCompletePersonName:globalData.managerName,
        fixCompletePersonWXInfo:globalData.userWXInfo,
        fixCompletePerson_Phone:globalData.managerPhone,
        fixCompletePersonOpenid:globalData.openid,
        fixAccepted:true
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id 可以当作索引
        // that.setData({
        //   counterId: res._id,
        //   count: 1
        // })
        wx.showToast({
          title: '接单成功',
        })
        // that.backBtnClick();
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        let options={id:res._id}
        that.onLoad(options)
      },
      fail: err => {
        that.setData({
          dialogMessage: '接单失败，请检查网络',
          dialogShow:true,
          savestatus: false
        })
        wx.hideLoading()
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onChangeFix_status:function (e) {
    this.setData({
      radio:e.detail
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
      let cloudPath = 'fixCompleteFiles/' + util.datePattern("yyyy-MM-dd") +'/fixCplImage' + url.replace(/[^0-9]/ig, "") + url.match(/\.[^.]+?$/);
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

  addFixMessageJudgment:function(){
    if (this.data.radio == "0") {
      Notify({ type: 'danger', message: '请选择维修结果' });
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
    db.collection('fix_list').where({
      _id:that.data.fixInformationList._id
    }).update({
      data: {
        fix_Status:parseInt(that.data.radio),     //0 待修复  1 完成修复  2  推迟修复
        fixCompleteTime:util.datePattern("yyyy-MM-dd HH:mm:ss"),
        fixReason:that.data.fixReason,
        fixCompleteFiles:files,   // 完成修复上传的图片
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id 可以当作索引
        // that.setData({
        //   counterId: res._id,
        //   count: 1
        // })
        wx.showToast({
          title: '维修完成',
        })
        let options={id:res._id}
        that.onLoad(options)
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

  updateFixMessage:function () {
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
})