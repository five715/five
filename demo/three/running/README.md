# cube show is a project with ar for tencent.
show some cube fly from a box.
CubeShow is the class of game,I defined it to the global,you can construct anywhere.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:5000
npm run server

# open chrome to localhost:5000
start "C:\Users\Administrator\AppData\Local\Google\Chrome\Application\chrome.exe"  http://localhost:5000

# build for production with minification
npm run build
```


## use by javascript
``` javascript
var game = new CubeShow.main(canvasElement);
game.launch();
```