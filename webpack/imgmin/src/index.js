

const pattern = /\/(.*)\.(png|jpg|gif)$/;
//声音

let _images = [];
var imgContext = require.context("./", true, /^\.*\/.*\.(png|jpg|gif)$/);
imgContext.keys().map(imgContext).forEach((src) => {
    let o = {};
	let arr = src.match(pattern);
	let name = arr[1];
	o.id = name;
	o.src = src;
	_images.push(o);
});

