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

var users = [];



io.on('connection', function(socket){
	socket.emit('join_session', drawnObjects);
	socket.on('disconnect', function(){
		var index = users.indexOf(socket.id);
		if(index > -1){
			users.splice(index,1);
			io.emit('update_users', users);
		}
	})
	users.push(socket.id);
	io.emit('update_users', users);
	socket.on('lineDrawn', function(coords) {
		drawnObjects.push({
			startX : coords.startX,
			startY : coords.startY,
			endX : coords.endX,
			endY : coords.endY
		});
		socket.broadcast.emit('updated_data', coords);
	});
	socket.on('isDrawing', function(client) {
		io.emit('user_is_drawing', client);
	});
	socket.on('clear_drawing', function (id) {
		drawnObjects = [];
		io.emit('restart_drawing_state', null);
	});
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname,'/public/index.html'));
});