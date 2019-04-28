// pages/home/budgetList/budgetList.js
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageNumber: 1,//当前页数
    PageSize: 7,//每页行数
    UserID: '',//用户id
    information: null,//邀请信息
    imgUrl: util.imgUrl,//图片路径
    noMoreShow: false,//显示没有更多
    noLoad: true,//是否加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('UserID'));
    this.setData({
      UserID: wx.getStorageSync('UserID')
    })
    this.getInformation();
  },
  /*
  * 获取数据
  */
  invitationDetailsrun:function(e){
    // console.log("============"+JSON.stringify(e));
    var UserName = e.currentTarget.dataset.username
    var UserID = e.currentTarget.dataset.userid
    var CreateDate = e.currentTarget.dataset.createdate
    // console.log(CreateDate)
    wx.navigateTo({
      url: '../invitationDetails/invitationDetails?UserName=' + UserName + '&UserID=' + UserID + '&CreateDate=' + CreateDate,
    })

  },
  getInformation: function(){
    var param = {
      UserID: this.data.UserID,//用户ID
      UserID: this.data.UserID,
      PageNumber: this.data.PageNumber,
      PageSize: this.data.PageSize
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/User_iGreatorList', 'POST', param,
      (res) => {
        console.log(res);
        // console.log("返回值：" + JSON.stringify(res.data));
        if(res.data.ERROR_CODE==-1){
          if (res.data.DATA.data.length < this.data.PageSize) {
            this.setData({
              noMoreShow: true,
              noLoad: false
            })
          }
          if (this.data.PageNumber == 1) {
            this.setData({
              information: res.data.DATA.data,
              PageNumber: this.data.PageNumber + 1
            });
          }
          else {
            for (let i = 0; i < this.data.DATA.data.length; i++) {
              let list = this.data.information.push(res.data.DATA.data[i])
            }
            this.setData({
              information: list,
              PageNumber: this.data.PageNumber + 1
            });
          }
          let information = this.data.information;
          if (information == "" || information == null || information == undefined) {
            this.setData({
              noMoreShow: false
            })
          }
        }else{
          wx.showToast({
            title: res.data.ERROR_MESSAGE,
            icon: 'none',
            duration: 1000
          })
        }
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
      if(this.data.noLoad){
        this.getInformation();
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})