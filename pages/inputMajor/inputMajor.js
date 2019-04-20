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
    specialtyListlength:0,
    step: '1',//步骤
    isShow: false,
    isplay: app.globalData.isplay,
    zhuanyeid: '',
    zhiyeid: '',
    testRecord: false,
    text: true,
    showlist: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var specialtyListlength
    specialtyListlength = jmz.GetLength(_val)
//专业检索
    t.setData({
      specialtyListlength: specialtyListlength,
      specialtyList: _val,
      zhuanyeid : ''
    });
    if (specialtyListlength >= 4) {
      common.nRequest(
        getApp().data.services + "api/major/retrievalmajor",
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
      specialtyList: e.target.dataset.list,
      zhuanye: true,
      zhuanyeid: e.currentTarget.dataset.id,
      showlist:false
    })
  },
  // 下一步
  nextstapFun:function(){
    if(this.data.zhuanyeid != ''){
      wx.navigateTo({
        url: '../inputDirection/inputDirection?majorid=' + this.data.zhuanyeid,
      })
    }else{
      wx.showToast({
        title: '请选择有效的专业名称',
        icon: 'none',
        duration: 2000
      })
    }
  }
})