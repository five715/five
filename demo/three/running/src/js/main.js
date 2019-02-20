
import "three/examples/js/controls/DeviceOrientationControls";
import * as Preload from "./preload";

const VER = "1.0.0";

var main = function (container) {
    var _this = this;

    var WIDTH = 0,
        HEIGHT = 0

    var CAMERA = {
        x: 0,
        y: 0,
        z: 0,
        fov: 60,
        near: 10,
        far: 200
    }

    var __camera = null,
        __scene = null,
        __renderer = null;

    _this.init = function (container) {
        container = document.createElement("canvas")

        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        console.log(WIDTH, HEIGHT)

        __camera = new THREE.PerspectiveCamera(CAMERA.fov, WIDTH / HEIGHT, CAMERA.near, CAMERA.far);
        __camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z);

        __scene = new THREE.Scene();

        __renderer = new THREE.WebGLRenderer({ canvas: container });
        __renderer.setPixelRatio(window.devicePixelRatio);
        __renderer.setSize(WIDTH, HEIGHT);
        __renderer.setClearColor(0x00aaaa);
        document.body.appendChild(container);

        animate()
    }
    function animate() {
        requestAnimationFrame(animate);
        __renderer.clear();
        __renderer.render(__scene, __camera);

    }
    _this.init(container)
}
Object.assign(main.prototype, THREE.EventDispatcher.prototype);
main.prototype.constructor = main;

export { VER, Preload, main }