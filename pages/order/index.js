// pages/order/index.js
Page({
  data: {
    visible1: false,
    visible2: false,
    visible3: false,
    current: '2',
    axis: [
      {
        time: '2018-2-15',
        name: '张三',
        event: '垃圾太多',
        now:1
      },
      {
        time: '2018-2-15',
        name: '王三',
        event: '垃圾太多',
        now: 0
      },
      {
        time: '2018-2-15',
        name: '张三',
        event: '垃圾太多',
        now: 0
      },
      {
        time: '2018-2-15',
        name: '张三',
        event: '垃圾太多',
        now: 0
      },

    ],
    list: [
      { choosed: 1 },
      { choosed: 0 },
      { choosed: 0 },
    ],
    tabs: [
      {
        key: '1',
        title: '待发货',
        content: 'Content of tab 1',
      },
      {
        key: '2',
        title: '待收货',
        content: 'Content of tab 2',
      },
      {
        key: '3',
        title: '待评价',
        content: 'Content of tab 3',
      },
      {
        key: '4',
        title: '分期还款',
        content: 'Content of tab 3',
      },
    ],
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]

    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },
  open1() {
    this.setData({
      visible1: true,
    })
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  open3() {
    this.setData({
      visible3: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
      visible3: true,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose1() {
    this.onClose('visible1')
  },
  onClose3() {
    this.onClose('visible3')
  },
  onClose2() {
    this.onClose('visible2')
  },
  onClosed1() {
    console.log('onClosed')
  },
  onClosed3() {
    console.log('onClosed')
  },
  choose(e) {
    var list = this.data.list
    
    list[e.currentTarget.dataset.id]["choosed"] = !e.currentTarget.dataset.choosed
    this.setData({
      list: list
    })
  },
  cancle(){
    wx.showModal({
      title: '提醒',
      content: '是否确定取消订单？',
      cancelText:'否',
      cancelColor:'#2EB354',
      confirmText:'是',
      confirmColor:'#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }

      }
    })
  }
})