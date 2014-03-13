/*
 * app.js Simpole express server
 */
'use strict';
var
  http = require('http'),
  express = require('express'),
  app = express(),
  server = http.createServer(app);

app.get('/API/version', function (req, res) {
    res.send('hello world');
});

server.listen(3000);
console.log('Express server listening on port %d in %s mode',
        server.address().port, app.settings.env
        );
