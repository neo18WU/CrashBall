import * as THREE from "three";
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js';

import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "./node_modules/three/examples/jsm/postprocessing/OutputPass.js";

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import vertexPars from './shaders/vertex_pars.glsl.js';
import vertexMain from './shaders/vertex_main.glsl.js';
import fragmentPars from './shaders/fragment_pars.glsl.js';
import fragmentMain from './shaders/fragment_main.glsl.js';
//import colorfullTexture from './public/img/colorfull.jpg';

let uniforms;
// Canvas
const canvas = document.querySelector('canvas.webgl_1');


// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight * 2

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(new THREE.Color('#000000'), 1) //change the backgroundcolor
})

/***************************************************************************************************
* Renderer
****************************************************************************************************/
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  canvas: canvas,
  alpha: true,
  antialias: true,
  stencil: false,
  depth: true //important 'true' due to the rendering in GLSL Shaders
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;

renderer.setClearColor(new THREE.Color('#000000'), 1) //change the backgroundcolor
/***************************************************************************************************
* Camera
****************************************************************************************************/
let camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 1, 180);

camera.position.set(0, 0, 15);

camera.lookAt(new THREE.Vector3(0, 0, 0));

scene.add(camera);

//************************************************ LIGHTS *********************************************************** */

const ambient = new THREE.AmbientLight('#526cff', 0.2);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight('#4255ff', 0.75);
dirLight.position.set(2, 2, 2);
//scene.add(dirLight);

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.position.set(10, 10, 10);
spotlight.castShadow = false;
spotlight.intensity = 10;
spotlight.radius = 2;
spotlight.sample = 10;
spotlight.angle = 1.2;//0.8
spotlight.penumbra = 0.5;
spotlight.decay = 1;
spotlight.distance = 45;
scene.add(spotlight);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
//scene.add( spotLightHelper );
const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(0.32, 5, 0.7);
scene.add(light)
/***************************************************************************************************
 * yControls
 ****************************************************************************************************/
const controls = new OrbitControls(camera, canvas);
//controls.autoRotate = true;
//controls.autoRotateSpeed = 2;

//controls.enableDamping = true;
const axesHelper = new THREE.AxesHelper(15);
//scene.add(axesHelper);

//************************************************ OBJECTS *********************************************************** */

/************Some Geometrys ***************************************************** */
//const geometry = new THREE.BoxGeometry(1,1,1);
//const geometry = new THREE.SphereGeometry(1);
//const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
const geometry = new THREE.IcosahedronGeometry(1, 200);
//const geometry = new THREE.OctahedronGeometry(1, 100);
//const geometry = new THREE.TorusKnotGeometry( 10, 3, 300, 15, 1, 1 ); 
//console.log(geometry)
/*
uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
  u_mouse: { type: "v2", value: new THREE.Vector2() }
};
*/
/************Some Materials ***************************************************** */


const material = new THREE.MeshStandardMaterial({
  color: 0x6abbfa,
  shininess: 100,
  reflectivity:1,

  onBeforeCompile: (shader) => {
    // storing a reference to shader object
    material.userData.shader = shader

    const parsVertexString = /* glsl */`#include <displacementmap_pars_vertex>`
    shader.vertexShader = shader.vertexShader.replace(parsVertexString, parsVertexString + vertexPars)

    const mainVertexString = /* glsl */`#include <displacementmap_vertex>`
    shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + vertexMain)

    const mainFragmentString = /* glsl */`#include <normal_fragment_maps>`
    shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + fragmentMain)

    const parsFragmentString = /* glsl */`#include <bumpmap_pars_fragment>`
    shader.fragmentShader = shader.fragmentShader.replace(parsFragmentString, parsFragmentString + fragmentPars)

    //uniforms
    shader.uniforms.uTime = { value: 1.0 }
    shader.uniforms.uFrequency = { value: 0.5 }


  }
});

/*
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: false
})
*/


// Définir les variables dans material pour envoyer les informatio au fragment shader

//material.uniforms.uTime = { value: 1.0 };
//material.uniforms.uFrequency = { value: 0.2 };


const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
scene.add(mesh)

/***************************************************************************************************
 *                                      GUI
 ****************************************************************************************************/
let variateur = {
  value: 4.95
};
//pour fonctionner avec la pre-compilation le gui doit s'executer aprés le chargement du userData precompilé
//On passe dont par une fontion qui permet d'attendre
setTimeout((function () {
  const gui = new GUI();
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'z', 0, 10);
  cameraFolder.open();
  const vertexFolder = gui.addFolder('Vertex');
  vertexFolder.add(material.userData.shader.uniforms.uFrequency, "value", 0, 2).name("frequence");
  vertexFolder.add(variateur, "value", 1, 5).name("vitesse");
}
), 0);

/***************************************************************************************************
 *                                      POST-PROCESSING
 ****************************************************************************************************/
class GlowLayer extends EffectComposer {
  constructor(renderer) {
    const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      colorSpace: THREE.SRGBColorSpace,
      samples: 4
    })
    super(renderer, target);
    const renderScene = new RenderPass(scene, camera);
    //this.threshold = 0.3;
    //this.strength = 1.0;
    //this.radius = 0.85
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.4, 0.4);

    const outputPass = new OutputPass();
    this.addPass(renderScene);
    this.addPass(bloomPass);
    this.addPass(outputPass);
  }
}
let glowLayer = new GlowLayer(renderer);
glowLayer.passes[1].threshold = 0.7 //1
glowLayer.passes[1].strength = 0.4; //0.1
glowLayer.passes[1].radius = 0.4; //0
console.log(glowLayer)
//renderer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.4, 0.4))

/***************************************************************************************************
 *                                      ANIMATE
 ****************************************************************************************************/
const clock = new THREE.Clock();
let time = 0;

let speed = 0.5;
let initRotate = true;
let timeTotal = 0;

const animate = () => {
  time += 0.01; clock.getDelta();
  glowLayer.render();
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
  //material.uniforms.uTime.value = time / variateur.value; //A placer imperativement à la fin
  material.userData.shader.uniforms.uTime.value = time / variateur.value; //A placer imperativement à la fin
}

animate();
