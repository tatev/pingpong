'use strict';

var app = angular.module('pingPongApp', ['btford.socket-io', 'pingPongApp.AppCtrl', 
											'pingPongApp.changePosition', 'pingPongApp.fastClick']);

angular.module('pingPongApp.AppCtrl', []);
angular.module('pingPongApp.changePosition', []);
angular.module('socket', []);
angular.module('pingPongApp.fastClick', []);
angular.module('Modernizr', []);