// pages/home/invitationDetails/invitationDetails.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserName:'',
    pic: util.imgUrl, //上传用户图片
    invitationDetails:null,
    generalizeOrderList:null,
    UserID:'',
    CreateDate:'',
    PageSize:100,
    PageNumber:1, //总页数
    PageSize2: 100,
    PageNumber2: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.UserID)
    this.setData({
      UserName: options.UserName,
      UserID: options.UserID,
      CreateDate: options.CreateDate
    })
    this.getinvitationDetails(),
    this.getGeneralizeOrderList()
  },
  // 邀请
  getinvitationDetails: function () {
    var that=this
    var param = {
      UserID: that.data.UserID,
      PageNumber: that.data.PageNumber,
      PageSize: that.data.PageSize
    }
    // console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/User_iGreatorList', 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          console.log("返回值1：" + JSON.stringify(res.data));
          // console.log( res.data );
          that.setData({
            invitationDetails: res.data.DATA.data,
            // total: res.data.DATA.total
          })

          //隐藏-加载中
          that.setData({
            loading: false
          });
          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
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

  // 推广
  getGeneralizeOrderList: function () {
    var that = this;
    //参数
    var param = {
      my:wx.getStorageSync('UserID'),
      UserID: that.data.UserID, //用户ID
      PageNumber: that.data.PageNumber2, //页数
      PageSize: that.data.PageSize2, //每页行数
      Status:2, //全部订单
    }
    console.log("获取订单列表传递的参数是：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Order/GetMemberOrderList', 'POST', param,
      function (res) {
        if (res.data.ERROR_CODE == "-1") {
          // 数据绑定
        console.log("返回值2：" + JSON.stringify(res.data));
         that.setData({
              generalizeOrderList: res.data.DATA.data,
            })
           
          //隐藏-加载中
          that.setData({
            loading: false
          });

          //隐藏-加载中
          wx.hideLoading();
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
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