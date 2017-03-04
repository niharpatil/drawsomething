var express = require('express');
var path = require('path');
var app = express();
app.set('view engine', 'hbs');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
app.use(express.static('public'));

server.listen(port, function(){
	console.log('listening on port ' + port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
	socket.on('lineDrawn', function(coords) {
		socket.broadcast.emit('updated_data', coords);
	});
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname,'/public/index.html'));
});