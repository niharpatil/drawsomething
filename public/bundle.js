/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var socket = io('http://drawsocket.herokuapp.com/');


socket.on('update_users', function(users) {
	$('#users').html('');
	users.forEach(function(user){
		$('#users').append('<li> Username: '+user.username+'</li>');
	})
});

socket.on('user_is_drawing', function (client) {
	$('#drawers').html(client.username + ' is drawing at (' + client.xCoord +', ' + client.yCoord + ')' );
});

$('#clear').click(function(){
	socket.emit('clear_drawing', socket.id);
});

module.exports = socket

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var cEl = $('#myCanvas');

var socket = __webpack_require__(0)

var started = false;
var mouseDown = false;

var startX = 0;
var startY = 0;

var endX = 0;
var endY = 0;

var isDrawing = false;

socket.on('updated_data', function(coords) {
	context.beginPath();
	context.moveTo(coords.startX,coords.startY);
	context.lineTo(coords.endX,coords.endY);
	context.stroke();
});

socket.on('restart_drawing_state', function (smth) {
	context.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('join_session', function(drawnObjects) {
	drawnObjects.forEach(function(coords){
		context.beginPath();
		context.moveTo(coords.startX,coords.startY);
		context.lineTo(coords.endX,coords.endY);
		context.stroke();
	});
});

cEl.mouseup(function(){
	mouseDown = false;
	socket.emit('is_not_drawing', socket.id);
});

cEl.mousemove(function(e){
	if(mouseDown) {
		var offset = $(this).offset();
		context.beginPath();
		context.moveTo(startX,startY);
		endX = e.pageX - offset.left;
		endY = e.pageY - offset.top;
		context.lineTo(endX,endY);
		context.stroke();
		socket.emit('lineDrawn', {
			startX: startX,
			endX: endX,
			startY: startY,
			endY: endY
		});
		socket.emit('isDrawing', {
			userid: socket.id,
			xCoord: endX,
			yCoord: endY
		});
		startX = endX;
		startY = endY;
	} else {
	}
})

cEl.mousedown(function(e){
	var offset = $(this).offset();
	mouseDown = true;
	startX = e.pageX - offset.left;
	startY = e.pageY - offset.top;
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


__webpack_require__(0)
__webpack_require__(1)

// import * as Vuestrap from 'vue-strap';

// Vue.component('users', require('./components/Users.vue'));

// const app = new Vue({
//     el: '#app',
//     components: {
//     	alert: Vuestrap.alert
//     }
// });

/***/ })
/******/ ]);