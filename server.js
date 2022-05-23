var express = require('express');
var app = express();
const path = require('path')
var history = require('connect-history-api-fallback');

app.use(history({
// verbose: true
}));

app.use(express.static(path.join(__dirname,'dist')));

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), () => {
  console.log('Port 8080')
});