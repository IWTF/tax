const app = getApp()
var cities = require('./data.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: 'F6JBZ-3NM33-LDK3V-3TWWM-KC2N6-WZBCW'
}); 

var salaryTax =  require('../../utils/tax.js')
// 屏幕适配函数实现
function createRpx2px() {
  const { windowWidth } = wx.getSystemInfoSync()

  return function (rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()



Page({
  data: {
    visible: false,
    cities: [],
    top: rpx2px(6 * 2),
    left: rpx2px(80 * 2),
    showDetail: false,
    current: '1',
    de: '',
    currentCity: '',
    currentProvince: '请选择或定位您所在城市',
    showTi: false,
    salary: '',         // 税前工资input的value
    base: '',           // 社保，公积金基数input的value
    FundRate: '8',
    reallySalary: '',   // 计算后应得工资
    reallyBonus: '',
    bonusIndex: ''
  },
  //加了个分享的提示性文字
  onShareAppMessage: function () {
    return {
      title: '新版个税好，各种扣减，这个月少交了几百块！晚饭加鸡腿！'
    }
  },
  // 获取城市数组下标
  indexOfKey(arr, key, c) {
    console.log('********indexOfKey function: ********')
    console.log(key+'+'+c)
    var index = -1
    var cities = arr.cities
    console.log('function', key)
    for (var i = 0; i < cities.length; i++) {
      if (cities[i].city == c) {
        console.log('success', c)
        index = i
      }
    } // 判断city是否在数组中

    if (index == -1) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].province == key) { 
          console.log('success', cities[i].province)
          index = i
          break
        }
      }
    } // 若没有找到城市，则返回省份的最小值
    
    if (index != -1) {
      var base = (cities[index].averageSalary * 0.6).toFixed(2)
      this.setData({
        base: base
      })
    }
  },

  // 对获取所在城市的函数进行封装
  getLoc() {
    var that = this
    wx.showLoading({
      title: '获取中',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        // 调用百度地图的函数，由经纬度获取城市
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            // 虚拟机调试精度会有问题，真机没有
            // 关闭加载
            wx.hideLoading()
            // 显示提示
            that.setData({
              showTi: true,
              currentCity: res.result.address_component.city,
              currentProvince: res.result.address_component.province
            })
            console.log(res)
            // 获取该城市下标
            var province = res.result.address_component.province
            var city = res.result.address_component.city
            that.indexOfKey(cities, province, city)
          },
          fail: function (error) {
            console.error(error)
          },
          complete: function (res) {
            console.log(res)
          }
        })
      },
    })
  },

  onLoad (option) {
    // 给cities数组赋值
    console.log('cities are: ', cities)
    this.setData({
      cities: cities
    })

    // indexOfKey(cities, '北京市')

    wx.showShareMenu({
      withShareTicket: true
    })
    if (option.id) {
      this.setData({
        de: option.id
      })
      var s = wx.getStorageSync('salary')
      var b = wx.getStorageSync('base')
      var r = wx.getStorageSync('fundRate')
      var p = wx.getStorageSync('province')
      var c = wx.getStorageSync('city')
      this.setData({
        salary: s,
        base: b,
        FundRate: r,
        currentProvince: p,
        currentCity: c
      })
      console.log("getStorage")
    }
  },

  // 获取地理位置
  getPosition() {
    console.log('click getPosition')
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 调用小程序获取地理位置的函数
              that.getLoc()
            }
          })
        } else { // 判断是否授权if (!res.authSetting['scope.userLocation'])
          that.getLoc()
        }
      }
    })
  },

  submintSalary () {
    console.log("click")
  },

  // 切换到奖金个人所得税计算
  bonus_on() {
    this.setData({
      current: 2
    })
  },

  back (){
    this.setData({
      reallyBonus: ''
    })
  },

  // 切换到工资个人所得税计算
  salary_on() {
    this.setData({
      current: 1
    })
  },

  // 展示/隐藏分享页面
  show: function (e) {
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


  salaryInput(e) {
    this.setData({
      // base: e.detail.value,
      salary: e.detail.value
    })
  },

  deInput (e) {
    this.setData({
      de: e.detail.value
    })
  },

  showDetail () {
    this.setData({
      showDetail: !this.data.showDetail
    })
  },

  // 显示详情
  more() {
    wx.setStorageSync('salary', this.data.salary)
    wx.setStorageSync('base', this.data.base)
    wx.setStorageSync('fundRate', this.data.FundRate)
    wx.setStorageSync('province', this.data.currentProvince)
    wx.setStorageSync('city', this.data.currentCity)
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  baseInput(e) {
    this.setData({
      base: e.detail.value
    })
  },

  rateInput (e) {
    this.setData({
      FundRate: e.detail.value
    })
  },

  // 城市信息改变
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    var province = e.detail.value[0]
    var city = e.detail.value[1]

    this.indexOfKey(cities, province,city)
    this.setData({
      currentProvince: e.detail.value[0],
      currentCity: e.detail.value[1]
    })
  },

  submintSalary(e) {
    console.log("click", e)
    var FundBase = e.detail.value.FundBase
    var FundRate = e.detail.value.FundRate
    var Monthsalary = e.detail.value.Monthsalary
    var socialBase = e.detail.value.socialBase
    var deductionMoney = e.detail.value.deductionMoney

    // 输入合法性检验
    if (Monthsalary == '') {
      wx.showToast({
        title: '请输入工资',
        icon: 'none'
      })
      return;
    }
    if (FundRate == '') {
      FundRate = 0.08
    } else {
      FundRate = FundRate / 100;
      console.log("fundrate: ", FundRate)
    }
    // 公积金比例默认为0.08
    if (deductionMoney == '') {
      deductionMoney = 0
    }
    if (FundBase == 0) {
      FundBase = Monthsalary
      socialBase = Monthsalary
    }

    var dataBase = {}

    dataBase.Monthsalary = Monthsalary
    dataBase.FundBase = FundBase
    dataBase.FundRate = FundRate
    dataBase.socialBase = socialBase
    dataBase.deductionMoney = deductionMoney

    console.log('对象为： ', dataBase)
    dataBase = JSON.stringify(dataBase)
    wx.navigateTo({
      url: '../result/result?id=' + dataBase,
    })
  },

  // 奖金所得税计算
  bonus(e) {
    console.log('bonus', e.detail.value.bonus)

    var MonthBonus = e.detail.value.bonus / 12  // 计算按月奖金计算，所有先转化
    var FundBase = e.detail.value.FundBase
    var FundRate = e.detail.value.FundRate
    var Monthsalary = e.detail.value.Monthsalary
    var socialBase = e.detail.value.socialBase

    if (MonthBonus == '' || Monthsalary == '') {
      wx.showToast({
        title: '请输入奖金和本月工资',
        icon: 'none'
      })
      return;
    }

    var dataBase = {}

    dataBase.Monthsalary = Monthsalary
    dataBase.FundBase = FundBase
    dataBase.FundRate = FundRate
    dataBase.socialBase = socialBase

    // 将月工资， 保险基数，比例等json化，方便页面传值
    dataBase = JSON.stringify(dataBase)

    // 计算工资的个人所得税
    var t = salaryTax.tax(dataBase)  // 调用tax函数，计算工资交税情况
    console.log('本月工资交税金额为： ', t)
    t = parseFloat(t)
    t = t .toFixed(2)

    // 根据网上方法，当月工资薪金所得低于税法规定的费用扣除额
    // 应纳税额=(雇员当月取得全年一次性奖金-雇员当月工资薪金所得与费用扣除额的差额)×适用税率-速算扣除数。
    var tiao = MonthBonus // 分段条件
    if(t < 0) {
      tiao = MonthBonus + t/12
    }
    console.log('MothBonus: ', MonthBonus)
    // 计算奖金的交税额  
    var tax
    
    if (tiao <= 3000) {
      tax = MonthBonus * 0.03
    } else {
      if (tiao <= 12000) {
        tax = MonthBonus * 0.1 - 210
      } else {
        if (tiao <= 25000) {
          tax = MonthBonus * 0.2 - 1410
        } else {
          if (tiao <= 35000) {
            tax = MonthBonus * 0.25 - 2660
          } else {
            if (tiao <= 55000) {
              tax = MonthBonus * 0.3 - 4410
            } else {
              if (tiao <= 80000) {
                tax = MonthBonus * 0.35 - 7160
              } else {
                tax = MonthBonus * 0.45 - 15160
              }
            }
          }
        }
      }
    }
    tax = tax.toFixed(2)

    if (t > 0) {
      tax = tax + t // 奖金纳税为 = 奖金税 + 工资税
      console.log('if true BonusTax" ', tax)
    }
    console.log('BonusTax ', tax)
    // 将字符串变为float型
    tax = parseFloat(tax)
    MonthBonus = parseFloat(MonthBonus)

    var reallyBonus = (MonthBonus - tax) * 12 // 转化为年奖金
    var bonusIndex
    if (reallyBonus < 10000) {
      bonusIndex = 2
    } else {
      if (reallyBonus < 20000) {
        bonusIndex = 1
      } else {
        bonusIndex = 0
      }
    }
    reallyBonus = parseFloat(reallyBonus)

    // 保留2位
    reallyBonus = reallyBonus.toFixed(2)
    tax = tax.toFixed(2) // 此处仍为月税
    
    this.setData({
      bonusIndex: bonusIndex,
      reallyBonus: reallyBonus
    })
    console.log('reallyBonus', reallyBonus, '   ', bonusIndex)

    // 将税前奖金，税后奖金，和税存入对象
    var summary = {}
    summary.bonus = e.detail.value.bonus
    summary.reallyBonus = reallyBonus
    summary.tax = tax * 12 // 转化为12个月的税值
    summary.tax = summary.tax.toFixed(2)
    console.log('summary: ', summary)

    summary = JSON.stringify(summary)

    wx.navigateTo({
      url: '../BonusResult/BonusResult?summary=' + summary,
    })
  }
});