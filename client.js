var pathname = window.location.pathname;
var namespace = pathname.substring(8);
var socket = io('/'+namespace);

socket.on('update_users', function(users) {
	$('#users').html('');
	users.forEach(function(user){
		$('#users').append('<li class="collection-item">'+user.username+'</li>');
	})
});

socket.on('user_is_drawing', function (client) {
	$('#drawers').html(client.username + ' is drawing at (' + client.xCoord +', ' + client.yCoord + ')' );
});

$('#clear').click(function(){
	socket.emit('clear_drawing', socket.id);
});

module.exports = socket