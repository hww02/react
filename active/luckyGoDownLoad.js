/***
 *
 * Created by helen on 2016/12/19.
 * 我的站点
 *
 **/
require(["zepto", "config", "services","dialog", "touch","wxshare"], function ($, Config, services,dialog, touch,wxshare) {
    Zepto(function ($) {
        Config.Init(); //全局配置初始化
			
		$(".btn-wrap").find("a").attr("href","https://h5.xianglin.cn/home/nodeManager/downApp.html?sources=friends_channel");
        
        var ua = navigator.userAgent.toLowerCase();
        var u = window.navigator.userAgent;
        var img_url=document.getElementsByTagName("img")[0].src;
        
        if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信
        	//alert("1");
            //微信分享
	        var shareData = {
		        title:"参与乡邻幸运go,抽千元手机!",
	          	desc:"下载乡邻app，网购、充值、交友，农村互联网生活从现在开始",
	          	link:window.location.href,
	          	imgUrl:img_url
		    }          
		    wxshare.set(shareData);
        }
        

        Config.LoadEnd();//页面加载移除
    })
});