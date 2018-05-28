$(function(){
/*---------------All---------------*/
testDriveInit()
/*---------------头图---------------*/


})
/*---------------验证---------------*/
function verify(){
	// 验证姓名
    var name = $(".testDrive .name input").val();
    if (validName(name)){
    	if(name=="请输入姓名"){
            alert("请输入姓名");
            return false
        }
    }else {
        alert("请输入正确的姓名");
        return false
    }
    //验证电话号码是否正确
    var phone = $(".testDrive .phone input").val();
    if (validPhone(phone)){
    }else {
    	if(phone == "请输入电话"){
    		alert("请输入手机号码");
	        return false;
    	}else{	
    	    alert("请输入正确的手机号码");
	        return false;
    	}
    }
    //验证邮箱是否正确
    var email = $(".popup_info .email input").val();
    if (!validEmail(email)){
	    alert("请输入有效的邮箱地址");
        return false;
    }
    //时间
    var time= $(".testDrive .time .span").text();
    if(time == "请选择时间"){
        alert("请选择时间");
        return false
    }
    //车型
    var audi= $(".testDrive .audi .span").text();
    if(audi == "请选择车型"){
        alert("请选择车型");
        return false
    }
    //数据保存
    var data = {
    	name	: name,
    	phone	: phone,
    	time	: time,
    	audi	: audi
    }
    alert("保存成功")
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
	//email的验证
	function validEmail(email){
		var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return pattern.test(email);
	}
}
/*---------------Function---------------*/
function testDriveInit(number){
	if(!number) number = "all";
	if(number == "name" || number == "all" ) $(".address .name input").val("");
	if(number == "phone" || number == "all" ) $(".address .phone input").val("");
	if(number == "pro" || number == "all" ) $(".address .pro .span").text("XX省")
	if(number == "city" || number == "all" ) $(".address .city .span").text("XX市");
	if(number == "addr" || number == "all" ) $(".address .addr textarea").val("");
	if(number == "config" || number == "all" ) {
		$(".testDrive .selectInit").empty();
		linkage(config)
	}
}
//视频
function funcPlayer(vid,id,w,h){
	//暂停上一个视频
	if(_player) _player.pause()
	//加载视频
	var video = new tvp.VideoInfo();
	video.setVid(vid);
	var player =new tvp.Player();
	player.create({
		width : w || $("#" + id).width(),
		height : h || $("#" + id).height(),
		video : video,
		modId : id,
		autoplay : true,
        flashWmode:"opaque",
        onwrite:function(){
        	_player = player	
        }
	});
}
//轮播图
function funcSlick(obj,prev,next){
	obj.attr("data-slick","yes");
	obj.slick({
        dots: true,
        infinite: true,
        arrows: true,
        draggable: false,
        prevArrow: obj.find(prev),
        nextArrow: obj.find(next),
        autoplay:!1
    });
}
//滚动条
function funcScroll(obj){
    obj.jScrollPane(
        {
            verticalDragMinHeight: 50,
            verticalDragMaxHeight: 80
        }
    );
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
//导航视频
function funcNavsPlayer(cla){
	var _cla = cla || "active";
	//导航
	$(this).siblings().removeClass(_cla)
	$(this).addClass(_cla)
	//视频
	var number = $(this).addClass(_cla).index();
	var player = $(this).parent().next().attr("id")
	var vid = vids[player][number];	
	funcPlayer(vid,player)
}
