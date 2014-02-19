var path = require('path');
var fs = require('fs');
// CLI interface
var commander = require('commander');

commander
	.version(require('./package.json').version)
	.option('-p, --port <port>', 'WebServer port', 8080)
	.option('-d, --dir <path>', 'Directory containing doc files', __dirname)
	.parse(process.argv);
// Parsing options
commander.dir = path.resolve(commander.dir);
// Fetching resources
var src = {};
fs.readdirSync(commander.dir).forEach(function (elem) {
	if (elem.match("^.*\.(json)$") !== null) {
		src[elem.split('.json')[0]] = JSON.parse(fs.readFileSync(commander.dir + '/' + elem, {encoding: 'utf-8'}));
		console.log('Added ' + elem);
	}
});


// WebServer
var express = require('express');
var app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/', function(req, res) {
	res.json(src['resource']);
});

app.get('/:path', function(req, res) {
	res.json(src[req.params.path]);
});

app.listen(commander.port);
console.log('URL: ' + 'http://localhost:' + commander.port);
console.log('Doc Directory: ' + commander.dir);