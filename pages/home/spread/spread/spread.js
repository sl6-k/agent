// pages/home/spread/spread.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentCode: '', //存储二维码路径

  },


  /**
   * 获取邀请信息
   */
  getInvite: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/GetUserQrCode', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          that.setData({
            paymentCode: res.data.DATA
          })

          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
        } else {
          //错误提示
          wx.showModal({
            showCancel: false,
            content: res.data.ERROR_MESSAGE
          });
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        }
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
  /**
   * 保存图片
   */
  saveImg: function(e) {
    var _this = this;
    var times = _this.data.timeend - _this.data.timestart;
    var imgUrl = _this.data.paymentCode;
    if (times > 300) {
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
      url: '../../rule/rule',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInvite();
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

  }
})