Page({
    data: {
      hint:{} 
    },
    onLoad(e){
      console.log(e)
      var hint = JSON.parse(e.hint)
      this.setData({
        hint: hint
      })
      wx.setNavigationBarTitle({
        title: hint.hint,
      })
    },
  back(){
    wx.navigateBack()
  }, 
  sure(){
    wx.navigateTo({
      url: '../index/index',
    })
  }
})