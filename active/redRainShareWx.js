/**
 * Created by zhangminglei on 2017/01/09.
 * 揽储
 */
require(["zepto","services","alert","config","dialog","wxshare","sessionStroage","wx"],function($,services,Alert,Config,dialog,wxshare,ss,wx) {
    Zepto(function($) {
        Config.Init(); //全局配置初始化
        var code = Config.GetUrl()["code"]; //微信授权code
        var dailyId = Config.GetUrl()["state"];
        //var openId="";
        console.log("-----------"+code);
        //查询微信是否已授权接口
        services.queryShareAuth({
            requestBody:{
                code:code
            },
            callback:function(response) {
                //debugger;
                console.log(response);
                if (response.code == "200000") {
                    $("body").removeClass("bg");
                    debugger;
                    ss.set("openId",response.content.openId);
                    if(response.content.outhStatus == "Y"){

                        $(".wrap-bg").hide();
                        console.log('已授权');
                        location.href="../../nodeManager/active/redRainShare.html?mobilePhone="+response.content.mobilePhone+"&dailyId="+dailyId;
                    }else if(response.content.outhStatus == "N"){
                        $("body").addClass("bg");
                        $(".wrap-bg").show();
                        console.log('未授权');
                    }

                }else if(response.code == "300012"){
                    closeWeixinPage();
                }else{
                    $("body").removeClass("bg");
                    $(".wrap-bg").hide();
                    dialog.open({
                        type:"loading",
                        content:"红包不见了?返回上一步再打开看看...",
                        time:2000
                    });
                }

            }
        });

        //关闭微信页面
        function closeWeixinPage(){
            $.ajax({
                url:Config.GetAjaxUrl()+'/initWeixinjksParam',// 跳转到 action
                data:{pageUrl:window.location.href},
                type:'post',
                cache:false,
                dataType:'json',
                success:function(data) {
                    var appId=data.content.appId;
                    var timestamp=data.content.timestamp;
                    var nonceStr=data.content.nonceStr;
                    var signature=data.content.signature;

                    wx.config({
                        debug: false,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: ['closeWindow']
                    });
                    wx.ready(function() {
                        wx.closeWindow();
                    })
                },
                error : function() {
                    // view("异常！");
                    Alert.Message(300,"微信接口异常！",2000,2);
                }
            });//获取JS接口API算法
        }



        $("#telNumber").blur(function(){
            //$(".tcc-wrap").scrollTop(0);
            var v = $(this).val();
            if(v == ""){
                $("#errorMsg").html("手机号不能为空,请重新输入");
                return false;
            }else{
                var regex = /^1[34578]\d{9}$/;
                if(!regex.test(v)){
                    $("#errorMsg").html("手机号不正确,请重新输入");
                    return false;
                }
            }
        });
        /*$("#telNumber").focus(function(){
            $(".tcc-wrap").scrollTop(30);
        });

        $(".telYzm").focus(function(){
            $(".tcc-wrap").scrollTop(30);
        });
        $(".telYzm").blur(function(){
            $(".tcc-wrap").scrollTop(0);
        });*/

        var InterValObj; //timer变量，控制时间
        var count = 60; //间隔函数，1秒执行
        var curCount;//当前剩余秒数

        $("#getTelYzm").click(function(){
            if($("#telNumber").val() == ""){
                $("#errorMsg").html("手机号不能为空,请重新输入");
                return false;
            }else{
                var regex = /^1[34578]\d{9}$/;
                if(!regex.test($("#telNumber").val())){
                    $("#errorMsg").html("手机号不正确,请重新输入");
                    return false;
                }else{
                    curCount = count;
                    //设置button效果，开始计时
                    $("#getTelYzm").attr("disabled", "true");
                    $("#getTelYzm").text(curCount);
                    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
                    //获取手机验证码
                    services.sendMsg({
                        requestBody:{
                            mobilePhone:$("#telNumber").val()
                        },
                        callback:function(response) {
                            if (response.code == "200000") {
                                console.log('发送成功');
                                $("#errorMsg").html("验证码偶尔会延迟2分钟到达,请注意查收手机短信");
                            }else{
                                $("#errorMsg").html("验证码发送失败,请稍后重试");
                            }

                        }
                    });
                }
            }
        });

        var isRepeat = true;//防重提交
        $("#submit").click(function(){
            var openId="";
            openId = ss.get("openId")?ss.get("openId"):"";
            //console.log("==========="+openId);
            //alert("openId"+openId);

            var telNum = $("#telNumber").val();//手机号
            var telYzm = $(".telYzm").val();//验证码
            if(telNum == ""){
                $("#errorMsg").html("手机号不能为空,请重新输入");
                return false;
            }
            var regex = /^1[34578]\d{9}$/;
            if(!regex.test(telNum)){
                $("#errorMsg").html("手机号不正确,请重新输入");
                return false;
            }
            if(telYzm == ""){
                $("#errorMsg").html("验证码不能为空,请重新输入");
                return false;
            }

            if(isRepeat){
               // location.href="../../nodeManager/active/redRainShare.html?mobilePhone="+telNum+"&dailyId="+dailyId;
                isRepeat=false;
                //验证短信验证码,授权绑定微信接口

                services.validateMsg({
                    requestBody:{
                        mobilePhone:telNum,
                        msgCode:telYzm,
                        code:code,
                        openId:openId
                    },
                    callback:function(response) {
                        if (response.code == "200000") {
                            isRepeat=true;

                            location.href="../../nodeManager/active/redRainShare.html?mobilePhone="+telNum+"&dailyId="+dailyId;
                        }else{
                            isRepeat=true;
                            dialog.open({
                                type:"loading",
                                content:response.message,
                                time:2000
                            });
                        }

                    }
                });
            }



        });

        //timer处理函数
        function SetRemainTime() {
            if (curCount == 0) {
                window.clearInterval(InterValObj);//停止计时器
                $("#getTelYzm").removeAttr("disabled");//启用按钮
                $("#getTelYzm").text("重新发送验证码");
            }
            else {
                curCount--;
                $("#getTelYzm").text(curCount+"s");
            }
        }



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