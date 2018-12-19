var Vehicle = {};
Vehicle.VER = '1.0.0';
Vehicle.main = function(container){
	var _this = this;
	var WIDTH,HEIGHT;
	var __camera = null,
		__scene = null,
		__renderer = null;
	var _mouseControls = null,
		_loader = new THREE.TextureLoader(),
		_vehicle = null,
		_input = null,
		_light = null;
		
	var CAMERA = {x: 60, y: 50, z: 60, fov: 35, near: 1, far: 1000};
	_this.init =function(container){
		Physijs.scripts.worker = './js/libs/physijs_worker.js';
		Physijs.scripts.ammo = 'ammo.js';
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		
		__renderer = new THREE.WebGLRenderer({antialias:true});
		__renderer.setSize(WIDTH,HEIGHT);
		__renderer.shadowMap.enabled = true;
		__renderer.shadowMapSoft = true;
		container[0].appendChild(__renderer.domElement)
		
		__scene = new Physijs.Scene;
		__scene.setGravity(new THREE.Vector3(0,-30,0));
		__scene.addEventListener('update',function(){
			if(_input &&　_vehicle){
				if(_input.direction !== null){
					_input.steering += _input.direction / 50;
					if(_input.steering < -.6) _input.steering = -.6
					if(_input.steering > .6) _input.steering = .6
				}
				_vehicle.setSteering(_input.steering, 0);
				_vehicle.setSteering(_input.steering, 1);
				if(_input.power === true){
					_vehicle.applyEngineForce(300);
				}else if(_input.power == false){
					_vector.setBrake(20,2);
					_vector.setBrake(20,3);
				}else{
					_vehicle.applyEngineForce(0);
				}
			}
			
			__scene.simulate(undefined,2);
		})
		
		__camera = new THREE.PerspectiveCamera(
			CAMERA.fov, 
			WIDTH/HEIGHT, 
			CAMERA.near, 
			CAMERA.far
		);
		__camera.position.set(CAMERA.x,CAMERA.y,CAMERA.z);
		__scene.add(__camera)
		
		
		
		light();
		ground();
//		box();
		vehicle();
//		_this.controls()
		animate();
		__scene.simulate();	
	}
	vehicle = (function(){
		var loader = new THREE.JSONLoader();
		return function(){
			loader.load("models/mustang.js", function(car,car_m){
				loader.load("models/mustang_wheel.js",function(wheel, wheel_m){
					var mesh = new Physijs.BoxMesh(
						car,
						new THREE.MeshFaceMaterial(car_m)
					)
					mesh.position.y = 2;
					mesh.castShadow = mesh.receiveShadow = true;
					
					_vehicle = new Physijs.Vehicle(mesh,
						new Physijs.VehicleTuning(
							10.88,
							1.83,
							0.28,
							500,
							10.5,
							6000
						)
					)
					
					
					__scene.add(_vehicle);
					
					var wheel_material = new THREE.MeshFaceMaterial(wheel_m);
					for(var i = 0 ; i < 4; i ++){
						_vehicle.addWheel(
							wheel,
							wheel_material,
							new THREE.Vector3(
								i % 2 === 0 ? -1.6 : 1.6, -1,
								i < 2 ? 3.3 : -3.2
							),
							new THREE.Vector3(0, -1, 0),
							new THREE.Vector3(-1, 0, 0),
							0.5,
							0.7,
							i < 2 ? false : true
						);
					}
					
					_input = {
						power:null,
						direction:null,
						steering:0
					}
					
					document.addEventListener('keydown', function(ev) {
						switch(ev.keyCode) {
							case 37: // left
								_input.direction = 1;
								break;
							case 38: // forward
								_input.power = true;
								break;
							case 39: // right
								_input.direction = -1;
								break;
							case 40: // back
								_input.power = false;
								break;
						}
					});
					document.addEventListener('keyup', function(ev) {
						switch(ev.keyCode) {
							case 37: // left
								_input.direction = null;
								break;
							case 38: // forward
								_input.power = null;
								break;
							case 39: // right
								_input.direction = null;
								break;
							case 40: // back
								_input.power = null;
								break;
						}
					});
				})
			})
		}
		
	})()
	box =  (function(){
		var box_m = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({
				map: _loader.load('images/plywood.jpg')
			}),
			.4,
			.6
		)
		box_m.map.wrapS = box_m.map.wrapT = THREE.RepeatWrapping;
		box_m.map.repeat.set(.25,.25);
		return function(){
			for(i = 0 ; i < 50; i ++){
				var size = Math.random() * 2 + .5;
				var box = new Physijs.BoxMesh(
					new THREE.BoxGeometry(size,size,size),
					box_m
				)
				box.castShadow = box.receiveShadow = true;
				box.position.set(
					Math.random() * 25 - 50,
					5,
					Math.random() * 25 - 50
				)
				__scene.add(box);
			}
		}
	})()
	ground = (function(){
		var ground_m = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({
				map: _loader.load('images/rocks.jpg')
			}),
			.8,
			.4
		)
		ground_m.map.wrapS = ground_m.map.wrapT = THREE.RepeatWrapping;
		ground_m.map.repeat.set(3,3);
		
		var ground_g = new THREE.PlaneGeometry(300, 300, 100, 100);
		ground_g.computeFaceNormals();
		ground_g.computeVertexNormals();
		return function(){
			var ground = new Physijs.HeightfieldMesh(
				ground_g,
				ground_m,
				0
			)
			ground.rotation.x = -Math.PI / 2;
			ground.receiveShadow = true;
			__scene.add(ground)
		}
	})()
	
	light = (function(){
		_light = new THREE.DirectionalLight(0xFFFFFF);
		return function(){
			_light.position.set(20, 20, -15);
			_light.target.position.copy(__scene.position);
			_light.castShadow = true;
			_light.shadowCameraLeft = -150;
			_light.shadowCameraTop = -150;
			_light.shadowCameraRight = 150;
			_light.shadowCameraBottom = 150;
			_light.shadowCameraNear = 20;
			_light.shadowCameraFar = 400;
			_light.shadowBias = -.0001
			_light.shadowMapWidth = _light.shadowMapHeight = 2048;
			_light.shadowDarkness = .7;
			__scene.add(_light);
		}
	})()
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
	animate = function(){
		requestAnimationFrame(animate);
		if(_vehicle){
			__camera.position.copy(_vehicle.mesh.position)
				.add(new THREE.Vector3(40, 25, 40))
			__camera.lookAt(_vehicle.mesh.position)
			
			_light.target.position.copy(_vehicle.mesh.position);
			_light.position.addVectors(
				_light.target.position,
				new THREE.Vector3(20, 20, -15)
			);
		}
		if(_mouseControls) _mouseControls.update();
		__renderer.render(__scene,__camera);
	}
	_this.init(container);
}
Object.assign(Vehicle.main.prototype, THREE.EventDispatcher.prototype);
Vehicle.main.prototype.constructor = Vehicle.main;
