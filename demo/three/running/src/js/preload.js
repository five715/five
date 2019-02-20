

const pattern = /\/(.*)\.(mp3|png|jpg|gif|fbx)$/;

let _images = [];
var imgContext = require.context("../textures/", false, /.(png|jpg|gif)$/);
imgContext.keys().map(imgContext).forEach((src) => {
	let o = {};
	let arr = src.match(pattern);
	o.id = arr[1].split("/")[1]
	o.src = src
	_images.push(o)
})

let _sounds = [];
var soundContext = require.context("../sounds/", false, /^\.\/.*\.mp3$/);
soundContext.keys().map(soundContext).forEach((src) => {
	let o = {};
	let arr = src.match(pattern);
	o.id = arr[1].split("/")[1]
	o.src = src
	_sounds.push(o)
})

let _objs = [];
var soundContext = require.context("../models/", false, /^\.\/.*\.fbx$/);
soundContext.keys().map(soundContext).forEach((src) => {
	let o = {};
	let arr = src.match(pattern);
	o.id = arr[1].split("/")[1]
	o.src = src
	_objs.push(o)
})

/**
 * 预先加载
 */
var _queue = null; //loder
/**
 * 初始化
 */
var init = function () {
	_queue = new createjs.LoadQueue(false);
	_queue.loadManifest(_images, false);
	_queue.loadManifest(_objs, false);
	_queue.loadManifest(_sounds, false);
}
/**
 *	加载
*/
var load = function (progress, complete) {
	if (!_queue) init();
	if (progress) _queue.on("progress", progress, this);//资源载入中
	if (complete) _queue.on("complete", complete, this);//资源载入完毕
	_queue.load();
}
/**
 *	获取loader
*/
var getQueue = function () {
	return _queue;
};
/**
 *	获取文件实体
*/
var getResult = function (id) {
	return _queue.getResult(id)
}

export { load, getResult };