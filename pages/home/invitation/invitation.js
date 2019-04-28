// pages/home/invitation/invitation.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl: '' //二维码地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCodeImg();
    var param = {
      UserID: wx.getStorageSync('UserID'),
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/GetAgentUserQrCode', 'POST', param,
      (res) => {
        this.setData({
          codeUrl: res.data.DATA
        })
        console.log(this.data.codeUrl);
      })
    var param = {
      UserID: wx.getStorageSync('UserID'),
    }
    console.log("获取数据时传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/GetAgentUserQrCode', 'POST', param,
      (res) => {
        this.setData({
          codeUrl: res.data.DATA
        })
        console.log(this.data.codeUrl);
      })
  },
  /**
   * 点击开始的时间
   */
  timestart: function(e) {
    var _this = this;
    _this.setData({
      timestart: e.timeStamp
    });
  },

  /**
   * 点击结束的时间
   */
  timeend: function(e) {
    var _this = this;
    _this.setData({
      timeend: e.timeStamp
    });
  },
  /*
   * 保存二维码到相册
   */
  saveCodeImg: function(e) {
    var _this = this;

    var times = _this.data.timeend - _this.data.timestart;

    var imgUrl = _this.data.codeUrl;
    if (times > 300) {
      console.log('222');
      wx.getSetting({
        success: function(res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function(res) {
              //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
              wx.downloadFile({
                url: imgUrl,
                success: function(res) {
                  // 下载成功后再保存到本地
                  console.log(res.tempFilePath);
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function(res) {
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  /*
   * 打开规则页面
   */
  openRule: function() {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /*
  * 获取二维码图片
  */
  getCodeImg(){
    var param = {
      UserID: wx.getStorageSync('UserID'),
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/GetAgentUserQrCode', 'POST', param,
      (res) => {
        this.setData({
          codeUrl: res.data.DATA
        })
        console.log(this.data.codeUrl);
      })
  }
})