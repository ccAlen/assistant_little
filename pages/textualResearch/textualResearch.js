// pages/textualResearch/textualResearch.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotNewsList: [],
    nav: app.globalData.textualResearchNav,
    isSearch: false,
    showLogin: false,
    showGetPhone: false,
    navList:[],
    pageNumber: 1,
    isEdd: false,
    storageSys:{
      allList: {//全部列表缓存
        list: [],
        isall:false
      },
      // dongtaiList: [],//动态列表缓存
      zigezhengList: {//资格证列表缓存
        list: [],
        isall: false
      },
    },
    backTopValue:false
  },
  onPageScroll: function (e) {
    // console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    // console.log(scrollTop)
    var backTopValue = scrollTop >= 43 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },
  getPhone: function (param) {
    common.getPhone(param, this)
  },
  getKey: function (param) {
    common.getKey(param, this)
  },
  // searchFun:function(){
  //   this.setData({
  //     isSearch:true,
  //     nav:'search',
  //     hotNewsList:[]
  //   })
  // },
  searchbackFun:function(){
    this.setData({
      isSearch: false,
      nav:"0",
      pageNumber: 1,
      hotNewsList: [],
      isEdd: false
    })
    this.getHotNewsFun("0")
  },
  searchinputFun:function(e){
    var t = this;
    // console.log(e.detail.value)
    t.setData({
      hotNewsList:[]
    })
    if (e.detail.value != ''){
      // 考证动态#搜索
      common.nRequest(
        getApp().data.services + "api/search",
        { page: 1, per_page: 500, keyword: e.detail.value },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            // console.log(res.data.data)
            t.setData({
              hotNewsList: res.data.data
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
        isSearch: false,
        nav: "0",
        pageNumber: 1,
        hotNewsList: [],
        isEdd: false
      })
    }
    
  },
  navFun: function (e) {
    var t = this;
    var _nav = e.target.dataset.nav;
    var _isEdd = false;
    var _pageNumber = 1;
    var _hotNewsList = [];
    if (_nav == '0') {
      if (!t.data.storageSys.allList.isall) {
        _pageNumber = Math.ceil(t.data.storageSys.allList.list.length / 10) + 1;
        _hotNewsList = t.data.storageSys.allList.list;
        _isEdd = false
      } else {
        _hotNewsList = t.data.storageSys.allList.list;
        _isEdd = true;
      }
    } else if (_nav == '9') {
      if (!t.data.storageSys.zigezhengList.isall) {
         _pageNumber = Math.ceil(t.data.storageSys.zigezhengList.list.length / 10) + 1;
         _hotNewsList = t.data.storageSys.zigezhengList.list;
      } else {
        // var _pageNumber = 1;
        _hotNewsList = t.data.storageSys.zigezhengList.list;
        _isEdd = true;
      }
    } else {
      if (t.data.storageSys[_nav]) {
        if (!t.data.storageSys[_nav].isall){
          _pageNumber = Math.ceil(t.data.storageSys[_nav].list.length / 10) + 1;
          _hotNewsList = t.data.storageSys[_nav].list;
          _isEdd = false
        }else{
          _isEdd = true;
          _hotNewsList = t.data.storageSys[_nav].list;
        }
      } else {
        var _storageSys = t.data.storageSys;
        _storageSys[_nav] = {
          list: [],
          isall: false
        }
        console.log(_storageSys)
      }
    }
    t.setData({
      nav: _nav,
      pageNumber: _pageNumber,
      hotNewsList: _hotNewsList,
      isEdd: _isEdd

    })
    // this.setData({
    //   nav: e.target.dataset.nav,
    //   pageNumber: 1,
    //   hotNewsList: [],
    //   // isEdd:false

    // })
    app.globalData.textualResearchNav = _nav;
    if (!_isEdd){
      this.getHotNewsFun(_nav)
    }
    
    // getApp().globalData.recordNav = e.target.dataset.nav;
  },
  // 封装获取热门资格证书接口
  getHotcertFun(){
    var t = this;
    var _hotcertList = [];
    // 获取热门证书列表
    common.nRequest(
      getApp().data.services + "api/cert/gethotcerts",
      { page: t.data.pageNumber, per_page: 10,},
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          wx.stopPullDownRefresh();
          var _hotcertList = t.data.hotNewsList.concat(res.data.data);
          var _storageSys = t.data.storageSys;
          _storageSys.zigezhengList.list = _hotcertList;
          t.setData({
            hotNewsList: _hotcertList,
            storageSys: _storageSys
          })
          if (_hotcertList.length >= res.data.page.total) {
            _storageSys.zigezhengList.isall = true;
            t.setData({
              isEdd: true,
              storageSys: _storageSys
            })
          }         
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 封装资讯列表接口
  getHotNewsFun:function(navid){
    var t = this;
    // console.log(navid)
    if(navid == '9'){
      t.setData({
        // hotNewsList:[],
        nav:'9'
      })
      t.getHotcertFun()
    }else{
      var can = {};
      if (navid == '0') {
        can = { page: t.data.pageNumber, per_page: 10, is_hot: '1' };
      } else {
        can = { page: t.data.pageNumber, per_page: 10, is_hot: '1', tid: navid };
      }
      // 热门内容列表
      common.nRequest(
        getApp().data.services + "api/news/news",
        can,
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            wx.stopPullDownRefresh();
            var _hotNewsList = t.data.hotNewsList.concat(res.data.data)
            var _storageSys = t.data.storageSys;
            if (navid == '0'){
              _storageSys.allList.list = _hotNewsList;
            }else{
              
              var _navid = navid.toString()
              // console.log(_storageSys)
              // console.log(_storageSys[_navid])
              _storageSys[_navid].list = _hotNewsList;
            }
            
            t.setData({
              hotNewsList: _hotNewsList,
              storageSys: _storageSys
            })
            if (_hotNewsList.length >= res.data.page.total){
              // console.log("llllllllllllll")
              if (navid == '0') {
                _storageSys.allList.isall = true;
              } else {
                _storageSys[navid].isall = true;
                console.log(_storageSys)
              }
              
              t.setData({
                isEdd:true,
                storageSys: _storageSys
              })
            }
            // if(navid == '0'){
            //   t.setData({
            //     allList: _hotNewsList
            //   })
            // }
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded' },
        function () {
          console.log('系统错误')
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onShow:function(){
    var t = this;
    // 登录
    // if (app.globalData.token == '') {
    //   common.getLogin(t, 'textualResearch')
    // }
    // t.setData({
    //   nav: app.globalData.textualResearchNav
    // })
    // console.log(app.globalData.textualResearchNav)
    if (app.globalData.textualResearchNav == 'indexurl9'){
      t.setData({
        hotNewsList:[],
        pageNumber:1,
        isEdd:false
      })
      t.getHotNewsFun('9');
      app.globalData.textualResearchNav = 0
    }
  },
  onLoad: function (options) {
    var t = this;
    // console.log('2')
    if (app.globalData.textualResearchNav != 'indexurl9') {
      t.getHotNewsFun(app.globalData.textualResearchNav)
    }
    
    // 获取考证动态顶部的资讯分类labels列表
    common.nRequest(
      getApp().data.services + "api/news/getnewslabels",
      {},
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res.data.data)
          t.setData({
            navList: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 上拉触底事件
  onReachBottom: function () {
    var t = this;
    // 当前页+1
    var pageNumber = t.data.pageNumber + 1;

    t.setData({
      pageNumber: pageNumber,
    })

    if (!t.data.isEdd) {
      if (t.data.nav != 'search'){
        // 请求后台，获取下一页的数据。
        t.getHotNewsFun(t.data.nav)
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var t = this;
    console.log("下拉")
    if (t.data.nav != 'search') {
      // 请求后台，获取下一页的数据。
      t.setData({
        pageNumber: 1,
        isEdd: false,
        hotNewsList:[]
      })
      t.getHotNewsFun(t.data.nav)
    }
  },
})