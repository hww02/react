/***
 *
 * Created by helen on 2016/12/19.
 * 我的站点
 *
 **/
require(["zepto", "config", "services","dialog","awardRotate"], function ($, Config, services,dialog) {
    Zepto(function ($) {
        Config.Init(); //全局配置初始化
		
        var turnplate={			
			restaraunts:["VivoY51A", "5元话费券", "50元话费券", "100元优惠券", "5元优惠券", "2元话费券", "1元话费券", "乡邻红包"] ,//大转盘奖品区块		
			bRotate:false				//false:停止;ture:旋转
		};
		
		//答题按钮
		$("#btnQuestion").on("click",function(){
			Config.AndroidEvent("um_luckturntable_gotest_click_event");
			location.href="../../nodeManager/active/luckyEverydayQuestion.html";
		});
		
		//活动规则
		$("#active-rule").on("click",function(){
			Config.AndroidEvent("um_luckturntable_rule_click_event");
			location.href="../../nodeManager/active/luckyGoRule.html";
		});
		
		//动态添加大转盘的奖品与奖品区域背景颜色				
		var rotateTimeOut = function (){
			$('#wheelcanvas').rotate({
				angle:0,
				animateTo:2160,
				duration:8000,
				callback:function (){
					dialog.open({
						type:"loading",
						width:"250px",
						content:"网络超时，请检查您的网络设置！",
						time:2000
					});
				}
			});
		};
		
		//旋转转盘 item:奖品位置; txt：提示语;
		var rotateFn = function (item,pmoney,telNum){
			var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
			
			if(angles<270){
				angles = 270 - angles; 
				console.log(angles);
			}else{
				angles = 360 - angles + 270;
				console.log(angles);
			}
			$('#wheelcanvas').stopRotate();
			$('#wheelcanvas').rotate({
				angle:0,
				animateTo:angles+1800,
				duration:8000,
				callback:function (){
					turnplate.bRotate = !turnplate.bRotate;
					//状态初始化
					luckyInit();
					switch (item) {
						case 1://VivoY51A
																
							break;
						case 2://5元话费券
							$("#ticket-title").html("恭喜您获得话费券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元话费券");
							$("#tickt-use").html("可用于手机充值");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 3://50元话费券
							$("#ticket-title").html("恭喜您获得话费券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元话费券");
							$("#tickt-use").html("可用于手机充值");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 4://100元优惠券
							$("#ticket-title").html("恭喜您获得优惠券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元优惠券");
							$("#tickt-use").html("可在乡邻购中使用");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 5://5元优惠券
							$("#ticket-title").html("恭喜您获得优惠券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元优惠券");
							$("#tickt-use").html("可在乡邻购中使用");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 6://2元话费券
							$("#ticket-title").html("恭喜您获得话费券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元话费券");
							$("#tickt-use").html("可用于手机充值");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 7://1元话费券
							$("#ticket-title").html("恭喜您获得话费券！");
							$("#ticket-num").html(pmoney);
							$("#ticket-text").html("元话费券");
							$("#tickt-use").html("可用于手机充值");
							$(".ticket-wrap").show().siblings().hide();
							tccShow();
							break;
						case 8://乡邻红包							
							$("#hb-num").html(pmoney);
							$(".cash-wrap").show().siblings().hide();
							tccShow();	
							break;
					}
					
					$("#a-ticket").click(function(){
						location.href="https://mai.xianglin.cn/wap/index.html#/member/newcoupon";
						Config.AndroidEvent("um_luckturntable_pulling_use_click_event");
					});
					$("#a-cash").click(function(){
						location.href="https://h5cau.xianglin.cn/home/network/nodeManager/accountBalance.html?mobilePhone="+telNum+"&markFlag=true";
						Config.AndroidEvent("um_luckturntable_pulling_check_click_event");
					});
				}
			});
			
		};
		
		//点击抽奖
		$('.pointer').click(function (){
			if(turnplate.bRotate)return;
			turnplate.bRotate = !turnplate.bRotate;
			prizeResult();
			Config.AndroidEvent("um_luckturntable_pulling_click_event");
			
		});
		
		//抽奖结果
		function prizeResult(){
			
			services.LuckyGoReward({
	            requestBody:{
	            },
	            callback:function(response) {
	            	if (response.code == "200000") {
	            		var name = response.content.comments;//奖品名字
	            		var item = turnplate.restaraunts.indexOf(name)+1;	            		
	            		var amount = response.content.amount;//金额
	            		var telNum = response.content.mobilePhone;//手机号
	            		
						rotateFn(item,amount,telNum);
	            	}else{
						$("#mesg-text").html(response.message);
						$(".text-wrap").show().siblings().hide();
						tccShow();	
						turnplate.bRotate = !turnplate.bRotate;
						return false;
	            	}
	            },
	            errCallback:function(){
	            	turnplate.bRotate = false;
	            }
	        });
		}
		
		//状态初始化
		luckyInit();
		function luckyInit(){
			services.LuckyGoProgress({
	            requestBody:{ 
	            },
	            callback:function(response) {
	            	if (response.code == "200000") {
	            		turnplate.restaraunts=response.content.rewards;//奖项
	            		
	            		$("#lastCount").html(response.content.count);//抽奖次数
	            		if(response.content.SHARE=="Y"){//每日分享状态
	            			$("#shareState").html("已完成").addClass("finish");
	            		}else{
	            			$("#shareState").html("未完成").removeClass("finish");
	            		}
	            		
	            		if(response.content.COMMENT=="Y"){//每日评论状态
	            			$("#commentState").html("已完成").addClass("finish");
	            		}else{
	            			$("#commentState").html("未完成").removeClass("finish");
	            		}
	            		
	            		if(response.content.ANSWER=="Y"){//每日答题状态
	            			$("#questionState").html("已完成").addClass("finish");
	            		}else{
	            			$("#questionState").html("未完成").removeClass("finish");
	            		}
	            		            		
	            		
	            	}else{
	            		dialog.open({
							type:"loading",
							width:"250px",
							content:response.message,
							time:2000
						});
						return false;
	            	}
	            }
	        });
		}
		
		//分享按钮
		$("#btnShare").click(function(){
			$(".zp-tcc-bg,.share-tcc-wrap").show();
			turnplate.bRotate = false;
		});
		//取消分享
		$("#share-cancle").click(function(){
			$(".zp-tcc-bg,.share-tcc-wrap").hide();
			turnplate.bRotate = false;
		});
		
		var imgUrl = document.getElementsByTagName("img")[0].src;
		console.log(imgUrl);		
		//分享之朋友
		$(".shareFriends").click(function(){
			//alert("朋友");
			Config.appShare("参与乡邻幸运go,抽千元手机!","下载乡邻app，网购、充值、交友，农村互联网生活从现在开始",imgUrl, "https://h5.xianglin.cn/home/nodeManager/active/luckyGoDownLoad.html","WEIXIN");
			Config.AndroidEvent("um_luckturntable_share_successwx_count_event");
		});
		
		//分享之朋友圈
		$(".shareShuoshuo").click(function(){
			//alert("朋友圈 ");
			Config.appShare("参与乡邻幸运go,抽千元手机!","下载乡邻app，网购、充值、交友，农村互联网生活从现在开始",imgUrl, "https://h5.xianglin.cn/home/nodeManager/active/luckyGoDownLoad.html","WEIXIN_CIRCLE");
			Config.AndroidEvent("um_luckturntable_share_successquan_count_event");
		});
		
		window.UserShareFun=function(bool){
			if(bool=='true'){
				console.log("分享成功");
				$(".zp-tcc-bg,.share-tcc-wrap").hide();
				services.LuckyGoShare({
		            requestBody:{ 
		            },
		            callback:function(response) {
		            	if (response.code == "200000") {
		            		luckyInit();
		            	}else{
		            		dialog.open({
								type:"loading",
								width:"250px",
								content:response.message,
								time:2000
							});
							return false;
		            	}
		            }
		        });
				dialog.open({
					type:"loading",
					width:"250px",
					content:"分享成功",
					time:2000
				});
				
	        }else{
	            console.log("分享失败");
	            $(".zp-tcc-bg,.share-tcc-wrap").hide();
	            dialog.open({
					type:"loading",
					width:"250px",
					content:"分享失败",
					time:2000
				});
	        }
		}
		
		//关闭tcc
		$(".close,.a-close").click(function(){	
			tccHide();					
			turnplate.bRotate = false;
		});		
			
		function tccShow(){
			$(".zp-tcc-bg").show();
			$(".zp-tcc-wrap").show();
		}

        function tccHide(){
			$(".zp-tcc-bg").hide();
			$(".zp-tcc-wrap").hide();
		}
        
       
        

        Config.LoadEnd();//页面加载移除
    })
});