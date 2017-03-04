var socket = io('https://warm-journey-77092.herokuapp.com');

socket.on('user_joined', function(id) {
	var userItem = $('<li>').val(id);
	$('#users').append(userItem);
});

module.exports = socket