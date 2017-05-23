/**
 * Created by zhangminglei on 2017/01/09.
 * 揽储
 */
require(["zepto","services","config","dialog","publicFun"],function($,services,Config,dialog,publicFun) {
    Zepto(function($) {
        Config.Init(); //全局配置初始化
		var dailyId = Config.GetUrl()["dailyId"];
		var callbackUrl = "https://h5.xianglin.cn/home/nodeManager/active/redRainShareWx.html";
		var appId="wx0c1a1664441c4dd7";
		var shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURIComponent(callbackUrl)+"&response_type=code&scope=snsapi_userinfo&state="+dailyId+"#wechat_redirect";
		window.location.href=shareUrl;

        Config.LoadEnd();//页面加载移除
    })
});