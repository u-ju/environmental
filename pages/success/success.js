Page({
    data: {
        buttons: [{
                type: 'balanced',
                block: true,
                text: '确定',
            },
            {
              type: 'stable',
                block: true,
                text: '返回',
            },
        ],
    },
    onLoad(){
      wx.hideLoading()
    },
    onClick(e) {
        console.log(e)
        const { index } = e.detail


      if (index == 0) {
        wx.navigateTo({
          url: '../personal_center/personal_center',
        })
      } else if (index == 1) {
        wx.navigateBack()
      }
    },
})