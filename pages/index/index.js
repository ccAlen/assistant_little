//index.js  
//获取应用实例
const app = getApp()
var common = require("../../utils/util.js");
Page({
  data: {
    showLogin: false,
    isshowzgh: true
  },
  onGotUserInfo:function(){
    wx.setStorageSync('loginedLink', 'inputMajor')
    common.getPhoneNumber(this);
  },
  officialLoad: function (e) {
    console.log('组件加载成功')
    console.log(e)
    if (e.detail.status != '0') {
      console.log(e.detail.status)
      this.setData({
        isshowzgh: false
      })
    } else {
      console.log(e.detail.status)
      this.setData({
        isshowzgh: true
      })
    }
  },
  officialError: function (e) {
    console.log("official组件加载失败")
    console.log(e)
    this.setData({
      isshowzgh: false
    })
  },
  closegzhFun: function () {
    this.setData({
      isshowzgh: false
    })
  },
  getKey: function (param) {
    common.getKey(param, this)
  },
  textFun: function () {
    if (app.globalData.token != '') {
      wx.navigateTo({
        url: '../inputMajor/inputMajor',
      })
    } else {
      this.setData({
        showLogin: true
      })
      wx.setStorageSync('loginedLink', 'inputMajor')
    }
  },
  onShow: function () {
    console.log(app.globalData.token)
    if (app.globalData.isshowzgh == false) {
      this.setData({
        isshowzgh: false
      })
    };
    if (app.globalData.token == ''){
      console.log('app.globalData.token')
      this.setData({
        showLogin: true
      })
    }else{
      this.setData({
        showLogin: false
      })
    }
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '猩考证'

    }
  },

  // 组件edd
  onLoad: function (options) {
    const t = this;
    
    // 登录
    if (app.globalData.token == '') {
      common.getLogin(t, 'inputMajor')
    }
    if (app.globalData.ops.scene && ((app.globalData.ops.scene == '1011') || (app.globalData.ops.scene == '1047') || (app.globalData.ops.scene == '1089') || (app.globalData.ops.scene == '1038'))) {
      // console.log(app.globalData.ops.scene)
      t.setData({
        isshowzgh: true
      })
    } else {
      // console.log(app.globalData.ops.scene)
      t.setData({
        isshowzgh: false
      })
    }
  }
})