var express = require('express');
var path = require('path');
var app = express();
app.set('view engine', 'hbs');
var server = require('http').createServer(app);

var port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.static('node_modules/socket.io-client'))

server.listen(port, function(){
	console.log('listening on port ' + port);
});

var io = require('socket.io')(server);

var drawnObjects = [];

io.on('connection', function(socket){
	socket.emit('join_session', drawnObjects);
	io.emit('user_joined', socket.id);
	socket.on('lineDrawn', function(coords) {
		drawnObjects.push({
			startX : coords.startX,
			startY : coords.startY,
			endX : coords.endX,
			endY : coords.endY
		});
		socket.broadcast.emit('updated_data', coords);
	});
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname,'/public/index.html'));
});