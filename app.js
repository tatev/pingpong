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
var started = false;
io.sockets.on('connection', function (socket) {
	var clientsCount = io.sockets.clients().length;
    var player;

    if (clientsCount > 2) {
        console.log('Sorry, you are a bit late :(');
    } else {
        player = 'player' + clientsCount;
        if (!speeds || !speeds[player]) {
            speeds[player] = [];
        }

        var time = new Date().getTime();
        //speeds[player].push(time);

        socket.emit('start', { count: clientsCount, msg: player + ' started game at ' + time, player: player });

        socket.on('click', function(data) {
            if (!started) {
                started = true;
                setTimeout(function() {
                    var now = new Date().getTime();

                    var player1clicks = speeds['player1'];
                    var player2clicks = speeds['player2'];

                    var plr1 = 0;
                    var plr2 = 0;

                    if (player1clicks.length === player2clicks.length) {
                        player1clicks.push(now);
                        for (var i = 0; i < player2clicks.length; ++i) {
                            plr2 += (player2clicks[i] - player1clicks[i]);
                            plr1 += (player1clicks[i + 1] - player2clicks[i]);    
                        }
                    } else {
                        for (var i = 0; i < player2clicks.length; ++i) {
                            plr2 += (player2clicks[i] - player1clicks[i]);
                            plr1 += (player1clicks[i + 1] - player2clicks[i]);    
                        }
                        plr2 += (now - player1clicks[player1clicks.length - 1]);
                    }

                    started = false;

                    io.sockets.emit('finished', { msg: 'Game over!', player1spenttime: plr1, player2spenttime: plr2, winner: plr1 > plr2 ? 'player2' : plr1 < plr2 ? 'player1' : 'draw' });
                }, 15000);
            }
            var dt = new Date().getTime();
            speeds[player].push(dt);
            io.sockets.emit('changestate', { msg: player + ' changed state at ' + dt });
        });
    }
});

server.listen(3000, function() {
	console.log('Express server listening on port ' + app.get('port'));
});