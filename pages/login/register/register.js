// pages/login/register/register.js
var util = require("../../../utils/util.js");
var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    register: {}, //注册时的信息存储
    countdown: 60, //定时器初始时间
    getVerifyCode: '', //获取到的验证码
    time: '获取验证码',
    currentTime: 61, //短信验证码倒计时
    disabled: false,
  },
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 点击获取验证码的按钮
   */
  getVerificationCode() {
    var that = this
    var phoneNum = this.data.register.phoneNum;
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
    that.setData({
      disabled: true
    })
    this.getCode();
    this.getVerifyCode();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("扫描二维码所携带的参数是：" + JSON.stringify(options));
    if (options.q) {
      let q = decodeURIComponent(options.q);
      var agentUserCode = util.getQueryString(q, 'AgentUserCode');
      console.log("获取的推广码是：" + agentUserCode);
      this.setData({
        ["register.inviteCode"]: agentUserCode
      });
    } else {
      this.setData({
        ["register.inviteCode"]: ''
      });
    }
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
   * 注册
   */
  register: function() {
    var name = this.data.register.name;
    var phoneNum = this.data.register.phoneNum;
    var userPwd = this.data.register.userPwd;
    var verifyCode = this.data.register.verifyCode;
    var getVerifyCode = this.data.getVerifyCode;
    var inviteCode = this.data.register.inviteCode; //邀请码
    if(name == undefined || name == '' || name == null){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (phoneNum == undefined || phoneNum == '' || phoneNum==null) {
      wx.showToast({
        title: '手机号码不能为空',
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
    if (userPwd == undefined || userPwd == '' || userPwd==null) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (verifyCode == undefined || verifyCode == '' || verifyCode==null) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (verifyCode != getVerifyCode) {
      wx.showToast({
        title: '验证码输入有误',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (inviteCode == undefined || inviteCode == '' || inviteCode==null) {
      wx.showToast({
        title: '邀请码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.registerFun();
  },

  /**
   * 调用注册方法
   */
  registerFun: function() {
    var that = this;
    var name = that.data.register.name;
    var phoneNum = that.data.register.phoneNum;
    var password = that.data.register.userPwd;
    var inviteCode = that.data.register.inviteCode;
    wx.showLoading({
      title: '正在注册...',
    })
    var param = {
      TrueName:name,
      UserName: phoneNum,
      Password: password,
      AgentCode: inviteCode,
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/UsersRegister', 'POST', param,
      function(res) {
        console.log("返回值是：" + JSON.stringify(res))
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取的userid是：" + JSON.stringify(res.data))
          wx.setStorageSync("UserID", res.data.DATA);
          wx.showToast({
            title: '注册成功，跳转到登录页面',
            icon: 'none',
            duration: 1000,
            complete: function() {
              wx.reLaunch({
                url: '../../home/home/home',
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
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        }
      })
  },
  /*
  * 输入姓名
  */
  name: function(e){
    this.setData({
      ['register.name']: e.detail.value
    })
  },
  /**
   * 输入手机号
   */
  phoneNum: function(e) {
    this.setData({
      ["register.phoneNum"]: e.detail.value
    });
  },

  /**
   * 输入密码
   */
  userPwd: function(e) {
    this.setData({
      ["register.userPwd"]: e.detail.value
    });
  },

  /**
   * 验证码
   */
  verifyCode: function(e) {
    this.setData({
      ["register.verifyCode"]: e.detail.value
    });
  },

  /**
   * 邀请码
   */

  inviteCode: function(e) {
    this.setData({
      ["register.inviteCode"]: e.detail.value
    });
  },

  /**
   * 调用获取验证码接口
   */
  getVerifyCode: function() {
    var that = this;
    var phoneNum = this.data.register.phoneNum;
    console.log(phoneNum);
    if (phoneNum == undefined || phoneNum == '' || phoneNum==null) {
      wx.showToast({
        title: '请输入手机号码',
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
    var data = {
      UserName: phoneNum,
    };
    util.ajaxRequest('/AppApiAgent/Account_Users/SendSMS', 'post', data,
      function(res) {
        console.log(res);
        if (res.data.ERROR_CODE == "-1") {
          console.log(res.data.DATA.Code);
          that.data.getVerifyCode = res.data.DATA.Code;
          console.log(that.data.getVerifyCode);
        } else {
          wx.showToast({
            title: res.data.ERROR_MESSAGE,
            icon: 'none',
            duration: 1000
          })
        }
      })
  }

})