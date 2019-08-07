//初始化数据
function tabbarinit() {
  return [{
    "id":0,
    "current": 0,
    "pagePath": "../../pages/index/index",
    "iconPath": "../../images/index.png",
    "selectedIconPath": "../../images/indexC.png",
    "text": "主页"
    
  },
    {
      "id": 1,
      "current": 0,
      "pagePath": "",
      "iconPath": "",
      "selectedIconPath": "",
      "text": "扫码丢垃圾",
      'show':1
    },
  {
    "id": 2,
    "current": 0,
    "pagePath": "../../pages/personal_center/personal_center",
    "iconPath": "../../images/my.png",
    "selectedIconPath": "../../images/myC.png",
    "text": "我的",
    // "message":1,
    "num":1
  },

  ]
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  if(id<3){
    otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath'] //换当前的icon
    otabbar[id]['current'] = 1;
  }
  bindData[bindName] = otabbar
  that.setData({
    bindData
  });
}

module.exports = {
  tabbar: tabbarmain
}