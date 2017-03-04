var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var cEl = $('#myCanvas');

var socket = require('./client')

var started = false;

var startX = 0;
var startY = 0;

var endX = 0;
var endY = 0;

socket.on('updated_data', function(coords) {
	context.beginPath();
	context.moveTo(coords.startX,coords.startY);
	context.lineTo(coords.endX,coords.endY);
	context.stroke();
});

cEl.mousedown(function(e){
	if (!started) {
		startX = e.pageX;
		startY = e.pageY;
		started = true;
	} else {
		endX = e.pageX;
		endY = e.pageY;
		context.beginPath();
		context.moveTo(startX,startY);
		context.lineTo(endX,endY);
		context.stroke();
		socket.emit('lineDrawn', {
			startX : startX,
			endX: endX,
			startY: startY,
			endY: endY
		})
		started = false;
	}
});