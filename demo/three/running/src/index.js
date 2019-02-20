import './css/style.less';
import $ from "jQuery";
import * as foo from "./js/main";
console.log(foo)

var _game = null;
$(function(){
    foo.Preload.load(progress, complete)
})


function progress(e){
    console.log(e.loaded)
}
function complete(e){
    _game = new foo.main();
}