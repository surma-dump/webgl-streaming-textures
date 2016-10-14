#!/usr/bin/env node

const spdy = require('spdy');
const express = require('express');
const fs = require('fs');

const gulp = require('gulp');
const babel = require('gulp-babel');

const babelConfig = {
  comments: false,
  presets: [require('babel-preset-babili')],
  plugins: [require('babel-plugin-transform-es2015-modules-amd')]
};

// ES2015 modules -> SystemJS modules
gulp.src([
  'node_modules/three/src/**/*.js',
])
  .pipe(babel(babelConfig))
  .pipe(gulp.dest('dist/threejs'));

// Plain copy
gulp.src(['node_modules/three/src/**/*.glsl'])
  .pipe(gulp.dest('dist/threejs'));

// Minify
gulp.src([
  'static/*.js',
  'node_modules/three/build/three.min.js',
  'node_modules/systemjs-plugin-text/text.js',
  'node_modules/systemjs/dist/system.js'
])
  .pipe(babel({
    comments: false,
    // presets: [require('babel-preset-babili')]
  }))
  .pipe(gulp.dest('dist'));

// Plain copy
gulp.src([
  'static/*.html',
  'static/*.{jpg,png}',
])
  .pipe(gulp.dest('dist'));

const app = express();
app.use(require('compression')());
// Import strings don't necessarily end on `.js`,
// so add that if needed.
app.get('/threejs/*', (req, res, next) => {
  if (!req.url.endsWith('.js') && !req.url.endsWith('.glsl')) {
    req.url += '.js';
  }
  next();
});
app.use(express.static('dist'));
const config = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
console.log('Starting HTTP/2 server on https://localhost:8080');
spdy.createServer(config, app).listen(8080);