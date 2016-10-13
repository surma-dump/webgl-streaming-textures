define([
  '/node_modules/three/src/textures/Texture.js',
  '/node_modules/three/src/textures/DataTexture.js',
  '/node_modules/three/src/constants.js'
], (
  {Texture},
  {DataTexture},
  constants
) => {
  const RedTexture = new DataTexture(new Uint8Array([255, 0, 0]), 1, 1, constants.RGBFormat);
  const BlueTexture = new DataTexture(new Uint8Array([0, 0, 255]), 1, 1, constants.RGBFormat);
  const SwitchingTexture = RedTexture.clone();
  SwitchingTexture.needsUpdate = true;
  setInterval(_ => {
    if (SwitchingTexture.image == RedTexture.image) {
      SwitchingTexture.image = BlueTexture.image;
    } else {
      SwitchingTexture.image = RedTexture.image;
    }
    SwitchingTexture.needsUpdate = true;
  }, 1000);

  return {
    SwitchingTexture
  };
});