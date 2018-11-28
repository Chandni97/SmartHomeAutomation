var socket;
if(window.location.hostname == 'localhost')
{
	socket = new WebSocket('ws://localhost:8080');
}
else
{
	socket = new WebSocket('wss://'+window.location.hostname);
}
var myData={'name' : 'foo', 'cpu' : 60, 'mem' : 50};

if ('DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false);
} else {
  document.getElementById('logoContainer').innerText = 'Device Orientation API not supported.';
}

function deviceOrientationHandler (eventData) {
  var tiltLR = eventData.gamma;
  var tiltFB = eventData.beta;
  var dir = eventData.alpha;
  var myData = {'tiltLR' : Math.round(tiltLR), 'titlFB' : Math.round(tiltFB), 'dir' : Math.round(dir)};
  myData = JSON.stringify(myData)
  socket.send(myData);
}
