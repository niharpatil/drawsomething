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

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:true
}))

var namespaces = []

function isInArray(value, array) {
	if(!array || !value){
		return false;
	}
  return array.indexOf(value) > -1;
}

app.post('/joinroom', function(req,res){
	if(req.body.canvas_join && isInArray(req.body.canvas_join, namespaces)){
		var namespace = req.body.canvas_join
		res.redirect('/canvas/'+namespace);
	} else {
		res.redirect('/');
	}
})

app.post('/createroom', function (req,res){
	if(req.body.canvas_create){
		var namespace = req.body.canvas_create
		buildNamespace(namespace)
		namespaces.push(namespace)
		res.redirect('/canvas/'+namespace);
	} else {
		res.redirect('/');
	}
})

app.get('/canvas/:id', function(req, res) {
	var space = req.params.id;
	if(isInArray(space, namespaces)){
		res.sendFile(path.join(__dirname,'/public/canvas.html'));
	} else {
		res.redirect('/');
	}
});

var io = require('socket.io')(server);

var buildNamespace = function(namespace){
	var drawnObjects = [];
	var users = [];
	var randomUserModule = require('./randomName');
	var randomUserName = function randomUserName(){
		var username = randomUserModule.randomEl(randomUserModule.adjectives) + ' ' + randomUserModule.randomEl(randomUserModule.nouns);
		return username;
	}
	function arrayObjectIndexOf(myArray, property, searchTerm) {
	    for(var i = 0, len = myArray.length; i < len; i++) {
	        if (myArray[i][property] === searchTerm) return i;
	    }
	    return -1;
	}

	var nsp = io.of(namespace)
	nsp.on('connection', function(socket){
		socket.emit('join_session', drawnObjects);
		socket.on('disconnect', function(){
			var index = arrayObjectIndexOf(users,'id', socket.id);
			if(index > -1){
				users.splice(index,1);
				nsp.emit('update_users', users);
			}
		});
		users.push({
			id: socket.id,
			username: randomUserName()
		});
		nsp.emit('update_users', users);
		socket.on('lineDrawn', function(coords) {
			drawnObjects.push({
				startX : coords.startX,
				startY : coords.startY,
				endX : coords.endX,
				endY : coords.endY,
				lineThickness: coords.lineThickness,
				lineColor: coords.lineColor
			});
			socket.broadcast.emit('updated_data', coords);
		});
		socket.on('isDrawing', function(client) {
			var index = arrayObjectIndexOf(users,'id', socket.id);
			var username = users[index].username;
			client.username = username;
			nsp.emit('user_is_drawing', client);
		});
		socket.on('clear_drawing', function (id) {
			drawnObjects = [];
			nsp.emit('restart_drawing_state', null);
		});
		socket.on('drawText', function(text) {
			nsp.emit('draw_text', text);
		})
	});
}




