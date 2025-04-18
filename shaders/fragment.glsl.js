export default /* glsl */`
#ifdef GL_ES
precision mediump float;
#endif


uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

void main() {
	gl_FragColor = vec4(vec3(vDisplacement), 1);
}

`;
