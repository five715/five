var Demo = {};
Demo.VER = "1.0.0";
/**
 *	枚举，类型
 */
Demo.kType = {
	DRAG: 0,
	GRAVITY: 1
}
Demo.Event = {
	YANHUA_OVER :"yanhuaOver"
}
/**
 *	预先加载
 */
Demo.Preload = {
	_queue : null,	//loder
	_images : [
	],
	_sounds : [
	
	],
	/**
	 *	初始化
	 */
	init : function(){
		for(var images = [],i = 1 ; i < 65 ; i ++){
			var obj = {id:"y"+i,src:'yanhua_'+i+'.png'};
			
			images.push(obj)
		}
		this._queue = new createjs.LoadQueue(true);
		this._queue.loadManifest(images, false, "res/");
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
Demo.main = function(canvas){
	var _this = this;
	var WIDTH = 414,
		HEIGHT = 736;
	var FPS=60;
	var __camera = null,	//摄像头
		__scene = null,		//场景
		__room = null,
		__renderer = null;	//渲染器
	var _controls = null,
		_controls2 = null;
	var _raycaster = new THREE.Raycaster(),	//射线
		_objects = [];	//检测元素
	var _mouseControls = null;
	var CAMERA_ORIGIN = new THREE.Vector3(0, 0, 1);
	var CAMERA = {
		x : 0,
		y : 0,
		z : 0,
		fov : 50,
		near : 10,
		far : 2000
	}
	
	var _angle = 0,
		_radian = 0
	var _tween = false;
	_this.init = function(container){
//		_this.Stage_constructor(container); //继承stage
//		createjs.Ticker.setFPS = FPS; //帧频
//		createjs.Ticker.addEventListener('tick', _this); //按照帧频更新舞台
		
		
		__camera = new THREE.PerspectiveCamera(
			CAMERA.fov,
			WIDTH/HEIGHT,
			CAMERA.near,
			CAMERA.far)
		__camera.position.copy(CAMERA_ORIGIN);
		
		__room = new THREE.Object3D();
		__scene = new THREE.Scene();
		
		__scene.add(__room);
		__renderer = new THREE.WebGLRenderer({
			canvas: container,
			antialias: true,
			alpha:false
		});
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		var light = new THREE.AmbientLight( 0xffffff , 0.8);
		__scene.add(light);
		lightInit();
//		_this.setView();
//		_this.controls();
		_this.control();
		animate();		
	}
	_this.removeYanhua = function(){
		console.log(__room)
		__room.remove()
	}
	_this.launch = function(){
//		botany = new Demo.Botany(Demo.Preload.getResult("img"));
//		__scene.add(botany)
		
		
//		for(var i = 30 ; i > 0 ; i --){
//			__scene.add(setPos(i--,true,20));
//			__scene.add(setPos(i,false,20));
//		}
		var i = 300;
		var t = setInterval(function(){
			var geometry = new THREE.SphereGeometry( 5, 30, 30 );
			var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
			var sphere = new THREE.Mesh( geometry, material );
			sphere.name = sphere.id = "g"+i;
			
			_objects.push(sphere);
        	sphere.position.x= -500;
        	
        	var radian = i*25//THREE.Math.degToRad(i*3);
        	var radian1 = THREE.Math.degToRad(i);
        	var r = 500;
//      	console.log(radian);
        	new TWEEN.Tween(sphere.position)
        		.to({
//      			x:100*Math.sin(radian),
//      			z:100*Math.cos(radian),
//      			y:20*Math.sin(-radian+1)*Math.cos(-radian+1)
        			x:r*Math.sin(radian)*Math.cos(i),
					y:r*Math.sin(radian)*Math.sin(i),
					z:r*Math.cos(radian)
        		},1000)
        		.repeat(1)
        		.onComplete(a)
        		.start();
        	__scene.add(sphere);
			i--
			if(i<0) clearInterval(t)
		},5)
	}
	function a (){
		if(_tween) return;
		_tween = true;
//		_this.control();
	}
	//假贝塞尔
	function setPos(i,bol,r){
		var geometry = new THREE.SphereGeometry( 1, 30, 30 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.name = sphere.id = "l"+i;
        var radian = THREE.Math.degToRad(i*6);
        var fluctuate = 4
        sphere.position.x = 100*Math.sin(bol?-radian:radian);
        sphere.position.z = 100*Math.cos(radian);
        sphere.position.y = r*Math.sin(-radian*fluctuate);
        return sphere;
	}
	/**
	 * 设置背景
	 */
	_this.setView = function(image){
		var view = new Demo.View(image);
		__room.add(view);
	}
	_this.controls = function(){
		_mouseControls = new THREE.TrackballControls(__camera);
		__renderer.domElement.addEventListener( 'click', onClick, false );
		__renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
	}
	/**
	 * 控制
	 */
	_this.control = function(type, limit){
		if(type = Demo.kType.GRAVITY){
			_controls = new THREE.DeviceOrientationControls(__camera);	//加载陀螺仪
			_controls2 = new THREE.rotaControls(__room, __renderer.domElement);
		}else{
			_controls = new THREE.AntiMeshControls(__camera, __renderer.domElement, limit);
		}
		__renderer.domElement.addEventListener( 'click', onClick, false );
		__renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
	}
	/**
	 *	点击
	 */
	function onClick( e ) {
		e.preventDefault();
		hitTest( e.clientX, e.clientY );
	}
	function onTouchStart (e) {
		e.preventDefault();
		hitTest( e.touches[0].clientX, e.touches[0].clientY );
	}
	function hitTest(x,y){
		var mouse = {};
		mouse.x = ( x / WIDTH ) * 2 - 1;
		mouse.y = - ( y / HEIGHT ) * 2 + 1;
		_raycaster.setFromCamera( mouse, __camera );
		var intersects = _raycaster.intersectObjects( _objects );
		if ( intersects.length > 0 ) {
			var obj = intersects[ 0 ].object;
			console.log(obj,obj.id,obj.position);
			var pos= obj.position;
//			yanhua(pos)
			var botany = new Demo.Botany();
			botany.position.x = pos.x
			botany.position.y = pos.y
			botany.position.z = pos.z
			var middle = new THREE.Vector3( 0, 0, 0 );
			botany.lookAt(middle);
			__scene.add(botany);
		}
	}
	function lightInit(){
		dirLight = new THREE.DirectionalLight(0xfecd80,0.7);
		dirLight.position.set(-163,241,420);
		__scene.add(dirLight);
	}
	function animate(){
		requestAnimationFrame(animate);
		if(_mouseControls) _mouseControls.update();
		if(_controls)_controls.update();
		if(_controls2)_controls2.update();
		TWEEN.update();
		__renderer.clear();
		__renderer.render( __scene, __camera );
	}
	_this.init(canvas);
}
Object.assign( Demo.main.prototype, THREE.EventDispatcher.prototype);
Demo.main.prototype.constructor = Demo.main;
//Demo.main.prototype = createjs.extend(Demo.main, createjs.Stage);
//Demo.main = createjs.promote(Demo.main, "Stage");


/**
 * 添加药材
 */
Demo.Botany = function(pos){
	var _this = this;
	var _scale = 0.12;
	var _radius = 20;
	var __entity = null,
		__tip = null;
	var _isError = false,
		_enable = true;
	_this.init = function(pos){
		THREE.Object3D.call(_this);
		var i = 1;
		var texture = new THREE.Texture(Demo.Preload.getResult("y"+i));
		texture.needsUpdate = true;
		var geometry = new THREE.PlaneGeometry(64,64);
		var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true});
		__entity = new THREE.Mesh(geometry, material);
		_this.add(__entity);
		
		var tr = setInterval(function(){
			i++
			var t = new THREE.Texture(Demo.Preload.getResult("y"+i));
			t.needsUpdate = true;
			var m = new THREE.MeshPhongMaterial({map:t, side: THREE.DoubleSide, transparent: true});
			__entity.material = m;
			if(i>=64){
				console.log(i);
				clearInterval(tr);
				_this.remove(__entity)
//				removeYanhua();
			}
		},10)
	}
	_this.init(pos);
}
Demo.Botany.prototype = Object.create( THREE.Object3D.prototype );
Demo.Botany.prototype.constructor = Demo.Botany;

/**
 * 全景
 */
Demo.View = function(image){
	var _this = this;
	var RADIUS = 100,
		SEGMENTS = 60;
	_this.init = function (image){
		THREE.Mesh.call(_this);
		var texture = new THREE.Texture(image);
		texture.needsUpdate = true;
		var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
		
		var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide});
		
		_this.name = "view";
		_this.geometry = geometry;
		_this.material = material;
	}
	_this.init(image)
}
Demo.View.prototype = Object.create( THREE.Mesh.prototype );
Demo.View.prototype.constructor = Demo.View;

/*-------------------------------------------------------*/

/**
 *	@desc	运动物体
 *	@author minamoto
 *	@param	object	控制的物体
 *	@param	domElement	应用事件的承载
 *	@param	limit	限制上限位置
 */

THREE.AntiMeshControls = function ( object, domElement, limit ) {

	var _this = this;
	
	var TOUCH_UNIT = 0.2;
	
	var _touchParam = {};
	var _lon = -90;
	var _lat = 0;
	var _limit = limit || 85;

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	var _movePrev = new THREE.Vector2();
	var _moveCurr = new THREE.Vector2();

	this.update = function () {
		_lat = Math.max( - _limit, Math.min( _limit, _lat ) );
		var phi = THREE.Math.degToRad( 90 - _lat );
		var theta = THREE.Math.degToRad( _lon );

		var target = new THREE.Vector3();
		target.x = Math.sin( phi ) * Math.cos( theta );
		target.y = Math.cos( phi );
		target.z = Math.sin( phi ) * Math.sin( theta );
		//this.object.rotation.y = -theta;
		this.object.lookAt( target );
	};

	this.reset = function () {

	};
	function touchstart ( e ) {
		e.preventDefault();
		var touch = e.touches[ 0 ];
		_touchParam.x = touch.screenX;
		_touchParam.y = touch.screenY;
	}
	function touchend( e ) {
		e.preventDefault();
	}
	function touchmove ( e ) {
		e.preventDefault();
		var touch = e.touches[ 0 ];
		_lon -= ( touch.screenX - _touchParam.x ) * TOUCH_UNIT;
		_lat += ( touch.screenY - _touchParam.y ) * TOUCH_UNIT;
		_touchParam.x = touch.screenX;
		_touchParam.y = touch.screenY;
	}
	function mousewheel ( event ) {
		console.log(event);
	}
	function mousedown ( event ) {
		event.preventDefault();
		event.stopPropagation();
		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );
	}
	function mousemove ( event ) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		_lon -= movementX * TOUCH_UNIT;
		_lat += movementY * TOUCH_UNIT;
	}
	function mouseup ( event ) {
		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
	}
	function contextmenu( event ) {
		event.preventDefault();
	}
	
	this.dispose = function() {
		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', mousedown, false );
		this.domElement.removeEventListener( 'mousewheel', mousewheel, false );

		this.domElement.removeEventListener( 'touchstart', touchstart, false );
		this.domElement.removeEventListener( 'touchend', touchend, false );
		this.domElement.removeEventListener( 'touchmove', touchmove, false );

		document.removeEventListener( 'mousemove', mousemove, false );
		document.removeEventListener( 'mouseup', mouseup, false );

	};
	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mousewheel', mousewheel, false );

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );
	
	this.update();

};

THREE.AntiMeshControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.AntiMeshControls.prototype.constructor = THREE.AntiMeshControls;

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alpha = 0;
	this.alphaOffsetAngle = 0;


	var onDeviceOrientationChangeEvent = function( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function() {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function() {

		if ( scope.enabled === false ) return;

		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
		this.alpha = alpha;

	};

	this.updateAlphaOffsetAngle = function( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	};

	this.dispose = function() {

		this.disconnect();

	};

	this.connect();

};
/**
 *	@desc	运动物体
 *	@author minamoto
 *	@param	object	控制的物体
 *	@param	domElement	应用事件的承载
 *	@param	limit	限制上限位置
 */

THREE.rotaControls = function ( object, domElement ) {

	var _this = this;
	
	var TOUCH_UNIT = -0.2;
	
	var _touchParam = {};
	var _lon = 0;
	var _lat = 0;

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	var _movePrev = new THREE.Vector2();
	var _moveCurr = new THREE.Vector2();

	this.update = function () {
		var phi = THREE.Math.degToRad( 90 );
		var theta = THREE.Math.degToRad( _lon );

		var target = new THREE.Vector3();
		target.x = Math.sin( phi ) * Math.cos( theta );
		//target.y = Math.cos( phi );
		target.z = Math.sin( phi ) * Math.sin( theta );
		//this.object.rotation.y = -theta;
		this.object.lookAt( target );
	};

	this.reset = function () {

	};
	function touchstart ( e ) {
		e.preventDefault();
		var touch = e.touches[ 0 ];
		_touchParam.x = touch.screenX;
		_touchParam.y = touch.screenY;
	}
	function touchend( e ) {
		e.preventDefault();
	}
	function touchmove ( e ) {
		e.preventDefault();
		var touch = e.touches[ 0 ];
		_lon -= ( touch.screenX - _touchParam.x ) * TOUCH_UNIT;
		_lat += ( touch.screenY - _touchParam.y ) * TOUCH_UNIT;
		_touchParam.x = touch.screenX;
		_touchParam.y = touch.screenY;
	}
	function mousewheel ( event ) {
		console.log(event);
	}
	function mousedown ( event ) {
		event.preventDefault();
		event.stopPropagation();
		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );
	}
	function mousemove ( event ) {
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		_lon -= movementX * TOUCH_UNIT;
		_lat += movementY * TOUCH_UNIT;
	}
	function mouseup ( event ) {
		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
	}
	function contextmenu( event ) {
		event.preventDefault();
	}
	
	this.dispose = function() {
		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', mousedown, false );
		this.domElement.removeEventListener( 'mousewheel', mousewheel, false );

		this.domElement.removeEventListener( 'touchstart', touchstart, false );
		this.domElement.removeEventListener( 'touchend', touchend, false );
		this.domElement.removeEventListener( 'touchmove', touchmove, false );

		document.removeEventListener( 'mousemove', mousemove, false );
		document.removeEventListener( 'mouseup', mouseup, false );

	};
	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mousewheel', mousewheel, false );

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );
	
	this.update();

};

THREE.rotaControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.rotaControls.prototype.constructor = THREE.rotaControls;

