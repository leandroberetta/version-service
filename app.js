var express = require('express')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var util = require('util')

mongoose.connect(util.format('mongodb://%s:%s@%s/%s', process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_CONNECTION_URL, process.env.DB_NAME), {useNewUrlParser: true});

var versionSchema = new mongoose.Schema({
    project: String,
    application: String,
    version: String,
    updatedAt: Date
});

var Version = mongoose.model('Version', versionSchema);

var app = express()

app.use(bodyParser.json());

app.get('/health', function (req, res) {
    res.send({'status': '0', 'data': 'running'});
});

app.get('/version/:project', function (req, res) {
    Version.find({'project': req.params.project }, function (err, versions) {
        if (err) 
            res.send({'status': '1', 'data': err})
        
        res.send({'status': '0', 'data': versions})
    })
});

app.delete('/version/:project/:application', function (req, res) {
    Version.deleteOne({'project': req.params.project, 'application': req.params.application }, function (err, versions) {
        if (err) 
            res.send({'status': '1', 'data': err})
        
        res.send({'status': '0', 'data': null})
    })
});

app.post('/version', function (req, res) {
    Version.updateOne({'project': req.body.project, 'application': req.body.application }, { 'version': req.body.version, 'updatedAt': Date.now()}, { upsert: true }, function (err, raw) {
        if (err) 
            res.send({'status': '1', 'data': err})
    });

    res.send({'status': '0', 'data': null});
});

app.listen(8080);

module.exports = app;