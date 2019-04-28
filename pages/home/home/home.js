// pages/home/home.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: util.imgUrl,
    agentAmount: null, //收入和待提现金额
    cornerMarker: null, //获取角标值
    isComplete: false, //是否加载完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    if (util.whetherLogin()) {
      this.bindGetUserInfo();
      this.bindGetAgentAmount();
      this.getCornerMarker();
    } else {
      wx.redirectTo({
        url: '../../login/login/login',
      })
    }
  },

  /**
   * 返回商城
   */
  backToUser: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb16e70ee139561f1', // 要跳转的小程序的appid
      path: 'pages/home/index/index', // 跳转的目标页面
      extarData: {

      },
      success(res) {
        // 打开成功  
      }
    })
  },

  /**
   * 获取角标值
   */
  getCornerMarker: function() {
    var that = this;
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    util.ajaxRequest('/AppApiAgent/Order/AgentTodoNumber', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取角标的值：" + JSON.stringify(res.data));
          that.setData({
            cornerMarker: res.data.DATA
          });
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
      },
      function(res) {
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
      });
  },

  /**
   * 获取用户信息
   */
  bindGetUserInfo: function() {
    var that = this;
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersSelet', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取用户信息：" + JSON.stringify(res.data));
          wx.setStorageSync('phoneNum', res.data.DATA.UserName);
          that.setData({
            userInfo: res.data.DATA
          });
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
      },
      function(res) {
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
      });
  },

  /**
   * 获取推客收入和待提现金额
   */
  bindGetAgentAmount: function() {
    var that = this;
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    // console.log("传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/GetAgentAmount', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("=============" + JSON.stringify(res.data));
          //缓存代理ID
          wx.setStorageSync('AgentID', res.data.DATA.AgentID);
          //数据绑定
          that.setData({
            agentAmount: res.data.DATA
          });
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
      },
      function(res) {
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
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("2222222222");
    this.setData({
      isComplete: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (util.whetherLogin()) {
      //获取用户信息
      this.bindGetUserInfo();
      //获取代理信息
      this.bindGetAgentAmount();
    } else {
      wx.redirectTo({
        url: '../../login/login/login',
      })
    }
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

  /**
   * 推广订单
   */
  openSpreadOrder: function() {
    wx.navigateTo({
      url: '../spread/spreadOrder/spreadOrder',
    })
  },

  /**
   * 我的邀请
   */
  openInvitation: function() {
    wx.navigateTo({
      url: '../invitationList/invitationList',
    })
  },

  /**
   * 收支明细
   */
  openBudgetList: function() {
    wx.navigateTo({
      url: '../budgetList/budgetList',
    })
  },

  /**
   * 提现通知
   */
  openCashNotice: function() {
    wx.navigateTo({
      url: '../cashNotice/cashNotice',
    })
  },

  /**
   * 我的推广码
   */
  bindOpenSpread: function() {
    wx.navigateTo({
      url: '../spread/spread/spread',
    })
  },

  /**
   * 我的邀请码
   */
  bindOpenInvitation: function() {
    wx.navigateTo({
      url: '../invitation/invitation',
    })
  },

  /**
   * 提现页面
   */
  bindOpenCash: function(e) {
    wx.navigateTo({
      url: '../cashWithdrawal/cashWithdrawal',
    })
  },

  /**
   * 设置
   */
  openSetting: function() {
    wx.navigateTo({
      url: '../../setting/index/index',
    })
  },
  /*
   *个人信息设置
   */
  bindModifyUserInfo: function() {
    wx.navigateTo({
      url: '../../setting/personalCenter/personalCenter',
    })
  }
})