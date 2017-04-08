var express = require('express');
var request = require('request');
    kpi = require('./public/routes/kpi');
	auth = require('./public/routes/auth');
    tags = require('./public/routes/tags');
    engine = require('./public/routes/engine');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use("/public", express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})

// KPI routes
app.get('/api/kpi/:kpiName/:token', kpi.getKpi);

// Engine routes
app.get('/api/kpi/:kpiName/engine/:token', engine.getEngine);

// Auth route
app.get('/api/auth/', auth.authenticate);

// Tags route
app.get('/api/tags/:token', tags.getTags);

app.listen(process.env.PORT || 8002);
console.log("App listening on port 8000");