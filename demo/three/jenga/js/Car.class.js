var Car = {};
Car.VER = '1.0.0';
Car.main = function(container){
	var _this = this;	
	var WIDTH = 0,
		HEIGHT = 0;
	var __camera = null,
		__camera1 = null,
		__scene = null,
		__renderer = null;
	var CAMERA = {x: 60, y: 50, z: 60, fov: 35, near: 1, far: 1000};
	
	var _loader = new THREE.TextureLoader(),
		_mouseControls = null,
		_body = null,
		_angle = 0;
	
	_this.init = function(container){
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
		__scene.setGravity(new THREE.Vector3(0, -30, 0));
		__scene.addEventListener('update',function(){
			__scene.simulate( undefined, 2 );
			__camera1.position.copy(_body.position)
			var v3 = new THREE.Vector3(0,0,0); 
			v3.copy(_body.position);
		    v3.x = 0 + 50*(Math.sin(_body.rotation.x));
		    v3.z = 0 + 50*(Math.cos(_body.rotation.z));
		    __camera1.lookAt(v3)
		})
		__camera = new THREE.PerspectiveCamera(
			CAMERA.fov,
			WIDTH/HEIGHT,
			CAMERA.near,
			CAMERA.far
		)
		__camera.position.set(CAMERA.x,CAMERA.y,CAMERA.z);
		__camera.lookAt(__scene.position);
		__scene.add(__camera);
		
		
		__camera1 = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,50)
		__scene.add(new THREE.CameraHelper(__camera1));
		
		light();
		ground();
		barrier();
		car();
		_this.controls();
		render();
		__scene.simulate();
	}
	barrier = (function(){
		var block = {
			l : 3,
			w : 3,
			h: 10
		};
		var g = new THREE.BoxGeometry(block.w,block.h,block.l);
		
		return function(){
			var i,j,rows = 10;
			_r = 10;
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
				mesh.position.y = 20
				mesh.receiveShadow = true;
				mesh.castShadow = true;
				__scene.add(mesh);
			}
		}
		
	
		
	})()
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
	car = (function(){
		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0xff6666}),.8,.2),
			wheel_m = Physijs.createMaterial(new THREE.MeshLambertMaterial({color:0x444444}),.8,.5),
			wheel_g = new THREE.CylinderGeometry(2,2,1,8);
		var drive = 2;//驱动 1:前驱 / 2:后驱 / 4 : 四驱
		return function(){
			var body = new Physijs.BoxMesh(new THREE.BoxGeometry(10,5,7),material,1000);
			body.position.y = 10;
			body.receiveShadow = body.castShadow = true;
			__scene.add(body);
			_body = body;
			
			var fl = new Physijs.CylinderMesh(wheel_g,wheel_m,500);
			fl.rotation.x = Math.PI / 2;
			fl.position.set(-3.5,6.5,5);
			fl.receiveShadow = fl.castShadow = true;
			__scene.add(fl);
			fl_constraint = new Physijs.DOFConstraint(
				fl, body, new THREE.Vector3(-3.5,6.5,5)
			)
			__scene.addConstraint(fl_constraint);
			fl_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
			fl_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
			
			var fr = new Physijs.CylinderMesh(wheel_g,wheel_m,500);
			fr.rotation.x = Math.PI/2;
			fr.position.set(-3.5,6.5,-5);
			fr.receiveShadow = fr.castShadow = true;
			__scene.add(fr);
			fr_constraint = new Physijs.DOFConstraint(
				fr, body, new THREE.Vector3( -3.5, 6.5, -5 )
			);
			__scene.addConstraint(fr_constraint);
			fr_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
			fr_constraint.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
			
			var bl = new Physijs.CylinderMesh(wheel_g,wheel_m,500);
			bl.rotation.x = Math.PI / 2;
			bl.position.set(3.5,6.5,5);
			bl.receiveShadow = fl.castShadow = true;
			__scene.add(bl);
			bl_constraint = new Physijs.DOFConstraint(
				bl, body, new THREE.Vector3(3.5,6.5,5)
			)
			__scene.addConstraint(bl_constraint);
			bl_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
			bl_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
			
			var br = new Physijs.CylinderMesh(wheel_g,wheel_m,500);
			br.rotation.x = Math.PI/2;
			br.position.set(3.5,6.5,-5);
			br.receiveShadow = fr.castShadow = true;
			__scene.add(br);
			br_constraint = new Physijs.DOFConstraint(
				br, body, new THREE.Vector3( 3.5, 6.5, -5 )
			);
			__scene.addConstraint(br_constraint);
			br_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
			br_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
			
			if(drive == 1){
				wheel_l = fl_constraint
				wheel_r = fr_constraint
			}else if(drive == 2){
				wheel_l = bl_constraint
				wheel_r = br_constraint
			}
			document.addEventListener('keydown',function(e){
				switch(e.keyCode){
					case 37:
					case 65:
						fl_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
						fr_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, 1, 200 );
						fl_constraint.enableAngularMotor( 1 );
						fr_constraint.enableAngularMotor( 1 );
						break;
					case 39:
					case 68:
						fl_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
						fr_constraint.configureAngularMotor( 1, -Math.PI / 2, Math.PI / 2, -1, 200 );
						fl_constraint.enableAngularMotor( 1 );
						fr_constraint.enableAngularMotor( 1 );
						break;
					case 38:
					case 87:
						if(drive == 4){
							fl_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
							fr_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
							bl_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
							br_constraint.configureAngularMotor( 2, 1, 0, 5, 2000 );
							fl_constraint.enableAngularMotor( 2 );
							fr_constraint.enableAngularMotor( 2 );
							bl_constraint.enableAngularMotor( 2 );
							br_constraint.enableAngularMotor( 2 );
						}else{
							wheel_l.configureAngularMotor( 2, 1, 0, 5, 2000 );
							wheel_r.configureAngularMotor( 2, 1, 0, 5, 2000 );
							wheel_l.enableAngularMotor( 2 );
							wheel_r.enableAngularMotor( 2 );
						}
						break;
					case 40:
					case 83:
						if(drive == 4){
							fl_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
							fr_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
							bl_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
							br_constraint.configureAngularMotor( 2, 1, 0, -5, 2000 );
							fl_constraint.enableAngularMotor( 2 );
							fr_constraint.enableAngularMotor( 2 );
							bl_constraint.enableAngularMotor( 2 );
							br_constraint.enableAngularMotor( 2 );
						}else{
							wheel_l.configureAngularMotor( 2, 1, 0, -5, 2000 );
							wheel_r.configureAngularMotor( 2, 1, 0, -5, 2000 );
							wheel_l.enableAngularMotor( 2 );
							wheel_r.enableAngularMotor( 2 );
						}
						break;
				}
			})
			document.addEventListener('keyup',function(e){
				switch(e.keyCode){
					case 37:
					case 65:
						fl_constraint.disableAngularMotor( 1 );
						fr_constraint.disableAngularMotor( 1 );
						break;
					case 39:
					case 68:
						fl_constraint.disableAngularMotor( 1 );
						fr_constraint.disableAngularMotor( 1 );
						break;
					case 38:
					case 40:
					case 87:
					case 83:
						if(drive == 4){
							fl_constraint.disableAngularMotor( 2 );
							fr_constraint.disableAngularMotor( 2 );
							bl_constraint.disableAngularMotor( 2 );
							br_constraint.disableAngularMotor( 2 );
						}else{
							wheel_l.disableAngularMotor( 2 );
							wheel_r.disableAngularMotor( 2 );
						}
						break;
				}
			})
		}
	}())
	light = (function(){
		var light = new THREE.DirectionalLight( 0xFFFFFF );
		return function(){
			light.position.set( 20, 40, -15 );
			light.target.position.copy(__scene.position);
			light.castShadow = true;
			light.shadowCameraLeft = -60;
			light.shadowCameraTop = -60;
			light.shadowCameraRight = 60;
			light.shadowCameraBottom = 60;
			light.shadowCameraNear = 20;
			light.shadowCameraFar = 200;
			light.shadowBias = -.0001
			light.shadowMapWidth = light.shadowMapHeight = 2048;
			light.shadowDarkness = .7;
			__scene.add( light );
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
		
		return function(){
			var ground = new Physijs.BoxMesh(
				new THREE.BoxGeometry(100,1,100),
				ground_m,
				0
			)
			ground.receiveShadow = true;
			__scene.add(ground);
		}
	})()
	render = function(){
		requestAnimationFrame(render);
		if(_mouseControls) _mouseControls.update();
		__renderer.setViewport(WIDTH/3,0,WIDTH/3,HEIGHT/3);
		__renderer.render(__scene,__camera1);
		__renderer.setViewport(0,0,WIDTH,HEIGHT);
		__renderer.render(__scene,__camera);
	}
	_this.init(container);
}
Object.assign(Car.main.prototype, THREE.EventDispatcher.prototype);
Car.main.prototype.constructor = Car.main
