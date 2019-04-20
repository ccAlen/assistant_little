// pages/center/center.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,
    showGetPhone: false,
    userInfo:{},
    showewm: false,
    imgalist: []
  },
  getPhone: function (param) {
    common.getPhone(param, this)
  },
  getKey: function (param) {
    common.getKey(param, this)
  },
  closeEWMfun:function(){
    this.setData({
      showewm:false
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })

  },
  LinkFun:function(link){
    var t = this;
    // console.log(link.currentTarget.dataset.linkurl)
    if (link.currentTarget.dataset.linkurl == 'getBag'){
      if (t.data.imgalist.length <=0 ){
        // 获取证书详情页底部图
        common.nRequest(
          getApp().data.services + "api/getserviceqrcode",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              var _imgalist = [];
              _imgalist.push(res.data.data.service_qrcode);
              t.setData({
                imgalist: _imgalist,
                showewm: true
              })
            } else {
              wx.showToast({
                title: '二维码显示失败',
                icon: 'none',
                duration: 2000
              })
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
          showewm: true
        })
      }
    }else{
      if (app.globalData.token != '') {
        wx.navigateTo({
          url: '../' + link.currentTarget.dataset.linkurl + '/' + link.currentTarget.dataset.linkurl,
        })
      } else {
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', link.currentTarget.dataset.linkurl)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var t = this;
    if (app.globalData.token != ''){
      // 获取用户信息
      common.nRequest(
        getApp().data.services + "api/user/getdetail",
        {},
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            if (res.statusCode == app.data.status.s201) {
              // console.log("用户信息")
              // console.log(res.data.data)
              t.setData({
                userInfo: res.data.data
              })
              wx.setStorage({
                key: 'userInfo',
                data: res.data.data,
              })
            }
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + app.globalData.token },
        function () {
          console.log('系统错误')
        }
      );
    }
  },
  onGotUserInfo: function (e) {
    console.log(e)
    common.getPhoneNumber(this);
    if (e.currentTarget.dataset.btntype && e.currentTarget.dataset.btntype == 'center'){
      wx.setStorageSync('loginedLink', 'center')
    }  
  },
  // loginFun:function(){
  //   if (app.globalData.token == ''){
  //     // 弹出授权弹框
  //     common.getLogin(this, 'center')
  //   }
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t = this;
    // if (app.globalData.token == ''){
    //   // 弹出授权弹框
    //   common.getLogin(t, 'center')
    // }
    wx.getStorage({
      key: 'userInfo',
      success: function (_userInfo) {
        t.setData({
          userInfo: _userInfo.data
        })
      },
    })
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