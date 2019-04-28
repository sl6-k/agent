// pages/home/wallet/cashWithdrawal/cashWithdrawal.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cash: {}, //提现金额总数据
    cashAmount: '', //提现金额
    amount: 0, //可用余额
    AccountNo: '', //账号
    Account: '', //账号名称
    type: 1, //提现类型
    Bank: '', //银行名
    BankID: "", //银行id
    BankList: [], //银行列表
    index: 0, //默认键值
    spreadInfo: null, //推客信息
  },
  /*
   * 改变银行名
   */
  bindPickerChange: function(e) {
    var that = this;
    this.setData({
      index: e.detail.value,
      Bank: this.data.BankList[e.detail.value]
    })
  },
  /**
   * 获取账号号码
   */
  getAccountNo: function(e) {
    this.setData({
      AccountNo: e.detail.value
    })
  },
  /*
   * 获取账户名
   */
  getAccount: function(e) {
    this.setData({
      Account: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取推客收入和待提现金额
    this.bindGetAgentAmount();
    //获取用户信息
    this.bindGetUserInfo();
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
          console.log("获取用户信息的返回值是：" + JSON.stringify(res.data))
          that.setData({
            // BankCardNo: res.data.DATA.BankCardNo,
            // BankCardAccount: res.data.DATA.BankCardAccount,
            Account: res.data.DATA.BankCardNo,
            AccountNo: res.data.DATA.BankCardAccount,
            BankID: res.data.DATA.BankID,
            Bank: res.data.DATA.BankName,
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
   * 获取推客信息
   */
  bindGetSpreadInfo: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/GetMyAgent', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取用户信息的返回值是：" + JSON.stringify(res.data))
          wx.setStorageSync("minAmount", res.data.DATA.MinWithdrawalAmount);
          that.setData({
            spreadInfo: res.data.DATA,
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
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/GetAgentAmount', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          //缓存代理ID
          wx.setStorageSync('AgentID', res.data.DATA.AgentID);
          //数据绑定
          console.log("返回值是：" + JSON.stringify(res.data))
          that.setData({
            amount: res.data.DATA.IncomeMoney,
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
   * 获取银行卡列表
   */
  getBankList: function() {
    var param = {
      UserID: wx.getStorageSync('UserID'),
    }
    util.ajaxRequest('/AppApiAgent/WithdrawalRecord/GetBankList', 'POST', param,
      (res) => {
        if (res.data.ERROR_CODE == "-1") {
          let data = res.data.DATA;
          for (let i = 0; i < data.length; i++) {
            let BankName = data[i].BankName;
            let BankList = this.data.BankList;
            BankList.push(BankName);
            this.setData({
              BankList: BankList
            })
          }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取银行列表
    this.getBankList();
    //获取推客信息
    this.bindGetSpreadInfo();

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

  /*
   * 切换银行卡支付
   */
  shift1: function() {
    this.setData({
      type: 1,
    })
    this.bindGetUserInfo();
  },

  /*
   * 切换银行卡支付
   */
  shift2: function() {
    this.setData({
      type: 2,
      Account: "",
      AccountNo: ""
    })
  },

  /**
   * 获取提现金额
   */
  getCashAmount: function(e) {
   
    var cashAmount = this.checkInputText(e.detail.value);
    this.setData({
      cashAmount: cashAmount
    });
  },
  checkInputText: function(text) {
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(text)) { //正则匹配通过，提取有效文本
      text = text.replace(reg, '$2$3$4');
    } else { //正则匹配不通过，直接清空
      text = '';
    }
    return  text; //返回符合要求的文本（为数字且最多有带2位小数）

  },
  /**
   * 全部提现
   */
  getAllWithdrawals: function() {
    this.setData({
      cashAmount: this.data.amount
    });
  },

  /**
   * 提现
   */
  bindCashWithdrawal: function() {
    var that = this;
    // console.log(wx.getStorageSync("minAmount"));
    var cashAmount = that.data.cashAmount; //提现金额
    console.log(cashAmount);
    var accountNo = that.data.AccountNo; //支付宝，银行卡账号
    var account = that.data.Account; //账户姓名
    var minAmount = wx.getStorageSync("minAmount"); //提现的最小金额

    if (this.data.type == 1 && this.data.Bank == '') {
      wx.showToast({
        title: '请先选择银行',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (account == '') {
      wx.showToast({
        title: '账户姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (accountNo == '') {
      wx.showToast({
        title: '支付宝账号或者银行卡号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (cashAmount < minAmount || cashAmount == undefined) {
      wx.showToast({
        title: '提现金额必须大于' + minAmount,
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    wx.showLoading({
      title: '正在提现...',
    })
    var param = {
      UserID: wx.getStorageSync("UserID"),
      AgentID: wx.getStorageSync("AgentID"),
      Account: account,
      AccountNo: accountNo,
      Money: cashAmount,
      Bank: that.data.Bank,
      WithdrawalType: that.data.type
    }
    console.log("提现传参" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/WithdrawalRecord/WithdrawalRecordAdd', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("提现返回值" + JSON.stringify(res.data));
          wx.showToast({
            title: '提现成功',
            icon: 'success',
            duration: 1000,
            complete: function() {
              wx.reLaunch({
                url: '../home/home',
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
   * 选择银行卡
   */
  openBankList: function() {
    wx.navigateTo({
      url: '../bankList/bankList',
    })
  },

})