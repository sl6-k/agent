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
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    particulars: {
      timeString: '', //订单时间
      timeIndex: null, //订单时间index
      PaymentIndex: 1, //收支index
      Paymenttype: "", //收支类型
    }, //门店的查询条件 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  
  /**
   * 选择收支类型
   */
  getShop: function () {
    var that = this;
    var itemList = ["收入明细", "支出明细"];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        var index = res.tapIndex;
        that.setData({
          ["particulars.Paymenttype"]: itemList[res.tapIndex],
          ["particulars.PaymentIndex"]: res.tapIndex + 1
        });
        that.getStoreBanlanceList();
      }
    })
  },

  /**
   * 选择排序方式
   */
  getSortName: function () {
    var that = this;
    var itemList = ["近三天", "近一周", "近一个月", "近一年"];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        console.log(JSON.stringify(res));
        if (res.tapIndex == 0) {
          that.setData({
            ["particulars.timeString"]: itemList[res.tapIndex],
            ["particulars.timeIndex"]: 3
          });
        }
        if (res.tapIndex == 1) {
          that.setData({
            ["particulars.timeString"]: itemList[res.tapIndex],
            ["particulars.timeIndex"]: 7
          });
        }
        if (res.tapIndex == 2) {
          that.setData({
            ["particulars.timeString"]: itemList[res.tapIndex],
            ["particulars.timeIndex"]: 30
          });
        }
        if (res.tapIndex == 3) {
          that.setData({
            ["particulars.timeString"]: itemList[res.tapIndex],
            ["particulars.timeIndex"]: 365
          });
        }
        that.getStoreBanlanceList();
      }
    })
  },

  /**
   * 获取门店收支记录
   */
  getStoreBanlanceList: function() {
    var that = this;
    var pageNumber = that.data.pageNumber;
    console.log("pageNumber" + pageNumber)
    var pageSize = that.data.pageSize;
    if (pageNumber != 1) {
      //显示-加载中
      that.setData({
        loading: true
      });
    }
    //参数
    var param = {
      UserID: wx.getStorageSync('UserID'), //用户ID
      PageNumber: pageNumber, //页数
      PageSize: pageSize, //每页行数
      BalanceType: that.data.particulars.PaymentIndex, //收支类型
      Date: that.data.particulars.timeIndex, //天数
    }
    console.log("获取门店收支记录传递参数：" + JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/BalanceRecord/GetStoreBalanceRecordList', 'POST', param,
      function(res) {
        console.log(res);
        if (res.data.ERROR_CODE == "-1") {
          console.log("获取门店收支记录：" + JSON.stringify(res.data.DATA));

          //数据绑定
          var data = res.data.DATA.data;
          if (pageNumber == 1) {
            data = res.data.DATA.data;
          } else {
            data = that.data.rows.concat(res.data.DATA.data);
          }
          that.setData({
            rows: data,
            pageCount: res.data.DATA.pagecount,
          });


          if (that.data.pageCount == pageNumber) {
            that.setData({
              loadingComplete: true
            })
          }

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
    wx.showLoading({
      title: '加载中...',
    });
    //获取数据
    this.getStoreBanlanceList();
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
    var that = this;
    //参数重载
    that.setData({
      pageNumber: 1,
      loadingComplete: false
    });
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //获取数据
    that.getStoreBanlanceList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      pageNumber: that.data.pageNumber + 1
    })
    //获取数据
    that.getStoreBanlanceList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})