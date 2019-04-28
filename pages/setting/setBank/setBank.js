// pages/setting/setBank/setBank.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankInfo: {}, //常用卡账户信息
    BankList: [], //银行名称列表
    BankArray: null, //银行列表信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindGetUserInfo();
    this.getBankList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /*
   * 改变银行名
   */
  bindPickerChange: function (e) {
    console.log("选择银行时的下标：" + JSON.stringify(e));
    var that = this;
    var index = e.detail.value; //下标
    this.setData({
      index: index,
      ["bankInfo.bankID"]: this.data.BankArray[index].ID,
      ["bankInfo.bankName"]: this.data.BankList[index]
    })
  },
  /*
   * 获取账户名
   */
  getAccount: function (e) {
    this.setData({
      ["bankInfo.bankCardAccount"]: e.detail.value
    })
  },
  /**
   * 获取账号号码
   */
  getAccountNo: function (e) {
    this.setData({
      ["bankInfo.bankCardNo"]: e.detail.value
    })
  },
  /**
   * 获取银行列表
   */
  getBankList: function () {
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
    }
    console.log(JSON.stringify(param))
    util.ajaxRequest('/AppApiAgent/WithdrawalRecord/GetBankList', 'POST', param,
      (res) => {
        console.log("银行列表" + JSON.stringify(res));
        let data = res.data.DATA;
        for (let i = 0; i < data.length; i++) {
          let BankName = data[i].BankName;
          let BankList = this.data.BankList;
          BankList.push(BankName);
          this.setData({
            BankList: BankList,
            BankArray: data
          })
        }
      })
  },
  /**
   * 获取用户信息
   */
  bindGetUserInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersSelet', 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取用户信息的返回值是：" + JSON.stringify(res.data))
          that.setData({
            ["bankInfo.bankID"]: res.data.DATA.BankID, //银行id
            ["bankInfo.bankName"]: res.data.DATA.BankName,
            ["bankInfo.bankCardNo"]: res.data.DATA.BankCardNo,
            ["bankInfo.bankCardAccount"]: res.data.DATA.BankCardAccount,
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
      function (res) {
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
  /*
  * 提交信息
  */
  saveBank:function(){
    var UserID = wx.getStorageSync('UserID');
    var BankID = this.data.bankInfo.bankID;
    var BankCardNo = this.data.bankInfo.bankCardNo;
    var BankCardAccount = this.data.bankInfo.bankCardAccount;
    if (BankID == '' || BankID == null || BankID == undefined){
      wx.showToast({
        title: '请选择银行名称',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (BankCardAccount == '' || BankCardAccount == null || BankCardAccount == undefined) {
      wx.showToast({
        title: '请输入账号姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (BankCardNo == '' || BankCardNo == null || BankCardNo == undefined) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var param = {
      UserID: UserID,
      BankID: BankID,
      BankCardNo: BankCardNo,
      BankCardAccount: BankCardAccount
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersUpdateAccount','POST',param,
    (res)=>{
      console.log(res);
      if(res.data.ERROR_CODE == -1){
        wx.showToast({
          title: '绑定成功',
          duration: 1000,
          complete: wx.navigateBack()
        })
      }else{
        wx.showToast({
          title: res.data.ERROR_MESSAGE,
          icon: 'none',
          duration: 1000
        })
      }
    })
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

  }
})