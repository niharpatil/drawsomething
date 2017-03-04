var express = require('express');
var path = require('path');

var server = express();

// app.set('view engine', 'hbs');

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// io.on('connection', function(){
// 	console.log('client has connected');
// });


server.use(express.static('public'));
var port = 3000;


server.listen(port, function(){
	console.log('listening on port ' + port);
});

server.get('/', function(request, response) {
	response.sendFile(path.join(__dirname+'/public/index.html'));
});