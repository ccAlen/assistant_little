// pages/common/phone/phone.js
const app = getApp();
var common = require("../../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户信息
    getPhoneNumber: function (e) {
      var t = this;
      t.triggerEvent('getPhone', { phonestatus: true })
      
      wx.login({
        success: function (res) {
          if (res.code) {
            if (e.detail.iv) { //允许获取手机号 
              // t.triggerEvent('getPhone', { phonestatus: true })
              // 获取用户手机
              common.nRequest(
                getApp().data.services + "api/user/getmobile", {
                  code: res.code,
                  iv: e.detail.iv,
                  encryptedData: e.detail.encryptedData
                },
                function (phoneNum) {
                  console.log(phoneNum)
                  if (getApp().data.Reg.test(phoneNum.statusCode)) {
                    // t.setData({
                    //   showGetPhone: false
                    // })
                    console.log(phoneNum.data.data.phoneNumber)
                    // 获取到手机号后，请求更新用户信息接口存储手机号
                    common.nRequest(
                      getApp().data.services + "api/user/updateuser", {
                        mobile: phoneNum.data.data.phoneNumber
                      },
                      function (res) {
                        console.log(res)
                        if (res.statusCode == app.data.status.s402) {
                          wx.showToast({
                            title: '您已授权手机号',
                            icon: 'none',
                            duration: 2000
                          })
                          wx.getStorage({
                            key: 'loginedLink',
                            success: function (_loginedLink) {
                              if (_loginedLink.data == 'inputMajor') {
                                wx.navigateTo({
                                  url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                })
                              }
                            }
                          })
                        }
                      },
                      "post", {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + app.globalData.token
                      },
                      function () {
                        console.log('系统错误')
                      }
                    );
                  }
                },
                "post", {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + app.globalData.token
                },
                function () {
                  console.log('系统错误')
                }
              );
            } else { //拒绝获取手机号
              t.triggerEvent('getPhone', { phonestatus: false })
              wx.getStorage({
                key: 'loginedLink',
                success: function (_loginedLink) {
                  if (_loginedLink.data == 'inputMajor') {
                    wx.navigateTo({
                      url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                    })
                  }
                }
              })
              console.log("拒绝授权手机号")
              getApp().globalData.showGetPhone = false;
            }
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    },
  }
})
