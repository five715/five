/**
 *	非阻塞
var fs = require("fs");
var data = fs.readFileSync('input.txt')
fs.readFile('input.txt',function(err,data){
	if(err) return console.log(err);
	console.log(data.toString());
})
console.log('结束');
*/
/**
 * events模块
var events = require('events');
var eventEmitter = new events.EventEmitter();

var connectHandler = function connected(){
	console.log('连接成功.');
	
	eventEmitter.emit('data_received');
}
eventEmitter.on('connection',connectHandler);

eventEmitter.on('data_received',function(){
	console.log('数据接收成功.')	
})

eventEmitter.emit('connection')
console.log('结束');
 */
/**
 *	延时器
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
event.on('some_event',function(){
	console.log('some_event 事件触发');
})
setTimeout(function(){
	event.emit('some_event');
},1000)
console.log('结束')
*/
/**
 * 监听器
var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent',function(arg1,arg2){
	console.log('listener1',arg1,arg2);
})
emitter.on('someEvent',function(arg1,arg2){
	console.log('listener2',arg1,arg2);
})
emitter.emit('someEvent','arg1 参数','arg2 参数')
 */
/**
 * 监听器s
var events = require('events');
var eventEmitter = new events.EventEmitter();
var listener1 = function listener1(){
	console.log('监听器 listener1 执行.');
}
var listener2 = function listener2(){
	console.log('监听器 listener2 执行.');
}

eventEmitter.addListener('connection',listener1);
eventEmitter.on('connection',listener2);

var eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners+' 个监听器监听链接事件');

eventEmitter.emit('connection');

eventEmitter.removeListener('connection',listener1);
console.log('listener1 不再受监听.');

eventEmitter.emit('connection');

eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners+ ' 个监听器监听链接事件');

console.log('结束');

eventEmitter.emit('error');
 */
/**
 * buffer(缓冲区)
 */
const buf = Buffer.from('runoob','ascii');
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));







 