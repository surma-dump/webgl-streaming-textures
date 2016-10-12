import {PerspectiveCamera} from '/node_modules/three/src/cameras/PerspectiveCamera';
import {TextureLoader} from '/node_modules/three/src/loaders/TextureLoader';
import {BoxBufferGeometry} from '/node_modules/three/src/geometries/BoxBufferGeometry';
import {MeshBasicMaterial} from '/node_modules/three/src/materials/MeshBasicMaterial';
import {Mesh} from '/node_modules/three/src/objects/Mesh';
import {WebGLRenderer} from '/node_modules/three/src/renderers/WebGLRenderer';
import {Scene} from '/node_modules/three/src/scenes/Scene';

var camera, scene, renderer;
var mesh;
init();
animate();

function init() {
  camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;
  scene = new Scene();
  var texture = new TextureLoader().load( 'big_texture.jpg' );
  var geometry = new BoxBufferGeometry( 200, 200, 200 );
  var material = new MeshBasicMaterial( { map: texture } );
  mesh = new Mesh( geometry, material );
  scene.add( mesh );
  renderer = new WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render( scene, camera );
}