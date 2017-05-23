/***
 *
 * Created by liushihong on 2015/12/25.
 * 我的站点
 *
 **/
require(["zepto", "config", "services", "touch","dialog","pageplug","template"], function ($, Config, services, touch,dialog,Pageplug,template) {
    Zepto(function ($) {
    	
        Config.Init(); //全局配置初始化
        var count = 10;//分页每次加载条数
        
        Pageplug.Init({
            PageNow:2,            
            PageCount: count,
            PageWrap:'#js_page-tab-wrap',
            loading_back:getListDate
        });	
		getListDate(1,20);
       
   		function getListDate(curPage,PageCount){
			services.recList ({
	            requestBody:{
	            	startPage:curPage,
	            	pageSize:PageCount
	            },
	            callback:function(response) {
	            	if (response.code == "200000") {
	            		if(response.content.length==0){
	            			if(curPage==1){
                               html = "<p class='p-noData'>暂无数据</p>";
	                        	$(".friends-wrap").append(html);
                            }
	        				$('#js_page-tab-wrap').attr("lock","true");
	        				$('#js_page-tab-wrap').html("");	            			
	            		}else{
	            			var html = template('tpl/active/inviteFriendsList',response);
							$("#friends-list").append(html);
							$('#js_page-tab-wrap').attr("lock","false");
							$('#js_page-tab-wrap').html("");
	            		}
	            		
	            	}else{
	            		dialog.open({
							type:"loading",
							width:"250px",
							content:response.message,
							time:2000
						});
						return false;
	            	};                
	            }
	        });
		}

        Config.LoadEnd();//页面加载移除
    })
});