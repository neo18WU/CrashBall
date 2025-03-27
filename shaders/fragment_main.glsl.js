export default /* glsl */`
//gl_FragColor = vec4(vec3(vDisplacement), 1);
normal = perturbNormalArb( - vViewPosition, normal, vec2(dFdx(vDisplacement), dFdy(vDisplacement)), faceDirection );
	`;