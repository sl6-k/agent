// 个人中心
var util = require("../../../utils/util.js");
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceData: null, //获取发票信息
    addressData: null, //微信选择地址后的信息存储
    selectAddress: null, //是否已选择的地址
    userInfo: {}, //用户信息
    pic: util.imgUrl, //图片路径
    Bank: '', //银行名
    BankList: [], //银行列表
    index: 0, //默认键值
    bankArray: [], //银行列表
    BankID: "" //银行id
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
          // console.log("==========" + JSON.stringify(data));
          for (let i = 0; i < data.length; i++) {
            let BankName = data[i].BankName;
            let BankList = this.data.BankList;
            BankList.push(BankName);
            this.setData({
              BankList: BankList,
              bankArray: data
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.bindGetUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取银行列表
    this.getBankList();
  },

  /**
   * 获取用户信息
   */
  bindGetUserInfo: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var param = {
      UserID: wx.getStorageSync('UserID')
    }
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersSelet', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          // console.log("获取用户信息的返回值是：" + JSON.stringify(res.data))
          that.setData({
            ['userInfo.PictureUrl']: res.data.DATA.PictureUrl,
            ['userInfo.NickName']: res.data.DATA.NickName,
            ['userInfo.TrueName']: res.data.DATA.TrueName,
            ['userInfo.Phone']: res.data.DATA.Phone,
            ['userInfo.sex']: res.data.DATA.Sex,
            ['userInfo.BankCardNo']: res.data.DATA.BankCardNo,
            ['userInfo.BankCardAccount']: res.data.DATA.BankCardAccount,
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
   * 选择图片并上传（单张）
   */
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        // console.log("=================2:" + tempFilePaths);
        wx.showLoading({
          title: '正在上传...',
        })
        wx.uploadFile({
          url: util.apiUrl + '/AppApiAgent/Upload/UploadUserPic',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          formData: {
            param: JSON.stringify({
              UserID: wx.getStorageSync('UserID'), //用户ID
            })
          },
          success(res) {
            var data = JSON.parse(res.data);
            if (data.ERROR_CODE == -1) {
              that.setData({
                ["userInfo.PictureUrl"]: data.DATA.PictureUrl
              });
              // console.log(that.data.PictureUrl);
              wx.showToast({
                title: '图片上传成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })
            } else {
              wx.showToast({
                title: data.ERROR_MESSAGE,
                icon: 'none',
                duration: 1000
              })
            }

          },
          fail: function(res) {
            console.log("图片上传失败返回值：" + JSON.stringify(res));
            wx.showToast({
              title: '图片上传失败',
              icon: 'fail',
              duration: 1000,
              mask: true
            })
          },
        })
      }
    })
  },


  /**
   * 修改银行名
   */

  bindPickerChange: function(e) {
    var that = this;
    this.setData({
      BankID: this.data.bankArray[e.detail.value].ID,
      Bank: this.data.BankList[e.detail.value]
    })
  },

  /**
   * 修改昵称
   */
  modifyNickName: function(e) {
    this.setData({
      ["userInfo.NickName"]: e.detail.value
    });
  },

  /**
   * 修改真实姓名
   */
  modifyTrueName: function(e) {
    this.setData({
      ["userInfo.TrueName"]: e.detail.value
    });
  },

  /**
   * 修改开户名
   */
  modifyBankCardAccount: function(e) {
    this.setData({
      ["userInfo.BankCardAccount"]: e.detail.value
    });
  },

  /**
   * 修改银行卡号
   */
  modifyBankCardNo: function(e) {
    this.setData({
      ["userInfo.BankCardNo"]: e.detail.value
    });
  },
  /**
   * 修改手机号
   */
  modifyPhoneNum: function(e) {
    this.setData({
      ["userInfo.PhoneNum"]: e.detail.value
    });
  },

  /**
   * 选择微信中的发票
   */
  chooseInvoice: function() {
    var that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        that.setData({
          invoiceData: res
        });
        // console.log(JSON.stringify(that.data.invoiceData.title));
      }
    })
  },

  /**
   * 选择微信中的收货地址
   */
  selectAddress: function(e) {
    if (this.data.selectAddress) {
      // 如果已经选择了地址，则变成可编辑框
      return
    }
    wx.chooseAddress({
      success: res => {
        // console.log("收货地址：" + JSON.stringify(res));
        var addressData = `${res.cityName}${res.countyName}${res.detailInfo}`
        this.setData({
          addressData: addressData,
          selectAddress: true,
          // 如果用户收货地址里有手机号和姓名，使用选择的内容覆盖当前内容
          userInfo: res
        })
      },

      fail: res => {
        this.setData({
          selectAddress: true
        })
        // TODO
        // 自动从后台拉取其已有的收货地址
      },
    })
  },

  /**
   * 选择性别
   */
  selectSex: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function(res) {
        // console.log(res.tapIndex)
        var index = res.tapIndex;
        // console.log(index);
        that.setData({
          ["userInfo.sex"]: res.tapIndex.toString()
        });
      },
      fail: function(res) {
        return;
      }
    })
  },

  /**
   * 返回按钮
   */
  navBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 保存信息
   */
  saveInformation: function() {
    var UserID = wx.getStorageSync('UserID'); //获取用户ID
    var img = this.data.userInfo.PictureUrl; //获取头像地址
    var NickName = this.data.userInfo.NickName; //获取昵称
    var TrueName = this.data.userInfo.TrueName; //获取真实姓名
    var sex = this.data.userInfo.sex; //获取性别
    var Phone = this.data.userInfo.Phone; //获取电话号码
    var BankCardNo = this.data.userInfo.BankCardNo; //获取银行卡号
    var BankCardAccount = this.data.userInfo.BankCardAccount; //获取银行开户名
    var BankID = this.data.BankID; //获取银行id
    if (NickName == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    if (TrueName == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    if (sex == '' || sex == undefined || sex == null) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    if (Phone == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    var param = {
      UserID: wx.getStorageSync('UserID'),
      PictureUrl: img,
      UsedPassword: '',
      Password: '',
      NickName: NickName,
      TrueName: TrueName,
      Sex: sex,
      BankCardNo: '',
      BankCardAccount: '',
      BankID: '',
    }
    console.log(JSON.stringify(param));
    util.ajaxRequest('/AppApiAgent/Account_Users/Account_UsersModify', 'POST', param,
      function(res) {
        if (res.data.ERROR_CODE == "-1") {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1000,
            complete: function() {
              wx.reLaunch({
                url: '../../home/home/home'
              });
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
})