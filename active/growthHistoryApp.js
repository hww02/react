/***
 *
 * Created by helen on 2016/12/19.
 * 我的站点
 *
 **/
require(["zepto", "config", "services", "touch","countUp","moment","lunar","fullpage"], function ($, Config, services, touch,CountUp,moment,lunar) {
    Zepto(function ($) {
        Config.Init(); //全局配置初始化
        $(".wp").show();


        var ua = navigator.userAgent.toLowerCase();
        var u = window.navigator.userAgent;
        
        if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信
            $(".page8-btn").show();
        }else{
            $(".page8-btn").hide();
        }
        
        var creatDate = moment("2013-04-18","YYYY-MM-DD").unix();
        var nowDate = moment().format('YYYY年MM月DD日');
        var nowDates = moment(nowDate,"YYYY年MM月DD日").unix();
        var oneDay = 24*60*60;
        var days = (nowDates - creatDate)/oneDay;
        var lunarDate=lunar.solar2lunar(moment().format('YYYY'),moment().format('M'),moment().format('D'));
        $('#lunarDate').html('农历'+lunarDate.IMonthCn+lunarDate.IDayCn);
        $("#nowDays").html(nowDate);//当前日期
        $("#sumDays").html(days);//总天数
        
        $('.wp-inner').fullpage({
        	change: function (e) {
                // 移除动画属性
                $('.page').eq(e.cur).find('.js-animate').each(function() {
                    $(this).removeClass($(this).data('animate')).hide();
                });
                if(e.cur == 0){
                	$(".start").hide();
                }else if(e.cur == 3){
                	countScroll("myTargetElement");                	
                }else if(e.cur == 7){
                	$(".start").hide();
                }else{
                	$(".start").show();
                }
            },
            afterChange: function (e) {
                // 添加动画属性
                $('.page').eq(e.cur).find('.js-animate')
                    .each(function () {
                        $(this).addClass($(this).data('animate')).show();
                    });
            }
            
        });   
        
        //音乐
        /*var bgAudio = new Audio();
        bgAudio.loadStatus = 'unload';
        bgAudio.loop = true;
        function loadAudio(audio, url, callback) {
            audio.src = url;
            audio.load();
            audio.addEventListener('canplay', function () {
                bgAudio.loadStatus = 'loaded';
                callback();
            });
            audio.addEventListener('loadstart', function () {
                bgAudio.loadStatus = 'loading';
            });
        }
        function playAudio(){
            if (bgAudio.loadStatus === 'unload') {
                loadAudio(bgAudio, '../../../../css/media/bg.mp3', function () {
                    playAudio();
                });
                return 1;
            }
            bgAudio.play();
        }
        function stopAudio() {
            bgAudio.pause();
        }
        bgAudio.addEventListener('playing' ,function (e) {
            $('#music .music-btn').addClass('play');
        });
        bgAudio.addEventListener('pause' ,function (e) {
            $('#music .music-btn').removeClass('play');
        });
		playAudio();
        $('body').one('touchstart', function () {
            playAudio();
            $('#music').on('touchstart', function (e) {
                if (bgAudio.paused) {
                    playAudio();
                    return 0;
                }
                stopAudio();
                return 1;
            });
        });
        window.onload = function() {
            if (bgAudio.loadStatus !== 'unload') {return;}
            playAudio();
        };*/
        
        //数组滚动
        //a="../../../css/media/bg.mp3"
        function countScroll(id){
        	var options = {
				useEasing : false,
				useGrouping : false,
				separator : ',',
				decimal : '.',
				prefix : '',
				suffix : ''
			};
			var demo = new CountUp.init(id, 0, 31233478223, 0, 2.5, options);
			demo.start();
        }
        
        $(".page8-btn").on("click", function () {
            $(".downapp-tcc").fadeIn();
            $(".downapp-tcc-bg").fadeIn();
        });

        $(".btn-know").on("click", function () {
            $(".downapp-tcc").fadeOut();
            $(".downapp-tcc-bg").fadeOut();
        });
        
        $('#next').on('click', function (e) {        	
            e.preventDefault();
            $.fn.fullpage[$(this).data('dir')](true);
        });


        
        
                
        //微信分享
	      /*var shareData = {
	          title:'宜农成长史',
	          desc:'感谢一路陪伴宜农,有你们真好!',
	          link:window.location.href,
	          imgUrl:window.location.origin + __uri('image/active/history-share.jpg')
	      }          
	      wxshare.set(shareData);*/ 
  
        

        Config.LoadEnd();//页面加载移除
    })
});