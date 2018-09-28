var Marble = {};
Marble.VER = "1.0.0";
Marble.Event = {

}
/**
 * 主体
 */
Marble.main = function(canvas){
	var _this = this;
	var WIDTH = 0,
		HEIGHT = 0,
		RADIUS = 7;
	var __camera = null,
		__scene = null,
		__renderer = null;
	var CAMERA = {x: 1000, y: 50, z: 1500, fov: 30, near: 1, far: 100000};
	var _mouseControls = null;
	var _canvas = null;
	var clothGeometry = null,
		__stats = null;
	
	/**
	 * 初始化
	 */
	_this.init = function(container){
		_canvas = document.createElement( 'div' );
		_canvas.style.position = "fixed";
		_canvas.style.top = 0
		document.body.appendChild( _canvas );
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		_canvas.width = WIDTH;
		_canvas.height = HEIGHT;
		
		__camera = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,CAMERA.far)
		__camera.position.set(CAMERA.x,CAMERA.y,CAMERA.z)
		__scene = new THREE.Scene();
		
		__renderer = new THREE.WebGLRenderer({ antialias: true});
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		__renderer.gammaInput = true;
		__renderer.gammaOutput = true;
		__renderer.shadowMap.enabled = true;
		_canvas.appendChild( __renderer.domElement );
		
		__stats = new Stats();
		_canvas.appendChild( __stats.dom );
		
		lightInit()
		_this.controls();
	}
	/**
	 * 开始
	 */
	_this.launch = function(){
		var loader = new THREE.TextureLoader();
		var clothTexture  = loader.load("images/circuit_pattern.png");
		clothTexture.anisotropy = 16;
		
		var clothMaterial = new THREE.MeshLambertMaterial({
			map:clothTexture,
			side:THREE.DoubleSide,
			alphaTest : 0.5
		})
		clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h) 
		var object  = new THREE.Mesh(clothGeometry,clothMaterial)
		object.position.set(0, 0, 0);
		object.castShadow = true;
		__scene.add(object);
		object.customDepthMaterial = new THREE.MeshDepthMaterial( {
			depthPacking: THREE.RGBADepthPacking,
			map: clothTexture,
			alphaTest: 0.5
		} );
		
		
		var groundTexture = loader.load("images/grasslight-big.jpg");
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set(25,25)
		groundTexture.anisotropy = 16
		var groundMaterial = new THREE.MeshLambertMaterial({map:groundTexture});
		var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000,20000),groundMaterial);
		mesh.position.y = - 250;
		mesh.rotation.x = - Math.PI / 2;
		mesh.receiveShadow = true;
		__scene.add(mesh)
		
		var ballGeo = new THREE.SphereBufferGeometry(ballSize,32,16);
		var ballMaterial = new THREE.MeshLambertMaterial();
		sphere = new THREE.Mesh(ballGeo,ballMaterial);
		sphere.castShadow = true;
		sphere.receiveShadow = true;
		__scene.add(sphere);
		
		
		var poleGeo = new THREE.BoxBufferGeometry(5,375,5)
		var poleMat = new THREE.MeshLambertMaterial();
		var mesh = new THREE.Mesh(poleGeo,poleMat);
		mesh.position.x = - 125;
		mesh.position.y = - 62;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		__scene.add( mesh );
		var mesh = new THREE.Mesh( poleGeo, poleMat );
		mesh.position.x = 125;
		mesh.position.y = - 62;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		__scene.add( mesh );
		var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), poleMat );
		mesh.position.y = - 250 + ( 750 / 2 );
		mesh.position.x = 0;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		__scene.add( mesh );
		var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
		var mesh = new THREE.Mesh( gg, poleMat );
		mesh.position.y = - 250;
		mesh.position.x = 125;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		__scene.add( mesh );
		var mesh = new THREE.Mesh( gg, poleMat );
		mesh.position.y = - 250;
		mesh.position.x = - 125;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		__scene.add( mesh );
		animate();
				
	}
	
	/**
	 * 灯光
	 */
	function lightInit(){
		var l = new THREE.AmbientLight( 0x666666 );
		var light = new THREE.DirectionalLight( 0xdfebff, 1 );
		light.position.set(50,200,100);
		light.position.multiplyScalar( 1.3 );
		light.castShadow = true;
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		var d = 300;
		light.shadow.camera.left = - d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = - d;
		light.shadow.camera.far = 1000;
		__scene.add(light,l,new THREE.CameraHelper(light.shadow.camera))
	}
	/**
	 * 鼠标控制
	 */
	_this.controls = function(){
		_mouseControls = new THREE.TrackballControls(__camera,__renderer.domElement );
	}
	/**
	 * 更新
	 */
	function animate() {
		requestAnimationFrame( animate );
		if(_mouseControls) _mouseControls.update();
		var time = Date.now();
		var windStrength = Math.cos( time / 7000 ) * 20 + 40;
		windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
		windForce.normalize()
		windForce.multiplyScalar( windStrength );
		simulate( time,clothGeometry );
		render();
		__stats.update();
	}
	function render() {
		var p = cloth.particles;
		for ( var i = 0, il = p.length; i < il; i ++ ) {
			clothGeometry.vertices[ i ].copy( p[ i ].position );
		}
		clothGeometry.verticesNeedUpdate = true;
		clothGeometry.computeFaceNormals();
		clothGeometry.computeVertexNormals();
		sphere.position.copy( ballPosition );
		__renderer.render( __scene, __camera );
	}
	_this.init(canvas);
}
Object.assign(Marble.main.prototype,THREE.EventDispatcher.prototype);
Marble.main.prototype.constructor = Marble.main;


