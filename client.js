var socket = io('http://localhost:3000');


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