// pages/agriculturalRecommendation/index.js
// index/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['分类',  '销量' ,'价格'],//分类
    tab: [1, 1, 1],
    pinpaiList: [{ 'id': '1', 'title': '品牌1' }, { 'id': '2', 'title': '品牌2' }],
    pinpai_id: 0,//品牌
    pinpai_txt: '',
    jiage_id: 0,//价格
    jiage_txt: '',
    xiaoliang_id: 0,//销量
    xiaoliang_txt: '',
    details: [
      {
        img: '/images/house2.png',
        prix: '73',
        huxing: '3室2厅1卫',
        area: '128',
        price: '11456',
        chanquan: '产权',
        floor: '7/7',
        title: '大连市西岗区锦园小区48号楼2单元707',
        yongjin: '佣金1%，成交奖励奖励1万元',
        world: [
          {
            message: 'foo',
          },
          {
            message: 'bar'
          }
        ]
      },
      {
        img: '/images/house2.png',
        prix: '73',
        huxing: '3室2厅1卫',
        area: '128',
        price: '11456',
        chanquan: '产权',
        floor: '7/7',
        title: '大连市西岗区锦园小区48号楼2单元707',
        yongjin: '佣金1%，成交奖励奖励1万元',
        world: [
          {
            message: 'foo',
          },
          {
            message: 'bar'
          }
        ]
      },
      {
        img: '/images/house2.png',
        prix: '73',
        huxing: '3室2厅1卫',
        area: '128',
        price: '11456',
        chanquan: '产权',
        floor: '7/7',
        title: '大连市西岗区锦园小区48号楼2单元707',
        yongjin: '佣金1%，成交奖励奖励1万元',
        world: [
          {
            message: 'foo',
          },
          {
            message: 'bar'
          }
        ]
      }

    ],
  },

  // 选项卡
  filterTab: function (e) {
    var data =this.data.tab, index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
    console.log(data)
  },

  //筛选项点击操作
  filter: function (e) {

    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt, tab = this.data.tab;
    tabTxt[0] = txt;
    tab[0] = !this.data.tab[0];
    self.setData({
      tab: tab,
      tabTxt: tabTxt,
      pinpai_id: id,
      pinpai_txt: txt
    });
    //数据筛选
    self.getDataList();
  },
  hiddenzzc(){
    var tab = this.data.tab;
    tab[0] = !this.data.tab[0];
    this.setData({
      tab: tab,
    })
  },
  //加载数据
  getDataList: function () {
    //调用数据接口，获取数据


  }

})
