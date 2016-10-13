// Only load the things we need.

Promise.all([
  SystemJS.import('/threejs/cameras/PerspectiveCamera.js'),
  SystemJS.import('/threejs/loaders/TextureLoader.js'),
  SystemJS.import('/threejs/geometries/BoxBufferGeometry.js'),
  SystemJS.import('/threejs/materials/MeshBasicMaterial.js'),
  SystemJS.import('/threejs/objects/Mesh.js'),
  SystemJS.import('/threejs/renderers/WebGLRenderer.js'),
  SystemJS.import('/threejs/scenes/Scene.js')
])
.then(([{PerspectiveCamera}, {TextureLoader}, {BoxBufferGeometry}, {MeshBasicMaterial}, {Mesh}, {WebGLRenderer}, {Scene}]) => {

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