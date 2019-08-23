var Panorama = {};
Panorama.VER = "1.0.0";
/**
 *	枚举，类型
 */
Panorama.kType = {
	DRAG: 0,
	GRAVITY: 1
}
Panorama.Event = {
	
}
/**
 *	预先加载
 */
Panorama.Preload = {
	_queue : null,	//loder
	_images : [
		{id:"bg",src:"panorama_bg.jpg"}
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
Panorama.main = function(canvas){
	var _this = this;
	var WDITH = 0,
		HEIGHT = 0;
	var __camera = null,
		__scene = null,
		__room = null,
		__randerer = null;
	var _controls = null,
		_controls2 = null,
		_mouseControls = null;
	var _raycaster = new THREE.Raycaster(),	//射线
		_objects = [];	//检测元素
	_this.init = function(container){
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		__camera = new THREE.PerspectiveCamera(70,WIDTH/HEIGHT,1,1000)
		
		__scene = new THREE.Scene();
		
		__room = new THREE.Object3D();
		
		__scene.add(__room);
		
		__renderer = new THREE.WebGLRenderer({
			canvas:container,
			antialias : true
		})
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		window.addEventListener("resize",onWindowResize,false);
		
	}
	_this.launch = function(){
		
	}
	/**
	 * 鼠标控制器
	 */
	_this.mouseControl = function(){
		_mouseControls = new THREE.TrackballControls(__camera,__renderer.domElement );
	}
	/**
	 * 陀螺仪控制器
	 */
	_this.controls = function(type, limit){
		if(type = Panorama.kType.GRAVITY){
			_controls = new THREE.DeviceOrientationControls(__camera);	//加载陀螺仪
			_controls2 = new THREE.rotaControls(__room, __renderer.domElement);
		}else{
			_controls = new THREE.AntiMeshControls(__camera, __renderer.domElement, limit);
		}
//		__renderer.domElement.addEventListener( 'click', onClick, false );
//		__renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
	}
	/**
	 * 点击
	 */
	function onClick( e ) {
		e.preventDefault();
		hitTest( e.clientX, e.clientY );
	}
	function onTouchStart (e) {
		e.preventDefault();
		hitTest( e.touches[0].clientX, e.touches[0].clientY );
	}
	/**
	 * 碰撞检测
	 */
	function hitTest(x,y){
		var mouse = {};
		mouse.x = ( x / window.innerWidth ) * 2 - 1;
		mousu.y = -( y / window.innerHeight ) * 2 + 1;
		_raycaster.setFromCamera( mouse, __camera );
		var intersects = _raycaster.intersectObjects( _objects );
		if ( intersects.length > 0 ) {
			var obj = intersects[ 0 ].object;
			console.log(obj)
		}
	}
	/**
	 * 手机旋转
	 */
	function onWindowResize(){
		__camera.aspect = $(window).width() / $(window).height();
		__camera.updateProjectionMatrix();
		__renderer.setSize($(window).width(),$(window).height());
	}
	/**
	 * 更新
	 */
	function animate(){
		requestAnimationFrame(animate);
		TWEEN.update();
		if(_controls) _controls.update();
		if(_controls2) _controls2.update();
		if(_mouseControls) _mouseControls.update();
		__renderer.render(__scene, __camera)
	}
	_this.init(canvas);
}
Object.assign( Panorama.main.prototype, THREE.EventDispatcher.prototype);
Panorama.main.prototype.constructor = Panorama.main;
