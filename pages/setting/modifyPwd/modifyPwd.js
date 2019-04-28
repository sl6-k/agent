// pages/me/setting/modifyPwd/modifyPwd.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modifyPwd: {}, //修改密码信息存储
    Code: '',//用户输入的验证码
    codeText: '获取验证码',//验证码文本
    disabled: true,//获取验证码是否执行
    getPhoneCode: ''//发送的验证码
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
   * 原密码
   */
  blurmodifyPwd: function(e) {
    this.setData({
      ["modifyPwd.oldPwd"]: e.detail.value
    });
  },
  /**
   * 输入的验证码
   */
  getCode: function (e) {
    this.setData({
      Code: e.detail.value
    });
  },
  /**
   * 新密码
   */
  blurNewPwd: function(e) {
    this.setData({
      ["modifyPwd.NewPwd"]: e.detail.value
    });
  },

  /**
   * 重复密码
   */
  blurRepeatPwd: function(e) {
    this.setData({
      ["modifyPwd.RepeatPwd"]: e.detail.value
    });
  },
  /*
  * 获取密码倒计时
  */
  getCodeTime() {
    let i = 60;
    let timer = setInterval(() => {
      this.setData({
        codeText: i + '秒后获取',
        disabled: false
      })
      i--;
      if (i == 0) {
        clearInterval(timer);
        this.setData({
          codeText: '获取验证码',
          disabled: true
        })
      }
    }, 1000)
  },
  /*
  * 获取手机发送的验证码
  */
  getPhoneCode: function () {
    if (this.data.disabled) {
      this.getCodeTime();
      var param = {
        UserName: wx.getStorageSync('phoneNum')
      }
      console.log(JSON.stringify(param));
      util.ajaxRequest('/AppApiAgent/Account_Users/SendSMS', 'POST', param,
        (res) => {
          console.log(res);
          if (res.data.ERROR_CODE == "-1") {
            this.setData({
              getPhoneCode: res.data.DATA.Code
            })
          } else {
            wx.showToast({
              title: res.data.ERROR_MESSAGE,
              icon: 'none',
              duration: 1000
            })
          }
        })
    }
  },
  /**
   * 提交修改密码的信息
   */
  formSubmit: function() {
    var oldPwd = this.data.modifyPwd.oldPwd; //输入的原密码
    var newPwd = this.data.modifyPwd.NewPwd; //新密码
    var repeatPwd = this.data.modifyPwd.RepeatPwd; //重复密码
    var Code = this.data.Code;//输入的验证码
    var getPhoneCode = this.data.getPhoneCode;//获取到的验证码
    console.log(Code + '..' + getPhoneCode);
    if (oldPwd == undefined || oldPwd == '' || oldPwd==null) {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (Code != getPhoneCode) {
      wx.showToast({
        title: '验证码输入错误！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (newPwd == undefined || newPwd == '' || newPwd==null) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (newPwd.length < 6) {
      wx.showToast({
        title: '新密码不能少于6位',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (repeatPwd == undefined || repeatPwd == '' || repeatPwd==null) {
      wx.showToast({
        title: '重复密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (newPwd != repeatPwd) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    this.submitModifyPwd(oldPwd, newPwd);
  },

  /**
   * 提交信息到接口的方法
   */
  submitModifyPwd: function(oldPwd, newPwd) {
    var param = {
      UserID: wx.getStorageSync('UserID'),
      PictureUrl: '',
      UsedPassword: oldPwd,
      Password: newPwd,
      NickName: '',
      TrueName: '',
      Sex: ''
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersModify', 'POST', param,
      (res) => {
        console.log(res);
        if (res.data.ERROR_CODE == -1) {
          wx.showToast({
            title: '修改成功，即将返回上一页面',
            icon: 'none',
            duration: 1000,
            complete: function() {
              wx.navigateBack()
            }
          })
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