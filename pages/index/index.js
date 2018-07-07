//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this;

    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.data.username = res.data.username
        that.data.password = res.data.password
        that.login()
      }
    })


  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  login: function(e) {
    console.log(this.data.username)
    console.log(this.data.password)

    wx.showLoading({
      title: '登录中',
      mask: true,
    })

    var that = this;

    wx.request({
      url: 'https://card.boar.choosebridge.com/auth/login', //仅为示例，并非真实的接口地址
      data: {
        email: this.data.username,
        password: this.data.password,
        is_wechat: 1,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success == false) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        } else {
          console.log(res.data)
          wx.setStorage({
            key: 'user',
            data: {
              "username": that.data.username,
              "password": that.data.password
            },
          })
          getApp().globalData.userInfo = res.data.obj
          getApp().globalData.token = res.data.msg
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      }
    })
  },

  userNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  passWdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
})
