var _game = null;

$(function(){
	$(window).bind("resize load", function(){
		w = $(".box").width();
		if(w < 1000){			
			size = w / 64;
			$("html").css("font-size",size+"px");
		}
	})
	Car.Preload.load(progress, complete);
})
/**
 * 加载中
 */
function progress(e){
	var per = Math.floor(e.loaded*100);
	$(".per").text(per)
}
/**
 * 加载完成
 */
function complete(e){
	_game = new Car.main($("#car")[0]);
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
