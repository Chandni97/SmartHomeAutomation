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

socket.onopen = function() 
{
	socket.addEventListener('message', event => 
  {
       var data = `${event.data}`;
      console.log(data);
      if(data.includes('Light:1'))
      {
        alert('lights switched on');
      }

      else if(data.includes('Light:0'))
      {
        alert('lights switched off');
      }
	});

  var Light = {'Light' : true};
  socket.send(JSON.stringify(Light));

  getStream();
  let timerId = setInterval(() => takePhoto(), 5000);
};

function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

var theStream;

function getStream() {
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }
  
  var constraints = {
    video: true
  };

  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector('video');
    if ('srcObject' in mediaControl) {
      mediaControl.srcObject = stream;
      //mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream); => deprecated on google
    } else if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    }
    theStream = stream;
  }, function (err) {
    alert('Error: ' + err);
  });


}

function takePhoto() {

  if (!('ImageCapture' in window)) {
    alert('ImageCapture is not available');
    return;
  }
  
  if (!theStream) {
    alert('Grab the video stream first!');
    return;
  }
  
  var theImageCapturer = new ImageCapture(theStream.getVideoTracks()[0]);

  theImageCapturer.takePhoto()
    .then(blob => {
      var theImageTag = document.getElementById("imageTag");
      theImageTag.src = URL.createObjectURL(blob);
      var reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = function() {
      base64data = reader.result;                
      socket.send(base64data);
 }

    })
    .catch(err => alert('Error: ' + err));
}

