var express = require('express');
var request = require('request');
    kpi = require('./public/routes/kpi');
	auth = require('./public/routes/auth');
    tags = require('./public/routes/tags');
    engines = require('./public/routes/engines');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use("/public", express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})

// KPI routes
app.get('/api/kpi/:kpiName/:token', kpi.getKpi);

// Auth route
app.get('/api/auth/', auth.authenticate);

// Tags route
app.get('/api/tags/:token', tags.getTags);

// Engines based on tag
app.get('/api/:tag/engines/:token', engines.getEngines);

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");