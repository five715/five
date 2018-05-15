var Dream = {};
Dream.VER = "1.0.0";
Dream.Event = {
	
}
/**
 *	预先加载
 */
Dream.Preload = {
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
		this._queue.loadManifest(this._images, false, "images/");
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
Dream.main = function(canvas){
	var _this = this;
	var FPS = 60;
	_this.init = function(){
		_this.Stage_constructor(canvas);//继承stage
		createjs.Ticker.setFPS = FPS;	//帧频
		createjs.Ticker.addEventListener('tick', _this);	//按照帧频更新舞台
		createjs.Touch.enable(_this);	//启用tauch
		
		
	}
	_this.init(canvas);
}
Dream.main.prototype = createjs.extend(Dream.main, createjs.Stage);
Dream.main = createjs.promote(Dream.main, "Stage");

/**
 * 声音
 */
Dream.Sound = function(id,loo) {
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
Dream.Sound.prototype = createjs.extend(Dream.Sound, createjs.Container);
Dream.Sound = createjs.promote(Dream.Sound, "Container");


/**
 *	视频
 */
Dream.Video = function(url){
	var _this = this;
	var _video = null;
	var __bitmap = null;
	var _lock = true;
	_this.init = function(url){
		_this.Container_constructor();	//构造
		_video = document.createElement("video");
		_video = url;
		_video.setAttribute("playsinline", "playsinline");
		_video.setAttribute("webkit-playsinline", "webkit-playsinline");
		_video.addEventListener("ended", onEnded);
		var myBuffer = new createjs.VideoBuffer(_video);
		__bitmap  = new createjs.Bitmap(myBuffer);	
		_this.visible = false;
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
		var evt = new createjs.Event(Dream.Event.VIDEO_ENDED);
		_this.dispatchEvent(evt);
	}
	this.init(url);
};
Dream.Video.prototype = createjs.extend(Dream.Video, createjs.Container);
Dream.Video = createjs.promote(Dream.Video, "Container");


Dream.Bg = function(canvas){
	var _this = this;
	_this.init = function(){
		_this.Container_constructor();	//构造
		
		
	}
	_this.init(canvas);
}
Dream.Bg.prototype = createjs.extend(Dream.Bg, createjs.Container);
Dream.Bg = createjs.promote(Dream.Bg, "Container");


/**
 * 公用
 */
Dream.common = {
	SCALE : 1,
	FEAMERATE : 8,
	INTERVAL : 1000,
	/**
	 * 雪碧图控制 
	 */
	startSpritSheet : function(obj){
		obj.play();
		obj.visible = true;
	},
	endSpritSheet : function(obj,boolean){
		obj.stop();
		if(!boolean) obj.visible = false;
	},
	/**
	 * 动画帧
	 */
	objTween : function(obj,objTo,func,boolean){
		Cartoon.common.startSpritSheet(obj);
		createjs.Tween.get(obj)
			.to({x : objTo.x, y : objTo.y},objTo.i ? Cartoon.common.INTERVAL * objTo.i : Cartoon.common.INTERVAL)
			.call(function(){
				func();
				Cartoon.common.endSpritSheet(obj,boolean);
			})
	},
	/**
	 * 添加雪碧图
	 */
	addSprite : function(id, obj){
		if(!obj.s) obj.s = Cartoon.common.SCALE;
		if(!obj.f) obj.f = Cartoon.common.FEAMERATE;
		var data = {
			images : [Cartoon.Preload.getResult(id)],
			frames : { width : obj.w, height : obj.h},
			framerate : obj.f
		};
		var spriteSheet = new createjs.SpriteSheet(data);
		var sheet = new createjs.Sprite(spriteSheet);
		sheet.scaleX = sheet.scaleY = obj.s;
		sheet.visible = false;
		if(obj.p){
			sheet.visible = true;
			sheet.play();
		}
		sheet.x = obj.x;
		sheet.y = obj.y;
		return sheet;
	},
	/**
	 * 添加图片
	 */
	addBitmap : function(id, obj){
		if(!obj.v) obj.v = false;
		var bit = new createjs.Bitmap(Cartoon.Preload.getResult(id));
		bit.x = obj.x;
		bit.y = obj.y;
		bit.visible = obj.v;
		return bit;
	},
	/**
	 * 添加热区
	 */
	addShape : function(obj){
		var shape = new createjs.Shape();
		shape.graphics.f( "rgba(0,0,0,1)" )
    			.dr( obj.x, obj.y, obj.w, obj.h )
  		return shape;
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
			Dream.common._sound = document.getElementById("bell");
			if(!Dream.common._sound) loadVideo();
		    Dream.common._sound.play();
//		    alert(Dream.common._sound)
		    Dream.common._sound.pause();
			Dream.common._sound.currentTime = 0
		}
	}
}
