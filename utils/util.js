const app = getApp()
// var common = require("../../utils/util.js");

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 封装请求方法
 * url  请求的接口地址
 * data 请求接口的数据
 * successFunc  请求成功后执行的方法
 * errorFunc    请求失败后执行的方法
 * method    默认为get
 * header    默认为{'content-type': 'application/json'}
 */

var requestNum = 0;
function nRequest(url, data, successFunc, method, header, errorFunc) {
  header = header || { 'content-type': 'application/json' };
  method = method || "get";

  // console.log(requestNum);

  requestNum++;
  if (wx.showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }

  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    method: method,
    data: data,
    header: header,
    success: function (res) {
      successFunc(res);
      requestNum--;
      if (requestNum == 0) {
        wx.hideLoading();
      }
    },
    error: function (err) {
      errorFunc(err);
      requestNum--;
      if (requestNum == 0) {
        wx.hideLoading();
      }
    }
  })
};
// 封装登录方法(该方法用在每次进入小程序的时候调用，更新缓存中的token)
function getLogin (_this,_url) {
  var t = _this;
  var that = this;
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      that.nRequest(
        getApp().data.services + "api/login", 
        { code: res.code, is_textual:'1' },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            console.log(res)
            if (res.data.data.state == '1') {//该用户已注册，获取token存起来
              getApp().globalData.token = res.data.data.token;
              wx.setStorageSync('token', res.data.data.token)
              t.setData({
                showLogin: false
              })
              if (getApp().globalData.pid != ''){
                // 获取用户信息
                that.nRequest(
                  getApp().data.services + "api/user/getdetail",
                  {},
                  function (_getdetail) {
                    if (getApp().data.Reg.test(_getdetail.statusCode)) {
                      console.log(_getdetail.data.data.mobile)
                      if (_getdetail.data.data.mobile == null) {
                        t.setData({
                          showGetPhone: true
                        })
                      } else {
                        // 曾经有授权过手机号
                        t.setData({
                          showGetPhone: false
                        })
                      }
                    }
                  },
                  "post",
                  { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + (res.data.data.token || app.globalData.token) },
                  function () {
                    console.log('系统错误')
                  }
                )
              }
            } else {//该用户还没注册
              console.log("不存在该用户，去授权登录")
              // 弹出弹框让用户授权
              getApp().globalData.showLogin = true;
              t.setData({
                showLogin: true
              })
              wx.setStorageSync('loginedLink', _url)
              getApp().globalData.untoken = res.data.data.token;
            }
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
};
// 获取用户信息
function getPhoneNumber (t) {
  var t = t;
  var that = this;
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
                if (getApp().globalData.pid != '') {
                  var canshu = {
                    code: _code.code,
                    iv: res.iv,
                    encryptedData: res.encryptedData,
                    pid: getApp().globalData.pid,
                    is_textual: '1'
                  }
                } else {
                  var canshu = {
                    code: _code.code,
                    iv: res.iv,
                    encryptedData: res.encryptedData,
                    is_textual: '1'
                  }
                }
                that.nRequest(
                  getApp().data.services + "api/register",
                  canshu,
                  function (register) {
                    if (getApp().data.Reg.test(register.statusCode)) {
                      // 获取到用户token,存到缓存
                      getApp().globalData.token = register.data.data.token;
                      wx.setStorageSync('token', register.data.data.token)
                      t.setData({
                        showLogin: false
                      })
                      if (getApp().globalData.pid != '') {
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
                          } else if (_loginedLink.data == 'center') {
                            console.log("center!!!")
                            // wx.switchTab({
                            //   url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                            // })
                            t.setData({
                              userInfo:res
                            })
                          } else if (_loginedLink.data == 'inputMajor') {
                            if (getApp().globalData.pid == '') {
                              // pid != ''需要授权手机号
                              wx.navigateTo({
                                url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                              })
                            }
                          } else {
                            console.log("2")
                            wx.navigateTo({
                              url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                            })
                          }
                        },
                      })
                      console.log(register.data.data.token)
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
          fail: res => {
            console.log("获取用户信息失败")
          }
        })
      } else {
        console.log("没有授权")
        t.triggerEvent('getKey', { status: false })
        // getApp().globalData.showLogin = false;
      }
    }
  })
};
function getPhone(param,that) {
  const { detail: { phonestatus } } = param;
  console.log("用户手机授权弹框弹出");
  that.setData({
    showGetPhone: false
  })
  if (phonestatus) {
    console.log("授权手机号")
  } else {
    console.log("拒绝授权手机号")
  }
};
// 获取login组件的值
function getKey(param,that) {
  const { detail: { status } } = param;
  var t = that;
  if (status) {
    if (getApp().globalData.pid != '') {
      t.setData({
        showGetPhone: true,
        showLogin: false,
      })
    } else {
      t.setData({
        showGetPhone: false,
        showLogin: false,
      })
    }
    console.log("用户信息授权成功");
  } else {
    console.log("用户信息拒绝授权");
    t.setData({
      showGetPhone: false,
      showLogin: false,
    })
  }
};
module.exports = {
  formatTime: formatTime,
  nRequest: nRequest,
  getLogin: getLogin,
  getPhone: getPhone,
  getKey: getKey,
  getPhoneNumber: getPhoneNumber
}
