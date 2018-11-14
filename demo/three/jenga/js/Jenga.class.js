var Jenga = {};

Jenga.VER = '1.0.0';


Jenga.main = function(container){
	var _this = this;
	var WIDTH = 0,
		HEIGHT = 0;
	var __camera = null,
		__camera1 = null,
		__scene = null,
		__renderer = null;
	var CAMERA = {x: 0, y: 350, z: 800, fov: 35, near: 1, far: 5000};
	var _mouseControls = null,
		_loader = new THREE.TextureLoader(),
		_angle = 0,
		_r= 0,
		_plane = null;
		
	
	var SHADOW_MAP_WIDTH = 2048, 
		SHADOW_MAP_HEIGHT = 1024;
	
	var _raycaster = new THREE.Raycaster(),	//射线
		_objects = [];	//检测元素

	var _selectBlock = null,
		_mousePostion = new THREE.Vector3,
		_blockOffset = new THREE.Vector3,
		_v3 = new THREE.Vector3;
		
	var _keyControls = null,
		_clock = new THREE.Clock();
	
		
	_this.init = function(container){
		Physijs.scripts.worker = './js/libs/physijs_worker.js';
		Physijs.scripts.ammo = 'ammo.js';
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		__scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		__scene.setGravity(new THREE.Vector3(0,-30,0));
		__scene.addEventListener('update',function(){
			if(_selectBlock !== null){
				_v3.copy(_mousePostion)
					.add(_blockOffset)
					.sub(_selectBlock.position)
					.multiplyScalar(50);
				_v3.y = 0;
				_selectBlock.setLinearVelocity(_v3);
				_v3.set(0,0,0);
				for(var i = 0 ; i < _objects.length; i ++){
					_objects[i].applyCentralImpulse(_v3);
				}
			}
			__scene.simulate(undefined,1);
		})
		
		__camera = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,CAMERA.far)
		__camera.position.z = CAMERA.z;
		__camera.position.y = CAMERA.y;
		__camera.position.x = CAMERA.x;
		__camera.lookAt(new THREE.Vector3( 0, 70, 0 ));
//		__scene.add( __camera );
//		__camera.setViewOffset( WIDTH*3, HEIGHT*2, WIDTH * 1, HEIGHT * 2, WIDTH, HEIGHT );
		__camera1 = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,1000)
//		__camera1.position.z = CAMERA.z;
		__camera1.position.y = 999;
//		__camera1.position.x = CAMERA.x;
		__camera1.lookAt(new THREE.Vector3( 0, 70, 0 ));
//		__scene.add(new THREE.CameraHelper(__camera1));
		
	
		__renderer = new THREE.WebGLRenderer({antialias: true});
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		__renderer.shadowMap.enabled = true;
		__renderer.shadowMapSoft = true;
		__renderer.autoClear = false;
		$("#viewport")[0].appendChild( __renderer.domElement );
		
		
			
		
		var light = new THREE.AmbientLight(0xffffff);
		__scene.add(light);
		
//		var dir_light = new THREE.DirectionalLight( 0xFFFFFF );
//		dir_light.position.set( 150, 150, 0 );
//		dir_light.target.position.copy( __scene.position );
//		dir_light.castShadow = true;
//		dir_light.shadowCameraLeft = -500;
//		dir_light.shadowCameraTop = -500;
//		dir_light.shadowCameraRight = 30;
//		dir_light.shadowCameraBottom = 30;
//		dir_light.shadowCameraNear = 20;
//		dir_light.shadowCameraFar = 200;
//		dir_light.shadowBias = -.01
//		dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
//		dir_light.shadowDarkness = .5;
//		__scene.add( dir_light )
//		dirLightHeper = new THREE.DirectionalLightHelper( dir_light, 100 );
//		__scene.add( dirLightHeper );
		
		
// 		_light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
// 		_light.position.set(300,300,0);
// 		_light.castShadow = true;
// 		_light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50,1,20,1000));
// 		_light.shadow.bias = 0.01;
// 		_light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
// 		_light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
// 		// __scene.add(new THREE.CameraHelper(_light.shadow.camera))
// 		__scene.add(_light);

		setPos(0,-250,0,0,0,0)
//		setPos(0,750,0,0,0,0)
//		
//		setPos(500,250,0,0,0,0.5)
//		setPos(-500,250,0,0,0,0.5)
//		
//		setPos(0,250,-500,0.5,0,0)
//		setPos(0,250,500,0.5,0,0)
		createTower();
//		car();
		
//		var ground = new Physijs.createMaterial(
//			new THREE.MeshLambertMaterial({
//				map: _loader.load( 'images/wood.jpg' )
//				}),
//			1,
//			2		
//		)
//		
//		
//		
//		ground.map.wrapS = ground.map.wrapT = THREE.RepeatWrapping;
//		ground.map.repeat.set( 5, 5 );
//		var mesh = new Physijs.BoxMesh(
//			new THREE.BoxGeometry(200,5,200),
//			ground,
//			1,
//			{ restitution: .2, friction: .8 }
//		)
//		mesh.receiveShadow = true;
//		__scene.add(mesh);
//				_objects.push(mesh);
		
		
		_plane = new THREE.Mesh(
			new THREE.PlaneGeometry( 500-30, 500-30 ),
			new THREE.MeshBasicMaterial({ 
				opacity: 0, 
				transparent: true 
			})
		);
		_plane.rotation.x = Math.PI / -2;
		__scene.add( _plane );
		
		
		initEventHandling();
		
		requestAnimationFrame( animate );
		__scene.simulate();
//		__renderer.domElement.addEventListener( 'touchstart', onTouchStart, false );
	}
	function setPos (x,y,z,rx,ry,rz){
		var ground = new Physijs.createMaterial(
			new THREE.MeshLambertMaterial({
				map: _loader.load( 'images/wood.jpg' )
				}),
			.9,
			.2		
		)
		ground.map.wrapS = ground.map.wrapT = THREE.RepeatWrapping;
		ground.map.repeat.set( 1, 1);
		var mesh = new Physijs.BoxMesh(
			new THREE.BoxGeometry(500,500,500),
			ground,
			0,
			{ restitution: .2, friction: .8 }
		)
		mesh.position.set(x,y,z);
		mesh.rotation.set(Math.PI*rx,Math.PI*ry,Math.PI*rz);
		mesh.receiveShadow = true;
		__scene.add(mesh);
	}
	
	function onTouchStart (e) {
		e.preventDefault();
		hitTest( e.touches[0].clientX, e.touches[0].clientY );
	}
	/**
	 *	碰撞检测
	 */
	function hitTest( x, y ) {
		var mouse = {};
		mouse.x = ( x / window.innerWidth ) * 2 - 1;
		mouse.y = - ( y / window.innerHeight ) * 2 + 1;
		_raycaster.setFromCamera( mouse, __camera );
		var intersects = _raycaster.intersectObjects( _objects );
		if ( intersects.length > 0 ) {
			var obj = intersects[ 0 ].object;
			log(obj)
		}
	}
	createTower = (function(){
		var block = {
			l : 3,
			w : 3,
			h: 10
		};
		var g = new THREE.BoxGeometry(block.w,block.h,block.l);
		
		return function(){
			var i,j,rows = 5;
			_r = 20;
			for ( i = 0; i < rows; i++ ) {
				var m = new Physijs.createMaterial(
					new THREE.MeshBasicMaterial({
						map:_loader.load('images/plywood.jpg')
					}),
					.4,
					.4
				)
				var mesh = new Physijs.BoxMesh(g,m);
				_this.revolution(mesh,0,0,_r);
//				mesh.position.x = block.l * i*2
				mesh.position.y = 300
//				if(i==0){
//					mesh.rotation.z = Math.PI*-0.1
//				}
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				__scene.add(mesh);
				_objects.push(mesh);
			}
		}
		
	})()
	
	initEventHandling = (function(){
		var _vector = new THREE.Vector3(),
			handleMouseDown, handleMouseMove, handleMouseUp;
		var _a;
		handleMouseDown = function(e){
			var ray, intersections;
			_vector.set(
				(e.clientX / WIDTH) * 2 - 1,
				-(e.clientY / HEIGHT) * 2 + 1,
				1
			);
			_vector.unproject(__camera);
			
			ray = new THREE.Raycaster(
				__camera.position,
				_vector.sub(__camera.position).normalize()
			)
			intersections = ray.intersectObjects(_objects);
			
			if(intersections.length > 0){
				_a = intersections[0]
				_selectBlock = intersections[0].object;
				_vector.set(0,0,0);
				
				_selectBlock.setAngularFactor( _vector );
				_selectBlock.setAngularVelocity( _vector );
				_selectBlock.setLinearFactor( _vector );
				_selectBlock.setLinearVelocity( _vector );
				
				_mousePostion.copy(intersections[0].point);
				
				_blockOffset.subVectors(_selectBlock.position,_mousePostion);
				_plane.position.y = _mousePostion.y;
			}
		}
		handleMouseMove = function(e){
			var ray, intersection, i, scalar;
			if(_selectBlock !== null){
				_vector.set(
					(e.clientX / WIDTH) * 2 - 1,
					-(e.clientY / HEIGHT) * 2 + 1,
					1
				);
				_vector.unproject(__camera);
				ray = new THREE.Raycaster(
					__camera.position,
					_vector.sub(__camera.position).normalize()
				)
				intersection = ray.intersectObject(_plane);
				if(intersection.length > 0){
					_mousePostion.copy( intersection[0].point );
				}
			}
		}
		handleMouseUp = function(e){
			if(_selectBlock !== null){
				_vector.set( 1, 1, 1 );
				_selectBlock.setAngularFactor( _vector );
				_selectBlock.setLinearFactor( _vector );
				_selectBlock = null;
			}
		}
		return function(){
			
//			_this.controls();
			__renderer.domElement.addEventListener( 'mousedown',handleMouseDown);
			__renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
			__renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
		}
	})();
	
	_this.revolution = function(obj,x0,y0, r){		//圆心x 圆心y 半径r 角度a0
	    _angle = _angle >= 360 ? 30 : _angle + 30;
	    _r +=2;
	    _radian = THREE.Math.degToRad(_angle);
	    obj.position.x = x0 + r*(Math.sin(_radian));
	    obj.position.z = y0 + r*(Math.cos(_radian));
//	    obj.rotation.y = Math.PI * (_angle/180);
	};
	/**
	 * 鼠标控制
	 */
	_this.controls = function(bol){
		if(bol){
			_mouseControls = null;
		}else{
			_mouseControls = new THREE.TrackballControls(__camera,__renderer.domElement );
		}
	}
	/**
	 * 键盘控制
	 */
	_this.controlsKey = function(bol){
		if(bol){
			_keyControls = null;
		}else{
			_keyControls = new THREE.FirstPersonControls(__camera);
			_keyControls.movementSpeed = 100;
			_keyControls.lookSpeed = 0.2;
			_keyControls.lookVertical = true;
			_keyControls.constrainVertical = true;
			_keyControls.verticalMin = 1.1;
			_keyControls.verticalMax = 2.2;
			_keyControls.activeLook = false;
		}
	}
	function animate(){
		requestAnimationFrame(animate);		
		if(_mouseControls) _mouseControls.update();
		if(_keyControls) _keyControls.update( _clock.getDelta() );
		
		__renderer.clear();
//		__renderer.setViewport(0,0,WIDTH,HEIGHT);
		__renderer.render(__scene,__camera);
//		__renderer.setViewport(WIDTH/2,0,WIDTH/2,HEIGHT);
//		__renderer.render(__scene,__camera1);
	}
	car = (function(){
		var _material = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0xff6666}),.8, .2),
			_wheel_m = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0x444444}),.8, .5),
			_wheel_g = new THREE.CylinderGeometry(2,2,1,8),
			_car = {};
		return function(){
			var body = new Physijs.BoxMesh(
				new THREE.BoxGeometry(10,5,7),
				_material,1000
			)
			body.position.y = 10;
			__group.add(body);
			body.receiveShadow = body.castShadow = true;
			_car.body = body;
			
			var fl = new Physijs.CylinderMesh(
				_wheel_g,
				_wheel_m,
				500
			)
			fl.rotation.x = Math.PI/2;
			fl.position.set(-3.5,6.5,5)
			fl.receiveShadow = fl.castShadow = true;
			fl_onstraint = new Physijs.DOFConstraint(
				fl,_car.body,
				new THREE.Vector3(-3.5,6.5,5)
			)
	//		__group.addConstraint(fl_onstraint);
			__group.add(fl,fl_onstraint);
		}
	})()
	_this.init(container);
}
Object.assign( Jenga.main.prototype, THREE.EventDispatcher.prototype);
Jenga.main.prototype.constructor = Jenga.main;
/**
 * 车
 */
Jenga.Car = function(){
	var _this = this;
	var _material = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0xff6666}),.8, .2),
		_wheel_m = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0x444444}),.8, .5),
		_wheel_g = new THREE.CylinderGeometry(2,2,1,8),
		__group = new THREE.Group();
		_car = {};
	_this.init = function(){
		THREE.Object3D.call(_this);
		_this.add(__group)
		_this.body();
		_this.wheel();
	}
	_this.body = function(){
		var body = new Physijs.BoxMesh(
			new THREE.BoxGeometry(10,5,7),
			_material,1000
		)
		body.position.y = 10;
		__group.add(body);
		body.receiveShadow = body.castShadow = true;
		_car.body = body;
	}
	_this.wheel = function(){
		var fl = new Physijs.CylinderMesh(
			_wheel_g,
			_wheel_m,
			500
		)
		fl.rotation.x = Math.PI/2;
		fl.position.set(-3.5,6.5,5)
		fl.receiveShadow = fl.castShadow = true;
		fl_onstraint = new Physijs.DOFConstraint(
			fl,_car.body,
			new THREE.Vector3(-3.5,6.5,5)
		)
//		__group.addConstraint(fl_onstraint);
		__group.add(fl,fl_onstraint);
	}
	_this.init();
}
Jenga.Car.prototype = Object.create(THREE.Object3D.prototype)
Jenga.Car.prototype.constructor = Jenga.Car;



//class car{
//	constructor(){
//		THREE.Object3D.call(this);
//		this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0xff6666}),.8, .2);
//		this.wheel_m = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0x444444}),.8, .5);
//		this.wheel_g = new THREE.CylinderGeometry(2,2,1,8);
//		this.group = new THREE.Group();
//		this.init();
//	}
//	body(){
//		this.body = new Physijs.BoxMesh(
//			new THREE.BoxGeometry(10,5,7),
//			this.material,1000
//		)
//		this.body.position.y = 50;
//		this.group.add(this.body);
//	}
//	init(){
//		this.body();
//	}
//}
//car.prototype = Object.create(THREE.Object3D.prototype)
//car.prototype.constructor = car;
function log(t){
	console.log(t)
}

		