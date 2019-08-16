let _compData = {
  '_toast_.isHide': false,// 控制组件显示隐藏
  '_toast_.content': '',// 显示的内容
  '_toast_.value': ''
}
let toastPannel = {
  // toast显示的方法
  showt: function (data, data1) {
    let self = this;
    this.setData({ '_toast_.isHide': true, '_toast_.content': data, '_toast_.value': data1 });
    setTimeout(function () {
      self.setData({ '_toast_.isHide': false })
    }, 3000)
  }
}
function ToastPannel() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  // 小程序最新版把原型链干掉了。。。换种写法
  Object.assign(curPage, toastPannel);
  // 附加到page上，方便访问
  curPage.toastPannel = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_compData);
  return this;
}
module.exports = {
  ToastPannel
}