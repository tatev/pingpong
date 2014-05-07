'use strict';

app.controller('AppCtrl', function ($scope, socket) {

  socket.on('start', function (data) {
    $scope.btnVal = data.msg === 1 ? 'PING' : 'PONG';
  });

  socket.on('changestate', function(data) {
    $scope.btnVal = $scope.btnVal === 'PING' ? 'PONG' : 'PING';
  });

  $scope.btnClick = function() {
    var text = $scope.btnVal;
    socket.emit('click', { msg: text });
    $scope.btnVal = text === 'PING' ? 'PONG' : 'PING';
  };

});