/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _SlotImage = __webpack_require__(1);

var _AnimateImage = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlotMachine = function SlotMachine() {
    var _this = this;

    _classCallCheck(this, SlotMachine);

    this.reels = [['apple.png'], ['banana.png'], ['melon.png']];
    this.reelArray = [];
    this.arrayImages = [];
    this.animateImage = new _AnimateImage.AnimateImage();

    this.draw = function () {

        //button listener, register click event
        document.getElementById('btnStart').addEventListener('click', function () {
            this.animate();
        }.bind(_this));

        var slotImage = new _SlotImage.SlotImage();

        _this.reels.forEach(function (img) {
            _this.arrayImages.push(slotImage.createImageNode(img));
        });

        //initialize the reels to apples
        document.getElementById("reel0").appendChild(_this.arrayImages[0].cloneNode(true));
        document.getElementById("reel1").appendChild(_this.arrayImages[0].cloneNode(true));
        document.getElementById("reel2").appendChild(_this.arrayImages[0].cloneNode(true));
    };

    this.animate = function () {
        var sound = document.getElementById("audio");
        sound.play(); // could comment if sound not needed
        var stake = document.getElementById('stakeSelector').value;
        _this.doFetch('<Request balance=\"100.00\" stake=\" ' + stake + '\" />', 'http://192.168.99.100:8888/serve'); //had to change this from localhost to ip address - 192.168.99.100 of local docker server
    };

    this.doFetch = function (Content, URL) {
        var fetchPromise = fetch(URL, {
            method: 'POST',
            //mode: 'no-cors',
            headers: new Headers({
                'Content-Type': 'text/xml; charset=utf-8',
                'Accept': '*/*',
                'Accept-Language': 'en-GB',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'Keep-alive',
                'Content-Length': Content.length
            }),
            body: Content
        });

        return fetchPromise.then(function (response) {
            return response.text();
        }).then(function (str) {
            if (str.includes("Error")) {
                throw Error(str);
            }
            return new window.DOMParser().parseFromString(str, "text/xml");
        }).then(function (data) {
            var slot = data.getElementsByTagName("SymbolGrid");
            var winnings = data.getElementsByTagName("Response");
            if (winnings.length != 0) {
                document.getElementById("balance").innerText = "Balance : " + winnings[0].attributes[0].value;
                document.getElementById("stake").innerText = "Stake : " + winnings[0].attributes[1].value;
                document.getElementById("win").innerText = "Win : " + winnings[0].attributes[2].value;
            }

            _this.reelArray = [];
            for (var i = 0; i < slot.length; i++) {
                var arr = slot[i].attributes[1].value.split(',');
                var fst = arr.splice(0, 1);
                document.getElementById("reel" + i).innerHTML = "";
                switch (Number(fst)) {
                    case 0:
                        _this.displayImages(0, i);
                        break;
                    case 1:
                        _this.displayImages(1, i);
                        break;
                    case 2:
                        _this.displayImages(2, i);
                        break;
                    default:
                        break;
                }
            }
        }).catch(function (error) {
            alert(error);
        });
    };

    this.displayImages = function (reelNo, i) {
        var imgNode = _this.arrayImages[reelNo];
        imgNode.id = "image" + reelNo;
        if (_this.reelArray.includes(reelNo)) {
            imgNode = _this.arrayImages[reelNo].cloneNode(true);
            imgNode.id = "image" + reelNo + reelNo;
        }

        document.getElementById("reel" + i).appendChild(imgNode);
        _this.animateImage.animateCSS(imgNode.id, 'fadeInDown');
        _this.reelArray.push(reelNo);
    };
}

//0 = apple
//1 = banana
//2 = melon

//On click of start button call fetch api
;

var x = new SlotMachine();
x.draw();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlotImage = function SlotImage() {
    _classCallCheck(this, SlotImage);

    this.createImageNode = function (fileName) {
        var image = new Image();
        image.src = fileName;
        return image;
    };
};

exports.SlotImage = SlotImage;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
            value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimateImage = function AnimateImage() {
            _classCallCheck(this, AnimateImage);

            this.animateCSS = function (element, animation) {
                        var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'animate__';
                        return (
                                    // We create a Promise and return it
                                    new Promise(function (resolve, reject) {
                                                var animationName = '' + prefix + animation;
                                                var node = document.getElementById(element);

                                                node.classList.add(prefix + 'animated', animationName);

                                                // When the animation ends, we clean the classes and resolve the Promise
                                                function handleAnimationEnd() {
                                                            node.classList.remove(prefix + 'animated', animationName);
                                                            node.removeEventListener('animationend', handleAnimationEnd);

                                                            resolve('Animation ended');
                                                }

                                                node.addEventListener('animationend', handleAnimationEnd);
                                    })
                        );
            };
};

exports.AnimateImage = AnimateImage;

/***/ })
/******/ ]);