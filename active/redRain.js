/**
 * Created by zhangminglei on 2017/01/09.
 * 揽储
 */
require(["zepto","services","config","dialog","publicFun"],function($,services,Config,dialog,publicFun) {
    Zepto(function($) {
        Config.Init(); //全局配置初始化

		//活动未完成
		var dailyId = "";
		var shareUrl="";
		var taskStatus = "";//任务完成状态
		var isLogin = "Y";
		services.daily({
			callback:function(response) {
				if (response.code == "200000") {
					dailyId = response.content.id;
					var appId="wx0c1a1664441c4dd7";
					//var appId ="wx63cd8889dc7cda56";
					shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURIComponent(callbackUrl)+"&response_type=code&scope=snsapi_userinfo&state="+dailyId+"#wechat_redirect";
					if(response.content.taskStatus == "Y"){//已达成任务
						taskStatus =response.content.taskStatus;
						$("#taskState").addClass('cur').html("今日已完成");
						$("#share").removeClass('gray');
					}else{
						$("#taskState").removeClass('cur').html("今日未完成");
						$("#share").addClass('gray');
					}

					if(response.content.shareStatus == "Y"){//分享
						$("#shareText").addClass('cur').html("今日已分享");
					}else{
						$("#shareText").removeClass('cur').html("今日未分享");
					}

				}else if(response.code == "403"){
					isLogin ="N";
				}else{
					dialog.open({
						type:"loading",
						content:response.message,
						time:2000
					});
				}

			}
		});


		//去发表

		$("#goPublish").click(function(){
			if(isLogin =="N"){
				try{
					window.android.login();
				}catch(e){
					try{
						toLogin();
					}catch(e){

					}
				}
			}else{
				try{
					window.android.publish();
				}catch (e){
					toPublish();
				}
				Config.AndroidEvent("um_banner_viralmkt_express_click_event");
			}

		});
		//去分享
		$("#share").click(function(){
			if(taskStatus == "Y"){
				$('.share-tcc-wrap').show();
				$(".tcc-bg").show();
				Config.AndroidEvent("um_banner_viralmkt_share_click_event");
			}
		});
		//关闭分享tcc
		$("#share-cancle").click(function(){
			$('.share-tcc-wrap').hide();
			$(".tcc-bg").hide();
		});




		//微信授权appid获取


		var callbackUrl = "https://h5.xianglin.cn/home/nodeManager/active/redRainShareWx.html";

		var imgUrl = document.getElementsByTagName("img")[0].src;
		console.log(imgUrl);
		//分享之朋友
		$(".shareFriends").click(function(){
			if(dailyId == ""){
				dialog.open({
					type:"loading",
					content:"分享失败",
					time:2000
				});
				return false;
			}
			Config.appShare("乡邻APP广场开业庆典，我在红包雨里抢了一份给你！","在热闹的乡邻app广场里发表生活/农作/出游/奇闻异事，和全国各地乡亲们一同分享生活乐趣！",imgUrl, shareUrl,"WEIXIN");
			Config.AndroidEvent("um_banner_luckturntable_share_wechatfriends_click_event");
		});
		//分享之朋友圈
		$(".shareShuoshuo").click(function(){
			if(dailyId == ""){
				dialog.open({
					type:"loading",
					content:"分享失败",
					time:2000
				});
				return false;
			}
			Config.appShare("乡邻APP广场开业庆典，我在红包雨里抢了一份给你！","在热闹的乡邻app广场里发表生活/农作/出游/奇闻异事，和全国各地乡亲们一同分享生活乐趣！",imgUrl, shareUrl,"WEIXIN_CIRCLE");
			Config.AndroidEvent("um_banner_luckturntable_share_friendsQ_click_event");
		});
		window.UserShareFun=function(bool){
			if(bool=='true'){
				dialog.open({
					type:"loading",
					content:"分享成功",
					time:2000
				});
				//console.log("分享成功");
				services.shareStauts({
					callback:function(response) {
						if (response.code == "200000") {
							if(response.content.taskStatus == "Y"){//已达成任务
								$("#taskState").html("今日已完成");
							}else{
								$("#taskState").html("今日未完成");
							}

							if(response.content.shareStatus == "Y"){//分享
								$("#shareText").removeClass('cur').html("今日已分享");
								$("#share").removeClass('gray');
							}else{
								$("#shareText").addClass('cur').html("今日未分享");
								$("#share").addClass('gray');
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


				$('.tcc-bg').hide();
				$('.share-tcc-wrap').hide();
			}else{
				dialog.open({
					type:"loading",
					content:"分享失败",
					time:2000
				});
				//console.log("分享失败");
			}
		}

		//活动答疑
		$(".active-info").click(function(){
			$(".wrap").css("overflow-y","hidden");
			$(".tcc-wrap,.tcc-bg").show();
			Config.AndroidEvent("um_banner_viralmkt_question_click_event");
		});
		$(".tcc-close").click(function(){
			$(".wrap").css("overflow-y","scroll");
			$(".tcc-wrap,.tcc-bg").hide();
		});

        Config.LoadEnd();//页面加载移除
    })
});