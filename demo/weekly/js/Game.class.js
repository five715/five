var Game = {};
Game.VER = '1.0.0';
Game.Event = {

}

/**
 * 预先加载
 */
Game.Preload = {
    _queue : null,
    _images : [

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
        _this.addChild(_map);
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

    var _isMove = true; //是否在移动地图
    var __troops = null;    //部队组
    _this.init = function(){
        _this.Container_constructor();	//构造

        for(var i = 0 ; i < ROW ; i ++){
            for(var j = 0 ; j < ROL; j ++){
                var boxes = _this.addColor(W*i,H*j,COLOR[Math.floor(Math.random()*COLOR.length)]);
                boxes.data = {x:i+1,y:j+1};
                boxes.on("click",boxesClick);
                _this.addChild(boxes);
            }
        }
        
        _this.control();
        __troops = new createjs.Container();
        _this.addChild(__troops)
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
        if(_isMove) return
        // _this.x = scopeCount(-(this.data.x*W-W/2-WIDTH/2),MAXW)
        // _this.y = scopeCount(-(this.data.y*H-H/2-HEIGHT/2),MAXH)
        // console.log(-(this.data.x*W-W/2-WIDTH/2),_this.x)
        new createjs.Tween.get(_this)
            .to({
                x:scopeCount(-(this.data.x*W-W/2-WIDTH/2),MAXW),
                y: scopeCount(-(this.data.y*H-H/2-HEIGHT/2),MAXH)
            },350)


        $("#data li").eq(0).find("b").text(this.name)
        $("#data li").eq(1).find("b").text(this.data.x)
        $("#data li").eq(2).find("b").text(this.data.y)
    }
    /**
     * 添加元素块
     */
    _this.addColor = function(x,y,obj){
        var boxes = new createjs.Shape();
        boxes.graphics.beginStroke("#000000").f(obj.color).dr(x,y,WIDTH,HEIGHT)
        boxes.name = obj.name;
        return boxes;
    }
    /**
     * 添加部队
     */
    _this.addTroops =function(){
        var troops = new Game.troops();
        __troops.addChild(troops)
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
    var NUMBER = 50, //数量
        HP = 50,
        DP = 10,
        AP = 10,
        MV = 3;

    var TYPE = [
            {type:1,name:"步兵"},
            {type:2,name:"骑兵"},
            {type:3,name:"弓兵"}
        ]

    _this.init = function(){
        _this.Container_constructor();	//构造

    }
    _this.init();
}
Game.troops.prototype = createjs.extend(Game.troops, createjs.Container);
Game.troops = createjs.promote(Game.troops, "Container");