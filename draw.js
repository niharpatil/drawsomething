var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var cEl = $('#myCanvas');

var socket = require('./client')

var started = false;
var mouseDown = false;

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

cEl.mouseup(function(){
	mouseDown = false;
})

cEl.mousemove(function(e){
	if(mouseDown) {
		context.beginPath();
		context.moveTo(startX,startY);
		context.lineTo(e.pageX,e.pageY);
		context.stroke();
		socket.emit('lineDrawn', {
			startX: startX,
			endX: e.pageX,
			startY: startY,
			endY: e.pageY
		});
	}
})

cEl.mousedown(function(e){
	mouseDown = true;
	startX = e.pageX;
	startY = e.pageY;
});