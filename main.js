import * as THREE from "three";
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from './node_modules/three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from './shaders/vertex.glsl.js';
import fragmentShader from './shaders/fragment.glsl.js';
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

const ambient = new THREE.HemisphereLight(0xfe3000, 0xfe3000, 10);
scene.add(ambient);

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

//const geometry = new THREE.SphereGeometry(1);
//const geometry = new THREE.PlaneGeometry(2, 2, 10, 10)
const geometry = new THREE.IcosahedronGeometry(1, 150)
//console.log(geometry)
/*
uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
  u_mouse: { type: "v2", value: new THREE.Vector2() }
};
*/
/*
const material = new THREE.MeshStandardMaterial({
oneBeforeCompile: (shader) => {
  material.userData.shader = shader
}
})
*/

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: false
})
  
console.log(material)
// Définir les variables dans material pour envoyer les informatio au fragment shader
material.uniforms.uTime = { value: 1.0 };


const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/***************************************************************************************************
 *                                      GUI
 ****************************************************************************************************/
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z', 0, 10);
cameraFolder.open();

//gui.add(material.uniforms.uRadius, "value", 0, 1);

/***************************************************************************************************
 *                                      ANIMATE
 ****************************************************************************************************/
const clock = new THREE.Clock();
let time = 0;
let speed = 0.5;
let initRotate = true;
let timeTotal = 0;

const animate = () => {
  time +=0.01;  clock.getDelta();
material.uniforms.uTime.value = time/10;
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);

}

animate();
