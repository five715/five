var Alert = {};
Alert.VER = '1.0.0';
Alert.main = function() {
	var _this = this;
	var _maskAlert
	_this.init = function(){
		_maskAlert = document.createElement('div')
		_maskAlert.className = 'maskAlert wapMask';
		var alertText = document.createElement('div')
		alertText.className = 'alertText wapText';
		alertText.innerHTML = "敬请期待"
		var alertLine = document.createElement('div')
		alertLine.className = 'alertLine';
		var alertSure = document.createElement('div')
		alertSure.className = 'alertSure wapSure';
		alertSure.innerHTML = "确定"
		$(_maskAlert).append(alertText)
		$(_maskAlert).append(alertLine)
		$(_maskAlert).append(alertSure)
		$('.box').append(_maskAlert).css("height",window.innerHeight);
    	alertSure.addEventListener("click",_this.hide)
	}
	_this.show = function(txt){
	    $(".maskAlert").show();
	    $(".alertText").text(txt);
	}
	_this.hide = function(){
		$(_maskAlert).hide()
	}
	_this.init();
}