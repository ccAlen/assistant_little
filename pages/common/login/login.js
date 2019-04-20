const app = getApp();
var common = require("../../../utils/util.js");
Component({
  properties: {
  },
  data: {
    // 这里是一些组件内部数据 
    showLogin: false,
    showGetPhone: false,
  },
  ready:function(){
    var t = this;
    console.log(app.globalData)
    console.log(app.globalData.showLogin)
    t.setData({
      showLogin: app.globalData.showLogin
    })
  },
  methods: {
    // 关闭
    closeFun:function(){
      var t = this;
      t.triggerEvent('getKey', {status: false})
      t.setData({
        showLogin: false
      })
      getApp().globalData.showLogin = false;
    },
    // 获取用户信息
    onGotUserInfo:function(){
      var t = this;
      // t.setData({
      //   showLogin:false
      // })
      // t.triggerEvent('getKey', { status: 'close' })
      wx.getSetting({
        success: res => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            t.triggerEvent('getKey', { status: true })
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // t.triggerEvent('getKey', { status: true })
                // t.setData({
                //   showLogin: false
                // })
                console.log('用户授权基本信息')
                // 把获取到的用户信息存到缓存
                wx.setStorage({
                  key: "userInfo",
                  data: res
                })
                // 可以将 res 发送给后台解码出 unionId
                // 登录
                wx.login({
                  success: _code => {
                    if (getApp().globalData.pid != ''){
                      var canshu = {
                        code: _code.code,
                        iv: res.iv,
                        encryptedData: res.encryptedData,
                        pid: getApp().globalData.pid,
                        is_textual:'1'
                      }
                    }else{
                      var canshu = {
                        code: _code.code,
                        iv: res.iv,
                        encryptedData: res.encryptedData,
                        is_textual: '1'
                      }
                    }
                    common.nRequest(
                      getApp().data.services + "api/register",
                      canshu,
                      function (res) {
                        if (getApp().data.Reg.test(res.statusCode)) {
                          // 获取到用户token,存到缓存
                          getApp().globalData.token = res.data.data.token;
                          wx.setStorageSync('token', res.data.data.token)
                          t.setData({
                            showLogin: false
                          })
                          if (getApp().globalData.pid != ''){
                            console.log("66666666666")
                            // t.setData({
                            //   showGetPhone:true
                            // })
                          }
                          // 跳转到对应的页面
                          wx.getStorage({
                            key: 'loginedLink',
                            success: function (_loginedLink) {
                              if ((_loginedLink.data == '') || (_loginedLink.data == 'index')) {
                                console.log("1")
                                // wx.redirectTo({
                                //   url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                // })
                              } else if (_loginedLink.data == 'center'){
                                wx.redirectTo({
                                  url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                })
                              } else if (_loginedLink.data == 'inputMajor'){
                                if (getApp().globalData.pid == ''){
                                  // pid != ''需要授权手机号
                                  wx.navigateTo({
                                    url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                  })
                                }
                              }else {
                                console.log("2")
                                wx.navigateTo({
                                  url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                })
                              }
                            },
                          })
                          console.log(res.data.data.token)
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
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (t.userInfoReadyCallback) {
                  t.userInfoReadyCallback(res)
                }
              },
              fail:res => {
                console.log("获取用户信息失败")
              }
            })
          }else{
            console.log("没有授权")
            t.triggerEvent('getKey', { status: false })
            // getApp().globalData.showLogin = false;
          }
        }
      })
    }
  }
})