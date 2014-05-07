'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.set('log level', 1);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
});
var speeds = {};
io.sockets.on('connection', function (socket) {
	var clientsCount = io.sockets.clients().length
	
	if (clientsCount <= 2) {
		if (!speeds || !speeds[socket.id]) {
			speeds[socket.id] = [];
		}
		
		socket.emit('start', { msg: clientsCount });
		socket.on('click', function (data) {
			var dt = new Date();
			speeds[socket.id].push(dt);
			socket.broadcast.emit('changestate', { msg: 'changing state' });
		});
	} else {
		console.log('speeds', speeds);
	}
	
});

server.listen(3000, function() {
	console.log('Express server listening on port ' + app.get('port'));
});