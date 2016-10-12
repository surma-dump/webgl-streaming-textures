#!/usr/bin/env node

const http = require('http');
const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const throttlePipe = require('throttle');
const url = require('url');
const babel = require('babel-core');

const babelConfig = {
  presets: [require('babel-preset-es2015')],
  plugins: [require('babel-plugin-transform-es2015-modules-systemjs')]
};

const app = express();

app.get('/big_texture.jpg', (req, res) => {
  const throttle = new throttlePipe(100000); // 100kb/s
  fs.createReadStream('big_texture.jpg')
    .pipe(throttle)
    .pipe(res);
});

app.get([
  '/node_modules/three/*',
  '/main.js'
], (req, res, next) => {
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
app.use(express.static('.'));

const config = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
spdy.createServer(config, app).listen(8080);