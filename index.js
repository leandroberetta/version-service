var express = require('express')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var util = require('util')

mongoose.connect(util.format('mongodb://admin:redhat01@%s/version', process.env.DB_CONNECTION_URL), {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("connected to db")
});

var versionSchema = new mongoose.Schema({
    project: String,
    application: String,
    version: String
});

var Version = mongoose.model('Version', versionSchema);

var app = express()

app.use(bodyParser.json()); 

app.get('/health', function (req, res) {
  res.send('running')
});

app.get('/version/:project', function (req, res) {
    Version.find({'project': req.params.project}, function (err, versions) {
        if (err) return console.error(err);
        console.log(versions);
        res.send(versions)
    })    
});
  
app.post('/version', function(req, res){
    console.log(req.body);

    Version.update({ 'project': req.body.project, 'application': req.body.application }, { 'version': req.body.version }, { upsert: true }, function (err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
      });

    res.send({"status": "0"});
 });

app.listen(8080);

