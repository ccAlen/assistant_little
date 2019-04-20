// pages/suggestedResults/feedbackSuggestion.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.setData({
      isShow: app.globalData.isShow
    })
  },
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var _feedback = e.detail.value.textarea;
    var _username = e.detail.value.name;
    var _contact = e.detail.value.phone;
    var reg = /^1[34578][0-9]{9}/;
    var reg1 = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/;
    
    if (_feedback == ''){
      wx.showToast({
        title: '建议内容不得为空',
        icon: 'none',
        duration: 2000
      })
    } else if (_username == ''){
      wx.showToast({
        title: '称呼不得为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!reg.test(_contact) && !reg1.test(_contact)){
      wx.showToast({
        title: '请正确填写手机号码和邮箱',
        icon: 'none',
        duration: 2000
      })
    }else{
      // 添加用户反馈
      common.nRequest(
        getApp().data.services + "api/feedback", {
          feedback: _feedback,
          contact: _contact,
          username: _username
        },
        function (res) {
          wx.hideLoading();
          if (res.statusCode == app.data.status.s203) {
            wx.hideLoading();
            // console.log(res)
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              duration: 3000,
              complete: function () {
                setTimeout(function () { wx.hideToast(); wx.navigateBack() }, 2000);
              }
            })
          } else if (res.statusCode == app.data.status.s402) {
            wx.showToast({
              title: res.data.message[0],
              icon: 'none',
              duration: 2000,
              complete: function () {
                setTimeout(function () { wx.hideToast(); }, 2000);
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000,
              complete: function () {
                setTimeout(function () { wx.hideToast(); }, 2000);
              }
            })
          }
        },
        "post", {
          'content-type': 'application/x-www-form-urlencoded'
        },
        function () {
          console.log('系统错误')
        }
      );
    }
  },
})