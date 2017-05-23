/***
 *
 * Created by liushihong on 2015/12/25.
 * 我的站点
 *
 **/
require(["zepto", "config", "services", "touch","dialog","wxshare"], function ($, Config, services, touch,dialog,wxshare) {
    Zepto(function ($) {
    	
        Config.Init(); //全局配置初始化
        var partyId=Config.GetUrl()["pid"];
        var source=Config.GetUrl()["source"];
        $(".contioner-back").height($(window).height());
        
        $("#ljck,#ljzjl").on("click",function(){
        	window.location.href="../../nodeManager/downApp.html?sources=friends_channel";
        });
        

       $("#phoneNum").on("focus",function(){
        	$(".phone-content").css({"position":"relative","top":0});
        	$(".bottom-content").css("position","relative");
        }).on("blur",function(){
        	$(".phone-content").css({"position":"absolute","top":"3rem"});
        	$(".bottom-content").css("position","absolute");
        })
        
        $("#ljlq").on("click",function(){
        	if(!checkPhone($("#phoneNum").val())){
        		return false;
        	}else{
        		submitFun();
        	}
        })
        
        
        function shareNews(){
        	var ua = navigator.userAgent.toLowerCase();
	        var u = window.navigator.userAgent;
	        var img_url=document.getElementsByTagName("img")[0].src;
	        if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信
	            //微信分享
		        var shareData = {
			        title:"领红包了！我和乡邻给您拜早年， 小小红包请笑纳～",
		          	desc:"呼朋唤友赚收益，丰富奖励等你拿！全民一起来乡邻app!",
		          	link:window.location.href,
		          	imgUrl:img_url
			    }          
			    wxshare.set(shareData);
	        }
        }
        shareNews()
        
        function checkPhone(value){
        	if(value==""){
        		dialog.open({
	                type:"loading",
	                content:"请输入手机号",
	                time:2000
	            });
	            return false;
        		
        	}
        	var regString = /^1[3456789]\d{9}$/;
        	if(!regString.test(value)){
        		dialog.open({
	                type:"loading",
	                content:"您输入的手机号码有误",
	                time:2000
	            });
        		return false;
        	}else{
        		return true;
        	}
        }
        
        
        function submitFun(){
        	services.activity({
                requestBody:{
                   mobile:$("#phoneNum").val(),
                   partyId:partyId,
                   source:source
                },
                callback:function(response) {
                    if (response.code == "200000") {
                    	if(response.content==true){//新用户
                    		$(".success-content").show();
                    		$(".phone-content").hide();
                    		$("#usedNum").text($("#phoneNum").val().substring(0,3)+"***"+$("#phoneNum").val().substring(7,11));
                    	}else{//老用户
                    		$(".receive-content").show();
                    		$(".phone-content").hide();
                    	}
                    }else{
                    	dialog.open({
			                type:"loading",
			                content:response.message,
			                time:2000
			            });
                    }
                    
                }
            });
        }
        

        Config.LoadEnd();//页面加载移除
    })
});