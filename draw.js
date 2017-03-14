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

var isDrawing = false;

var lineColor = 'black';
var lineThickness = 1;

$('#red').click(function(){
	lineColor='#c62828';
});
$('#blue').click(function(){
	lineColor='#1976d2';
});
$('#green').click(function(){
	lineColor='#388e3c';
});
$('#white').click(function(){
	lineColor='#ffffff';
});

$('#lineSize').val(1);
$('#lineSize').change(function(){
	lineThickness = $('#lineSize').val();
	$('#thickness').html('<h5>Thickness: ' + lineThickness + '</h5>');
})

socket.on('updated_data', function(coords) {
	context.beginPath();
	context.moveTo(coords.startX,coords.startY);
	context.lineTo(coords.endX,coords.endY);
	context.lineWidth=coords.lineThickness;
	context.strokeStyle=coords.lineColor;
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
		context.lineWidth=coords.lineThickness;
		context.strokeStyle=coords.lineColor;
		context.stroke();
	});
});

socket.on('draw_text', function(text) {
	context.fillText(text,200,100);
});

cEl.on('mouseup ', function(){
	mouseDown = false;
	socket.emit('is_not_drawing', socket.id);
});

cEl.on('mousemove ',function(e){
	if(mouseDown) {
		var offset = $(this).offset();
		context.beginPath();
		context.moveTo(startX,startY);
		endX = e.pageX - offset.left;
		endY = e.pageY - offset.top;
		context.lineTo(endX,endY);
		context.lineWidth = lineThickness;
		context.strokeStyle = lineColor;
		context.stroke();
		socket.emit('lineDrawn', {
			startX: startX,
			endX: endX,
			startY: startY,
			endY: endY,
			lineThickness: lineThickness,
			lineColor: lineColor
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

cEl.on('mousedown ', function(e){
	var offset = $(this).offset();
	mouseDown = true;
	startX = e.pageX - offset.left;
	startY = e.pageY - offset.top;
});