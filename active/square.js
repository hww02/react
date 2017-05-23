/**
 * Created by zhangminglei on 2017/01/09.
 * 揽储
 */
require(["zepto","services","config","dialog","wxImg","template","wxshare"],function($,services,Config,dialog,wxImg,template,wxshare) {
    Zepto(function($) {
        Config.Init(); //全局配置初始化
        var articleId = Config.GetUrl()["id"];
        
        var shareDesc="";//分享描述
		var shareImgUrl = "";//分享图片链接
		
		services.shareArticleInfo({
			requestBody:{
                articleId:articleId
            },
			callback:function(response) {
				if (response.code == "200000") {
					$(".content-wrap").show();
					var state = response.content.articleInfo;//动态内容
					if(state.gender == "男"){//性别 
						$("#sex").removeClass("female").addClass("male");
					}else{
						$("#sex").removeClass("male").addClass("");
					}
					
					$("#userPhoto").attr("src",state.headImg);//用户头像
					$("#userName").html(state.nikeName);//用户昵称
					$("#stateTime").html(state.dateTime);//状态发表时间
					
					shareDesc = state.article;//分享描述
					
					if(state.article == "" ){//状态内容
						$("#state").hide();
					}else{
						$("#state").hide();
						$("#state").show().html(state.article);//状态内容;
					}
					
					
					if(state.articleAudio == "" || state.articleAudioLength == ""){
						$("#state-audio-wrap").hide();
						$(".div-state-wrap").addClass("pb15");
						
						if(state.articleImgs != ""){
							$(".state-wrap").addClass("pb30");
						}else{
							$(".state-wrap").removeClass("pb30");
						}
					}else{
						
						$("#state-audio-wrap").show();
						$(".div-state-wrap").removeClass("pb15");
						$(".state-wrap").addClass("pb30");
						
						
						
						/*var state_audio = document.createElement("audio");
						state_audio.src = state.articleAudio;						
						$("#state-audio-wrap").append(state_audio);//语音*/	
						
						$("#state-audio-wrap").attr("data-audioUrl",state.articleAudio);
						$(".state-audio-time").html(state.articleAudioLength+'"');//语音时长								
					}
					
					//状态图片
					var imgList = [];//状态图片list
					if(state.articleImgs == ""){//无图片
						$(".img-layout").hide();
						shareImgUrl = document.getElementsByTagName("img")[0].src;
					}else{
						imgList=state.articleImgs.split(";");
						shareImgUrl = imgList[0];//分享动态第一张图片
						if(imgList.length == 1){
							$(".img-list").html("<li class='w100' data-imgUrl= "+imgList[0]+" style='background-image:url("+imgList[0]+")'></li>");
						}else{
							var imgListHtml = "";
							for(var i=0;i<imgList.length;i++){
								
									imgListHtml += "<li data-imgUrl= "+imgList[i]+" style='background-image:url("+imgList[i]+")'></li>";
								
							}
							$(".img-list").html(imgListHtml);
						}				
					}
					
					//评论列表
					var commentList = response.content.list;
					if(commentList == ""){
						$(".comment-wrap").hide();
					}else{
						$(".comment-wrap").show();
						var html = template('tpl/active/squareList',response.content);
		                $(".comment-list").append(html);
					}
					
					wxShareFun();//微信分享

				}else if(response.code == "400005"){
					$(".state-del").show();
					$(".content-wrap").hide();
				}else{
					dialog.open({
						type:"loading",
						content:response.message,
						time:2000
					});
				}

			}
		});
        
        //语音播放
		
		$(".yuyin-body").on("click",".audioWrap",function(){
			var state_audio = document.createElement("audio");
				//state_audio.src = state.articleAudio;						
				$("body").append(state_audio);
			
			var u = navigator.userAgent;
		    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		    //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		    if(isAndroid){
		    	var audioLable = document.getElementById("voiceAudio");			
				var audioSrc = $(this).attr("data-audioUrl");
				if($(this).attr('play')=='true'){
					//处于播放的状态
					$(this).attr('play','false');
					state_audio.pause();
					$(this).find(".start-play").hide();
				}else{
					//处于未播放的状态
					$(this).attr('play','true');
					state_audio.src=audioSrc;
					state_audio.play();
					$(this).find(".start-play").show();
					var _this = this;
					var is_playFinish = setInterval(function(){
		               if(state_audio.ended){
		               		$(_this).find(".start-play").hide();
		                    window.clearInterval(is_playFinish);
			            }
			        }, 3);
					
				}
		    }else{
		    	location.href="http://t.cn/RI867QG";
		    }		
			
		});
		
		//跳转至downapp页面
		$("body").on("click",".openApp",function(){
			location.href="http://t.cn/RI867QG";
		});

		//点击小图看大图
		$(".img-list").bind("click","li",function(){
			var imgArray = [];
			var curImageSrc = $(this).attr("data-imgUrl");
			if (curImageSrc) {
	            $(this).parent().find("li").each(function(index, el) {
	                var itemUrl = $(this).attr("data-imgUrl");
	                imgArray.push(itemUrl);
	            });
	            console.log("--------------------");
	            console.log(curImageSrc);
	            console.log(imgArray);
	            wxImg.bigImg({
	                current: curImageSrc,
	                urls: imgArray
	            });	           
	       }
		});
		
		//微信分享
		function wxShareFun(){
			var ua = navigator.userAgent.toLowerCase();
	        if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信
	            //微信分享
	            var shareData = {
	                title: '来自乡邻app的动态',
	                desc: shareDesc,
	                link:"https://h5.xianglin.cn/home/nodeManager/active/square.html?id="+articleId,
	                imgUrl: shareImgUrl
	            }
	            wxshare.set(shareData);
	        }
		}
        
		
		
        Config.LoadEnd();//页面加载移除
    })
});