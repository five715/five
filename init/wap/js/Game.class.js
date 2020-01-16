var Game = {};
Game.VER = "1.0.0";
Game.Event = {
	
}
/**
 *	预先加载
 */
Game.Preload = {
	_queue : null,	//loder
	_images : [
	],
	_sounds : [
	
	],
	/**
	 *	初始化
	 */
	init : function(){
		this._queue = new createjs.LoadQueue(true);
		this._queue.loadManifest(this._images, false, "res/");
//		this._queue.loadManifest(this._sounds, false, "");
//		createjs.Sound.registerSounds(this._sounds);
	},
	/**
	 *	加载
	 */
	load : function(progress, complete){
		if(!this._queue) this.init();
		if(progress)this._queue.on("progress", progress, this);//资源载入中
		if(complete)this._queue.on("complete", complete, this);//资源载入完毕
		this._queue.load();
	},
	/**
	 *	获取loader
	 */
	getQueue : function(){
		return this._queue;
	},
	/**
	 *	获取文件实体
	 */
	getResult : function(id){
		return this._queue.getResult(id);
	}
};

/**
 * 主函数
 */
Game.main = function(canvas){
	var _this = this;
	var FPS = 60;
	_this.init = function(){
		_this.Stage_constructor(canvas);//继承stage
		createjs.Ticker.setFPS = FPS;	//帧频
		createjs.Ticker.addEventListener('tick', _this);	//按照帧频更新舞台
		createjs.Touch.enable(_this);	//启用tauch
		
		
	}
	/**
	 *	尺寸变化
	 */
	_this.resize = function(){
		width = $(window).width();
		height = $(window).height();
		var scale = 1;
		if(width > height){
			$("#canvas").attr("height", HEIGHT);
			$("#canvas").attr("width", WIDTH);
			scale = width / WIDTH;
			_this.x = 0
			_this.y = -(HEIGHT * scale - height);
			_this.rotation = 0;	
		}else{
			$("#canvas").attr("height", WIDTH);
			$("#canvas").attr("width", HEIGHT);
			scale = width / HEIGHT;
			_this.x = HEIGHT;
			_this.y = -(WIDTH * scale - height) / scale
			_this.rotation = 90;
		}
	};
	_this.init(canvas);
}
Game.main.prototype = createjs.extend(Game.main, createjs.Stage);
Game.main = createjs.promote(Game.main, "Stage");

/**
 * 声音
 */
Game.Sound = function(id,loo) {
	var _this = this;
	var __sound = null,
		_loop = loo;
	_this.init = function(id) {
		_this.Container_constructor(); //构造
		__sound = new createjs.Sound.play(id,{loop:_loop});
		_this.on("tick", onTick)
	}
	_this.getDuration = function(){
		return __sound._playbackResource.duration+0.5
	}
	_this.play = function(){
		__sound.play()
	}
	_this.stop = function(){
		_loop = false;
		__sound.stop();
	}
	function onTick(e){
		_this.removeEventListener("tick", onTick)
		if(_loop) __sound.play();
	}
	_this.init(id)
}
Game.Sound.prototype = createjs.extend(Game.Sound, createjs.Container);
Game.Sound = createjs.promote(Game.Sound, "Container");

/**
 *	视频
 */
Media.Video = function(url){
	var _this = this;
	var _video = null;
	var __bitmap = null;
	var _lock = true;
	_this.init = function(url){
		_this.Container_constructor();	//构造
		_video = document.createElement("video");
		_video.src = url;
		_video.setAttribute("playsinline", "playsinline");
		_video.setAttribute("webkit-playsinline", "webkit-playsinline");
		_video.addEventListener("ended", onEnded);
		console.log(_video);		
		__bitmap = new createjs.Bitmap();
		__bitmap.image = _video;
//		var myBuffer = new createjs.VideoBuffer(_video);
//		__bitmap  = new createjs.Bitmap(myBuffer);
//		_this.visible = false;
		_this.addChild(__bitmap);
//		_this.on("tick", onTick);
	};
	function onTick(){
		console.log(_video.currentTime);
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
	_this.getCurrentTime = function(){
		return _video.currentTime;
	}
	_this.play = function(){
		if(_this.visible == false) _this.show();
		_video.play();
	};
	_this.gotoPlay = function(t){
		_video.currentTime = t;
		if(_this.visible == false) _this.show();
		_video.play();
	};
	_this.stop = function(){
		_video.pause();
	};
	_this.end = function(){
		_video.currentTime = _video.duration - 1;
	};
	_this.voidEnd = function(){
		_video.currentTime = 0;
//		_video.currentTime = _video.duration - 1;
	};
	function onEnded (e) {
		_this.voidEnd();
		var evt = new createjs.Event(Media.Event.Media_ENDED);
		_this.dispatchEvent(evt);
	}
	this.init(url);
};
Media.Video.prototype = createjs.extend(Media.Video, createjs.Container);
Media.Video = createjs.promote(Media.Video, "Container");

Game.Bg = function(canvas){
	var _this = this;
	_this.init = function(){
		_this.Container_constructor();	//构造
		
		
	}
	_this.init(canvas);
}
Game.Bg.prototype = createjs.extend(Game.Bg, createjs.Container);
Game.Bg = createjs.promote(Game.Bg, "Container");


/**
 * 公用
 */
Game.common = {
	SCALE: 1,
	FEAMERATE: 8,
	INTERVAL: 1000,
	// FONT: "st",
	FONT: "宋体",
    /**
     * 添加雪碧图
     */
	addSprite: function (obj) {
		// console.log(obj)
		if (!obj.s) obj.s = Game.common.SCALE;
		if (!obj.f) obj.f = Game.common.FEAMERATE;
		var data = {
			images: [Game.Preload.getResult(obj.id)],
			frames: { width: obj.w, height: obj.h },
			framerate: obj.f
		};
		var spriteSheet = new createjs.SpriteSheet(data);
		var sheet = new createjs.Sprite(spriteSheet);
		if (obj.name) sheet.name = obj.name
		sheet.play();
		sheet.x = obj.x;
		sheet.y = obj.y;
		// console.log(sheet)
		return sheet;
	},
	/**
	 * Container
	 */
	addContainer: function (obj) {
		var con = new createjs.Container();
		if (obj.attr) con.attr = obj.attr
		if (obj.x) con.x = obj.x;
		if (obj.y) con.y = obj.y;
		obj.x = obj.y = null;
		var ioc = Game.common.addBitmap(obj);
		con.addChild(ioc);
		return con;
	},
	/**
	 * 添加图片
	 */
	addBitmap: function (obj) {
		if (!obj.v) obj.v = true;
		var bit = new createjs.Bitmap(Game.Preload.getResult(obj.id));
		if (obj.name) bit.name = obj.name
		if (obj.regX) bit.regX = obj.regX / 2
		if (obj.regY) bit.regY = obj.regY / 2
		if (obj.x) bit.x = obj.x + bit.regX;
		if (obj.y) bit.y = obj.y + bit.regY;
		bit.visible = obj.v;
		return bit;
	},
	/**
	 * 添加热区
	 */
	addShape: function (obj, op) {
		if (!op) op = 0.01
		var shape = new createjs.Shape();
		shape.graphics.f("rgba(0,0,0," + op + ")")
			.dr(obj.x, obj.y, obj.width, obj.height)
		return shape;
	},
	/**
	 * 添加文字
	 */
	addText: function (obj) {
		var text = new createjs.Text(obj.t || '-', (obj.f ? obj.f : 42) + "px " + Game.common.FONT, obj.c || "#000000");
		text.textAlign = obj.ta || "center";
		if (obj.tb) text.textBaseline = "middle";
		text.x = obj.x || 0;
		text.y = obj.y || 0
		// console.log(text)
		return text;
	},
	weixinSound: function(){
		var browser = {
		    versions: function () {
		        var u = navigator.userAgent, app = navigator.appVersion;
		        return {
		            webKit: u.indexOf('AppleWebKit') > -1,
		            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
		            weixin: u.indexOf('MicroMessenger') > -1,
		            txnews: u.indexOf('qqnews') > -1,
		            sinawb: u.indexOf('weibo') > -1,
		            mqq: u.indexOf('QQ') > -1
		        };
		    }(),
		    language: (navigator.browserLanguage || navigator.language).toLowerCase()
		};
		
		// ios下的微信和qq自动播放视频
		if (browser.versions.ios && (browser.versions.weixin || browser.versions.mqq)) {
		    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
		        //已经错过事件不能再自动播放
		    } else {
		        if (document.addEventListener) {
		            document.addEventListener("WeixinJSBridgeReady", loadVideo, false);
		        } else if (document.attachEvent) {
		            document.attachEvent("WeixinJSBridgeReady", loadVideo);
		            document.attachEvent("onWeixinJSBridgeReady", loadVideo);
		        }
		    };
		}
		//加载视频
		function loadVideo() {
			Game.common._sound = document.getElementById("bell");
			if(!Game.common._sound) loadVideo();
		    Game.common._sound.play();
//		    alert(Game.common._sound)
		    Game.common._sound.pause();
			Game.common._sound.currentTime = 0
		}
	}
}
