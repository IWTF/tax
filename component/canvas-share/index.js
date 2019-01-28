// 屏幕适配函数实现
function createRpx2px() {
  const { windowWidth } = wx.getSystemInfoSync()

  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          this.draw()
          this.beginDraw = true
        }
      }
    },
    userInfo: {
      type: Object,
      value: false
    },
    sayings: {
      type: Array,
      value: []
    }
  },

  data: {
    beginDraw: false,
    isDraw: false,

    canvasWidth: 843,
    canvasHeight: 1500,

    imageFile: '',

    responsiveScale: 1,
  },

  lifetimes: {
    ready() {
      const designWidth = 375
      const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

      // 以iphone6为设计稿，计算相应的缩放比例
      const { windowWidth, windowHeight } = wx.getSystemInfoSync()
      const responsiveScale =
        windowHeight / ((windowWidth / designWidth) * designHeight)
      if (responsiveScale < 1) {
        this.setData({
          responsiveScale,
        })
      }
    },
  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },
    handleSave() {
      const { imageFile } = this.data

      if (imageFile) {
        saveImageToPhotosAlbum({
          filePath: imageFile,
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '分享图片已保存至相册',
            duration: 2000,
          })
        })
      }
    },
    draw() {
      wx.showLoading()
      const { userInfo, canvasWidth, canvasHeight } = this.data
      const { avatarUrl, nickName } = userInfo
      // 创建绘图上下文
      const ctx = wx.createCanvasContext('share', this)

      // 屏幕适配
      const canvasW = rpx2px(canvasWidth * 2)
      const canvasH = rpx2px(canvasHeight * 2)

      // 绘制背景
      ctx.drawImage(
        '../../images/bg2.png',
        0,
        0,
        canvasW,
        canvasH
      )

      // 绘制用户名
      const y = rpx2px(50 * 2)
      ctx.setFontSize(70)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.fillText(
        nickName,
        canvasW / 2,
        y + rpx2px(120 * 2),
      )
      ctx.stroke()

      // 绘制 良心推荐
      ctx.setFontSize(50)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.fillText(
        '良心推荐',
        canvasW / 2,
        y + rpx2px(200 * 2),
      )
      ctx.stroke()

      // 绘制修饰图片
      const radius2 = rpx2px(300 * 2)
      ctx.drawImage(
        '../../images/photo.png',
        canvasW / 2 - radius2,
        y + rpx2px(545 * 2) - radius2,
        radius2 * 2,
        radius2 * 1.6,
      )

      // 俏皮的话
      console.log(this.data.sayings)
      ctx.setTextAlign('center')
      ctx.setFontSize(50)
      ctx.setFillStyle('#ffffff')

      var sY
      if (this.data.sayings.length >= 4) {
        sY = y + rpx2px(520 * 2) + radius2
      } else {
        sY = y + rpx2px(545 * 2) + radius2 + rpx2px(30 * 2)
      }
      var sYC = rpx2px(60 * 2)
      for(var i=0; i<this.data.sayings.length; i++) {
        ctx.fillText(
          this.data.sayings[i],
          canvasW / 2,
          sY + sYC*i,
        )
      }

      // 绘制小程序二维码
      const radius3 = rpx2px(145 * 2)
      ctx.drawImage(
        '../../images/ewm.png',
        canvasW / 2 - radius3 - rpx2px(230 * 2),
        y + rpx2px(1050 * 2),
        radius3 * 2,
        radius3 * 2,
      )

      // 书写分享文字
      const h = 60
      const beginX = canvasW / 2 + rpx2px(180 * 2)
      const beginY = y + rpx2px(1140 * 2)
      ctx.setFontSize(40)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.fillText( // 第一行
        '还在为计算个税发愁?',
        beginX,
        beginY,
      )
      ctx.fillText( //第二行 h
        '赶紧来试试"新版个',
        beginX,
        beginY + rpx2px(h * 2),
      )
      ctx.stroke()

      ctx.setFontSize(40)
      ctx.setFillStyle('#ffffff')
      ctx.fillText( // 第三行最后  2*h
        '税工资计算器"吧！',
        beginX,
        beginY + rpx2px(2*h * 2),
      )
      ctx.stroke()

      ctx.draw(false, () => {
        setTimeout(()=>{
          canvasToTempFilePath({
            canvasId: 'share',
          }, this).then(({ tempFilePath }) => this.setData({ imageFile: tempFilePath }))
        }, 100)
      })


      wx.hideLoading()
      this.setData({ isDraw: true })
    }
  }
})