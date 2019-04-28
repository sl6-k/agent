// pages/home/spread/orderInformation/orderInformation.js
var util=require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:null,//订单详情
    goodsList: [],//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNo = options.orderNo;
    var param = {
      MemberOrderID: orderNo
    }
    util.ajaxRequest('/AppApiAgent/Order/GetMemberOrderDetail','POST',param,
    (res)=>{
      if(res.data.ERROR_CODE==-1){
        this.setData({
          information: res.data.DATA,
          goodsList: res.data.DATA.OrderMemberOrderModelList
          })
      }
    })
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