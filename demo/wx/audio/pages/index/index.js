//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    sounds:[
      {src:"effet1_poulll_a",color:"red"},
      {src:"effet2_tucati_a",color:"red"},
      {src:"effet3_tuilopta_a",color:"red"},
      {src:"effet4_tululou_a",color:"red"},
      {src:"effet5_tumttt_a",color:"red"},
      {src:"melo1_nananana_a",color:"red"},
      {src:"melo2_pelulu_a",color:"red"},
      {src:"melo3_siffle_a",color:"red"},
      {src:"melo4_tatouti_a",color:"red"},
      {src:"melo5_tvutvutvu_a",color:"red"},
      {src:"voix1_isit_a",color:"red"},
      {src:"voix2_uare_a",color:"red"}
    ],
    audios:{},
    isStart : false, //是否开始记录
    time : 0,//时间
    t:0,//播放时间
    timer:null,//定时器
    arr:[]  //记录数据
  },  
  onReady(){
    var _this = this;
    var sounds = _this.data.sounds
    for(var i = 0 ; i < sounds.length;i++){
      _this.data.audios["sounds"+i] = wx.createInnerAudioContext()
      _this.data.audios["sounds"+i].loop = true
    }
  },
  onAudio(e){
    var _this =this;
    var target = e.target;
    var dataset = target.dataset;
    var audio = _this.data.audios[target.id];
    // console.log(e,_this.data.sounds[dataset.i],dataset.i);
    var obj = _this.data.sounds;
    if(obj[dataset.i].color == "red"){
      obj[dataset.i].color = "#000";
      audio.src=dataset.src;
      audio.play();
    }else{
      obj[dataset.i].color = "red"
      audio.stop()
    }
    _this.setData({
      sounds:obj
    })
    // console.log(audio);
    if(_this.data.isStart){
      var o = {}
      o.id = e.target.id
      if(obj[dataset.i].color == "red"){
        o.e = new Date().getTime() -_this.timeDate;
      }else{
        o.t = new Date().getTime() - _this.timeDate;
      }
    _this.data.arr.push(o)
    }
  },
  onStart(){
    var _this = this;
    _this.funcStop();
    this.setData({
      isStart:true,
      arr:[]
    },function(){
      _this.timeDate = new Date().getTime();
      _this.data.timer = setInterval(function(){
        _this.setData({
          time : new Date().getTime()-_this.timeDate
        })
      },10)
    })
  },
  onEnd(){
    var _this = this;
    console.log(_this.data.arr)
    this.setData({
      isStart:false
    },_this.funcStop)
  },
  funcStop(){
    var _this = this
    clearInterval(_this.data.timer);
    var audios = _this.data.audios
    for(var audio in audios) {
      audios[audio].stop();
      // console.log(audio.split("sounds"),audio)
      _this.data.sounds[audio.split("sounds")[1]].color = "red";
      _this.setData({
        sounds : _this.data.sounds
      })
    }
  },
  onPlay(){
    var _this = this;
    var arr = _this.data.arr
    var obj = _this.data.sounds
    _this.timeDate = new Date().getTime();
    _this.data.timer = setInterval(function(){
      var t = new Date().getTime() - _this.timeDate
      if(t >= _this.data.time) {
        _this.funcStop();
        return false;
      }
      arr.forEach((arr)=>{
        if(t >= arr.t && !arr.s){
          _this.data.audios[arr.id].play()
          obj[arr.id.split("sounds")[1]].color = '#000';
          arr.s = true
        }else if(t >= arr.e && !arr.s){
          _this.data.audios[arr.id].stop();
          obj[arr.id.split("sounds")[1]].color = "red";
          arr.s = true
        }
      })
      _this.setData({
        t:t,
        sounds:obj
      })
    },10)
  },
  onLoad: function () {
  } 
})
