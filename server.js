#!/usr/bin/env node

const http = require('http');
const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const throttlePipe = require('throttle');
const url = require('url');
const babel = require('babel-core');

const babelConfig = {
  plugins: [require('babel-plugin-transform-es2015-modules-systemjs')]
};

const app = express();

app.get('/big_texture.jpg', (req, res) => {
  const throttle = new throttlePipe(100000); // 100kb/s
  fs.createReadStream('static/big_texture.jpg')
    .pipe(throttle)
    .pipe(res);
});

// ThreeJS needs to be transpiled to SystemJS modules.
app.get('/node_modules/three/*', (req, res, next) => {
  let filename = url.parse(req.url).path.slice(1);
  // fallthrough to static middleware for shaders
  if (filename.endsWith('.glsl')) {
    next();
    return;
  }
  // Since we are transpiling, some imports won’t have .js extension
  if (!filename.endsWith('.js')) {
    filename += '.js';
  }

  babel.transformFile(filename, babelConfig, (err, result) => {
    if (err) {
      res.status(500).send(err.toString());
      return;
    }
    res.send(result.code);
  });
});
// Serve node_modules folder
app.use('/node_modules', express.static('./node_modules'));
// Serve static folder
app.use(express.static('static'));

const config = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
console.log('Starting HTTP/2 server on https://localhost:8080');
spdy.createServer(config, app).listen(8080);