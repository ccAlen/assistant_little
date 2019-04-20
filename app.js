//app.js
var common = require("./utils/util.js");
App({
  data: {
    // services: "https://dev.wefundvc.com/",//测试
    // services: "https://api.exinghang.com/",//正式
    services: "https://dev.exinghang.com/",//测试
    // services: "https://lion.exinghang.com/",//正式
    Reg: /^20[0123456789]$/,//判断接口返回状态是否为20开头
    imgReg: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,//判断图片格式
    status: {
      s201: '201',//正常显示数据
      s402: '402',//显示错误信息，告知用户
      s203: '203',//删除成功
      s204: '204',//删除失败
      s301: '301',//需要后续操作
      s401: '401',//系统错误
      s403: '403',//敏感词
    }

  },
  onLaunch: function (ops) {
    console.log(ops);
    this.globalData.ops = ops;
    wx.login({
      success: res => {
        console.log(res)
      }
    })
    if (ops.scene == '1089'){
      this.globalData.isshowzgh = false
    }
    // console.log("新渲染")
    if(ops.query.pid){
      this.globalData.pid = ops.query.pid
    }else{
      this.globalData.pid = ''
    }
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
      //console.log('abcb')
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      console.log('更新失败')
    })
  },
  onHide:function(){
    // console.log("隐藏小程序")
  },
  globalData: {
    userInfo: null,
    isShow: false,
    token: '',
    showLogin: false,
    untoken:'',
    textualResearchNav:'0',
    showGetPhone:false,
    pid: '',
    ops:{},
    isshowzgh:true
  }
})