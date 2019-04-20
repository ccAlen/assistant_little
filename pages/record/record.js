// pages/record/record.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kaozhengList: {},//考证助手数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // [记录]获取证书查询记录
    common.nRequest(
      getApp().data.services + "/api/cert/getsearchcertrecords",
      { page: 1, per_page: 1000 },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          var _kaozhengList = res.data.data;
          // console.log(_kaozhengList)
          if (_kaozhengList.length > 0) {
            for (var i = 0; i < _kaozhengList.length; i++) {
              _kaozhengList[i].created_at = _kaozhengList[i].created_at.split(' ')[0]
            }
          }
          t.setData({
            kaozhengList: _kaozhengList
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
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  }
})