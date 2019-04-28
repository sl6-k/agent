// pages/home/spreadOrder/spreadOrder.js
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    swiperHeight: 0, //获取内容高度
    titleBarHeight: wx.getStorageSync('titleBarHeight'), //获取高度
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //获取高度
    generalizeOrderList: null, //推广订单数据
    PageTotal: 0, //总行数
    AllPageNumber: 0, //总页数
    pageSize: 10, //初始显示的行数
    pageNumber: 1, //初始第几页

  },
  /*
   * 打开订单详情
   */
  openOrderInformation: function(e) {
    let index = e.currentTarget.dataset.index;
    let orderNo = this.data.generalizeOrderList[index].MemberOrderID
    wx.navigateTo({
      url: '../orderInformation/orderInformation?orderNo=' + orderNo,
    })
  },

  /**
   * 获取推广订单数据
   */
  getGeneralizeOrderList: function() {
    var that = this;
    if (that.data.pageNumber != 1) {
      //显示-加载中
      that.setData({
        loading: true
      });
    }
    //参数
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      PageNumber: that.data.pageNumber, //页数
      PageSize: that.data.pageSize, //每页行数
      Status: parseInt(that.data.currentTab) + 1, //全部订单
    }

    util.ajaxRequest('/AppApiAgent/Order/GetMemberOrderList', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // 数据绑定
          that.setData({
            AllPageNumber: res.data.DATA.pagecount, //总页数
            PageTotal: res.data.DATA.total, //总页数
          })
          if (that.data.pageNumber == 1) {

            that.setData({
              generalizeOrderList: res.data.DATA.data,
            })
          }
          if (that.data.pageNumber > 1 && that.data.pageNumber <= res.data.DATA.pagecount) {

            that.setData({
              generalizeOrderList: that.data.generalizeOrderList.concat(res.data.DATA.data),
            })
          }
          if (that.data.pageNumber > res.data.DATA.pagecount) {
            return;
          }

          //隐藏-加载中
          that.setData({
            loading: false
          });
          //隐藏-加载中
          wx.hideLoading();
          //隐藏-加载中
          wx.hideNavigationBarLoading();

        } else {
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

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数

  },


  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
    this.getGeneralizeOrderList();
  },


  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        pageNumber: 1, //初始第几页
      })
    }
    this.getGeneralizeOrderList();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    //请求接口获取订单数据
    this.getGeneralizeOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this;
    // //请求接口获取订单数据
    // this.getGeneralizeOrderList();
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
    this.setData({
      pageNumber: 1,
    })
    this.getGeneralizeOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    this.setData({
      pageNumber: that.data.pageNumber + 1,
      pageSize: that.data.pageSize
    })
    this.getGeneralizeOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})