require(['zepto','config','services'],function($,Config,services){
	Zepto(function($){
		Config.Init(); //全局配置初始化

		services.receiveNewGift({
			requestBody:{},
			callback:function(response){
				console.log(response);


			}
		});
		
		// $('.btn').on('click',function(){
		// 	window.location.href="receiveSuccess.html";
		// });
		


		Config.LoadEnd();//页面加载移除
	});
});