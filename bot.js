var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/hot take$/,
      hotTakePrefix = "Hot take:";

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else if (request.text.indexOf(hotTakePrefix) === 0) {
    this.res.writeHead(200);
    postMessage(request.name, request.text);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(userName, text) {
  var botResponse, options, body, botReq;
  
  if (userName && text) {
    botResponse = "$$ HOT TAKE ALERT $$\nWho: " + userName + "\n" + "What: " + text.replace("Hot take:", "") ;
  } else {
    botResponse = "Hello! I am the Hot Take Town Crier! Your one stop shop for the hottest takes in all the land!";
    botResponse += " To broadcast your hot take, simply prefix your message with 'Hot take:'";
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
