// pages/login/login/login.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: {}, //登录信息
    agentUserCode: '', //代理编码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (util.whetherLogin()){
      this.setData({
        ['login.phoneNum']: wx.getStorageSync('phoneNum'),
        ['login.userPwd']: wx.getStorageSync('userPwd')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getOpenId();
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
   * 登录
   */
  login: function() {
    var phoneNum = this.data.login.phoneNum;
    var userPwd = this.data.login.userPwd;
    var phoneReg = '/^1[34578]\d{9}$/'; //正则校验手机号码
    if (phoneNum == undefined || phoneNum == '' || phoneNum==null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (userPwd == undefined || userPwd=='' || userPwd==null) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //添加当前用户的登录信息
    this.loginFun();
  },

  /**
   * 输入手机号
   */
  getPhoneNum: function(e) {
    this.setData({
      ["login.phoneNum"]: e.detail.value
    });
  },

  /**
   * 输入密码
   */
  getUserPwd: function(e) {
    this.setData({
      ["login.userPwd"]: e.detail.value
    });
  },

  /**
   * 调用登录的方法
   */
  loginFun: function() {
    var that = this;
    var phoneNum = that.data.login.phoneNum; //登录手机号
    var userPwd = that.data.login.userPwd; //登录密码
    wx.showLoading({
      title: '正在登录...',
    })
    var param = {
      UserName: phoneNum,
      Password: userPwd,
      code: '',
      toDecrypt: '',
      ivBytes: '',
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersLogin', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log(res);
          wx.setStorageSync("phoneNum", phoneNum);
          wx.setStorageSync("userPwd", userPwd);
          wx.setStorageSync("UserID", res.data.DATA.UserID);
          wx.showToast({
            title: '登录成功，跳转到首页',
            icon: 'success',
            duration: 1000,
            complete: function() {
              wx.reLaunch({
                url: '/pages/home/home/home',
              })
            }
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
          //没有更多了
          that.setData({
            loadingComplete: true
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

  // /**
  //  * 微信一键登录
  //  */
  // getPhoneNumber: function(e) {
  //   var that = this;
  //   var ency = e.detail.encryptedData;
  //   var iv = e.detail.iv;
  //   var code = that.data.code;
  //   if (e.detail.errMsg != "getPhoneNumber:ok") {} else {
  //     that.oneKeyLogon(code, ency, iv);
  //   }
  // },

  // /**
  //  * 一键登录方法
  //  */
  // oneKeyLogon: function(code, ency, ivBytes) {
  //   var that = this;
  //   wx.showLoading({
  //     title: '正在登录...',
  //   })
  //   var param = {
  //     UserName: '',
  //     Password: '',
  //     code: code,
  //     toDecrypt: ency,
  //     ivBytes: ivBytes,
  //   }
  //   util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersLogin', 'POST', param,
  //     function(res) {
  //       if (res.data.ERROR_CODE == "-1") {
  //         wx.setStorageSync("UserID", res.data.DATA.UserID);
  //         wx.showToast({
  //           title: '登录成功，跳转到首页',
  //           icon: 'none',
  //           duration: 1000,
  //           complete: function() {
  //             wx.reLaunch({
  //               url: '../../home/home/home',
  //             })
  //           }
  //         })
  //         //隐藏-加载中
  //         wx.hideLoading();
  //         //隐藏-加载中
  //         wx.hideNavigationBarLoading();
  //         //停止当前页面下拉刷新
  //         wx.stopPullDownRefresh();
  //       } else {
  //         //错误提示
  //         wx.showModal({
  //           showCancel: false,
  //           content: res.data.ERROR_MESSAGE
  //         });
  //         //隐藏-加载中
  //         wx.hideLoading();
  //         //停止当前页面下拉刷新
  //         wx.stopPullDownRefresh();
  //         //隐藏-加载中
  //         wx.hideNavigationBarLoading();
  //       }
  //     },
  //     function(res) {
  //       //错误提示
  //       wx.showModal({
  //         showCancel: false,
  //         content: res.errMsg
  //       });
  //       //隐藏-加载中
  //       wx.hideLoading();
  //       //停止当前页面下拉刷新
  //       wx.stopPullDownRefresh();
  //       //隐藏-加载中
  //       wx.hideNavigationBarLoading();
  //     });
  // },

  /**
   * 获取openID
   */
  getOpenId: function() {
    var that = this;
    // 获取openID
    wx.login({
      //获取code
      success: function(res) {
        var code = res.code; //返回code
        that.setData({
          code: res.code
        });
      }
    })
  }
})