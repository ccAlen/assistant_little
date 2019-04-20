// pages/inputMajor/inputMajor.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialtyList: '',//专业输入框的值
    zhuanye: false,//判断用户是否从查询结果中选择专业
    postName: '',//岗位输入框的值
    zhiye: false,//判断用户是否从查询结果中选择职业
    searchMajorList: [],//搜索关键字返回的专业列表
    searchTextLength:0,
    step: '1',//步骤
    isShow: false,
    isplay: app.globalData.isplay,
    zhuanyeid: '',
    zhiyeid: '',
    testRecord: false,
    text: true,
    showlist: false,
    showGetPhone: false,
    showshare:false,
    isshare: false,
    profList: []
  },
  closeShare:function(){
    this.setData({
      showshare:false,
      isshare: false
    })
    this.getuserInfo()
  },
  // 分享
  onShareAppMessage: function (res) {
    var t = this;
    return {
      title: t.data.shareTitle,
      path: '/pages/index/index',
      success(e) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 2000
        })
        t.setData({
          isshare:true
        })
      },
      fail(e) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
        t.setData({
          isshare: false
        })
      },
      complete() {
        t.setData({
          showshare:false
        })
        t.getuserInfo()
      }
    }
  },
  getProf:function(ins){
    var t = this;
    // console.log(ins)
    // 读取10条 热门 或 随机 职业
    common.nRequest(
      getApp().data.services + "api/prof/getrandomprofs",
      { manual_refresh: ins },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res.data.data)
          if (res.data.data && (res.data.data.length > 0)) {
            t.setData({
              profList: res.data.data
            })
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded'},
      function () {
        console.log('系统错误')
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    console.log(options)
    t.setData({
      zhuanyeid: options.majorid
    });
    t.getProf('0')
  },
  selectprof:function(e){
    console.log(e.target.dataset)
    this.setData({
      postName: e.target.dataset.prof,
      zhiye: true,
      zhiyeid: e.target.dataset.id,
      // showlist: false
    })
  },
  changeFresh:function(){
    this.getProf('1')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /// 专业输入框监听
  getInputValFun: function (e) {
    const t = this;
    // console.log(e)
    let _val = e.detail.value;

    // 判断输入字符串长度，至少输入两个之后才请求
    let jmz = {};
    jmz.GetLength = function (str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    var searchTextLength
    searchTextLength = jmz.GetLength(_val)
    //职业检索
    t.setData({
      searchTextLength: searchTextLength,
      postName: _val,
      zhiye: false
    });
    if (searchTextLength >= 4) {
      common.nRequest(
        getApp().data.services + "api/prof/retrievalprof",
        { keyword: _val },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            // console.log(res)
            t.setData({
              searchMajorList: res.data.data,
              showlist: true
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
        searchMajorList:[]
      })
    }
  },
  // 选择列表
  onclickListFun: function (e) {
    console.log(e.target.dataset)
    this.setData({
      postName: e.target.dataset.list,
      zhiye: true,
      zhiyeid: e.currentTarget.dataset.id,
      showlist: false
    })
  },
  getuserInfo:function(){
    var t = this;
    // 获取用户信息
    common.nRequest(
      getApp().data.services + "api/user/getdetail",
      {},
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res.data.data.mobile)
          if (res.data.data.mobile == null) {
            t.setData({
              showGetPhone: true
            })
          } else {
            // 曾经有授权过手机号
            t.setData({
              showGetPhone: false,
              // hasphonenum: true
            })
            wx.navigateTo({
              url: '../notes/notes?zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
            })
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + app.globalData.token },
      function () {
        console.log('系统错误')
      }
    )
  },
  // 下一步
  nextstapFun: function () { 
    var t = this;
    if (t.data.zhuanyeid != '') {
      t.setData({
        showshare: true
      })
      // if(t.data.isshare){//已分享

      // }else{//没分享

      // }
      
    }else{
      wx.showToast({
        title: '您没有选择专业',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 获取用户信息
  getPhoneNumber: function (e) {
    var t = this;
    t.setData({
      showGetPhone: false
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          if (e.detail.iv) { //允许获取手机号 
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
                        wx.navigateTo({
                          url: '../notes/notes?zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
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
            t.setData({
              showGetPhone: false
            })
            if (t.data.isshare){
              wx.navigateTo({
                url: '../notes/notes?zhuanyeid=' + t.data.zhuanyeid + '&zhiyeid=' + t.data.zhiyeid
              })
            }else{
              wx.showToast({
                title: '必须分享或授权手机号才能查看报告',
                icon: 'none',
                duration: 2000
              })
            }
            console.log("拒绝授权手机号")
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
})