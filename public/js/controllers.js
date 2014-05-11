'use strict';

app.controller('AppCtrl', function ($scope, socket) {
  $scope.state;
  $scope.player;
  $scope.finished = false;
  $scope.history = [];
  $scope.msg;

  socket.on('start', function(data) {
    $scope.player = data.player;
    $scope.state = $scope.player === 'player1' ? 'ping' : 'pong';
    $scope.history.push(data.msg);    
  });

  socket.on('changestate', function(data) {
    $scope.state = $scope.state === 'ping' ? 'pong' : 'ping';
    $scope.history.push(data.msg);
  });

  socket.on('finished', function(data) {
    $scope.gameMsg = data.msg;
    if (data.winner === $scope.player) {
      $scope.msg = 'Congrats! You won! :)';
    } else if (data.winner === 'draw') {
      $scope.msg = 'You draw!';
    } else {
      $scope.msg = 'Sorry! You lost! :(';
    }
    alert($scope.gameMsg);
    $scope.finished = true;
  });

  $scope.btnClick = function() {
    socket.emit('click', { state: $scope.state });
  };

  $scope.tryAgain = function() {
    $scope.finished = false;
    $scope.history = [];
  };
});