var Car = {};
Car.VER = "1.0.0";
Car.Event = {
	
}
Car.portrait = true;
/**
 *	预先加载
 */
Car.Preload = {
	_queue : null,	//loder
	_images : [
	
	],
	/**
	 *	初始化
	 */
	init : function(){
		this._queue = new createjs.LoadQueue(true);
		
		for(var i = 0 ; i < 72;i++){
			var images = {};
			images.id = 'car'+i;
			images.src = 'yin_se.'+i+'.png';
			this._images.push(images)
		}
		this._queue.loadManifest(this._images, false, "images/car_yin/");
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

Car.main = function(canvas){
	var _this = this;
	var FPS = 60; 
	var WIDTH = 0,
		HEIGHT = 0;
	var __flsah = null;
	var _initY = 0,
		_endY = 0;
	var _nowFrame = 1,				//当前帧
		_agoFrame = 1;				//之前帧
	var _dt = 0,
		_ease = 100;				
	var _isDown = false,			//是否向下缓动
		_isUp = false,				//是否向上缓动
		_isAutoPlay = false,		//是否自动播放
		_isMoveDown = false,		//是否向下移动
		_isMoveUp = false;			//是否向上移动
	var SPEED = 1,					//每次移动帧
		_timer = null;				
	var _timerPrefix = "_timer",	//缓动定时器前缀
		_objTimeout = {};			//组
	var R = 71;
	var _bgm = null;
	
		
	
	_this.init = function(canvas){
		WIDTH = canvas.width;
		HEIGHT = canvas.height
		_this.Stage_constructor(canvas);//继承stage
		createjs.Ticker.setFPS(FPS);//帧频
		createjs.Ticker.addEventListener('tick', _this);	//按照帧频更新舞台
		createjs.Touch.enable(_this);	//启用tauch
		
		__flash = new Car.Graph();
		__sounds = new createjs.Container();
		
		var bg = new createjs.Shape();
		bg.graphics.f("rgba(255,203,221,1)").dr(0,0,WIDTH,HEIGHT)
		_this.addChild(bg,__flash)
      	_this.addEventListener("tick",onTick)
      	_isAutoPlay = true;
      	_this.launch();
	}
	/**
	 * 开始
	 */
	_this.launch = function(){
		_this.addEventListener("mousedown", onMouseDown);
		_this.addEventListener("pressmove", onPressMove);
		_this.addEventListener("pressup", onPressUp);
	}
	/**
	 *	按下
	 */
	function onMouseDown (e) {
		_initY = _endY = Car.portrait?e.stageX:e.stageY;
		_timer = setInterval(function(){
			_initY = _endY
		},300)
		for (t in _objTimeout) {
			clearTimeout(_objTimeout[t])
			delete _objTimeout[t]
		}
	}
	/**
	 *	拖动
	 */
	function onPressMove (e) {
		var y = Car.portrait?e.stageX:e.stageY;
		if(_endY - y > 0){
			_isMoveDown = true
			_isMoveUp = false
		}else{
			_isMoveDown = false
			_isMoveUp = true
		}
		_endY = y
	}
	/**
	 * 抬起
	 */
	function onPressUp(e){
		clearInterval(_timer)
		_isMoveDown = false
		_isMoveUp = false
		var s = parseInt((_initY-_endY)/2);
		if(s>0){
			_dt = s;
			_isUp = false;
			_isDown = true;
		}else{
			_dt = -s;
			_isDown = false;
			_isUp = true;
		}
		_ease = 0//_dt>100?100:_dt;
		update(_dt>100?100:_dt)
	}
	/**
	 * 设置帧
	 */
	function setFrame(){
		__flash.onGoToAndStop(_nowFrame)
		_agoFrame = _nowFrame
	}
	/**
	 * 自动播放结束
	 */
	function endAutoPlay(){
		_isAutoPlay = false;
	}
	/**
	 * 缓动
	 * @param {Object} dt
	 */
	function update(dt) {
		var time = new Date().getTime();
	    let v = (_ease)/100
	    _ease += 1
	    let value = Math.pow(v, 5) * 40
//	    console.log(value,dt)
	    if(_ease > dt){
	    	return false
	      	_isDown = false;
			_isUp = false;
	    }else{
	    	_isDown?_nowFrame+=SPEED:_nowFrame-=SPEED
	    }
	    _objTimeout[_timerPrefix+time] = setTimeout(function(){
			_isDown?_nowFrame+=SPEED:_nowFrame-=SPEED
			setFrame()
			update(dt)
			delete _objTimeout[_timerPrefix+time]
		},value)
	}
	function onTick() {
		if(_isMoveDown || _isAutoPlay)	_nowFrame+=SPEED;
		if(_isMoveUp)	_nowFrame-=SPEED;
		if(_nowFrame < 0) _nowFrame = R;
		if(_nowFrame > R) _nowFrame = 0;
		if(_isAutoPlay && _nowFrame>=4) endAutoPlay()
//		$(".b").html(_nowFrame)
		if(_bgm) _bgm.onTick();
		setFrame()
		_isMoveDown = false
		_isMoveUp = false
	}
	_this.init(canvas);
}
Car.main.prototype = createjs.extend(Car.main, createjs.Stage);
Car.main = createjs.promote(Car.main, "Stage");


/**
 *	mc
 */
Car.Graph = function(cate,loo,fix){
	var _this = this;
	
	var _index = 1,			//图片编号
		_expire = 0,		//上次播放时间
		DURATION = 50,		//没100毫秒一帧
		_lastFrame = 71;	//停止帧	
	var __bit = null;		//bitmap
	var _cate = cate;		//动画编号
	var _loop = true,	//循环总帧//空不循环
		_fix = ""		//前缀
	
	var _pauseFame = {
			"20" :[[1,8],[16,20],[31,37]]
		},
		_nowPauseFame = _pauseFame[cate];
	var _isJump = false;
	

	_this.init = function (fix) {
		if(fix) _fix = fix;
		_this.Container_constructor();
		
		__bit = new createjs.Bitmap(Car.Preload.getResult('car1'))
		_this.addChild(__bit);
//		playing();
	};
	function playing () {
		if(_index == _lastFrame){
			var evt = new createjs.Event(Car.Event.CARTOON_END);
			_this.dispatchEvent(evt);
		}
		if(_index == _lastFrame){
			_index = 0
//			return;
		}
		setImage(_index);
		_index++;
		_expire = new Date().getTime();
	}
	_this.onGoToAndStop = function(n){
		console.log(n)
		setImage(n)
	}
	/**
	 *	设置图片
	 */
	function setImage(index){
		if(_this.numChildren > 2) _this.removeChildAt(0);
		setTimeout(playing, DURATION);
		if(_this.pause(index)) return
		__bit.image = Car.Preload.getResult('car'+index)
		
	}
	/**
	 * 跳过帧
	 */
	_this.pause = function(index){
		if(_nowPauseFame){
			for(var i = 0 ; i < _nowPauseFame.length;i++){
				if(_nowPauseFame[i][0] < index && index <= _nowPauseFame[i][1]){
					return true;
				}
			}
		}
	}
	function imgLoaded (e) {
		var img = e.target;
		var delay = _expire + DURATION - new Date().getTime();
		$("#pre").text(delay)
		if(delay < 0){
			playing();
		}else{
			setTimeout(playing, DURATION);
		}
	}
	_this.init(fix);
};
Car.Graph.prototype = createjs.extend(Car.Graph, createjs.Container);
Car.Graph = createjs.promote(Car.Graph, "Container");
