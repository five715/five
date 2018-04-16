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
	}
}
