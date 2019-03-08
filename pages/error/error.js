Page({
    data: {
        icon: {
            type: 'warn',
            color: '#ef473a',
        },
        buttons: [{
                type: 'balanced',
                block: true,
                text: '确定',
            },
            {
                type: 'light',
                block: true,
                text: '返回',
            },
        ],
    },
  onLoad() {
    wx.hideLoading()
  },
    onClick(e) {
        console.log(e)
        const { index } = e.detail

      if (index === 0) {
        wx.navigateTo({
          url: '../index/index',
        })
      } else if (index === 1){
        wx.navigateBack()
      }

    },
})