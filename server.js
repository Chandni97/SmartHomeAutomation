var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
require('dotenv').config();


var Client = require("ibmiotf");
var myData = {'0':'0'};

var appClientConfig = {
  "org" : process.env.IOT_PLATFORM_ORG,
  "id" : (Math.floor((Math.random() * 1000) + 1)).toString(),
  "domain" : "internetofthings.ibmcloud.com",
  "auth-key" : process.env.IOT_AUTH_KEY, //generate the key and token by using add api key on iot platform
  "auth-token" : process.env.IOT_AUTH_TOKEN
}

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');


var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: process.env.VISUAL_RECOGNITION_IAM_APIKEY
});

var appClient = new Client.IotfApplication(appClientConfig);

appClient.connect();

appClient.on("connect", function () {

  appClient.subscribeToDeviceEvents("Light","1234L","myevent");
  console.log('connected to ibm iot platform')
});

appClient.on("error", function (err) 
{
  console.log("Error : "+err);
});





var server = http.createServer(handleRequest);
server.listen(8080);
console.log('Server started on port 8080');





function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;
  //console.log(ua);

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  if(pathname == '/motion')
  {
    pathname = '/indexMotion.html'
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

const WebSocket = require('ws');

const server1 = new WebSocket.Server({ server:server });

server1.on('connection', socket => {


 // socket.send('Hello world!');
 socket.addEventListener('message', event => {
  console.log(`Message from client: ${event.data}`)
  if(`${event.data}`[0] === '{')
  {
    appClient.publishDeviceEvent("Motion","1234M", "myEvent", "json", JSON.parse(`${event.data}`));
  }

  else
  {
    base64ToPNG(`${event.data}`, socket);
  }
  //base64ToPNG(`${event.data}`, socket);

});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) 
{
    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
    if(deviceType === 'Light' )
    {
      if(payload.toString('utf8') === 'true')
      {
        socket.send('{Light:1}');
      }
      else
      {
        socket.send('{Light:0}');
      }
      //socket.send(payload);
    }
});

});

function base64ToPNG(data, socket) {

  data = data.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(path.resolve(__dirname, 'capture.PNG'), data, 'base64', function(err) {
    if (err) 
    {//socket.send(err);
      throw err;}
    
  });

  var images_file = fs.createReadStream('capture.PNG');
  var classifier_ids = ["IBM"];

  var params = {
    images_file: images_file
  };

  //socket.send('classifying');
  visualRecognition.classify(params, function(err, response) {
    if (err)
    {
      console.log(err);
      //socket.send(err);
    }
    else
    {
      console.log(JSON.stringify(response, null, 2))
      //socket.send(response);
      appClient.publishDeviceEvent("Door","1234D", "myEvent", "json", response);
      
    }
  });


}

