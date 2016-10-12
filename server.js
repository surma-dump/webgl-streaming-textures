#!/usr/bin/env node

const http = require('http');
const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const throttlePipe = require('throttle');
const url = require('url');

const app = express();

app.get('/big_texture.jpg', (req, res) => {
  const throttle = new throttlePipe(100000); // 100kb/s
  fs.createReadStream('big_texture.jpg')
    .pipe(throttle)
    .pipe(res);
});
app.get('/*.js', (req, res) => {
  console.log(`JS handler: ${req.url}`);
  fs.createReadStream(url.parse(req.url).path.slice(1)).pipe(res);
});
app.use(express.static('.'));

const config = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
spdy.createServer(config, app).listen(8080);