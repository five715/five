var _game = null;

$(function(){
	$(window).bind("resize load", function(){
		w = $(".box").width();
		if(w < 1000){			
			size = w / 64;
			$("html").css("font-size",size+"px");
		}
	})
	linkage(config)
	$("#fullpage").fullpage({
		'css3' : false,
		verticalCentered : !1,
		anchors:["1","2","3","4","5","6"]
	})
	Dream.Preload.load(progress, complete);
})
/**
 * 加载中
 */
function progress(e){
	var per = Math.floor(e.loaded*100);
	console.log(per);
}
/**
 * 加载完成
 */
function complete(e){
	
}
/**
 * 游戏开始
 */
function onGameStart(){
	
}
/**
 * 游戏结束
 */
function onGameOver(){
	
}
/**
 * 文字dot
 */
function animationDot(obj,text,speed){
	clearTimeout(_timer);
	var DOT = [".","..","..."];
	var i = 0;
	_timer = setInterval(function(){
		obj.text(text+DOT[i]);
		i++;
		if(i >= DOT.length) i = 0;
	},speed);
}

/**
 * 假loading
 */
function fakeLoading(obj,reso,speed){
	var i = 0
	_timer = setInterval(function(){
		i+= 100 / reso;
		pre = i;
		obj.text(pre+"%...");
		i++;
		if(pre >=100){		
			obj.text("100%...");
			clearTimeout(_timer);
		}
	},speed/reso);
}

/**
 * 弹窗
 * @param {Object} n
 * 1 : 车型配置
 * 2 : 试驾信息
 */
function popup(n){
	$(".popup,.pop").hide();
	$.fn.fullpage.setAllowScrolling(true);
	switch(n){
		case 1:
			$.fn.fullpage.setAllowScrolling(false);
			$(".popup,.popup_testDrive").show();
			break;
		case 2:
			$(".popup,.popup_info").show();
			$.fn.fullpage.setAllowScrolling(false);
			break;
	}
}

//轮播图
function funcSlick(obj,number,prev,next){
	obj.attr("data-slick","yes");
	obj.slick({
        dots: false,
        infinite: true,
        arrows: true,
        draggable: false,
        prevArrow: obj.parent().find(prev||".prev"),
        nextArrow: obj.parent().find(next||".next"),
        autoplay:false,
        slidesToShow : number||1
    });
}
function funcPlayer(vid){
	//暂停上一个视频
	if(_player) _player.pause()
	//加载视频
	var video = new tvp.VideoInfo();
	video.setVid(vid);
	var player =new tvp.Player();
	player.create({
		width : "100%",
		height : "100%",
		video : video,
		modId : "player",
		autoplay : false,
		pic:"images/section1_video_pic.jpg",
        flashWmode:"opaque",
        onwrite:function(){
        	_player = player	
        }
	});
}
/*---------------------------验证------------------------------*/
function verify(){
	var _this = $(".popup_info")
	//姓名 
	var name = _this.find(".name input").val();
    if (validName(name)){
    	if(name=="请输入联系人"){
            alert("请输入联系人");
            return false;
        }
    }else {
        alert("请输入正确的姓名");
        return false;
    }
//	性别
	var sex = _this.find(".sex .positive").attr("data-sex");
	if(!sex){
		alert("请选择性别");
		return false;
	}
//	手机
	var phone = _this.find(".phone input").val();
    if (validPhone(phone)){
    }else {
    	if(phone == ""){
    		alert("请输入手机号码");
	        return false;
    	}else{	
    	    alert("请输入正确的手机号码");
	        return false;
    	}
    }
//	省份
	var pro = _this.find(".pro span").text();
	if(!pro || pro == "请选择省份"){
		alert("请选择省份");
        return false;
	}
//	城市
	var city = _this.find(".city span").text();
	if(!city || city == "请选择城市"){
		alert("请选择城市");
        return false;
	}
//	经营商
	var dealer = _this.find(".dealer span").text();
	if(!dealer || dealer=="请选择经销商"){
		alert("请选择经销商");
        return false;
	}
//	协议
	var agreement = !_this.find(".agreement .tick").hasClass("positive");
	if(!agreement){
		alert("请勾选协议");
        return false;
	}
	
    //数据保存
    var data = {
    	name	: name,
    	sex		: sex,
    	phone	: phone,
    	pro		: pro,
    	city	: city,
    	dealer	: dealer,
    	agreement: agreement
    }
    alert("保存成功")
    console.log(data)
    testDriveInit()
    
	// 验证姓名的正则表达式
	function validName(name){
	    var pattern=/^([a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}|[\u4e00-\u9fa5a-zA-Z]{1,20})$/;
	    return pattern.test(name)
	}
	//手机号的验证  正则表达式
	function validPhone(phone){
	    var pattern=/^1[34578][0-9]{9}$/;
	    return pattern.test(phone)
	}
}
//选择框改变
function funcSelectChange(obj,obj1,obj2){		
	obj.on("change", function(){
		var text = $(this).find("option:selected").text()
		$(this).prev().text(text)
		if(obj1) testDriveInit(obj1)
		if(obj2) testDriveInit(obj2)
	})
}
//验证初始化
function testDriveInit(number){
	if(!number) number = "all";
	if(number == "name" || number == "all" ) $(".popup_info .name input").val("");
	if(number == "phone" || number == "all" ) $(".popup_info .phone input").val("");
	if(number == "pro" || number == "all" ) $(".popup_info .pro span").text("")
	if(number == "city" || number == "all" ) $(".popup_info .city span").text("");
	if(number == "dealer" || number == "all" ) $(".popup_info .dealer span").text("");
}