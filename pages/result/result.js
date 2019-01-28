const app = getApp()
Page({
  data: {
    userInfo: {},
    reallySalary: '',
    tax: '',
    dataBase: {},
    old: '',
    doctor: '',
    job: '',
    fund: '',
    visible: false,
    message: [
      [
        '每到发薪就发愁这么多钱怎么花?',
        '捉急哇~'
      ],
      [
        '我的目标','其实是财务自由你懂 ? ?'
      ],
      [
        '不要跟我聊收入诗和远方',
        '你们不懂....'
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

  onLoad (option) {
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

    console.log('option', option)

    var dataBase = JSON.parse(option.id)
    this.setData({
      dataBase: dataBase
    })

    var FundBase = parseFloat(dataBase.FundBase)
    var FundRate = dataBase.FundRate
    var Monthsalary = parseFloat(dataBase.Monthsalary)
    var socialBase = parseFloat(dataBase.socialBase)
    var deductionMoney = parseFloat(dataBase.deductionMoney)

    console.log("fundbase", FundBase)
    console.log('fundrate', FundRate)
    // 职工住房公积金的月缴存额计算
    var fund = FundBase * FundRate
    if(fund >= 22500*FundRate) {
      fund = 22500*FundRate
    }
    fund = fund.toFixed(2)

    // 去除三险一金后的工资 // 养老8%， 医疗2%， 失业0.5%
    var old = socialBase*0.08
    old = old.toFixed(2)
    if(old >= 1594.8) {
      old = 1594.8
    }
    var doctor = socialBase*0.02
    doctor = doctor.toFixed(2)
    if(doctor >= 398.7) {
      doctor = 398.7
    }
    var job = socialBase * 0.005
    job = job.toFixed(2)
    if (job >= 99.67) {
      job = 99.67
    }
    Monthsalary = Monthsalary - old - doctor - job - fund - deductionMoney

    // 记录三险一金值
    this.setData({
      old: old,
      doctor: doctor,
      job: job,
      fund: fund
    })

    // 月工资税收计算
    const lowest = 5000
    var tax
    if (Monthsalary <= lowest) {
      tax = 0
    } else {
      if (Monthsalary <= 8000) {
        tax = (Monthsalary - lowest) * 0.03
      } else {
        if (Monthsalary <= 17000) {
          tax = (Monthsalary - lowest) * 0.1 - 210
        } else {
          if (Monthsalary <= 30000) {
            tax = (Monthsalary - lowest) * 0.2 - 1410
          } else {
            if (Monthsalary <= 40000) {
              tax = (Monthsalary - lowest) * 0.25 - 2660
            } else {
              if (Monthsalary <= 60000) {
                tax = (Monthsalary - lowest) * 0.3 - 4410
              } else {
                if (Monthsalary <= 85000) {
                  tax = (Monthsalary - lowest) * 0.35 - 7160
                } else {
                  tax = (Monthsalary - lowest) * 0.45 - 15160
                }
              }
            }
          }
        }
      }
    }

    var reallySalary = parseFloat(Monthsalary) - parseFloat(tax) + parseFloat(deductionMoney)
    reallySalary = reallySalary.toFixed(2)
    // console.log("fundBase ", FundBase)
    // console.log("fundRate ", FundRate)
    // console.log("fund ", fund)
    // console.log("deductionMoney ", deductionMoney)
    // console.log("lowest ", lowest)
    // console.log("实际工资为： ", reallySalary)

    var chosenMessage
    if(reallySalary < 10000) {
      chosenMessage = 2
    } else {
      if(reallySalary < 20000) {
        chosenMessage = 1
      } else {
        chosenMessage = 0
      }
    }

    tax = tax.toFixed(2)
    this.setData({
      reallySalary: reallySalary,
      chosenMessage: chosenMessage,
      tax: tax
    })
  }
})