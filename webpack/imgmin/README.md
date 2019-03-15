# cube show is a project with ar for tencent.
show some cube fly from a box.
CubeShow is the class of game,I defined it to the global,you can construct anywhere.

## Build Setup

``` bash

##  设置bat文件   
start cmd /k "echo 压缩图片 && cd/d D:\working\git\fiveGit\webpack\imgmin && npm run build && start dist\src && exit"

#1 install dependencies
npm install

#2 build for production with minification
npm run build
```

## use by javascript
``` javascript
var game = new CubeShow.main(canvasElement);
game.launch();
```