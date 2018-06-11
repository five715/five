var Particle = {};
Particle.VER = "1.0.0";
Particle.Event = {
	
}
/**
 * 主体
 */
Particle.main = function(canvas){
	var _this = this;
	var WIDTH = 0,
		HEIGHT = 0;
	var __camera = null,
		__scene = null,
		__renderer = null;
	var CAMERA = {x: 0, y: 0, z: 0, fov: 75, near: 1, far: 5000};
	var _raycaster = new THREE.Raycaster(),	//射线
		_objects = [];	//检测元素
	var _mouseControls = null;
	
	var _options = null,
		_spawnerOptions = null,
		_tick = 0,
		_clock = new THREE.Clock(),
		__particleSystem = null;
		
	var __stats = 1,
		_gui = 1;
	_this.init = function(container){
		container = document.createElement( 'div' );
		container.style.position = "fixed";
		container.style.top=0
		document.body.appendChild( container );
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		__camera = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,CAMERA.far)
		__camera.position.z = 1;
		
		__scene = new THREE.Scene();
		__scene.background = new THREE.Color(0x000040);
		
		__renderer = new THREE.WebGLRenderer({
//			alpha:true
		});
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		container.appendChild( __renderer.domElement );
		
		if(__stats) {
			__stats = new Stats();
			container.appendChild(__stats.dom);
		}
		
		animate();
		_this.controls();
		__renderer.domElement.addEventListener("click",onClick,false)
		__renderer.domElement.addEventListener("touchstart",onTouchStart,false)
	}
	_this.launch = function(){
		var material = new THREE.SpriteMaterial( {
			map:new THREE.CanvasTexture(generateSprite()),
			blending:THREE.AdditiveBlending
		} );
		for ( var i = 0; i < 300; i++ ) {
			particle = new THREE.Sprite( material );
			__scene.add(particle)
			initParticle(particle,i*10)
		}
		_this.initParticle();
	}
	/**
	 * 粒子系统
	 */
	_this.initParticle = function(){
		__particleSystem = new THREE.GPUParticleSystem({
			maxParticles:25000
		})
//		__particleSystem.visible = false;
		__scene.add(__particleSystem);
		_options = {
			position : new THREE.Vector3(),
			positionRandomness : 0.98,
			velocity: new THREE.Vector3(),
			velocityRandomness: 1.75,
			color: 0xaa88ff,
			colorRandomness: 0.35,
			turbulence: 0.2,
			lifetime: 7,
			size: 5.9,
			sizeRandomness: 10.8
		}
		_spawnerOptions = {
			spawnRate:0,
			horizontalSpeed:1.5,
			verticalSpeed:1.33,
			timeScale : 6
		}
		if(_gui) _this.Gui();
	}
	_this.Gui = function(){
		_gui = new dat.GUI( { width: 350 } ),
		_gui.add( _options, "velocityRandomness", 0, 3 );
		_gui.add( _options, "positionRandomness", 0, 3 );
		_gui.add( _options, "size", 1, 20 );
		_gui.add( _options, "sizeRandomness", 0, 25 );
		_gui.add( _options, "colorRandomness", 0, 1 );
		_gui.add( _options, "lifetime", .1, 10 );
		_gui.add( _options, "turbulence", 0, 1 );
		_gui.add( _spawnerOptions, "spawnRate", 0, 30000 );
		_gui.add( _spawnerOptions, "timeScale", -5, 15 );
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
			var pos = obj.position
			_options.position.set(pos.x,pos.y,pos.z)
			__particleSystem.visible = true
			_spawnerOptions.spawnRate = 10000
			setTimeout(function(){
				_spawnerOptions.spawnRate = 0
			},100)
		}
	}
	function initParticle(particle,delay){
		particle.position.set(0,0,-300);
		particle.scale.x = particle.scale.y = 10;
		new TWEEN.Tween(particle.position)
			.delay(delay)
			.to({
				x : Math.random() * 800 - 400,
				y : Math.random() * 400 - 200,
				z : Math.random() * 800 - 400
			},3000)
			.onComplete(function(){
				_objects.push(particle);
				ainmatePar(particle);
			})
			.start();
		
	}
	function ainmatePar(particle){
		var scope = 50;
		var pos = particle.position;
		var t = new TWEEN.Tween(particle.position)
			.to({
				x : Math.random() > 0.5 ? pos.x + Math.random()*scope: pos.x - Math.random()*scope,
				y : Math.random() > 0.5 ? pos.y + Math.random()*scope: pos.y - Math.random()*scope,
				z : Math.random() > 0.5 ? pos.z + Math.random()*scope: pos.z - Math.random()*scope
			},2000)
//			.yoyo(true)
			.onComplete(function(){
				ainmatePar(particle)
			})
//			.repeat(1)
			.start();
	}
	function generateSprite(){
		var canvas = document.createElement("canvas");
		canvas.width = 16;
		canvas.height = 16;
		var context = canvas.getContext('2d');
		var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
		gradient.addColorStop( 0, 'rgba(255,255,255,1)');
		gradient.addColorStop( 0.2, 'rgba(255,255,255,1)');
		gradient.addColorStop( 0.7, 'rgba(255,255,255,1)');
		gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
		context.fillStyle = gradient;
		context.fillRect(0,0,canvas.width,canvas.height);
		return canvas;
	}
	function scopeRandom(min,max){
		var n = Math.reand()
	}
	_this.controls = function(){
		_mouseControls = new THREE.TrackballControls(__camera,__renderer.domElement );
//			controls.rotateSpeed = 5.0;
//			controls.zoomSpeed = 2.2;
//			controls.panSpeed = 1;
//			controls.dynamicDampingFactor = 0.3;
	}
	function animate(){
		requestAnimationFrame(animate);
		if(_mouseControls) _mouseControls.update();
		if(__particleSystem) updateParticle();
		TWEEN.update();
		__renderer.render(__scene,__camera);
		if(__stats) __stats.update();
	}
	function updateParticle(){
		var delta = _clock.getDelta() * _spawnerOptions.timeScale;
		_tick+= delta;
		if(_tick < 0) tick = 0;
		if(delta > 0){
//			_options.position.x = Math.sin(_tick * _spawnerOptions.horizontalSpeed) * 20;
//			_options.position.y = Math.sin(_tick * _spawnerOptions.verticalSpeed) *10;
//			_options.position.z = Math.sin(_tick * _spawnerOptions.horizontalSpeed+_spawnerOptions.verticalSpeed)*5;
			for(var x = 0 ; x < _spawnerOptions.spawnRate * delta; x++){
				__particleSystem.spawnParticle(_options)
			}
		}
		__particleSystem.update(_tick)
	}
	_this.init(canvas);
}
Object.assign(Particle.main.prototype,THREE.EventDispatcher.prototype);
Particle.main.prototype.constructor = Particle.main;
