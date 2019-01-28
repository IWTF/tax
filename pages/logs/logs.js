const app = getApp()

Page({
  data: {
    myData: [
      {
        title: '住房支出',
        c_title1: '',
        tabs: [
          '首套房贷',
          '租房'
        ],
        cur: '10',
        value: '--',
        valueItem: [
          '1000', ''
        ],
        childOption: [
          '直辖/省会/计划单列城市',
          '市区人口百万以上城市',
          '市区人口百万以下城市'
        ],
        childCur: '10'
      },
      {
        title: '子女教育',
        c_title1: '受教育子女（3岁以上，幼儿园至博士）',
        tabs: [
          '1',
          '2'
        ],
        cur: '10',
        value: '--',
        valueItem: [
          '1000', '2000'
        ]
      }, {
        title: '赡养父母',
        c_title1: '是否独生子女',
        tabs: [
          '是',
          '否'
        ],
        cur: '10',
        value: '--',
        valueItem: [
          '2000', ''
        ]
      },
      {
        title: '继续教育',
        c_title1: '',
        tabs: [
          '学历教育',
          '技能/资格教育'
        ],
        cur: '10',
        value: '--',
        valueItem: [
          '400', '300'
        ]
      }
    ],
    sickness: {
      value: ''
    },
    childInput: '',
    current: '10',
    parentInput: ''
  },

  chooseTab(e) {
    var c = e.currentTarget.id % 10
    var p = Math.floor(e.currentTarget.id / 10)
    console.log('child', c, '   ', p)
    // 改变选中项
    var cur = 'myData[' + p + '].cur'
    this.setData({
      [cur]: c
    })
    console.log(this.data.myData[p].cur)

    // 改变value
    var v
    var value = 'myData[' + p + '].value'
    if (this.data.myData[p].valueItem[c] != '') { // 如果有金额，则计算
      v = this.data.myData[p].valueItem[c]
      this.setData({
        [value]: v
      })
    } else {
      this.setData({
        [value]: '--'
      })
    }

    if (p == 1) {
      this.setData({
        current: 1
      })
    }
  },

  // 选择城市类型
  childOption(e) {
    var c = e.currentTarget.id % 10
    var p = Math.floor(e.currentTarget.id / 10)
    console.log('childCity', c, '   ', p)

    // 改变选中项
    var cur = 'myData[' + p + '].childCur'
    this.setData({
      [cur]: c
    })

    var v
    if (c == 0) {
      v = 1500
    } else {
      if (c == 1) {
        v = 1100
      } else {
        if (c == 2) {
          v = 800
        }
      }
    }

    // 改变金额, house的子项选择函数
    var value = 'myData[' + p + '].value'
    this.setData({
      [value]: v
    })
  },


  // 子女教育的子项选择函数
  choose0() {
    var value = 'myData[' + 1 + '].value'
    var v = this.data.myData[1].value * 2
    this.setData({
      current: 1,
      [value]: v
    })
  },

  choose1() {
    var value = 'myData[' + 1 + '].value'
    var v = this.data.myData[1].value / 2
    this.setData({
      current: 2,
      [value]: v
    })
  },

  // 赡养父母子选项输入函数
  parentInput(e) {
    var value = 'myData[' + 2 + '].value'
    this.setData({
      [value]: e.detail.value,
      parentInput: e.detail.value
    })
  },

  // 大病输出计算
  sickInput(e) {
    var value = 'sickness.value'
    this.setData({
      [value]: e.detail.value
    })
  },

  // 子女教育自定义
  childInput(e) {
    var value = 'myData[' + 1 + '].value'
    this.setData({
      [value]: e.detail.value * 1000,
      current: 1,
      childInput: e.detail.value
    })
  },

  cancel() {
    var cur = 'myData[' + 1 + '].cur'
    var value = 'myData[' + 1 + '].value'
    this.setData({
      [cur]: 10,
      [value]: '--',
      current: 10
    })
  },

  // Init初始化数据
  onLoad () {
    // 将表单数据存入全局变量
    // cur, childCur
    for (var i = 0; i < this.data.myData.length; i++) {
      if (i == 0) {
        var v = 'myData[' + i + '].value'
        var d1 = 'myData[' + i + '].cur'
        var d2 = 'myData[' + i + '].childCur'
        this.setData({
          [v]: app.globalData.histroy[i].value,
          [d1]: app.globalData.histroy[i].cur,
          [d2]: app.globalData.histroy[i].childCur
        })
      } else {
        var v = 'myData[' + i + '].value'
        var d1 = 'myData[' + i + '].cur'
        this.setData({
          [v]: app.globalData.histroy[i].value,
          [d1]: app.globalData.histroy[i].cur
        })
      }
    }
    // 子女教育的非结构数据
    var c1 = 'childInput'
    var c2 = 'current'
    // 大病报销
    var s = 'sickness.value'
    this.setData({
      [c1]: app.globalData.child.input,
      [c2]: app.globalData.child.current,
      [s]: app.globalData.sickness,
      parentInput: app.globalData.parentInput
    })

    // 验证数据是否Init
    console.log('-----------------------------------')
    console.log(this.data.myData)
    console.log('childInput: ', this.data.childInput)
    console.log('childDe: ', this.data.current)
    console.log('sickness: ', this.data.sickness.value)
    console.log('-----------------------------------')
  },

  totle() {
    var a = this.data.myData
    var totle = 0
    for (var i = 0; i < a.length; i++) {
      if (a[i].value != '--') {
        var v = parseInt(a[i].value)
        totle = totle + v
      }
    }
    var sick = this.data.sickness.value
    if (sick != '') {
      var v = parseInt(sick)
      totle = totle + v
    }
    
    // 将表单数据存入全局变量
    var myData = this.data.myData
    // cur, childCur
    for (var i = 0; i < myData.length; i++) {
      if (i == 0) {
        app.globalData.histroy[i].childCur = myData[i].childCur
      }
      app.globalData.histroy[i].cur = myData[i].cur
      app.globalData.histroy[i].value = myData[i].value
    }
    // 子女教育的非结构数据
    app.globalData.child.input = this.data.childInput
    app.globalData.child.current = this.data.current
    // 大病报销
    app.globalData.sickness = this.data.sickness.value
    // 赡养父母
    app.globalData.parentInput = this.data.parentInput


    // 验证数据是否Init
    console.log('-----------------------------------')
    console.log(app.globalData.histroy)
    console.log('childInput: ', app.globalData.child.input)
    console.log('childDe: ', app.globalData.child.current)
    console.log('sickness: ', app.globalData.sickness)
    console.log('-------------------------------------')


    console.log('totle: ', totle) // 检验求和是否正确
    wx.navigateTo({
      url: '../index/index?id=' + totle
    })
  }
})