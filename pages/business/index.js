// pages/business/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type =='business'){
      var items = [
        { title: '内资注册', choose: false },
        { title: '贷款', choose: false },
        { title: '担保', choose: false },
        { title: '投资', choose: false },
        { title: '风水', choose: false },
        { title: '定制LED屏', choose: false },
        { title: '网站设计', choose: false },
        { title: '网络营销', choose: false },
        { title: '光纤宽带 ', choose: false },
        { title: '仓储', choose: false },
        { title: '同城快递', choose: false },
        { title: '空车配货', choose: false },
        { title: '办公租赁', choose: false },
        { title: '广告位招租', choose: false },
        { title: '灯箱/招牌', choose: false },
        { title: '基础灌浆', choose: false },
      ]
      var banner = '../../images/swbanner@2x.png';
      var title ='商务服务';
    } else if (options.type == 'housekeeping'){
      var items = [
        { title: '放心服务', choose: false },
        { title: '搬家', choose: false },
        { title: '保姆月嫂', choose: false },
        { title: '钟点工', choose: false },
        { title: '开锁换锁', choose: false },
        { title: '保洁清洗', choose: false },
        { title: '房屋维修', choose: false },
        { title: '管道疏通', choose: false },
        { title: '修家电', choose: false },
        { title: '修家具', choose: false },
        { title: '生活配送', choose: false },
        { title: '鲜花绿植', choose: false },
        { title: '修电脑', choose: false },
        { title: '修手机', choose: false },
        { title: '养老院', choose: false },
        { title: '洗衣修鞋', choose: false },
      ]
      var banner = '../../images/housekeeping.png';
      var title = '家政服务';
    }
    console.log(items)
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      banner: banner,
      items: items,
      type: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  choose(e){
    console.log(e.currentTarget.dataset.choose)
    var items = this.data.items
    items[e.currentTarget.dataset.index].choose = !e.currentTarget.dataset.choose
    this.setData({
      items: items
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})