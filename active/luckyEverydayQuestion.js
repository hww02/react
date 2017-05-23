/***
 *
 * Created by helen on 2016/12/19.
 * 我的站点
 *
 **/
require(["zepto", "config", "services","dialog"], function ($, Config, services,dialog) {
    Zepto(function ($) {
        Config.Init(); //全局配置初始化
        var selectType ="R";//1为单选，0为多选
        
        //查询当日答题
		services.dailyQuertion({
            requestBody:{
            },
            callback:function(response) {
            	if (response.code == "200000") {
            		$("#questionTitle").html(response.content.question);//问题
            		$("#questionType").html(response.content.type=="R"?"（单选）":"（多选）");
            		selectType = response.content.type;
            		var answerArr = response.content.answer;//答案选项
            		var html = "";
            		var lastHtml = '</span></p>';
            		var results = response.content.results;
            		if(results == ""){
            			$.each(answerArr,function(key,val){
	            			var a,b,c;//a:选项，b:答案,c:正确与否
	            			for( k in val){
	            				if(k!="ans"){
	            					a=k;
	            					b=val[k];
	            				}else{
	            					
	            					c=val[k]
	            				}
	            			}
	            			console.log(a,c);
	            			html += '<p class="clearfix">'
								+'	<span class="left">'+a+'. '+b+'</span>'
								+'	<span class="right selectRight">';
							
	            			var rightLable = "";//正确答案
							if(c == "Y"){
								rightLable = '<i data-option="'+a+'" data-answer="'+c+'" class="btn-select"></i><b data-answer="'+c+'" class="answer"></b>';
								html =html+rightLable+lastHtml;
							}else{
								rightLable = '<i data-option="'+a+'" data-answer="'+c+'" class="btn-select"></i><b data-answer="'+c+'" class=""></b>';
								html =html+rightLable+lastHtml;
							}						
	        			});
	        			$(".result-mesg").hide()
	        			$(".btn-confirm").css("display","block");
            		}else{
            			if(response.content.comments == "回答正确"){
            				$(".result-mesg").show().html("恭喜你答对了！获得一次抽奖机会");
            			}else{
            				$(".result-mesg").addClass("error").show().html("很遗憾，回答错误！请继续努力哦~");
            			}
            			
            			$.each(answerArr,function(key,val){
	            			var a,b,c;//a:选项，b:答案,c:正确与否
	            			for( k in val){
	            				if(k!="ans"){
	            					a=k;
	            					b=val[k];
	            				}else{
	            					
	            					c=val[k]
	            				}
	            			}
	            			console.log(a,c);
	            			html += '<p class="clearfix">'
								+'	<span class="left">'+a+'. '+b+'</span>'
								+'	<span class="right selectRight">';
							
	            			var rightLable = "";//正确答案
	            			
	            			
	            			if(results.indexOf(a)>=0){
	            				if(c == "Y"){
									rightLable = '<i data-option="'+a+'" data-answer="'+c+'" class="zp-selected"></i><b style="display: inline-block;" data-answer="'+c+'" class="answer"></b>';
									
								}else{
									rightLable = '<i data-option="'+a+'" data-answer="'+c+'" class="zp-selected"></i><b style="display: inline-block;" data-answer="'+c+'" class=""></b>';
									
								}	
	            			}else{
	            				if(c == "Y"){
									rightLable = '<i data-option="'+a+'" data-answer="'+c+'"></i><b style="display: inline-block;" data-answer="'+c+'" class="answer"></b>';
									
								}else{
									rightLable = '<i data-option="'+a+'" data-answer="'+c+'"></i><b style="display: inline-block;" data-answer="'+c+'" class=""></b>';
									
								}
	            			}
	            			
	            			html =html+rightLable+lastHtml;
												
	        			});
	        			$(".answer-title").show();
	        			$(".btn-confirm").hide();
            		}
            		
            		$("#answerList").append(html);
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
        
        //选择答案
        $("body").on("click",".btn-select",function(){
        	if(selectType == "R"){
				$(".btn-select").removeClass("zp-selected");
				if($(this).hasClass("zp-selected")){
	        		$(this).removeClass("zp-selected")
	        	}else{
	        		$(this).addClass("zp-selected");
	        	}
        	}else{
        		if($(this).hasClass("zp-selected")){
	        		$(this).removeClass("zp-selected")
	        	}else{
	        		$(this).addClass("zp-selected");
	        	}
        	}
        	
        });
        
        
        
        var answerResult = "";//结果       
		var optionsArr = "";//选中的选项
       //确认答案
       $(".btn-confirm").click(function(){       	
    		var right = false;//错误
    		if($(".zp-selected").length<=0){
    			dialog.open({
					type:"loading",
					width:"250px",
					content:"请选择答案哦！",
					time:2000
				});
				return false;
    		}
       		if(selectType == "R"){//单选
       			var $selected = $(".zp-selected").eq(0);
       			var answer = $selected.attr("data-answer");
       			optionsArr = $selected.attr("data-option");
       			if(answer == "Y"){//正确
       				right = false;
       			}else{//错误
       				right = true;
       			}
        	}else{//多选
        		var answerArr = $("#answerList").find("i");//所以答案
        		var answerRight = [];
        		var selAnswerArr = $(".zp-selected");//选中项
        		
        		for(var i=0;i<answerArr.length;i++){
        			var answer = answerArr.eq(i).attr("data-answer");
	       			if(answer == "Y"){
	       				answerRight.push(answer);	       				
	       			}
        		}
        		
        		if(answerRight.length != selAnswerArr.length){
        			right = true;//错误
        			for(var i=0;i<selAnswerArr.length;i++){
	        			var answerOption = selAnswerArr.eq(i).attr("data-option");
	        			optionsArr += answerOption+";";		       			
	        		}
        			
        		}else{
        			for(var i=0;i<selAnswerArr.length;i++){
	        			var answer = selAnswerArr.eq(i).attr("data-answer");
	        			var answerOption = selAnswerArr.eq(i).attr("data-option");
	        			optionsArr += answerOption+";";
		       			if(answer != "Y"){
		       				right = true;//错误		       				
		       			}
	        		}
        		}
        	}
        	if(right){
        		answerResult= "N";
				$(".result-mesg").show().addClass("error").html("很遗憾，回答错误！请继续努力哦~");
    		}else{
    			answerResult= "Y";
				$(".result-mesg").show().html("恭喜你答对了！获得一次抽奖机会");
				
    		}
    		$(".selectRight b").css("display"," inline-block");
    		$(".answer-title").show();
    		$(".btn-confirm").hide();
			$("body").find(".btn-select").removeClass("btn-select");
    		answerResultFun(answerResult,optionsArr);
        	
        });
        
        function answerResultFun(answer,optionsArr){
        	services.quertionAnswer({
	            requestBody:{
	            	"answer":answer,
	            	"results":optionsArr
	            },
	            callback:function(response) {
	            	if (response.code == "200000") {
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
        

        Config.LoadEnd();//页面加载移除
    })
});