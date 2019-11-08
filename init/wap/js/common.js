var _game = null;

$(function(){
	$(window).bind("resize load", function(){
		w = $(".box").width();
		if(w < 1000){			
			size = w / 75;
			$("html").css("font-size",size+"px");
		}
	})
//	$("#fullpage").fullpage({
//		'css3' : false,
//		verticalCentered : !1,
//		anchors:["1","2","3","4","5","6"]
//	})
//	Dream.Preload.load(progress, complete);
/*--------------------------视频---------------------------*/
	//播放
	$(".video .player .play").on("click",function(){
		livePlayer("i0712l5fveu")
		$(this).hide();
	})
	$(".video .player .play").click();
/*--------------------------预约试驾---------------------------*/
	//省市联动信息
//	linkage(config);
//	linkageType(data_type);
	//选择框-省份
	funcSelectChange($("#pro"),"city","dealer");
	//选择框-城市
	funcSelectChange($("#city"),"dealer");
	//选择框-经销商
	funcSelectChange($("#dealer"));
	//选择框-性别
	funcSelectChange($("#sex"));
	//选择框-车型
	funcSelectChange($("#type"));
	//声明选择框
	$(".testDrive .treaty").on("click",function(){
		$(this).toggleClass("active")
	})
	//提交
	$(".testDrive .submit").on("click",verify);
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
function funcSlick(obj, role, number,scroll, prev, next) {
    if (obj.attr("data-slick") == 'yes') return false;
    obj.attr("data-slick", "yes");
    obj.slick({
        dots: role ? false : true,
        infinite: true,
        arrows: true,
        draggable: false,
        prevArrow: obj.parent().parent().find(prev || ".prev"),
        nextArrow: obj.parent().parent().find(next || ".next"),
        autoplay: true,
        slidesToShow: number || 1,
        slidesToScroll: scroll || 1
	});
}
/**
 * 视频
 */
function livePlayer(vid,id,type){
	var player = h5e.video.init({
		 modId: id,
		 vid: vid,
		 width: "100%",
		 height: "100%",
		 type: type,
		 autoplay:false
		//  volume:0
	 });
 }
/*---------------------------验证------------------------------*/
function verify(){
	var _this = $(".inputs")
	//姓名 
	var name = _this.find(".name").val();
    if(name=="请输入联系人" || name == ""){
		alert("请输入联系人");
		return false;
    }
    if (!validName(name)){
        alert("请输入正确的姓名");
        return false;
    }
//	性别
	var sex = _this.find(".sex span").text();
	if(!sex || sex == "请选择性别" || sex == "性别"){
		alert("请选择性别");
		return false;
	}
//	手机
	var phone = _this.find(".phone").val();
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
	if(!pro || pro == "请选择省份" || pro == "省份"){
		alert("请选择省份");
        return false;
	}
//	城市
	var city = _this.find(".city span").text();
	if(!city || city == "请选择城市" || city =="城市"){
		alert("请选择城市");
        return false;
	}
//	经营商
	var dealer = _this.find(".dealer span").text();
	if(!dealer || dealer=="请选择经销商" || dealer == "经销商"){
		alert("请选择经销商");
        return false;
	}
	//时间 
	var time = _this.find(".models span").text();
    if(time =="意向购车时间" || time == ""){
		alert("请选择意向购车时间");
		return false;
    }
//	协议
	var agreement = _this.find(".check .boxes").hasClass("active");
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
		time	: time,
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
		var pattern=/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(16[6]{1})|(19[89]{1}))+\d{8})$/;
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
	var _this = $(".inputs")
	if(!number) number = "all";
	if(number == "name" || number == "all" ) _this.find(".name").val("");
    if(number == "sex" || number == "all") $(".sex span").text("性别");
	if(number == "phone" || number == "all" ) _this.find(".phone").val("");
	if(number == "pro" || number == "all" ) _this.find(".pro span").text("省份")
	if(number == "city" || number == "all" ) _this.find(".city span").text("城市");
	if(number == "dealer" || number == "all" ) _this.find(".dealer span").text("经销商");
	if(number == "models" || number == "all" ) _this.find(".models span").text("意向购车时间");
	if(number == "config" || number == "all" ) {
		_this.find(".selectInit").empty();
		linkage(config);
        _this.find('#sex').prop('selectedIndex', 0);
	}
}

/**
 * 替换系统弹窗
 * @param {Object} text
 */
function alert(text){
	Vogsojs.alert(text);
}