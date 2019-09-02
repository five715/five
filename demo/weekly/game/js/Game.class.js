var Game = {};
Game.VER = '1.0.0';
Game.Event = {
    ATTACK : 'attack',//攻击
    DIE : 'die', //死亡
    ATTRMAP:'attrMap',  //显示地图属性
    ATTRTROOPS:'attrTroops' //显示部队属性
}

/**
 * 预先加载
 */
Game.Preload = {
    _queue : null,
    _images : [
        {id:"type1",src:'type_1.png'},
        {id:"type2",src:'type_2.png'},
        {id:"type3",src:'type_3.png'}
    ],
    /**
     * 初始化
     */
    init :function(){
        this._queue = new createjs.LoadQueue(true);
        this._queue.loadManifest(this._images, false, "images/");
    },
    /**
     * 加载
     */
    load : function(progress,complete){
        if(!this._queue) this.init();
        if(progress) this._queue.on('progress', progress, this);
        if(complete) this._queue.on('complete', complete, this);
        this._queue.load();
    },
    /**
     * 获取loader
     */
    getQueue : function () {
        return this._queue;
    },
    /**
     * 获取文件实体
     */
    getResult : function(id){
        return this._queue.getResult(id);
    }
}

/**
 * 主函数
 */
Game.main = function (canvas) {  
    var _this = this;
    var FPS = 60;
    var WIDTH = 800,
        HEIGHT = 600;
    var _map = null;//地图
    _this.init = function (canvas) {
        _this.Stage_constructor(canvas);
        createjs.Ticker.setFPS = FPS;
        createjs.Ticker.addEventListener('tick', _this);
        createjs.Touch.enable(_this);

        _map = new Game.map(WIDTH,HEIGHT);
        _map.on(Game.Event.ATTRMAP,mapAttr)
        _map.on(Game.Event.ATTRTROOPS,troopsAttr)
        _this.addChild(_map);
    }
    /**
     * 地图块属性
     */
    function mapAttr(e){
        $("#data li").eq(0).find("b").text(e.data.name)
        $("#data li").eq(1).find("b").text(e.data.x)
        $("#data li").eq(2).find("b").text(e.data.y)
        
    }
    /**
     * 部队属性
     */
    function troopsAttr(e){
        var obj = e.data;
        var lis = [];
        for(o in obj) lis.push("<p>"+o+":"+obj[o]+"</p>")
        $("#attr li").html(lis)
    }
    _this.addTroops =function(){
        _map.addTroops();
    }
    _this.init(canvas)
}
Game.main.prototype = createjs.extend(Game.main, createjs.Stage);
Game.main = createjs.promote(Game.main ,'Stage');


/**
 * 添加地图场景
 */
Game.map = function(w,h){
    var _this = this;
        //地图
    var ROW = 16,
        ROL = 16,
        W = 100,
        H = 100,
        WIDTH = w,
        HEIGHT = h;
        //元素块
    var  COLOR = [
        {"name":"山脉","color":"#fcff00"},
        {"name":"树林","color":"#12ff00"},
        {"name":"河流","color":"#0c00ff"},
        {"name":"道路","color":"#ccc"},
        {"name":"平地","color":"#fff"}
    ]
        //移动参数
    var _x = 0,
        _y = 0,
        _newX = 0,
        _newY = 0,
        MAXW = ROW*W-WIDTH,
        MAXH = ROL*H-HEIGHT;

    var _isMove = false; //是否在移动地图
    var __troops = null,    //部队组
        __boxess = null,    //地图组
        _attack = null;     //攻击按钮
    var __troopsArr = [];   //部队坐标
    _this.init = function(){
        _this.Container_constructor();	//构造
        __troops = new createjs.Container();
        __boxess = new createjs.Container();
        _this.addChild(__boxess,__troops)

        for(var i = 0 ; i < ROW ; i ++){
            for(var j = 0 ; j < ROL; j ++){
                var obj =COLOR[Math.floor(Math.random()*COLOR.length)]
                var boxes = _this.addColor(i,j,obj);
                boxes.data = {x:i+1,y:j+1,name:obj.name};
                boxes.on("click",boxesClick);
                __boxess.addChild(boxes);
            }
        }
        
        _this.control();
        _attack = new Game.attack();
        _attack.on(Game.Event.ATTACK, onEventAttack)
        _this.addChild(_attack);
    }
    /**
     * 收到攻击
     */
    function onEventAttack(e){
        var obj = __troops.getChildByName(e.data)
        console.log(obj)
        
        var evt = new createjs.Event(Game.Event.ATTRTROOPS)
        evt.data = obj.onAttack();
        _this.dispatchEvent(evt);
        
    }

    /**
     * 添加拖动功能
     */
    _this.control = function () {  
        _this.on("mousedown",function(e){
            _isMove = false;
            _x = e.stageX;
            _y = e.stageY;
            _newX = _this.x;
            _newY = _this.y;
        })
        _this.on("pressmove",function(e){
            _isMove = true;
            _this.x = scopeCount(e.stageX-_x+_newX,MAXW)
            _this.y = scopeCount(e.stageY-_y+_newY,MAXH)
        })
    }
    /**
     * 范围计算
     */
    function scopeCount(n,max){
        return 0 < n ? 0 : -max > n ? -max : n;
    }
    /**
     * 元素块点击
     */
    function boxesClick(e){
        console.log(this.data,this.name,_isMove)
        if(_isMove) return
        // _this.x = scopeCount(-(this.data.x*W-W/2-WIDTH/2),MAXW)
        // _this.y = scopeCount(-(this.data.y*H-H/2-HEIGHT/2),MAXH)
        _attack.hide();

        new createjs.Tween.get(_this)
            .to({
                x: scopeCount(-(this.data.x*W-W/2-WIDTH/2),MAXW),
                y: scopeCount(-(this.data.y*H-H/2-HEIGHT/2),MAXH)
            },350)


        var evt = new createjs.Event(Game.Event.ATTRMAP)
        evt.data = this.data;
        _this.dispatchEvent(evt);
    }
    /**
     * 添加元素块
     */
    _this.addColor = function(x,y,obj){
        var boxes = new createjs.Shape();
        boxes.graphics.beginStroke("#000000").f(obj.color).dr(x*W,y*H,W,H)
        boxes.name = (x+1)+'_'+(y+1);
        return boxes;
    }
    /**
     * 添加部队
     */
    _this.addTroops =function(){
        var i = Math.floor(Math.random()*ROW+1),
            j = Math.floor(Math.random()*ROL+1)
        var n = i+'_'+j;
        var isN = __troopsArr.indexOf(n)
        if(__troopsArr.length >= ROW*ROL){
            console.log("已满")
            return;
        }
        // console.log(n,isN);
        if(isN == -1) {
            __troopsArr.push(n)
            new createjs.Tween.get(_this)
            .to({
                x: scopeCount(-(i*W-W/2-WIDTH/2),MAXW),
                y: scopeCount(-(j*H-H/2-HEIGHT/2),MAXH)
            },350)
            .call(function(){
                var troops = new Game.troops();
                troops.on(Game.Event.DIE, function(){
                    __troopsArr.splice(__troopsArr.indexOf(troops.name),1)
                    __troops.removeChild(troops)
                })
                console.log(n)  
                troops.x = i*W-W;
                troops.y = j*H-H;
                troops.name = n;
                troops.data = {x:i,y:j,name:n}
                troops.alpha = 0;
                __troops.addChild(troops)
                new createjs.Tween.get(troops).to({alpha:1},500).call(function(){
                    this.on('click',_this.showBtn)
                })
            })
        }else{
            _this.addTroops();
        }
    }
    /**
     * 显示攻击按钮
     */
    _this.showBtn =function(e){
        var boxes = __boxess.getChildByName(this.data.name)

        var evt = new createjs.Event(Game.Event.ATTRMAP)
        evt.data = boxes.data;
        _this.dispatchEvent(evt);
        
        var evt = new createjs.Event(Game.Event.ATTRTROOPS)
        evt.data = this.attr;
        _this.dispatchEvent(evt);

        _attack.show(this.data.x*W-W,this.data.y*H,this.name)
    }
    _this.init();
}
Game.map.prototype = createjs.extend(Game.map, createjs.Container);
Game.map = createjs.promote(Game.map, "Container");


/**
 * 部队
 */
Game.troops = function(){
    var _this =this;
    var ORDER = 1,  //次序
        _morale = 100,   //士气
        _state = "正常", //状态
        _amount = 50, //数量
        _hp = 50    //当前生命值
        HP = 50,    //生命值
        DP = 10,
        AP = 10,
        MV = 3;

    var TYPE = [
            {type:1,name:"步兵"},
            {type:2,name:"骑兵"},
            {type:3,name:"弓兵"}
        ]
    var TEXT = {
            font:"18px Arial",
            color:"#fff"
        },
        EDGE = 5,
        W = 100,
        H = 100;
    var __amount = null

    _this.init = function(){
        _this.Container_constructor();	//构造
        var bg = new createjs.Shape();
        bg.graphics.beginStroke("#000000").f('red').dr(0,0,100,100);
        //兵种
        var troops = Game.common.addBitmap('type'+Math.floor(Math.random()*3+1), {x:0,y:0,w:100,h:100});
        //属性
        var morale = new createjs.Text(_morale, TEXT.font, TEXT.color);
        var order = new createjs.Text(ORDER, TEXT.font, TEXT.color);
        var state = new createjs.Text(_state, TEXT.font, TEXT.color);
        __amount = new createjs.Text(_amount, TEXT.font, TEXT.color);
        _this.setFourPos(order,morale,state,__amount)
        _this.attr = {hp:_hp,amount:_amount}

        _this.addChild(bg, troops, morale,order,state,__amount);
    }
    /**
     * 收到攻击
     */
    _this.onAttack = function (e) { 
        var random = Math.floor(Math.random()*1000+1)   //1-1000
        var zHp = _this.attr.amount*HP+_this.attr.hp-HP
        var xHp = zHp - random


        var text = new createjs.Text('-'+random, TEXT.font, '#00ffff');
        text.x = W/2;
        text.textAlign = 'center'
        _this.addChild(text)
        new createjs.Tween.get(text).to({y:-10},1000).call(function(){
            _this.removeChild(this)
        })

        if(xHp <= 0 ){
            _this.attr.amount = __amount.text = 0
            _this.attr.hp = 0
            
            var evt = new createjs.Event(Game.Event.DIE)
            _this.dispatchEvent(evt)
        }else{
            _this.attr.amount = __amount.text = Math.floor(xHp/50)
            _this.attr.hp = Math.floor(xHp%50)
        }
        return _this.attr;

        console.log(zHp,xHp,random);
    }
    /**
     * 设置参数
     */
    _this.setFourPos = function(one , two , three , four){
        two.textAlign = four.textAlign = 'right'

        one.x = one.y = two.y = three.x = EDGE
        two.x = four.x =  W - EDGE;
        three.y = four.y = H-EDGE-18
    }
    _this.init();
}
Game.troops.prototype = createjs.extend(Game.troops, createjs.Container);
Game.troops = createjs.promote(Game.troops, "Container");

/**
 * 攻击
 */
Game.attack = function(){
    var _this =this;
    var W = 100,
        H = 20;

    _this.init = function(){
        _this.Container_constructor();	//构造

        var boxes = new createjs.Shape();
        boxes.graphics.beginStroke("red").f('#ccc').dr(0,0,W,H);
        var text = new createjs.Text("随机受到伤害","10px",'#000')
        text.textAlign = 'center';
        text.x = W/2;
        text.y = 2;
        _this.visible = false;
        _this.addChild(boxes,text)

        _this.on('click',function(){
            var evt = new createjs.Event(Game.Event.ATTACK)
            evt.data = _this.name;
            _this.dispatchEvent(evt)
            _this.hide();
        })
    }
    /**
     * 显示隐藏
     */
    _this.show = function(x,y,name){
        _this.x = x;
        _this.y = y-H;
        _this.visible = true;
        _this.name = name;
        console.log(_this)
    }
    _this.hide = function(){
        _this.visible = false;
    }
    _this.init();
}
Game.attack.prototype = createjs.extend(Game.attack, createjs.Container);
Game.attack = createjs.promote(Game.attack, "Container");



/**
 * 公用
 */
Game.common = {
	/**
	 * 添加图片
	 */
	addBitmap : function(id, obj){
		if(!obj.v) obj.v = true;
		var bit = new createjs.Bitmap(Game.Preload.getResult(id));
		bit.x = obj.x;
        bit.y = obj.y;
        if(obj.w || obj.h){
            var o = bit.getBounds()
            if(obj.w) bit.scaleX = obj.w/o.width;
            if(obj.h) bit.scaleY = obj.h/o.height;
        }
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