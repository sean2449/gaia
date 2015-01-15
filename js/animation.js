function infiniteLeftAnimation(element, speed, period) {
  var remRatio = parseInt(window.getComputedStyle(document.documentElement).fontSize, 10);
  var currentPos = 0;
  var initialPos = element.offsetLeft;
  var offset = initialPos;
  var isStop = false;
  var startTime;


  function step(timestamp) {

    if(isStop) {
    	startTime = null;
      offset = currentPos;
      return;
    }

    if (!startTime) {
      startTime = timestamp;
      window.requestAnimationFrame(step);
      return;
    }

    currentPos = offset - (timestamp - startTime)*speed;
    element.style.backgroundPosition = currentPos / remRatio + 'rem, bottom';
    window.requestAnimationFrame(step);
  }

  function stop() {
	  isStop = !isStop;
	  if (!isStop) {
	    window.requestAnimationFrame(step);
	  }
	}
	window.requestAnimationFrame(step);

  return stop;
}

var stop1 = infiniteLeftAnimation(document.getElementById('wave1'), 0.2, 296);
var stop2 = infiniteLeftAnimation(document.getElementById('wave2'), 0.15, 296);
var stopLong = infiniteLeftAnimation(document.getElementById('wave_long'), 0.15, 2470);

function stop() {
  stop1();
  stop2();
  stopLong();
}