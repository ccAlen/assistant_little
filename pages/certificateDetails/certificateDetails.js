// pages/certificateDetails/certificateDetails.js 
var common = require("../../utils/util.js");
// var html2wxml = require('../../html2wxml-template/html2wxml.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatNumber:"",
    title:'',
    detailsList: {},
    idindex: [],
    isShow: false,
    navselect: 0,
    showNav: true,
    certsId: '',
    shareTitle: '资格证',
    isFavorite: false,
    imgalist: []
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })

  },
  closeNavFun: function() {
    this.setData({
      showNav: false
    })
  },
  navselectFun: function(e) {
    this.setData({
      navselect: e.currentTarget.dataset.index,
      showNav: false,
      text: this.data.detailsList[e.currentTarget.dataset.index].content,
      title: e.currentTarget.dataset.title
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查询证书并保存查询记录
    // app.globalData.textualResearchNav = 9;
    const t = this;
    t.setData({
      certsId: options.certsId
    })
    common.nRequest(
      getApp().data.services + "api/cert/getcertdetail", {
        id: options.certsId
      },
      function(res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res.data.data)
          // var _idindex = t.data.idindex;
          var _arr = [3, 5, 4, 6, 2, 7, 0, 1, 8,9];
          var _contentArr = [];
          var _detailsList = {};
          wx.setNavigationBarTitle({
            title: res.data.data.cert_name
          })
          var wxml_cont = res.data.data.wxml_cont;
          if (wxml_cont && (wxml_cont.length > 0)) {
            for (var i = 0; i < _arr.length; i++) {
              _contentArr.push(wxml_cont[_arr[i]])
            }
            t.setData({ text: _contentArr[0].content, title: _contentArr[0].title });
          }
        }
        t.setData({
          detailsList: _contentArr,
          // idindex: _idindex,
          shareTitle: res.data.data.cert_name,
          isFavorite: res.data.data.has_favorite == '1' ? true : false
        })
      },
      "post", 
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + (app.globalData.token ? app.globalData.token : app.globalData.untoken) },
      function() {
        console.log('系统错误')
      }
    );
    // 获取证书详情页底部图
    // common.nRequest(
    //   getApp().data.services + "api/getcertbottomimage", {
    //     id: options.certsId
    //   },
    //   function (res) {
    //     if (getApp().data.Reg.test(res.statusCode)) {
    //       var _imgalist = [];
    //       _imgalist.push(res.data.data.url);
    //       t.setData({
    //         imgalist:_imgalist
    //       })
    //     }
    //   },
    //   "post",
    //   { 'content-type': 'application/x-www-form-urlencoded' },
    //   function () {
    //     console.log('系统错误')
    //   }
    // );
    wx.getStorage({
      key:'wechatNumber',
      success: function (_wechatNumber){
        if (_wechatNumber.data == '') {
          // 获取微信账号
          common.nRequest(
            getApp().data.services + "api/getwechatid",
            {},
            function (res) {
              if (getApp().data.Reg.test(res.statusCode)) {
                t.setData({
                  wechatNumber: res.data.data.wechat_id
                })
                wx.setStorageSync('wechatNumber', res.data.data.wechat_id)
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded' },
            function () {
              console.log('系统错误')
            }
          );
        }else{
          t.setData({
            wechatNumber: _wechatNumber.data
          })
        }
      },
      fail:function(){
        // 获取微信账号
        common.nRequest(
          getApp().data.services + "api/getwechatid",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              t.setData({
                wechatNumber: res.data.data.wechat_id
              })
              wx.setStorageSync('wechatNumber', res.data.data.wechat_id)
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded' },
          function () {
            console.log('系统错误')
          }
        );
      }
    })
  },
  certificateNavFun: function() {
    this.setData({
      showNav: !this.data.showNav
    })
  },
  // 分享
  onShareAppMessage: function(res) {
    var t = this;
    return {
      title: t.data.shareTitle,
      path: '/pages/certificateDetails/certificateDetails?certsId=' + t.data.certsId,
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
  // 收藏
  collectionFun: function() {
    var t = this;
    common.nRequest(
      getApp().data.services + "api/favorite", {
        id: t.data.certsId,
        increase: t.data.isFavorite ? '-1' : '1',
        favorite: 'cert'
      },
      function(res) {
        wx.hideLoading();
        console.log(res)
        if (getApp().data.status.s203 == res.statusCode) { //收藏成功
          t.setData({
            isFavorite: !t.data.isFavorite
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 2000,
            complete: function () {
              setTimeout(function () { wx.hideToast();}, 2000);
            }
          })
        } else if (getApp().data.status.s204 == res.statusCode) { //取消收藏成功
          wx.showToast({
            title: '取消收藏成功',
            icon: 'none',
            duration: 2000,
            complete: function () {
              setTimeout(function () { wx.hideToast(); }, 2000);
            }
          })
          t.setData({
            isFavorite: !t.data.isFavorite
          })
        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + (app.globalData.token ? app.globalData.token : app.globalData.untoken)
      },
      function() {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

})