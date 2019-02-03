var express = require('express');
var bodyParser = require("body-parser");
var compression = require("compression");
var morgan = require("morgan");

var Counters = require('./lib/counter');

var app = express();
var port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

// web
app.use('/', express.static(__dirname + '/build'));

// api
// [json] GET /api/v1/counters
// => [
// =>   {id: "asdf", title: "boop",  count: 4},
// =>   {id: "zxcv", title: "steve", count: 3}
// => ]
app.get("/api/v1/counters", function (req, res) {
  res.json(Counters.all())
});

// [json] POST {title: "bob"} /api/v1/counters
// => [
// =>   {id: "asdf", title: "boop",  count: 4},
// =>   {id: "zxcv", title: "steve", count: 3},
// =>   {id: "qwer", title: "bob",   count: 0}
// => ]
app.post("/api/v1/counter", function (req, res) {
  res.json(Counters.create(req.body.title));
});

// [json] DELETE {id: "asdf"} /api/v1/counter
// => [
// =>   {id: "zxcv", title: "steve", count: 3},
// =>   {id: "qwer", title: "bob",   count: 0}
// => ]
app.delete("/api/v1/counter", function (req, res) {
  res.json(Counters.delete(req.body.id));
});

// [json] POST {id: "qwer"} /api/v1/counter/inc
// => [
// =>   {id: "zxcv", title: "steve", count: 3},
// =>   {id: "qwer", title: "bob",   count: 1}
// => ]
app.post("/api/v1/counter/inc", function (req, res) {
  res.json(Counters.inc(req.body.id));
});

// [json] POST {id: "zxcv"} /api/v1/counter/dec
// => [
// =>   {id: "zxcv", title: "steve", count: 2},
// =>   {id: "qwer", title: "bob",   count: 1}
// => ]
app.post("/api/v1/counter/dec", function (req, res) {
  res.json(Counters.dec(req.body.id));
});

app.listen(port, console.log.bind(null, 'PORT: ' + port));