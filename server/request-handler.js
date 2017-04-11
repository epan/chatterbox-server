// These headers will allow Cross-Origin Resource Sharing (CORS).
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'Content-Type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var storage = [
  {
    username: 'josh',
    text: 'welcome',
    roomname: 'lobby'
  }
];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var resultObject = { results: [] };
  var headers = defaultCorsHeaders;
  var statusCode = 404;

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }

  if (request.url === '/classes/messages' || request.url === '/classes/room') {
    if (request.method === 'GET') {
      statusCode = 200;
      resultObject.results = storage;
    }

    if (request.method === 'POST') {
      statusCode = 201;
      var body = [];
      request.on('data', function (chunk) {
        body.push(chunk);
      });
      request.on('end', function () {
        console.log('body before concat: ', body);
        // console.log('type of element: ', typeof body[0]);
        body = Buffer.concat(body).toString();
        storage.push(JSON.parse(body));
        console.log('storage: ', storage);
      });
    }

    if (request) {

    }
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(resultObject));
};

exports.requestHandler = requestHandler;
exports.storage = storage;
exports.defaultCorsHeaders = defaultCorsHeaders;
