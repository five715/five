var Video = {};
Video.EVR = "1.0.0";
Video.Event = {
	VIDEO_ENDED : "videoEnded"
}
Video.main = function(canvas){
	var _this = this;
	var FPS = 25;
	var WIDTH = 640,
		HEIGHT = 1138,
		TOP = 0;		//手机顶部菜单高
	var VIDEO_WIDTH = 1080,
		VIDEO_HEIGHT = 540;
	var __video = null;
	_this.init = function(){
		_this.Stage_constructor(canvas);//继承stage
		createjs.Ticker.setFPS = FPS;	//帧频
		createjs.Ticker.addEventListener('tick', _this);	//按照帧频更新舞台
		__video = new Video.Video("http://appmedia.qq.com/media/taibao1221/long.mp4");
		_this.videoCon();
		_this.addChild(__video);
		_this.resize();
	}
	_this.play = function(){
		__video.play();
	}
	_this.resize = function(){		
		width = $(window).width();
		height = $(window).height();
		var scale = 1;
		scale = width / WIDTH;
		TOP = (HEIGHT * scale - height);
		HEIGHT = HEIGHT - TOP;
		_this.y = -TOP/2;
		$(canvas).attr("height", HEIGHT);
		$(canvas).attr("width", WIDTH);
		__video.scaleX = __video.scaleY = WIDTH/VIDEO_WIDTH
	};
	_this.videoCon = function(){
		__video.regX = VIDEO_WIDTH/2;
		__video.regY = VIDEO_HEIGHT/2;
		__video.x = WIDTH/2;
		__video.y = HEIGHT/2;
		
		
		var cx = window.innerWidth / VIDEO_WIDTH;
		var cy = window.innerHeight / VIDEO_HEIGHT;
		var scaleX = WIDTH / VIDEO_WIDTH;
		var scaleY = HEIGHT / VIDEO_HEIGHT;
		if(cx > cy){
			__video.scaleX = __video.scaleY = scaleX;		
		}else{
			__video.scaleX = __video.scaleY = scaleY;
		}
	}
	_this.init(canvas);
}
Video.main.prototype = createjs.extend(Video.main, createjs.Stage);
Video.main = createjs.promote(Video.main, "Stage");

/**
 *	视频
 */
Video.Video = function(url){
	var _this = this;
	var _video = null;
	var __bitmap = null;
	var _lock = true;
	var _isqq = navigator.userAgent.toLowerCase();
	_this.init = function(url){
		_this.Container_constructor();	//构造
		_video = document.createElement("video");
		_video.setAttribute("playsinline", "playsinline");
		_video.setAttribute("webkit-playsinline", "webkit-playsinline");
		_video.src = url;
		_video.addEventListener("ended", onEnded);
//		_video.muted = true;
		console.log(_video);
		__bitmap = new createjs.Bitmap();
		__bitmap.image = _video;
		_this.addChild(__bitmap);
		_this.on("tick", onTick);
	};
	function onTick(e){
		console.log(_video.currentTime);
		$(".s").text(_video.currentTime);
		if(_video.currentTime >= 12){
			_video.currentTime = 10;
		}
	}
	_this.show =  function(){
		_this.visible = true;
	};
	_this.hide =  function(){
		_this.visible = false;
	};
	_this.unLock = function(){
		if(_lock){
			_video.play();
			_video.pause();
			_lock = false;
		}
	};
	_this.play = function(){
		if(_this.visible == false) _this.show();
		_video.play();
	};
	_this.stop = function(){
		_video.pause();
	};
	_this.end = function(){
		_video.currentTime = _video.duration;
	};
	_this.voidEnd = function(){
//		_this.stop()
		_video.currentTime = _video.duration;
	};
	_this.getCurrentTime = function(){
		return _video.currentTime;
	}
	_this.goToAndPlay = function(t){
//		_this.stop()
		_video.currentTime = t;
//		_video.play();
	}
	_this.goToAndStop = function(){
		_this.stop();
		_video.currentTime = 0
	}
	_this.mute = function(boolean){
		if(boolean){
			_video.muted = true;
		}else{
			_video.currentTime = 0;
			_video.muted = false;
		}
	}
	function onEnded (e) {
		//_this.voidEnd();
		var evt = new createjs.Event(Video.Event.VIDEO_ENDED);
		_this.dispatchEvent(evt);
	}
	this.init(url);
};
Video.Video.prototype = createjs.extend(Video.Video, createjs.Container);
Video.Video = createjs.promote(Video.Video, "Container");