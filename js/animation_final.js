'use strict';

(function(exports) {

  var TvAnimation = function TvAnimation() {

    var Bezier = function(bezierParam) {
      var p1x = bezierParam[0];
      var p1y = bezierParam[1];
      var p2x = bezierParam[2];
      var p2y = bezierParam[3];
      var a1 = 3.0 * p1x;
      var b1 = 3.0 * (p2x - p1x) - a1;
      var c1 = 1.0 - a1 - b1;
      var a2 = 3.0 * p1y;
      var b2 = 3.0 * (p2y - p1y) - a2;
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

    this.circleIn = function(element, duration, bezierParam, callback) {
      var parentElement = element.parentElement;
      if(!parentElement) {
        return;
      }
      parentElement.removeChild(element);
      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;

      var maskElement = document.createElement('div');
      maskElement.classList.add('mask');
      maskElement.style.top = winHeight + 'px';
      maskElement.style.left = winWidth/2 + 'px';
      element.style.width = winWidth + 'px';
      element.style.height = winHeight + 'px';
      element.style.position = 'absolute';
      maskElement.appendChild(element);
      parentElement.appendChild(maskElement);

      var size = Math.sqrt((winWidth/2*winWidth/2 + winHeight*winHeight));
      var startTime;
      var bezierFunc = Bezier(bezierParam);
      var iniMaskTop = winHeight;
      var iniMaskLeft = winWidth/2;

      var enlargeCircle = function enlargeCircle(timestamp) {
        if (!startTime) {
          startTime = timestamp;
          window.requestAnimationFrame(enlargeCircle);
          return;
        }

        var progress = timestamp - startTime;
        var subSize = size * bezierFunc(progress / duration);
        //maskElement.style.visibility = 'hidden';
        //window.getComputedStyle(maskElement).visibility;
        maskElement.style.top = (iniMaskTop - subSize) + 'px';
        maskElement.style.left = (iniMaskLeft - subSize) + 'px';
        maskElement.style.width = subSize*2 + 'px';
        maskElement.style.height = subSize*2 + 'px';
        element.style.top = -(iniMaskTop - subSize) + 'px';
        element.style.left = -(iniMaskLeft - subSize) + 'px';
        //maskElement.style.visibility = 'visible';

        if(progress < duration) {
          window.requestAnimationFrame(enlargeCircle);
        } else {
          element.style.top = '';
          element.style.left = '';
          element.style.position = 'fixed';

          parentElement.appendChild(element);
          parentElement.removeChild(maskElement);
          if(callback) {
            callback();
          }
        }
      };
      window.requestAnimationFrame(enlargeCircle);
    };

    this.circleIn2 = function(element, duration, bezierParam, callback) {

      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;
      var size = Math.sqrt((winWidth/2*winWidth/2 + winHeight*winHeight));

      var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      var existingSvg = document.getElementById(element.id + '-svg');
      if(existingSvg) {
        document.body.removeChild(existingSvg);
      }
      svgEle.setAttribute('id', element.id + '-svg');
      svgEle.setAttribute('width', 0);
      svgEle.setAttribute('height', 0);

      var clipPathEle = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPathEle.setAttribute('id', element.id + '-clipCircle');

      var circleEle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleEle.setAttribute('cx', window.innerWidth/2);
      circleEle.setAttribute('cy', window.innerHeight);
      circleEle.setAttribute('r', 0);

      element.style.clipPath = 'url(\"#' + element.id + '-clipCircle\")';
      element.style.transitionProperty = 'none';

      clipPathEle.appendChild(circleEle);
      svgEle.appendChild(clipPathEle);
      document.body.appendChild(svgEle);

      var startTime;
      var bezierFunc = Bezier(bezierParam);

      var enlargeCircle = function enlargeCircle(time) {
        if (!startTime) {
          startTime = time;
        }

        var progress = time - startTime;
        circleEle.setAttribute('r', 250 + 3 * size * (progress / duration));
        if (progress < duration) {
          window.requestAnimationFrame(enlargeCircle);
        } else {
          if(callback) {
            callback();
          }
          window.getComputedStyle(element).display;
          document.body.removeChild(svgEle);
        }
      };
      window.requestAnimationFrame(enlargeCircle);
    };

    this.circleOut = function(element, duration, bezierParam, callback) {

      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;
      var size = Math.sqrt((winWidth/2*winWidth/2 + winHeight*winHeight));

      var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      var existingSvg = document.getElementById(element.id + '-svg');
      if(existingSvg) {
        document.body.removeChild(existingSvg);
      }
      svgEle.setAttribute('id', element.id + '-svg');
      svgEle.setAttribute('width', 0);
      svgEle.setAttribute('height', 0);

      var clipPathEle = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPathEle.setAttribute('id', element.id + '-clipCircle');

      var circleEle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleEle.setAttribute('cx', window.innerWidth/2);
      circleEle.setAttribute('cy', window.innerHeight);
      circleEle.setAttribute('r', size);

      element.style.clipPath = 'url(\"#' + element.id + '-clipCircle\")';
      element.style.transitionProperty = 'none';

      clipPathEle.appendChild(circleEle);
      svgEle.appendChild(clipPathEle);
      document.body.appendChild(svgEle);

      var startTime;
      var bezierFunc = Bezier(bezierParam);

      var enlargeCircle = function enlargeCircle(time) {
        if (!startTime) {
          startTime = time;
        }

        var progress = time - startTime;
        circleEle.setAttribute('r', size * ( 1 - bezierFunc(progress / duration)));
        if (progress < duration) {
          window.requestAnimationFrame(enlargeCircle);
        } else {
          if(callback) {
            callback();
          }
          window.getComputedStyle(element).display;
          document.body.removeChild(svgEle);
        }
      };
      window.requestAnimationFrame(enlargeCircle);
    };
  };

  exports.tvAnimation = new TvAnimation();
})(window);
tvAnimation.circleIn2(document.getElementById('front'), 1000, [0, 0.5, 0.5, 1], iterate);

var isToggle = false;
function iterate() {
  if(isToggle) {
    tvAnimation.circleIn2(document.getElementById('front'), 2000, [0, 0.5, 0.5, 1], iterate);
  } else {
    tvAnimation.circleIn2(document.getElementById('front'), 1000, [0, 0.5, 0.5, 1], iterate);
  }
}
function toggle() {
  isToggle = !isToggle;
}