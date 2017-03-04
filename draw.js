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
		startX = endX;
		startY = endY;
	}
})

cEl.mousedown(function(e){
	var offset = $(this).offset();
	mouseDown = true;
	startX = e.pageX - offset.left;
	startY = e.pageY - offset.top;
});