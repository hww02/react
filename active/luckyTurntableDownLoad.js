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
		        title:"我在乡邻幸运大转盘中中奖啦！好运传递给您，快来参与！",
	          	desc:"乡邻幸运大转盘，一天两次的免费中奖机会，礼品多多，不抽白不抽。",
	          	link:window.location.href,
	          	imgUrl:img_url
		    }          
		    wxshare.set(shareData);
        }
        

        Config.LoadEnd();//页面加载移除
    })
});