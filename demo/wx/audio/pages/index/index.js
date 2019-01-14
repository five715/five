//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    sounds:[
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
    audios:{}
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
    console.log(e,_this.data.sounds[dataset.i]);
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
    console.log(audio);
  },
  onLoad: function () {
  } 
})
