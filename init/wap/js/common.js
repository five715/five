var _game = null;

$(function(){
	$(window).bind("resize load", function(){
		w = $(".box").width();
		if(w < 1000){			
			size = w / 64;
			$("html").css("font-size",size+"px");
		}
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