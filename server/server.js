var express = require('express');
var index = require('./routes/index');
var api = require('./routes/api.js');

var app = express();

app.use(express.static('server/public'));
app.use('/api', api);
app.use('/', index);

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('listening on port:', port);
});
