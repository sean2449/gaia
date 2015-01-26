'use strict';

(function(exports) {

  var TvAnimation = function TvAnimation() {

    this.GenerateBezierCurve = function tva_GenerateBezierCurve(bezierParam) {
      var p1 = bezierParam.p1;
      var p2 = bezierParam.p2;
      var p3 = bezierParam.p3;
      var p4 = bezierParam.p4;
      var a1 = 3.0 * p1;
      var b1 = 3.0 * (p3 - p1) - a1;
      var c1 = 1.0 - a1 - b1;
      var a2 = 3.0 * p2;
      var b2 = 3.0 * (p4 - p2) - a2;
      var c2 = 1.0 - a2 - b2;
      var curveX = function(t) {
        return ((c1 * t + b1) * t + a1) * t;
      };

      var curveY = function(t) {
        return ((c2 * t + b2) * t + a2) * t;
      };

      var solve = function(x, epsilon) {
        var t0;
        var t1;
        var t2;
        var x2;

        t0 = 0.0;
        t1 = 1.0;
        t2 = x;

        if (t2 < t0) {
          return t0;
        }
        if (t2 > t1) {
          return t1;
        }

        while (t0 < t1) {
          x2 = curveX(t2);
          if (Math.abs(x2 - x) < epsilon) {
            return t2;
          }
          if (x > x2) {
            t0 = t2;
          } else {
            t1 = t2;
          }
          t2 = (t1 - t0) * 0.5 + t0;
        }

        return t2;
      };

      return function(x) {
        return curveY(solve(x, 0.001));
      };
    };

    this.doCircleTransition = function tva_doCircleTransition(type, callback) {
      var circleElem = document.createElement('div');
      circleElem.className = 'tv-animation-circle';
      circleElem.classList.add('init');
      switch(type) {
        case 'shrink':
          circleElem.classList.add('shrink');
          break;
        case 'grow':
          circleElem.classList.add('grow');
          break;
      }
      document.body.appendChild(circleElem);
      window.getComputedStyle(circleElem).width;
      circleElem.classList.remove('init');
      circleElem.addEventListener('transitionend', function(evt) {
        if (evt.target === circleElem) {
          if (callback) {
            callback();
          }
          document.body.removeChild(circleElem);
        }
      });
    };
  };

  exports.TvAnimation = new TvAnimation();
})(window);
function step() {
  TvAnimation.doCircleTransition('grow', step);
}
step();