var Marble = {};
Marble.VER = "1.0.0";
Marble.Event = {
	BALL_FALL : "ballFall",
	BALL_DIE : "ballDie"
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
		__renderer = null,
		__field = null ; //场地
	var CAMERA = {x: 0, y: 0, z: 0, fov: 75, near: 1, far: 5000};
	var _mouseControls = null;
	var __stats = null;
	
	var __environment = null,	//环境
		__ball = null,			//球
		BALL = 1.3;				//球半径
	var _isRunning = false;	//是否开始
	var _floor = 1,			//当前楼层
		_rotate = 0;		//当前旋转
	var _score = 0;		//得分
	var _clock = new THREE.Clock()
	var _canvas = null;
	
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
		
		__environment = new THREE.Object3D();
		__ball = new Marble.Ball(RADIUS,BALL);
		__ball.position.y = BALL
		__ball.playJump();
		__ball.addEventListener(Marble.Event.BALL_FALL, _this.plusFloor);
		__ball.addEventListener(Marble.Event.BALL_DIE, ballDie);
		
		
		__camera = new THREE.PerspectiveCamera(CAMERA.fov,WIDTH/HEIGHT,CAMERA.near,CAMERA.far)
		__scene = new THREE.Scene();
		__scene.background = new THREE.Color(0x000000);
		
		__renderer = new THREE.WebGLRenderer({
//			alpha:true
		});
		__renderer.setPixelRatio(window.devicePixelRatio);
		__renderer.setSize(WIDTH,HEIGHT);
		_canvas.appendChild( __renderer.domElement );
		
		if(__stats) {
			__stats = new Stats();
			_canvas.appendChild(__stats.dom);
		}
		
		__scene.add(__environment,__ball)
		animate();
		_this.controls();
		lightInit();
	}
	/**
	 * 预备
	 */
	_this.ready = function(){
		__field = new Marble.Field(RADIUS);
		__environment.add(__field)
		__camera.position.set(0,15,50)
		__camera.rotation.set(Math.PI*-0.155,0,0)
		_this.launch();
	}
	/**
	 * 开始
	 */
	_this.launch = function(){
		_isRunning = true;
		_clock = new THREE.Clock()
	}
	
	/**
	 * 灯光
	 */
	function lightInit(){
		var ambient = new THREE.AmbientLight(0xffffff,1);
		__scene.add(ambient);
	}
	/**
	 * 鼠标控制
	 */
	_this.controls = function(){
//		_mouseControls = new THREE.TrackballControls(__camera,__renderer.domElement );
//		_mouseControls = new THREE.TrackballControls(__camera);
//		_mouseControls.addEventListener("change", onControlChange)
		_canvas.addEventListener("touchstart",onTouchStart);
		_canvas.addEventListener("touchmove",onTouchMove);
	}
	function onTouchStart(e){
		var touches = e.targetTouches[0];
		_x = touches.pageX;
	}
	function onTouchMove(e){
		var touches = e.targetTouches[0];
		var x = touches.pageX;
		__environment.rotation.y += Math.PI*((x-_x)/300)
		_x = x;
	}
	function onControlChange (e) {
		var o = e.target.object;
		console.log(o)
//		__ball.lookAt(__camera.position);
//		__ball.quaternion.copy(__camera.quaternion);
	}
	_this.plusFloor = function(e){
//		console.log(e.data)
		_score+=e.data
		_floor++
		__field.addFloor();
		$(".a").text(_score)
	}
	/**
	 * 死亡，游戏结束
	 */
	function ballDie(e){
		console.log("游戏结束")
		_isRunning = false;
		_canvas.removeEventListener("touchstart",onTouchStart);
		_canvas.removeEventListener("touchmove",onTouchMove);
	}
	/**
	 * 更新
	 */
	function animate(){
		requestAnimationFrame(animate);
		TWEEN.update()
		if(_mouseControls) _mouseControls.update();
		if(_isRunning){
//			_isRunning = false;
			field = __field.getFloor()
			_rotate = __environment.rotation.y<0 ? __environment.rotation.y%(Math.PI*2):Math.PI*2-(__environment.rotation.y%(Math.PI*2));
//			$(".a").html(_rotate)
			__ball.playFall(__camera);
			__field.route(__ball,__camera,_rotate,field);
			__ball.playGhost(__environment,_clock.getElapsedTime())
		}
		__renderer.clear();
		__renderer.render(__scene,__camera);
		if(__stats) __stats.update();
	}
	_this.init(canvas);
}
Object.assign(Marble.main.prototype,THREE.EventDispatcher.prototype);
Marble.main.prototype.constructor = Marble.main;

/**
 * 场景
 */
Marble.Field = function(radius){
	var _this =this;
	var RADIUS = radius
	var __floor = null;
	
	_this.init = function(){
		THREE.Object3D.call(_this);
		__floor = new Marble.Floor(RADIUS);
		_this.add(__floor)
		__floor.create()
	}
	_this.route = function(ball,camera,rotate,field){
		__floor.checkBarrier(ball,camera,Math.abs(rotate),field)
	}
	/**
	 * 获取楼层
	 */
	_this.getFloor = function(){
		return __floor;
	}
	_this.addFloor = function(){
		__floor.create(1)
	}
	_this.init()
}
Marble.Field.prototype = Object.create( THREE.Object3D.prototype );
Marble.Field.prototype.constructor = Marble.Field;

/**
 * 楼层
 */
Marble.Floor = function(radius){
	var _this = this;
	var RADIUS = radius,
		INTERVAL = 20,
		HEIGHT = 83;
	var GAP = {
		start:0.7,
		end:1.5
	}
	var _i = 0;
	var PREFIX = {
		barriel :"barriel",
		chartlet:"chartlet"
	}
	var _dimain = true;
	var _isCylinder = true,//是否显示柱子
		__chartlet = null,	//贴图
		_isChartlet = true;//是否开启贴图
	var _floor = 0;
		
	_this.init = function(){
		THREE.Object3D.call(_this);
		__barrier = new THREE.Group();
		__cylinder = new THREE.Group();
		_this.add(__cylinder,__barrier)
		if(_isChartlet){
			__chartlet = new THREE.Group();
			_this.add(__chartlet)
		}
		_this.create();
	}
	_this.create = function(number){
		if(!number) number = 5 
		for(var i = 0; i < number ;i++){
			createBarrier(_i*INTERVAL,Math.ceil(Math.random()*3))
			_i++
		}
	}
	/**
	 * 楼层碰撞检测
	 */
	_this.checkBarrier = function(ball,camera,rotate,field){
		var y = Math.abs(parseInt((camera.position.y-15)/20))+1
		if(y%1 == 0) _floor = y
		__barrier.children.forEach(barrier=>{
			if(barrier.name == PREFIX.barriel + (_floor-1)){
				var p1 = barrier.position.clone();
				_this.localToWorld(p1)
				var p2 = ball.getBall();
				var d = p1.distanceTo(p2);
				var barriers = field.getRotate(_floor)
				var barr =  field.getBarrier(_floor);
				
				if(d < 11.08){
					if(barr.visible){
						for(b in barriers){
							var rotateY = barriers[b].y
							//console.log(rotate,rotateY,barriers[b].length,rotate > (rotateY)%(Math.PI*2),rotate<(rotateY+barriers[b].length)%(Math.PI*2),rotateY >= Math.PI*2-barriers[b].length)
							if(rotateY > Math.PI*2-barriers[b].length){
								if(rotate > (rotateY)%(Math.PI*2) || rotate<(rotateY+barriers[b].length)%(Math.PI*2)){
									groundOperation(ball,barriers[b],barr,field,rotate);
									return false;
								}
							}else{
								if(rotate > (rotateY)%(Math.PI*2) && rotate<(rotateY+barriers[b].length)%(Math.PI*2)){
									groundOperation(ball,barriers[b],barr,field,rotate);
									return false;
								}
							}
						}
					}
					ball.fall(barr,field)
					return false;
				}
			}
		})
	}
	function groundOperation(ball,barrier,barr,field,rotate){
		if(ball.getGravity()>2.8){
			ball.breakSmash(barr,field)
			ball.playJump(ball)
			return false;
		}
		if(barrier.name.indexOf("die") !== -1){
			ball.ballDie()
		}else{
			_this.chartletCreate(ball.getBallPos(),rotate,_floor-1);
			ball.playJump(ball)
		}
	}
	/**
	 * 创建楼层
	 */
	function createBarrier(y,number,a){
		if(y == 0){
			var barrier = new Marble.Barrier(RADIUS,1);
			barrier.rotation.y = Math.PI*(Math.random())
		}else{
			var barrier = new Marble.Barrier(RADIUS,number,_i);			
			barrier.rotation.y = Math.PI*(Math.random()*2)
		}
		barrier.name = PREFIX.barriel+_i;
		barrier.del = false;
//		console.log(barrier.name)
		barrier.position.y = -y
		var o = barrier;
		__barrier.add(barrier)
		if(_isCylinder){
			var cylinder = cylinderGeomtry();
			cylinder.position.y = -y
			__cylinder.add(cylinder)
		}
		if(__chartlet){
			var chartlet = new Marble.Chartlet();
			chartlet.name = PREFIX.chartlet+_i
			chartlet.position.y = -y
			__chartlet.add(chartlet);
		}
	}
	_this.chartletCreate = function(pos,rotate,i){
		var chartlet = _this.getChartlet(i);
		if(chartlet) chartlet.create(pos,rotate)
	}
	
	/**
	 * 获取楼层的旋转
	 * @param {Object} i
	 */
	_this.getRotate = function(i){
		var retate = [];
		__barrier.children.forEach(barrier=>{
			if(barrier.name == PREFIX.barriel+(i-1)){
				var mesgIn = barrier.getMesgIn()
				mesgIn.forEach(mesg=>{
					var r = mesg;
					r.y += barrier.rotation.clone().y;
					r.y += Math.PI*0.5;
					var y = r.y
					r.y = y % (Math.PI*2)
					retate.push(r)
				})
			}
		})
//		console.log(retate)
		return retate
	}
	_this.getBarrier = function(i){
		var o;
		__barrier.children.forEach(barrier=>{
			if(barrier.name == PREFIX.barriel+(i-1)){
				o = barrier
			}
		})
		return o;
	}
	_this.removeBarrier = function(obj){
		__chartlet.remove(_this.getChartlet(_floor-1))
		__barrier.remove(obj)
		
	}
	_this.getChartlet = function(i){
		var char;
		__chartlet.children.forEach(chartlet=>{
			if(chartlet.name == PREFIX.chartlet+i){
				char = chartlet
			}
		})
		return char;
	}
	/**
	 * 圆柱体
	 */
	function cylinderGeomtry(){
		var geometry = new THREE.CylinderGeometry( RADIUS, RADIUS, INTERVAL, 50);
		var material = new THREE.MeshBasicMaterial( {color: 0xeeeeee} );
		var cylinder = new THREE.Mesh( geometry, material );
		return cylinder;
	}
	_this.init();
}
Marble.Floor.prototype = Object.create( THREE.Object3D.prototype );
Marble.Floor.prototype.constructor = Marble.Floor;

/**
 * 障碍物
 */
Marble.Barrier = function(radius,number,tier){
	var _this = this;
	var _angle = 0;
	var _height = 3,			//楼层高度
		HEIGHT = 3,
		_width = 15,			//外圆半径
		WIDTH = 15,
		SEGMNTATION = 50,	//横截面
		RADIUS = radius,	//圆柱半径
		_start = 0,			//开始位置
		_length = Math.PI * (Math.random()*0.5+1.3),	//长度
		_color = 0x333333,	//颜色
		_number = number,	//每层数量
		_i = tier;			//当前第几层
	var GAP = {				//缺口
			min : 0.35,
			max : 0.35
		},
		DIE = {
			min : 0.2,
			max : 0.3
		}
	_this.init = function(){
		THREE.Object3D.call(_this);
		for(var i = 0 ; i < _number ; i++){
			countLength()
			var mesgIn = MeshInTheMesh(i,(_i?Math.random():0))
			mesgIn.rotation.y = Math.PI*2/_number*i
			_this.add(mesgIn)
		}
	}
	/**
	 * 计算楼层长度
	 */
	function countLength(){
		_length = Math.PI * (Math.random()*(GAP.max-GAP.min)+(2/_number-GAP.max))
	}
	/**
	 * 获取楼层块
	 */
	_this.getMesgIn = function(){
		var obj = [];
		_this.children.forEach(mesgIn=>{
			mesgIn.children.forEach(mesg=>{
//				if(mesg.name.indexOf("phase") !== -1 ){
					var r = mesg.rotation.clone();
					r.y += mesgIn.rotation.clone().y;
					r.length = mesg.length
					r.name = mesg.name
					obj.push(r)
//				}
			})
		})
		return obj;
	}
	/**
	 * 块中块
	 * @param {Object} 生成的第几个
	 * @param {Object} 
	 */
	function MeshInTheMesh(i,dom){
		var l = _length;
		var mesgIn = new THREE.Object3D();
		var dom1 = 0.4,	
			dom2 = 0.9;
		if(dom > dom1){
			if(dom > dom2){
				//第二段
				_length -= Math.PI*(DIE.max-DIE.min)+DIE.min
			}else{
				//第三段
				_length -= Math.PI*(DIE.max-DIE.min)+DIE.min
				_length = Math.random()*_length
			}
		}
		//添加楼层块
		_color = 0x333333;
		_height =  HEIGHT
		_width = WIDTH
		var obj = addMesh(i);
		mesgIn.add(obj)
		if(dom>dom1){
			//生成死亡块
			_color = 0x00ff00;
			var h = 0.5;
			_height =  HEIGHT+h;
			_width = WIDTH+0.1;
			var rotate = _length;
			var obj1 = addMesh(i,Math.PI*DIE.min);
			obj1.position.y += h/2
			obj1.rotation.y = rotate
			mesgIn.add(obj1)
		}
		if(dom>dom1 && dom < dom2){
			//补充死亡块之后的楼层块
			_color = 0x333333;
			_height =  HEIGHT
			_width = WIDTH
			var length = rotate + Math.PI*DIE.min
			_length = l - length;
			var obj2 = addMesh(i);
			obj2.rotation.y = length
			mesgIn.add(obj2)
		}
		return mesgIn;
	}
	/**
	 * 楼层块
	 */
	function addMesh(i,length){
		if(length) _length = length;
		var obj = new THREE.Object3D();
		var barrier = addFace()
		var barrier1 = addFace()
		barrier1.position.y = -_height
		var side = addSide(_width)
		var side1 = addSide(RADIUS)
		var plane = addPlane();
		plane.position.x = (_width-RADIUS)/2+RADIUS;
		var plane1 = addPlane();
		plane1.rotation.y = _length
		_this.revolution(plane1,0,0,(_width-RADIUS)/2+RADIUS)
		obj.add(barrier,barrier1,side,side1,plane,plane1)
//		obj.add(barrier1,plane,plane1)
		obj.name = length?"die"+i:"phase"+i
		obj.length = _length;
		return obj
	}
	
	/**
	 * 旋转位置
	 */
    _this.revolution = function(obj,x0,y0, r){		//圆心x 圆心y 半径r 角度a0
        obj.position.x = x0 + r*(Math.sin(_length + Math.PI*0.5));
        obj.position.z = y0 + r*(Math.cos(_length + Math.PI*0.5));
    };
	/**
	 * 添加面-左右
	 */
	function addPlane(){
		var geometry = new THREE.PlaneGeometry( _width-RADIUS,_height, 0 );
		var material = new THREE.MeshBasicMaterial( {color: _color, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.y = -_height/2
		return plane
	}
	/**
	 * 添加面-前后
	 */
	function addSide(width){
		var geometry = new THREE.CylinderGeometry( width, width, _height, SEGMNTATION , 1, true,_start+1.57,_length);
		var material = new THREE.MeshBasicMaterial( {
			color: _color,
			side: THREE.DoubleSide 
		} );
		var side = new THREE.Mesh( geometry, material );
		side.position.y = -_height/2
		return side;
	}
	/**
	 * 添加面-上下
	 */
	function addFace(){
		var geometry = new THREE.RingBufferGeometry( RADIUS, _width, SEGMNTATION ,1,_start,_length);
		var material = new THREE.MeshBasicMaterial( { 
			color: _color,
			side: THREE.DoubleSide 
		} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.x = -Math.PI/2
		mesh.name = "geometry"
		return mesh;
	}
	_this.init();
}
Marble.Barrier.prototype = Object.create( THREE.Object3D.prototype );
Marble.Barrier.prototype.constructor = Marble.Barrier;

/**
 * 球
 */
Marble.Ball = function(r,ball){
	var _this = this;
	var RADIUS = r,			//圆柱半径
		BALL = ball,		//球半径
		SEGMNTATION = 32,	//横截面
		WIDTH = 15;			//外圆半径
	var JUMP = {			//跳
			height : 12,
			duration :350
		},
		_jump = null,
		_playJump = false,
		_playFall = false,
		_pos = 0;
	var __ball = null,		//球
		_gravity = 0.05,	//重力增加
		_gravityInit = 3,	//初始重力
		_gravityMax = 4.49;	//最大重力
	var __ghost = null,		//残影
		__partice = null,	//粒子
		_isGhost = true,	//是否开启残影
		_isPartice = true; //是否开启粒子
		
	var _fall = false;
	var _score = 1;	//累计加分  初始值1 
	
	_this.init = function(){
		THREE.Object3D.call(_this);
		__ball = addBall();
		__ball.position.z = RADIUS+(WIDTH-RADIUS)/2
		_this.add(__ball);
		if(_isGhost){
			__ghost = new Marble.Ghost();
			_this.add(__ghost);
		}
		if(_isPartice){
			__partice = new Marble.Partice();
			_this.add(__partice);
		}
	}
	/**
	 * 获取粒子
	 */
	_this.getPartice = function(n){
		return __partice;
	}
	_this.playGhost = function(environment,clock){
		if(__partice) __partice.updateParticle();
		if(__ghost) __ghost.play(__ball.position.clone(),environment.rotation.clone(),clock)
	}
	/**
	 * 添加球体
	 */
	function addBall(){
		var geometry = new THREE.SphereGeometry( BALL, SEGMNTATION, SEGMNTATION );
		var material = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
		var sphere = new THREE.Mesh( geometry, material );
		return sphere;
	}
	/**
	 * 跳
	 */
	_this.jump = function(){
		_pos = __ball.position.clone();
		_pos.y = parseInt(__ball.position.clone().y/20)*20
		__ball.position.y = _pos.y;
		_jump = new TWEEN.Tween(__ball.position)
			.to({y:_pos.y+JUMP.height},JUMP.duration)
			.easing(TWEEN.Easing.Cubic.Out)
		var fall = new TWEEN.Tween(__ball.position)
			.to({y:_pos.y},JUMP.duration)
			.easing(TWEEN.Easing.Quadratic.In)
			.onComplete(function(){
				_playJump = false;
			})
		_jump.chain(fall)
		_jump.start()
		_gravityInit = 1;
		_score = 1;
	}
	/**
	 * 开始跳
	 */
	_this.playJump = function(){
		_this.showPartice();
		if(!_playJump) {
			_this.jump()
			_playFall = false;
			_playJump = true
		}
	}
	_this.showPartice = function(){
		__partice.setPos(__ball.position.clone());
		__partice.setNumber(100)
		setTimeout(function(){
			__partice.setNumber(0)
		},100)
	}
	/**
	 * 踩空，下落
	 */
	_this.fall = function(barrier,field){
//		return false
		if(!_playFall){
			_playFall = true	
			if(!barrier.del){
				barrier.del = true
				var e = { type: Marble.Event.BALL_FALL,data:_score++};
				_this.dispatchEvent(e);
			}
			setTimeout(function(){
				barrierVanish(barrier,field)
			},100)
		}
	}
	/**
	 * 开始下落
	 */
	_this.playFall = function(camera){
		if(_playFall){
			_gravityInit+=_gravity
			_gravityInit = _gravityInit>_gravityMax ? _gravityInit = _gravityMax: _gravityInit
//			$(".a").html(_gravityInit)
			__ball.position.y-= _gravityInit
			camera.position.y = __ball.position.y+15;
		}
		if(Math.abs(parseInt(camera.position.y-15))%20 <= 1){
			_playFall = false
		}
	}
	/**
	 * 死亡
	 */
	_this.ballDie = function(){
		__ball.position.y = parseInt(__ball.position.clone().y/20)*20
		var e = { type: Marble.Event.BALL_DIE};
		_this.dispatchEvent(e);
	}
	/**
	 * 砸碎,破封
	 */
	_this.breakSmash = function(barrier,field){
//		barrierVanish(barrier,field)
		barrier.visible = false
	}
	function barrierVanish(barrier,field){
		field.removeBarrier(barrier);
	}
	/**
	 * 获取球
	 */
	_this.getBall = function(){
		var v = __ball.position.clone();
		return _this.localToWorld(v);
	}
	_this.getBallPos = function(){
		return __ball.position.clone();
	}
	/**
	 * 获取球重力速度
	 */
	_this.getGravity = function(){
		return _gravityInit
	}
	_this.init();
}
Marble.Ball.prototype = Object.create( THREE.Object3D.prototype );
Marble.Ball.prototype.constructor = Marble.Ball;

/**
 * 残影
 */
Marble.Ghost = function(){
	var _this = this;
	var WIDTH = 30,
		HEIGHT = 30;
	var INTERVAL = 700;
	var _material = new THREE.SpriteMaterial( {
			map:new THREE.CanvasTexture(generateSprite()),
			blending:THREE.AdditiveBlending
		} );
	_this.init = function(){
		THREE.Object3D.call(_this);
	}
	_this.play = function(pos,rot,clock){
		particle = new THREE.Sprite( _material );
		particle.scale.set(2,2,2)
		_this.setPos(particle,pos,rot)
		_this.playTween(particle)
		_this.add(particle)
	}
	_this.setPos = function(obj,pos,rot){
		obj.position.copy(pos)
//		_this.revolution(obj,0,0,10,rot)
	}
    _this.revolution = function(obj,x0,y0, r,rot){		//圆心x 圆心y 半径r 角度a0
    	_this.rotation.y = rot.y
        obj.position.x = x0 + r*(Math.sin(-rot.y));
        obj.position.z = y0 + r*(Math.cos(-rot.y));
    };
	_this.playTween =function(obj){
		new TWEEN.Tween(obj.scale)
			.to({x : 0,y : 0,z : 0},INTERVAL)
			.onComplete(function(){
				_this.remove(obj)
			})
			.start();
	}
	/**
	 * 创建圆形
	 */
	function generateSprite(){
		var canvas = document.createElement("canvas");
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		var context = canvas.getContext('2d');
		var gradient = context.createRadialGradient(WIDTH / 2, HEIGHT / 2, 0, WIDTH / 2, HEIGHT / 2, WIDTH / 2);
		gradient.addColorStop( 0, 'rgba(255,0,0,1)');
		gradient.addColorStop( 0.2, 'rgba(255,0,255,1)');
		gradient.addColorStop( 0.7, 'rgba(0,255,0,1)');
		gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
		context.fillStyle = gradient;
		context.fillRect(0,0,WIDTH,HEIGHT);
//		canvas.style.position = "absolute"
//		$("body").append(canvas)
		return canvas;
	}
	_this.init();
}
Marble.Ghost.prototype = Object.create( THREE.Object3D.prototype );
Marble.Ghost.prototype.constructor = Marble.Ghost;

/**
 * 粒子系统
 */
Marble.Partice = function(){
	var _this = this;
	var _options = null,		//粒子系统
		_spawnerOptions = null,
		_tick = 0,
		_clock = new THREE.Clock(),
		__particleSystem = null;
	var __stats = 0,			//辅助参数
		_gui = 0;
	_this.init=function(){
		THREE.Object3D.call(_this);
		_this.initParticle();
	}
	_this.setNumber = function(n){
		_spawnerOptions.spawnRate = n
	}
	_this.setPos = function(pos){
		__particleSystem.position.copy(pos)
//		__particleSystem.position.z+=5
	}
	_this.initParticle = function(){
		__particleSystem = new THREE.GPUParticleSystem({
			maxParticles:25000
		})
		_this.add(__particleSystem);
		_options = {
			position : new THREE.Vector3(),
			positionRandomness : 0.98,
			velocity: new THREE.Vector3(),
			velocityRandomness: 1.75,
			color: 0xaa88ff,
			colorRandomness: 0.35,
			turbulence: 0.2,
			lifetime: 5,
			size: 11,
			sizeRandomness: 10.8
		}
		_spawnerOptions = {
			spawnRate:100,
			horizontalSpeed:1.5,
			verticalSpeed:1.33,
			size:11,
			timeScale : 3
		}
		if(_gui) _this.Gui();
	}
	/**
	 * 选择参数
	 */
	_this.Gui = function(){
		_gui = new dat.GUI( { width: 350 } ),
		_gui.add( _options, "velocityRandomness", 0, 3 );
		_gui.add( _options, "positionRandomness", 0, 3 );
		_gui.add( _options, "size", 1, 200 );
		_gui.add( _options, "sizeRandomness", 0, 25 );
		_gui.add( _options, "colorRandomness", 0, 1 );
		_gui.add( _options, "lifetime", .1, 10 );
		_gui.add( _options, "turbulence", 0, 1 );
		_gui.add( _spawnerOptions, "spawnRate", 0, 30000 );
		_gui.add( _spawnerOptions, "timeScale", -5, 15 );
	}
	/**
	 * 更新粒子
	 */
	_this.updateParticle = function(){
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
	_this.init()
}

Marble.Partice.prototype = Object.create( THREE.Object3D.prototype );
Marble.Partice.prototype.constructor = Marble.Partice;

/**
 * 落地贴图
 */
Marble.Chartlet = function(){
	var _this = this;
	var _i = 1;
	_this.init = function(){
		THREE.Object3D.call(_this);
	}
	_this.create = function(pos,rotate){
		var plane = createGeometry();
		if(pos) plane.position.y=0.001*_i
		if(rotate) _this.revolution(plane,0,0,10,rotate)
		_this.add(plane)
		_i++
	}
    _this.revolution = function(obj,x0,y0, r,rot){		//圆心x 圆心y 半径r 角度a0
        obj.position.x = x0 + r*(Math.sin(rot));
        obj.position.z = y0 + r*(Math.cos(rot));
    };
	function createGeometry(){
		var color = "rgba("+randomColor()+","+randomColor()+","+randomColor()+",1)";
//		console.log(color)
//		var geometry = new THREE.PlaneBufferGeometry( 5, 5, 0 );
//		var material = new THREE.MeshBasicMaterial( {
//			color: color,
//			side: THREE.DoubleSide
//		} );
//		var plane = new THREE.Mesh( geometry, material );
		var geometry = new THREE.CircleGeometry( 5/2, 32 );
		var material = new THREE.MeshBasicMaterial( { 
			color: color,
			side: THREE.DoubleSide
		} );
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = Math.PI*0.5
		return plane
	}
	function randomColor(){
		return parseInt(Math.random()*255)
	}
	_this.init()
}
Marble.Chartlet.prototype = Object.create( THREE.Object3D.prototype );
Marble.Chartlet.prototype.constructor = Marble.Chartlet;