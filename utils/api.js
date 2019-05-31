const basePath = 'https://wyhb.zgwyhb.com/api';
// const basePath = 'https://wyhb.dev.zgwyhb.com/api';
const apiList = {
  walletBalanceTransfer: basePath + '/front/wallet/balanceTransfer',
  walletBalanceTransferIndex: basePath + '/front/wallet/balanceTransferIndex',
  walletIntegralTransfer: basePath + '/front/wallet/integralTransfer',
  walletIntegralTransferIndex: basePath + '/front/wallet/integralTransferIndex',

  familyIndex: basePath + '/front/family/index',
  familyApplyIndex: basePath + '/front/family/applyIndex',
  familySendApply: basePath + '/front/family/sendApply',
  familyAgreeApply: basePath + '/front/family/agreeApply',
  familyRefuseApply: basePath + '/front/family/refuseApply',
  familyUnbind: basePath + '/front/family/unbind',
  

  userSearch: basePath + '/front/user/search?keywords=',

  credit: basePath + '/front/credit', 
  credit_index: basePath + '/front/credit/index', 
  goodsCart_update: basePath + '/front/goodsCart/update', 
  goodsCart_index: basePath + '/front/goodsCart/index',
  goodsCart_del: basePath + '/front/goodsCart/del',
  goodsCart_clear: basePath + '/front/goodsCart/clear',

  shop_conf: basePath + '/front/shop/conf', 

  shopComment_comment: basePath + '/front/shopComment/comment', 
  shopComment_indexShop: basePath + '/front/shopComment/indexShop?shop_id=', 
  shopComment_delShop: basePath + '/front/shopComment/delShop', 
  shopComment_index: basePath + '/front/shopComment/index?shop_id=', 

  // GET 控制对照
  // GET 控制对照
  arealayerIndex: basePath + '/common/area/layerIndex?type=', 
  areaparse: basePath + '/common/area/parse?address=', 
  areaUpdate: basePath + '/front/user/areaUpdate', 
  controlContrast: basePath + '/front/controlContrast', 
  search: basePath + '/front/search?keywords=',

  // PayController
  // POST 第三方支付信息创建
  vendor: basePath + '/common/pay/vendor', 
  // POST 支付结果查询
  query: basePath + '/common/pay/query', 
  // POST 上门回收订单创建
  create: basePath + '/common/pay/create', 
  // // POST 支付结果查询
  // query: basePath + '/common/pay/query', 
  // // POST 支付结果查询
  // query: basePath + '/common/pay/query', 



  // Common
  // 垃圾袋二维码解码
  decode: basePath + '/common/qrCode/decode',//0

  // 垃圾袋二维码解码
  action: basePath + '/common/qrCode/action',
  area: basePath +'/common/area/index?parent_id=' ,
  
  // CaptchaController
  // 发送手机验证码
  captcha: basePath + '/common/captcha/mobile',//0

  // UploadController
  // POST 图片上传
  upload_image: basePath + '/common/upload/image',
  upload_video: basePath + '/common/upload/video',

  //AuthController
  //POST 登录
  login: basePath + '/auth/login',
  // POST 手机验证码登录
  mobileLogin: basePath + '/auth/mobileLogin',
  // POST 微信小程序尝试登录
  wechatLetAttemptLogin: basePath + '/auth/wechatLetAttemptLogin',
  // POST 微信小程序登录
  wechatLetLogin: basePath + '/auth/wechatLetLogin',
  //POST 退出
  logout: basePath + '/auth/logout',
  //POST 忘记密码
  forget: basePath + '/auth/forget',





  // Front

  //HomeController
  // GET 首页信息
  index: basePath + '/front',//0
  // GET 公共配置
  config: basePath + '/front/config',


  // UserController
  // GET 用户信息
  user: basePath + '/front/user',//0
  // POST 用户信息更新
  user_update: basePath + '/front/user/update',
  // POST 用户手机号更新
  mobileUpdate: basePath + '/front/user/mobileUpdate',


  // RealnameController
  // GET  实名信息
  realname: basePath + '/front/realname',
  // POST 实名校验
  realname_verify: basePath + '/front/realname/verify',

  // AgentController 代理中心
  // GET  代理信息
  agent: basePath + '/front/agent',
  // POST 设置推荐人
  agent_sharerSet: basePath + '/front/agent/sharerSet',
  
  agent_shopIndex: basePath + '/front/agent/shopIndex',

  agent_agentIndex: basePath + '/front/agent/agentIndex',

  agent_userIndex: basePath + '/front/agent/userIndex',
  agent_earnIndex: basePath + '/front/agent/earnIndex',

  

  // WalletController
  // GET 钱包信息
  wallet: basePath + '/front/wallet',
  // GET 零钱记录列表
  balanceIndex: basePath + '/front/wallet/balanceIndex',
  // GET 积分记录列表
  integralIndex: basePath + '/front/wallet/integralIndex',
  // POST 零钱提现提交
  balanceWithdraw: basePath + '/front/wallet/balanceWithdraw',
  // GET 零钱提现列表
  balanceWithdrawIndex: basePath + '/front/wallet/balanceWithdrawIndex',
  // GET 积分记录列表
  settleIndex: basePath + '/front/wallet/settleIndex',
  // POST 零钱提现提交
  settleWithdraw: basePath + '/front/wallet/settleWithdraw',
  // GET 零钱提现列表
  settleWithdrawIndex: basePath + '/front/wallet/settleWithdrawIndex',
  
  // ShareController
  // GET 推广信息
  share: basePath + '/front/share',

  share_index: basePath +'/front/share/index',

  // OnsiteRecycleController
  // GET 上门回收信息
  onsiteRecycle: basePath + '/front/onsiteRecycle',
  // POST 订单创建提交
  onsiteRecycle_orderStore: basePath + '/front/onsiteRecycle/orderStore',
  // GET 发起人订单列表
  onsiteRecycle_orderIndex: basePath + '/front/onsiteRecycle/orderIndex',
  // GET 发起人订单详情
  onsiteRecycle_orderShow: basePath + '/front/onsiteRecycle/orderShow',
  // GET 回收人订单列表
  onsiteRecycle_orderRecycleIndex: basePath + '/front/onsiteRecycle/orderRecycleIndex',
  // GET 回收人订单详情
  onsiteRecycle_orderRecycleShow: basePath + '/front/onsiteRecycle/orderRecycleShow',
  // POST 订单评估提交
  onsiteRecycle_orderEvaluate: basePath + '/front/onsiteRecycle/orderEvaluate',


  // GarbageController
  // 垃圾投放记录列表
  putRecordIndex: basePath + '/front/garbage/putRecordIndex',
  // 垃圾柜列表
  arkIndex: basePath + '/front/garbage/arkIndex',
  // 垃圾柜详情
  arkShow: basePath + '/front/garbage/arkShow',
  // POST 垃圾袋订单提交
  bagOrderStore: basePath + '/front/garbage/bagOrderStore',
  // 投放人垃圾袋订单列表
  bagOrderIndex: basePath + '/front/garbage/bagOrderIndex',
  // 投放人垃圾袋订单详情
  bagOrderShow: basePath + '/front/garbage/bagOrderShow',
  // 分拣人垃圾袋订单列表
  bagOrderSorterIndex: basePath + '/front/garbage/bagOrderSorterIndex',
  // 分拣人垃圾袋订单详情
  bagOrderSorterShow: basePath + '/front/garbage/bagOrderSorterShow',
  // POST 垃圾袋订单更新
  bagOrderUpdate: basePath + '/front/garbage/bagOrderUpdate',
  // POST 垃圾袋订单删除
  bagOrderDestroy: basePath + '/front/garbage/bagOrderDestroy',
  // 站点订单预览
  stationOrderPreview: basePath + '/front/garbage/stationOrderPreview',
  // POST 站点订单提交
  stationOrderStore: basePath + '/front/garbage/stationOrderStore',
  // GET 分拣人站点订单列表
  stationOrderIndex: basePath + '/front/garbage/stationOrderIndex',
  // GET 分拣人站点订单详情
  stationOrderShow: basePath + '/front/garbage/stationOrderShow',
  // POST 站点订单更新
  stationOrderUpdate: basePath + '/front/garbage/stationOrderUpdate',


  //ShopController
  //GET 商家列表
  shop: basePath + '/front/shop/index?type=2',
  //GET 商家详情
  shop_show: basePath + '/front/shop/show',
  gatherPayCreate: basePath + '/front/shop/gatherPayCreate?shop_id=',
  shop_goodsIndex: basePath + '/front/shop/goodsIndex',
  shop_goodsShow: basePath + '/front/shop/goodsShow?sku_id=',

  shop_stat: basePath + '/front/shop/stat?shop_id=',
  
  shop_: basePath + '/front/shop',
  shop_apply: basePath + '/front/shop/apply',
  shop_update: basePath + '/front/shop/update',
  shop_showOwn: basePath + '/front/shop/showOwn?shop_id=',
  shop_gatherPayCreate: basePath + '/front/shop/gatherPayCreate?shop_id=',
  shop_index: basePath + '/front/shop/index',
  shop_goodsUpDown: basePath + '/front/shop/goodsUpDown',
  // shop_show: basePath + '/front/shop/show?shop_id=',
  // shop_goodsIndex: basePath + '/front/shop/goodsIndex',
  // shop_goodsShow: basePath + '/front/shop/goodsShow?sku_id=',

  shop_goodsSpecFormat: basePath + '/front/shop/goodsSpecFormat?spec_str=',
  shop_goodsStore: basePath + '/front/shop/goodsStore',
  shop_goodsIndexOwn: basePath + '/front/shop/goodsIndexOwn?shop_id=',
  shop_goodsShowOwn: basePath + '/front/shop/goodsShowOwn',
  shop_goodsUpdate: basePath + '/front/shop/goodsUpdate',
  shop_goodsDestroy: basePath + '/front/shop/goodsDestroy',
  // shop_index: basePath + '/front/shop/index?source=',
  // shop_goodsStore: basePath + '/front/shop/goodsStore',

  //TShopController
  //GET 便民列表
  tshop: basePath + '/front/shop/index?type=1',
  //GET 便民详情
  tshop_show: basePath + '/front/shop/show',



  //TopController
  //GET 积分排行榜
  integral: basePath + '/front/top/integral',


  //TaskController
  //GET 任务详情
  task_show: basePath + '/front/task/show',
  //POST 任务更新
  task_update: basePath + '/front/task/update',



  //HelpController
  // GET 帮助列表
  help: basePath + '/front/help/index',//0
  // GET 帮助详情
  help_show: basePath + '/front/help/show',//0

  //NewsController
  // GET 新闻列表
  news: basePath + '/front/news/index',//0
  // GET 新闻详情
  news_show: basePath + '/front/news/show',//0
  // POST 新闻回复提交
  news_replyStore: basePath + '/front/news/replyStore',
  //GET 新闻回复列表
  news_replyIndex: basePath + '/front/news/replyIndex',
  news_praiseStore: basePath + '/front/news/praiseStore',
  // ShopSettledController
  // GET 入驻首页
  shopSettled: basePath + '/front/shopSettled',
  // POST 入驻申请
  shopSettled_apply: basePath + '/front/shopSettled/apply',
  // GET 入驻详情
  // shopSettled_show: basePath + '/front/shopSettled/show',
  // POST 入驻更新
  shopSettled_update: basePath + '/front/shopSettled/update',
  // POST  
  shopSettled_goodsStore: basePath + '/front/shopSettled/goodsStore',
  // GET 
  shopSettled_goodsIndex: basePath + '/front/shopSettled/goodsIndex?shop_id=',
  // GET 
  shopSettled_goodsShow: basePath + '/front/shopSettled/goodsShow',
  shopSettled_goodsUpdate: basePath + '/front/shopSettled/goodsUpdate',
  
  // POST  
  shopSettled_goodsDestroy: basePath + '/front/shopSettled/goodsDestroy',


  // VicinageController
  // GET 邻里守望列表
  vicinage: basePath + '/front/vicinage/index',//0
  // GET 邻里守望详情
  vicinage_show: basePath + '/front/vicinage/show',//0
  // POST 邻里守望回复提交
  vicinage_replyStore: basePath + '/front/vicinage/replyStore',
  //GET 邻里守望回复列表
  vicinage_replyIndex: basePath + '/front/vicinage/replyIndex',

  vicinage_praiseStore: basePath + '/front/vicinage/praiseStore',

  vicinage_replyPraiseStore: basePath + '/front/vicinage/replyPraiseStore',
  
  vicinage_userStore: basePath + '/front/vicinage/userStore',

  vicinage_userIndex: basePath + '/front/vicinage/userIndex',

  vicinage_userShow: basePath + '/front/vicinage/userShow',

  vicinage_userUpdate: basePath + '/front/vicinage/userUpdate',

  vicinage_userDestroy: basePath + '/front/vicinage/userDestroy',

  // EcoBagController
  // POST 环保袋申请提交
  ecoBag_apply: basePath + '/front/ecoBag/apply',
  // GET 环保袋申请列表
  ecoBag_applyIndex: basePath + '/front/ecoBag/applyIndex',
  // POST 环保袋兑换提交
  ecoBag_exchange: basePath + '/front/ecoBag/exchange',
  // GET 环保袋兑换列表
  ecoBag_exchangeIndex: basePath + '/front/ecoBag/exchangeIndex',

  video_index: basePath + '/front/video/index',
  video_show: basePath + '/front/video/show',
  video_replyStore: basePath + '/front/video/replyStore',
  video_replyIndex: basePath + '/front/video/replyIndex',
  video_praiseStore: basePath + '/front/video/praiseStore',

  goods: basePath + '/front/goods/index',
  goods_show: basePath + '/front/goods/show?sku_id=',
  goods_commentIndex: basePath + '/front/goods/commentIndex?spu_id=',

  // shippingAddress: basePath + '/front/shippingAddress/store',
  // shippingAddress_index: basePath + '/front/shippingAddress/index',
  // shippingAddress_update: basePath + '/front/shippingAddress/update',
  // shippingAddress_destroy: basePath + '/front/shippingAddress/destroy',

  

  // ShippingAddressController 收货地址
  // POST 地址添加
  shippingAddress_store: basePath + '/front/shippingAddress/store',
  // GET 地址列表
  shippingAddress_index: basePath + '/front/shippingAddress/index',
  // POST  地址更新
  shippingAddress_update: basePath + '/front/shippingAddress/update',
  // POST 地址删除
  shippingAddress_destroy: basePath + '/front/shippingAddress/destroy',

  // OrderController 商品订单管理
  // POST 支付信息
  order_payShow: basePath + '/front/order/payShow',

  // UserOrderController 用户商品订单管理

  // GET  订单列表
  userOrder_index: basePath + '/front/userOrder/index',
  // GET 订单详情
  userOrder_show: basePath + '/front/userOrder/show',
  // POST  订单取消
  userOrder_cancel: basePath + '/front/userOrder/cancel',
  // POST 订单收货
  userOrder_receive: basePath + '/front/userOrder/receive',
  // POST  订单评价
  userOrder_comment: basePath + '/front/userOrder/comment',
  // POST 订单删除
  userOrder_destroy: basePath + '/front/userOrder/destroy',
  // GET 售后信息
  userOrder_afterSaleShow: basePath + '/front/userOrder/afterSaleShow',
  // POST 售后创建
  userOrder_afterSaleStore: basePath + '/front/userOrder/afterSaleStore',
  // POST 售后取消
  userOrder_afterSaleCancel: basePath + '/front/userOrder/afterSaleCancel',



  // ShopOrderController 商家商品订单管理


  // GET  订单列表
  shopOrder_index: basePath + '/front/shopOrder/index',
  // GET 
  shopOrder_show: basePath + '/front/shopOrder/show',
  shopOrder_deliver: basePath + '/front/shopOrder/deliver',
  shopOrder_expressStore: basePath + '/front/shopOrder/expressStore',
  shopOrder_expressDestroy: basePath + '/front/shopOrder/expressDestroy',
  // GET 售后信息
  shopOrder_afterSaleShow: basePath + '/front/shopOrder/afterSaleShow',
  // POST 售后创建
  shopOrder_afterSaleConfirm: basePath + '/front/shopOrder/afterSaleConfirm',
  // POST 售后取消
  shopOrder_afterSaleRefuse: basePath + '/front/shopOrder/afterSaleRefuse',

  // BankCardController 银行卡管理

  // POST 银行卡添加
  bankCard_store: basePath + '/front/bankCard/store',
  // GET 银行卡列表
  bankCard_index: basePath + '/front/bankCard/index',
  // POST 银行卡添加
  bankCard_destroy: basePath + '/front/bankCard/destroy',


  // UserNperController 用户分期中心

  // GET  分期信息
  userNper_home: basePath + '/front/userNper/home',
  // GET  账单列表
  userNper_orderIndex: basePath + '/front/userNper/orderIndex',
  // GET  账单详情
  userNper_orderShow: basePath + '/front/userNper/orderShow?order_id=',
  // GET  账单还款列表
  userNper_repaymentIndex: basePath + '/front/userNper/repaymentIndex?order_id=',

  // RepairController 维修服务


  // POST 个人维修申请
  repair_userStore: basePath + '/front/repair/userStore',
  //GET 个人维修详情
  repair_userShow: basePath + '/front/repair/userShow?repair_id=',
  // POST 个人维修更新
  repair_userUpdate: basePath + '/front/repair/userUpdate',
  //GET 维修列表
  repair_index: basePath + '/front/repair/index',
  //GET 维修详情
  repair_show: basePath + '/front/repair/show?repair_id=',
  //GET 维修列表
  repair_home: basePath + '/front/repair/home',

  // POST 个人维修申请
  jiazheng_userStore: basePath + '/front/jiazheng/userStore',
  //GET 个人维修详情
  jiazheng_userShow: basePath + '/front/jiazheng/userShow?jiazheng_id=',
  // POST 个人维修更新
  jiazheng_userUpdate: basePath + '/front/jiazheng/userUpdate',
  //GET 维修列表
  jiazheng_index: basePath + '/front/jiazheng/index',
  //GET 维修详情
  jiazheng_show: basePath + '/front/jiazheng/show?jiazheng_id=',
  //GET 维修列表
  jiazheng_home: basePath + '/front/jiazheng/home',

  // TravelPersonController 出行人员管理

  travelPerson_store: basePath + '/front/travelPerson/store',
  travelPerson_index: basePath + '/front/travelPerson/index',
  travelPerson_update: basePath + '/front/travelPerson/update',
  travelPerson_destroy: basePath + '/front/travelPerson/destroy',
}
module.exports = apiList;
