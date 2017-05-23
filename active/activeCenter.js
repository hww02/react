require(['zepto','config','services','dialog','pageplug'],function($,Config,services,dialog,PagePlug){
	Zepto(function($){
		Config.Init(); //全局配置初始化
		//列表分页
		PagePlug.Init({
            PageNow:2,
            PageCount:10,
            PageWrap:'#js_page-tab-wrap',
            loading_back:newF
        });

		newF(1);//默认显示一页
		
		function newF(curpage){
			//console.log(count);
			services.activeCenterList({
				requestBody:{ 
					startPage:curpage
				},
				callback:function(response){
					//console.log(response.content);

					if(response.code=="200000"){
						var html='';
						var data=response.content;
						console.log(data);
						if(data){
							if(data.length>0){
								for(var i = 0; i < data.length; i++){
									html+='<a href="'+data[i].activityUrl+'"><img src="'+data[i].activityImgUrl+'" alt=""/></a>';
								}
								$('.no_active').hide();
								$('.active_content').append(html);
								$('#js_page-tab-wrap').attr("lock", "false");
							}else{
								if(curpage==1){
									$('.no_active').show();
								}
								$('#js_page-tab-wrap').attr("lock", "true");
							}
						}else{
							if(curpage==1){
								$('.no_active').show();
							}
							$('#js_page-tab-wrap').attr("lock", "true");
						};
						$('#js_page-tab-wrap').html('');
					}else{
						$('#js_page-tab-wrap').attr("lock", "true");
						$('.no_active').show();
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