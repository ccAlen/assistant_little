// pages/newsDetails/newsDetails.js 
// const Towxml = require('towxml');
// const towxml = new Towxml();
// var html2wxml = require('../../html2wxml-template/html2wxml.js');

var common = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsDetails: '',
    //article将用来存储towxml数据
    article: {},
    iszan: false,
    token: '',
    newsId: '',
    favorites_count: 0,
    content:'',
    showLogin: false,
    showGetPhone: false,
    isshowzgh: true
  },
  closegzhFun: function () {
    this.setData({
      isshowzgh: false
    })
  },
  getPhone: function (param) {
    common.getPhone(param, this)
  },
  getKey: function (param) {
    common.getKey(param, this)
  },
  // 分享
  onShareAppMessage: function (res) {
    var t = this;
    return {
      title: '猩考证',
      path: '/pages/newsDetails/newsDetails?id=' + t.data.newsId,
      success(e) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail(e) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {

      }
    }
  },
  getNewsDetails: function (_id, _token) {
    var t = this;
    t.setData({
      token:_token
    })
    common.nRequest(
      getApp().data.services + "api/news/getnewsdetail",
      { id: _id },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          if (res.data.data.content) {
            // var reg = /^["|'](.*)["|']$/g;
            var _content = res.data.data.content.wxml_cont;
            res.data.data.created_at = res.data.data.created_at.split(' ')[0]
            // console.log(_content)
            // html2wxml.html2wxml('article', JSON.parse(res.data.data.content.wxml_cont), t, 5);
            // t.setData({ text: _content});
            t.setData({
              newsDetails: res.data.data,
              favorites_count: res.data.data.favorites_count,
              content:_content
            })
            if (res.data.data.has_favorite) {
              t.setData({
                iszan: true
              })
            }
          } else {
            t.setData({
              newsDetails: res.data.data
            })
            if (res.data.data.has_favorite) {
              t.setData({
                iszan: true
              })
            }
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const t = this;
    console.log(app.globalData.ops.scene)
    if (app.globalData.ops.scene && (app.globalData.ops.scene == '1011' || '1047' || '1089' || '1038')){
      t.setData({
        isshowzgh:true
      })
    }else{
      t.setData({
        isshowzgh: false
      })
    }
    t.setData({
      newsId: options.id
    })
    // 咨询详情 
    t.getNewsDetails(options.id, app.globalData.token != '' ? app.globalData.token : app.globalData.untoken)
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
    var t = this;
    if (app.globalData.ops.path && (app.globalData.ops.path == 'pages/newsDetails/newsDetails')) {
      if (app.globalData.token == '') {
        // 弹出授权弹框
        common.getLogin(t, '')
      }
    }
    
  },

  zanFun: function () {
    var t = this;
    // 点赞接口
    wx.login({
      success: function (res) {
        // console.log(res.code)
        common.nRequest(
          getApp().data.services + "api/favorite",
          {
            id: t.data.newsDetails.id,
            increase: !t.data.iszan ? '1' : '-1',
            favorite: 'news',
            code: res.code
          },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {//点赞成功
              var _favorites_count = t.data.favorites_count + (!t.data.iszan ? 1 : (-1))
              t.setData({
                iszan: !t.data.iszan,
                favorites_count: _favorites_count
              })
              /*wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })*/
              // 重新加载详情
              //t.getNewsDetails(t.data.newsId, t.data.token)
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
          function () {
            console.log('系统错误')
          }
        );
      }
    });
  }
})