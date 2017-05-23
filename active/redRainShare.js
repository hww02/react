/**
 * Created by zhangminglei on 2017/01/09.
 * 揽储
 */
require(["zepto","services","alert","config","dialog","wxshare","template"],function($,services,Alert,Config,dialog,wxshare,template) {
    Zepto(function($) {
        Config.Init(); //全局配置初始化
        var mobilePhone = Config.GetUrl()["mobilePhone"]; //手机号
        var dailyId = Config.GetUrl()["dailyId"];
        //alert(dailyId);
        console.log(dailyId);


        //领取奖励
        services.receiveShareReward({
            requestBody:{
                mobilePhone:mobilePhone,
                dailyId:dailyId
            },
            callback:function(response) {
                getQueryList();
                if(response.code=="200000"){
                    if(response.content.comments !=""){
                        dialog.open({
                            type:"loading",
                            content:response.content.comments,
                            time:2000
                        });
                    }
                    //$("#telNum").html(response.content.mobilePhone);
                    $("#redText").html("<em>红包已放至账户</em><span>"+response.content.mobilePhone+"</span><br/><i>登录乡邻APP即可使用</i>");
                    if(response.content.rewardType == "CASH"){//现金红包
                        $("#prizes").html("<span>"+response.content.rewardAmt+"元</span><i>现金红包</i>");
                    }
                    if(response.content.rewardType == "CALL_BILL"){//话费券
                        $("#prizes").html("<span>"+response.content.rewardAmt+"元</span><i>话费券</i>");
                    }
                    if(response.content.rewardType == "VOUCHER"){//抵用券
                        $("#prizes").html("<span>"+response.content.rewardAmt+"元</span><i>乡邻购抵用券</i>");
                    }
                }else if(response.code=="400008"){//来晚了，红包被领完了~
                    $("#prizes").html("<span class='tips'>红包已拆完</span>");
                    $("#redText").html("<em>参与乡邻广场活动，领更多红包</em><br/><i>登录乡邻APP即可获取</i>");
                    $("#downLoadApp").html("立即获取");
                    dialog.open({
                        type:"loading",
                        content:"来晚了，红包被领完了~",
                        time:2000
                    });
                }else if(response.code=="400007"){//当日开启红包数已达上限
                    $("#prizes").html("<span class='tips'>拆太多了，明天再来</span>");
                    $("#redText").html("<em>今日红包已全部放至账户</em><span>"+mobilePhone+"</span><br/><i>登录乡邻APP即可使用</i>");
                    dialog.open({
                        type:"loading",
                        content:"今天已经拆了3个红包啦，明天再来吧~",
                        time:2000
                    });
                }else{
                    dialog.open({
                        type:"loading",
                        content:response.message,
                        time:2000
                    });
                }

            }
        });

        //奖励列表
        function getQueryList(){
            services.queryShareReward({
                requestBody:{
                    dailyId:dailyId
                },
                callback:function(response) {
                    if(response.code=="200000"){
                        if(response.content.length >0){
                            var num = 5-response.content.length;
                            $("#redNum").html("还剩"+num+"个红包未拆");
                            var html = template('tpl/active/redRainList',response);
                            $("#redRainList").append(html);
                        }else{
                            $("#redNum").html("还剩5个红包未拆");
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


        //立即使用
        $("#downLoadApp").click(function(){
            _hmt.push(['_trackEvent', '下载', '点击', '下载按钮']);
            location.href="https://h5.xianglin.cn/home/nodeManager/downApp.html?sources=viralmkt_channel";
            //Config.AndroidEvent("um_viralshare_use_click_event");//微信页面中不能增加友盟统计
        });


        //微信授权appid获取
        var appId="wx0c1a1664441c4dd7";
        var callbackUrl = "https://h5.xianglin.cn/home/nodeManager/active/redRainShareWx.html";
        var  shareUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+encodeURIComponent(callbackUrl)+"&response_type=code&scope=snsapi_userinfo&state="+dailyId+"#wechat_redirect";
        var ua = navigator.userAgent.toLowerCase();
        var u = window.navigator.userAgent;
        var img_url=document.getElementsByTagName("img")[0].src;

        if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信
            //微信分享
            var shareData = {
                title: '乡邻APP广场开业庆典，我在红包雨里抢了一份给你！',
                desc: '在热闹的乡邻app广场里发表生活/农作/出游/奇闻异事，和全国各地乡亲们一同分享生活乐趣！',
                link:shareUrl,
                imgUrl: img_url,
                success:function(){
                    dialog.open({
                        type:"loading",
                        content:"分享成功",
                        time:2000
                    });
                },
                cancel:function(){
                    dialog.open({
                        type:"loading",
                        content:"分享失败",
                        time:2000
                    });
                }
            }
            wxshare.set(shareData);
        }

        Config.LoadEnd();//页面加载移除
    })
});