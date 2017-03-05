var socket = io('https://warm-journey-77092.herokuapp.com');


socket.on('update_users', function(users) {
	$('#users').html('');
	users.forEach(function(userid){
		$('#users').append('<li> UserId: '+userid+'</li>');
	})
});

socket.on('user_is_drawing', function (client) {
	$('#drawers').html(client.text + ' is drawing at (' + client.xCoord +', ' + client.yCoord + ')' );
});

module.exports = socket