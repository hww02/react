require(['zepto','config','services'],function($,Config,services){
	Zepto(function($){
		Config.Init(); //全局配置初始化

		$('.to_look').on('click',function(){
			window.location.href="https://mai.xianglin.cn/wap/index.html#/member/newcoupon";
		});
		

		Config.LoadEnd();//页面加载移除
	});
});