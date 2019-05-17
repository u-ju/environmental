// pages/myGreenCredit/index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var interval;
var varName;
// var ctx = wx.createCanvasContext('canvasArcCir');

Page({
  data: {
    credit_rule:''
  },
  drawCircle: function (num, steps, color, name) {
    var ctx = wx.createCanvasContext(name);
    clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('red');
      // ctx.clearRect(0, 0, 200, 200);
      ctx.clearRect(0, 0, 140, 140);
      ctx.draw();
      // var x = 100, y = 100, radius = 96;
      var x = 70, y = 70, radius = 64;
      ctx.setLineWidth(10);
      ctx.setStrokeStyle(color);
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    console.log(name)
    var step = 1, startAngle = 0.5 * Math.PI, endAngle = 0;
    var animation_interval = 200, n = 5;
    var animation = function () {
      if (step <= steps) {
        endAngle = step * num * Math.PI / steps  ;
        console.log(startAngle, endAngle)
        if (endAngle > startAngle){
          drawArc(startAngle, endAngle);
        }
        
        step++;
      } else {
        clearInterval(varName);
      }
    };
    varName = setInterval(animation, animation_interval);
  },
  onReady: function () {
    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setFillStyle('red');
    cxt_arc.clearRect(0, 0, 140, 140);
    cxt_arc.draw();
    var x = 70, y = 70, radius = 64;
    cxt_arc.setLineWidth(10);
    cxt_arc.setStrokeStyle('#b9c6dd');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);
    cxt_arc.stroke()
    cxt_arc.draw()
  },
  onLoad: function (options) {
    this.setData({
      credit_rule: app.globalData.config.protocol.credit_rule
    });
    this.init()
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.credit }, function (res) {
      var result = res.data.result
      that.setData({
        result: result
      })
      that.drawCircle(result.score / result.score_max*2+0.5, 5, "#4FD7F1", 'canvasArcCir')
    })
    util.getJSON({ apiUrl: apiurl.credit_index+"?page_limit=2"}, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page
      })
      util.hideLoading()
    })
  },
})