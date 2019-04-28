// pages/setting/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 打开用户端 
   */
  bindUserSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb16e70ee139561f1', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },
  /*
  * 打开设置银行卡页面
  */
  setBank: function () {
    wx.navigateTo({
      url: '../setBank/setBank',
    })
  },

  /**
   * 打开门店
   */
  bindStoreSys: function () {
    wx.navigateToMiniProgram({
      appId: 'wxce5bc16545128121', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开工人端
   */
  bindWorkerSys: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb1a138c89c8fbbc2', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 打开推客端
   */
  bindSpreadSys: function () {
    wx.navigateToMiniProgram({
      appId: 'wxccbf5f0d98de9697', // 要跳转的小程序的appid
      path: 'pages/login/login/login', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 修改密码
   */
  modifyPassword: function() {
    wx.navigateTo({
      url: '../modifyPwd/modifyPwd'
    })
  },

  /**
   * 修改手机号码
   */
  modifyPhoneNum: function() {
    wx.navigateTo({
      url: '../modifyPhoneNum/modifyPhoneNum'
    })
  },

  openCustomer: function() {
    wx.navigateTo({
      url: '../customerService/customerService',
    })
  },

  /**
   * 关于飞雳士
   */
  about: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      title: '温馨提示',
      content: '是否确定退出登录',
      success: function(res) {
        console.log(JSON.stringify(res));
        if (res.confirm) {
          //清除当前用户的登录信息
          wx.clearStorageSync();
          wx.showToast({
            title: '正在退出登录，请稍后...',
            icon: 'none',
            duration: 2000,
            complete: function() {
              wx.reLaunch({
                url: '../../login/login/login',
              })
            }
          })

        } else {
          return false;
        }
      }
    })

  }

})