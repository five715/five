var Car = {};
Car.VER = "1.0.3";

/**
 *	主体
 */
Car.main = function(id){
	var _this = this;
	var _game = null,
		_stage = null,
		_container = null;
	var _enable = true,
		_sid = 0,
		_swipeInitX = 0,
		_slickIndex = 0;
	var _timer = null;
	var SWIPE_LIMIT = 10;
	var OBJ = [
		{ x: 0, z: 10 },
		{ x: -14, y: 5, z: -70 },
		{ x: 14, y: 5, z: -70},
		{ x: 0, z: 10}
	]
	var _isDot = true,
		INTERVAL = 5000;
	_this.init = function(id) {
		_game = $(id).parents();
		_stage =  $(id);
		_container = _stage.find(".container");
		controls();
//		console.log(_stage.find("img"))
		var dots = [];
		var dot = '<div class="dot">\
			<img src="images/light_dot_yes.jpg" class="yes"/>\
			<img src="images/light_dot_no.png" class="no"/>\
		</div>'
		for(var i = 0 ; i < _stage.find("img").length ; i ++) {
			_stage.find("img").eq(i)[0].ondragstart = imgdragstart
			dots.push(dot)
		}
		if(_isDot){
			_game.find(".dots").html(dots.join(''));
			_game.find(".dots .dot").on('click',function(){_this.show($(this).index())})
		}
		_this.start();
	};
	_this.start = function(){
		_this.show(0);
		_enable = true;
		_this.setInterval()
	};
	_this.setInterval = function(){
		_sid = setInterval(autoPlay, INTERVAL);
	}
	function autoPlay () {
		_this.show(++_slickIndex);
	}
	function controls () {
		$("#slick_3d").on("touchstart mousedown", function(e){
			clearInterval(_sid);
			_swipeInitX = e.clientX || e.originalEvent.changedTouches[0].clientX;
		});
		$("#slick_3d").on("touchend mouseup", function(e){
			var x = _swipeInitX - (e.clientX || e.originalEvent.changedTouches[0].clientX);
			if(Math.abs(x) > SWIPE_LIMIT){
				_this.setInterval()
				if(x > 0) _this.show(_slickIndex+1);
				if(x < 0) _this.show(_slickIndex-1);
			}
		});
	}
	_this.show = function (index) {
//		console.log(_enable)
		if(!_enable) return;
		_enable = false;
		index = correct(index);
		_slickIndex = index;
		_this.dots(_slickIndex);
		var left = correct(index-1);
		var right = correct(index+1);
		_container.find(".item").css("transition","transform 0.5s");
		_container.find(".item").hide();
		_container.find(".item").eq(index).show();
		_container.find(".item").eq(left).show();
		_container.find(".item").eq(right).show();
		_container.find(".item").css("transform", getTranslateStr());
//		_container.find(".item").css("opacity", 0.6);
//		_container.find(".item").eq(index).css("opacity", 1);

		_container.find(".item").css({"filter":"blur(2px)","border":"","z-index":1});
		_container.find(".item").eq(index).css({"filter":"blur(0px)","border":"1px #ffffff solid","z-index":2});
		
		_container.find(".item").eq(index).css("transform", getTranslateStr(0));
		_container.find(".item").eq(left).css("transform", getTranslateStr(-1));
		_container.find(".item").eq(right).css("transform", getTranslateStr(1));
		_container.find(".item").eq(index).one("transitionend", function (e) {
//			console.log(e);
			_enable = true;
			clearTimeout(_timer)
		});
		_timer = setTimeout(function(){_enable = true;},1000)
	}
	_this.dots = function(index){
		$(".dots .dot").removeClass("active")
		$(".dots .dot").eq(index).addClass("active")
		$(".light .text img").attr("src","images/light_text_"+(index+1)+".png")
	}
	_this.prev = function(){
		clearInterval(_sid);
		_this.show (_slickIndex - 1);
	};
	_this.next = function(){
		clearInterval(_sid);
		_this.show (_slickIndex + 1);
	};
	function correct(index) {
		var last = _container.find(".item").length - 1;
		if(index < 0) index = last;
		if(index > last) index = 0;
		return index;
	}
	function getTranslateStr (index) {
		var obj = judge(index);
		if(!obj.y)  obj.y = 0
		var str = "translate3d("+ obj.x +"%,"+ obj.y +"%,"+ obj.z +"px)";
		return str;
	}
	function judge(index){
		var n = 0;
		if(index == 0){
			n = 0;
		}else if(index < 0){
			n = 1;
		}else if(index > 0){
			n = 2;
		}else{
			n = 3;
		}
		return OBJ[n];
	}
	function imgdragstart() {
		return !1
	}
	_this.init(id);
};