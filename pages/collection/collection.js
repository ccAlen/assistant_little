// pages/collection/collection.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoritesList: [],//收藏
    nav: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // 获取课程收藏列表
    common.nRequest(
      getApp().data.services + "api/user/getfavorites",
      { page: 1, per_page: 500, favorite: t.data.nav == '1' ? "4" : "1" },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          t.setData({
            favoritesList: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + app.globalData.token },
      function () {
        console.log('系统错误')
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  navFun: function (e) {
    var t = this;
    t.setData({
      nav: e.target.dataset.nav
    })
    console.log(e.target.dataset.nav)
    // 获取课程收藏列表
    common.nRequest(
      getApp().data.services + "api/user/getfavorites",
      { page: 1, per_page: 500, favorite: e.target.dataset.nav == '1' ? "4" : "1" },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            favoritesList: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + app.globalData.token },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
})