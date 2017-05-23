require(['zepto','config','services','dialog'],function($,Config,services,dialog){
	Zepto(function($){
		Config.Init(); //全局配置初始化
		services.newGift({
			requestBody:{},
			callback:function(response){
				//console.log(response);
				if(response.code=="200000"){
					if(response.content=="N"){//老用户
						$('.content').hide();
						$('.receive_content').hide();
						$('.content_old').show();

						$('.content_old .to_look').on('click',function(){
							window.location.href="activeCenter.html";
						});
					}else if(response.content=="H"){//有新人礼可以领取
						$('.content_old').hide();
						$('.receive_content').hide();
						$('.content').show();

						$('.receive .btn').on('click',function(){
							
							receiveStatus();

						});
					}else if(response.content=="Y"){//已经领取过新人礼，不能再领取
						$('.content_old').hide();
						$('.content').hide();
						$('.receive_content').show();
						$('.receive_content .to_look').on('click',function(){
							window.location.href="https://mai.xianglin.cn/wap/index.html#/member/newcoupon";
						});

					}else if(response.content=="F"){
						$('.content').show();
						$('.receive .btn').on('click',function(){
							try{
		            			window.android.login();
		            		}catch(e){
		            			try{
		            				toLogin();		            				
		            			}catch(e){
		            				
		            			}
		            		}

						});
						
					};
				}else{
					dialog.open({
		                type:"loading",
		                content:response.message,
		                time:2000
		            });
				};


			}
		});

		function receiveStatus(){
			services.receiveNewGift({
				requestBody:{},
				callback:function(response){
					//console.log(response);

					if(response.code=="200000"){
						if(response.content==true){//领取成功
							window.location.href="receiveSuccess.html";
						}
					}else{
						dialog.open({
			                type:"loading",
			                content:response.message,
			                time:2000
			            });
					};
				}
			});
		};
		

		Config.LoadEnd();//页面加载移除
	});
});