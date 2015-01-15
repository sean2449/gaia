/*function infiniteLeftAnimation(element, speed, period) {
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

var stop1 = infiniteLeftAnimation(document.getElementById('wave1'), 1, 296);
var stop2 = infiniteLeftAnimation(document.getElementById('wave2'), 1, 296);*/

var c1 = document.getElementById('container1');
var c2 = document.getElementById('container2');
c1.style.display = 'block';
c2.style.display = 'none';
function stop() {
  if( c1.style.display === 'block' ) {
    c2.style.display = 'block';
    c1.style.display = 'none';
  } else {
    c1.style.display = 'block';
    c2.style.display = 'none';
  }
}