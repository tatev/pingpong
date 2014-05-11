'use strict';

app.directive('changePosition', ['$interval', '$window', function($interval, $window) {
    return function(scope, element, attr) {

      $interval(function() {
        var top = Math.floor(Math.random() * ($window.innerHeight - 200));
        var left = Math.floor(Math.random() * ($window.innerWidth - 200));
        element.css('position', 'absolute');
        element.css('top', top + 'px');
        element.css('left', left + 'px');
      }, 1000);
      
    };
  }]);

app.directive('fastClick', function ($parse, Modernizr) {
console.log('fast click directive')
  'use strict';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.fastClick),
        startX,
        startY,
        canceled,

        clickFunction = function (event) {
          if (!canceled) {
            scope.$apply(function () {
              fn(scope, {$event: event});
            });
          }
        };


      if (Modernizr.touch) {

        element.on('touchstart', function (event) {
          event.stopPropagation();

          var touches = event.originalEvent.touches;

          startX = touches[0].clientX;
          startY = touches[0].clientY;

          canceled = false;
        });

        element.on('touchend', function (event) {
          event.stopPropagation();
          clickFunction();
        });

        element.on('touchmove', function (event) {
          var touches = event.originalEvent.touches;

          if (Math.abs(touches[0].clientX - startX) > 10 ||
            Math.abs(touches[0].clientY - startY) > 10) {
            canceled = true;
          }
        });
      }

      if (!Modernizr.touch) {
        element.on('click', function (event) {
          clickFunction(event);
        });
      }
    }
  };
});


app.provider('Modernizr', function () {

  'use strict';

  this.$get = function () {
    return Modernizr || {};
  };

});