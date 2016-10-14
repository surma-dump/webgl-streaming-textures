// Only load the things we need.

define([
  '/threejs/cameras/PerspectiveCamera.js',
  '/threejs/loaders/TextureLoader.js',
  '/threejs/geometries/BoxBufferGeometry.js',
  '/threejs/materials/MeshBasicMaterial.js',
  '/threejs/objects/Mesh.js',
  '/threejs/renderers/WebGLRenderer.js',
  '/threejs/scenes/Scene.js'
], ([{PerspectiveCamera}, {TextureLoader}, {BoxBufferGeometry}, {MeshBasicMaterial}, {Mesh}, {WebGLRenderer}, {Scene}]) => {

  // This is the code from ThreeJS’s cube example:
  // @see https://threejs.org/examples/#webgl_geometry_cube
  var camera, scene, renderer;
  var mesh;
  init();
  animate();

  function init() {
    camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    scene = new Scene();
    var texture = new TextureLoader().load( 'texture.png' );
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
});