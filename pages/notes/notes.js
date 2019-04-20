// pages/notes/notes.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colors: ["#01b0f1", "#ffc000", "#92d14f", "#fe5c8d","#ccc"],
    searchcertRecord:{},
    majorrateArr:[],
    majorArr:[],
    profsrateArr:[],
    profsArr:[],
    haselse:false,
    showPoster: false,
    posterimg:'',
    zhuanyeid:'',
    zhiyeid:''
  },
  linkIndexFun:function(){
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 生成海报
  generatingPoster:function(){
    var t  = this;
    if (t.data.zhiyeid && t.data.zhiyeid != '' && t.data.zhiyeid != 0){
      var _can = {
        profession_id: t.data.zhiyeid,
        major_id: t.data.zhuanyeid
      }
    }else{
      var _can = {
        major_id: t.data.zhuanyeid
      }
    }
    
    common.nRequest(
      getApp().data.services + "api/getshareimage",
      _can,
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          if ((res.data.data.url) && (res.data.data.url != '')){
            t.setData({
              showPoster: true,
              posterimg: getApp().data.services + res.data.data.url
            })
          }
          // console.log(res.data.data)
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  closePosterFun:function(){
    this.setData({
      showPoster:false
    })
  },
  saveFun:function(){
    var t = this;
    // wx.showLoading()
    wx.downloadFile({
      url: t.data.posterimg,
      success: function (res) {
        let path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            // console.log(res)
            // console.log("保存成功")
            t.setData({
              showPoster:false
            })
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000,
              success:function(){
                setTimeout(function () { wx.hideToast() }, 2000);
              }
            })
          },
          fail(res) {
            console.log(res)
            console.log("保存失败")
            t.setData({
              showPoster: false
            })
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          },
          complete(res) {
            // wx.hideLoading()
          }
        })
      }, fail: function (res) {
        console.log(res)
      }
    })
  },
  // 分享
  onShareAppMessage: function (res) {
    var t = this;
    return {
      title:'猩考证',
      path: '/pages/index/index',
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
  //调用证书查询接口
  getSearchcert: function (_zhuanyeid, _zhiyeid, _token) {
    var t = this;
    // 查询证书并保存查询记录 
    var postData = {}

    if (_zhiyeid && _zhiyeid != '0') {
      postData.profession_id = _zhiyeid
    }
    if (_zhuanyeid) {
      postData.major_id = _zhuanyeid
    }
    common.nRequest(
      getApp().data.services + "api/cert/searchcert",
      postData,
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          
          var _searchcertRecord = res.data.data;
          // console.log(_searchcertRecord)
          t.setData({
            searchcertRecord: _searchcertRecord
          })
          if (_searchcertRecord.major.certs && _searchcertRecord.major.certs.length > 0){
            var majorrateArr = [];
            var majorArr = [];
            for (var i = 0; i < _searchcertRecord.major.certs.length; i++){
              majorrateArr.push(parseFloat(_searchcertRecord.major.certs[i].rate).toFixed(1))
              majorArr.push(_searchcertRecord.major.certs[i])
            }
            console.log(majorrateArr)
            t.setData({
              majorrateArr: majorrateArr,
              majorArr: majorArr
            })
            t.creatCanvars('mypie', majorrateArr)
          }
          if (_searchcertRecord.profs.certs && _searchcertRecord.profs.certs.length > 0) {
            var profsrateArr = [];
            var profsArr = [];
            for (var i = 0; i < _searchcertRecord.profs.certs.length; i++) {
              profsrateArr.push(parseFloat(_searchcertRecord.profs.certs[i].rate).toFixed(1))
              profsArr.push(_searchcertRecord.profs.certs[i])
            }
            // console.log(profsArr)
            t.setData({
              profsrateArr: profsrateArr,
              profsArr: profsArr
            })
            t.creatCanvars('mypie1', profsrateArr)
          }
          // this.creatCanvars('mypie1')
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    t.getSearchcert(options.zhuanyeid, options.zhiyeid, app.globalData.token)
    t.setData({
      zhuanyeid: options.zhuanyeid,
      zhiyeid: options.zhiyeid
    })
  },
  creatCanvars: function (_mypie, _majorrateArr){
    var context = wx.createContext();
    // 画饼图
    //    数据源
    var array = _majorrateArr;
    var colors = this.data.colors;
    var total = 100;
    //    计算总量有没有达到100%
    var _total = 0;
    for (var index = 0; index < array.length; index++) {
      _total = parseFloat(_total) + parseFloat(array[index]);
    }
    // console.log(total)
    // console.log(_total)
    // console.log(total - _total)
    if (_total >= total) {
      var array = _majorrateArr;
      haselse: false
      console.log(array)
    } else {
      array.push(total - _total);
      this.setData({
        haselse:true
      })
      // console.log(array)
    }
    //    定义圆心坐标
    var point = { x: 125, y: 125 };
    //    定义半径大小
    var radius = 60;
    /*    循环遍历所有的pie */
    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      //    	起点弧度
      var start = 0;
      if (i > 0) {
        // 计算开始弧度是前几项的总和，即从之前的基础的上继续作画
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      // console.log("i:" + i);
      // console.log("start:" + start);
      //      1.先做第一个pie
      //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
      context.arc(point.x, point.y, radius, start, start + array[i] / total * 2 * Math.PI, false);
      //      3.连线回圆心
      context.lineTo(point.x, point.y);
      //      4.填充样式
      // console.log(i)
      // console.log(array.length)
      
      if (i == array.length - 1 && _total < total){
        context.setFillStyle(colors[4]);
      }else{
        context.setFillStyle(colors[i]);
      }
      //      5.填充动作
      context.fill();
      context.closePath();
      // if (i < array.length - 1) {
        /*
            绘制文字
            text-x=x0+Mathcos(指定的度数)*（半径+突出的长度）
             text-=y0+Mathsin(指定的度数)*（半径+突出的长度）
            */
        context.beginPath();
        var startreg = start * 180 / Math.PI;
        var endreg = (start + array[i] / total * 2 * Math.PI) * 180 / Math.PI;
        var text = parseFloat(array[i]).toFixed(1) + "%";
        var textAngle = startreg + 1 / 2 * ((array[i] / total * 2 * Math.PI) * 180 / Math.PI);
        var x = 125 + Math.cos(textAngle * Math.PI / 180) * (radius + 20);
        var y = 125 + Math.sin(textAngle * Math.PI / 180) * (radius + 20);
        // console.log(startreg)
        // console.log(textAngle)
        // console.log(endreg)
        if (textAngle > 90 && textAngle <= 180){
          var x = 125 + Math.cos(textAngle * Math.PI / 180) * (radius + 20);
        } else if (textAngle > 180 && textAngle <= 230){
          var x = 125 + Math.cos(textAngle * Math.PI / 180) * (radius + 20);
          var y = 125 + Math.sin(textAngle * Math.PI / 180) * (radius + 0);
        } else if (textAngle > 230 && textAngle <= 270){
          var y = 125 + Math.sin(textAngle * Math.PI / 180) * (radius + 10);
        }else if (textAngle > 270){
          var x = 125 + Math.cos(textAngle * Math.PI / 180) * (radius + 15);
          var y = 125 + Math.sin(textAngle * Math.PI / 180) * (radius + 8);
        }else{
          var x = 125 + Math.cos(textAngle * Math.PI / 180) * (radius + 20);
        }
        context.font = "14px '微软雅黑'";
        if (textAngle > 90 && startreg < 270) {
          context.textAlign = "end"
        }
        context.setTextAlign('center')
        context.fillText(text, x, y);
        context.fill();
      // }
      
    }
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      //指定canvasId,canvas 组件的唯一标识符
      canvasId: _mypie,
      actions: context.getActions()
    });
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

  },

  
})