const app = getApp()
Page({
  data: {
    userInfo: {},
    dataBase: {},
    visible: false,
    bonusMes: [
      [
        '变成有钱人了好突然!',
        '有点不适应!有点晕!'
      ],
      [
        '付出总有回报的',
        '尽管比之前算的少了那么一丢丢',
        '大气的我',
        '就不太在乎这些小细节了....'
      ],
      [
        '马马虎虎吧',
        '(吃饭给自己加个鸡腿先! )'
      ]
    ],
    chosenMessage: ''
  },

  // 展示/隐藏分享页面
  show: function (e) {
    console.log(e)
    this.setData({
      visible: true,
      userInfo: e.detail.userInfo
    })
  },
  close: function () {
    this.setData({ visible: false })
  },

  // 对we.getUserInfo函数进行封装
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onLoad(option) {

    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

    console.log('Bonus option', option)

    var dataBase = JSON.parse(option.summary)
    this.setData({
      dataBase: dataBase
    })

    var reallyBonus = dataBase.reallyBonus
    var chosenMessage
    if (reallyBonus < 10000) {
      chosenMessage = 2
    } else {
      if (reallyBonus < 20000) {
        chosenMessage = 1
      } else {
        chosenMessage = 0
      }
    }

    this.setData({
      chosenMessage: chosenMessage
    })
  }
})