// pages/home/budgetList/budgetList.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1, //页数
    pageSize: 10, //每页行数
    rows: null, //放置返回数据的数组
    pageCount: 1, //设置总页数，默认为一页
    loading: false, //"上拉加载"的变量，默认false，隐藏
    loadingComplete: false //'没有数据'的变量，默认false，隐藏 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
  * 获取提现通知
  */
  getSysMessageList: function (that, pageNumber, pageSize) {
    var that = this;
    //参数
    that.setData({
      loading: false
    })
    var param = {
      UserID: wx.getStorageSync('UserID'), //门店ID
      PageNumber: pageNumber, //当前页数
      PageSize: pageSize,//每页行数
      ReadFlag: false,//阅读标识
      MessageType: 3//消息类型
    }
    console.log("获取门店收支记录传递参数：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/SystemMessage/GetSysMessageList', 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店收支记录：" + JSON.stringify(res.data.DATA));
          //数据绑定
          if (pageNumber == 1) {
            if (res.data.DATA.data.length != pageSize) {
              that.setData({
                loadingComplete: true
              });
            } else {
              that.setData({
                loading: true
              })
            }
            that.setData({
              rows: res.data.DATA.data,
              pageCount: res.data.DATA.pagecount,
              pageNumber: pageNumber
            });
          } else {
            if (res.data.DATA.data.length != pageSize) {
              that.setData({
                loadingComplete: true,
              })
            } else {
              that.setData({
                loading: true
              })
            }
            that.setData({
              rows: that.data.rows.concat(res.data.DATA.data),
              pageCount: res.data.DATA.pagecount,
              pageNumber: pageNumber,
            });
          }

          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //隐藏-加载中
          wx.hideNavigationBarLoading();
        } else {
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


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

    if (util.whetherLogin()) {

      wx.showLoading({
        title: '加载中...',
      });
      //获取数据
      this.getSysMessageList(that, that.data.pageNumber, that.data.pageSize);
    } else {
      //登录
      util.login(that, function () {

        wx.showLoading({
          title: '加载中...',
        });
        //获取数据
        this.getSysMessageList(that, that.data.pageNumber, that.data.pageSize);
      });

    }
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
    var that = this;
    //参数重载
    that.setData({
      pageNumber: 1,
      pageCount: 1
    });
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //获取数据
    that.getSysMessageList(that, that.data.pageNumber, that.data.pageSize);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.pageNumber == that.data.pageCount) {
      return false;
    }
    //获取数据
    that.getSysMessageList(that, that.data.pageNumber + 1, that.data.pageSize);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})