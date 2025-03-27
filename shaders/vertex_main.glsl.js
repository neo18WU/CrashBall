export default /* glsl */`
	vec3 coords = normal;
	coords.y += uTime;
	vec3 noisePattern = vec3(cnoise(coords));
	float pattern = wave(noisePattern*uFrequency);


	//vayring

	vDisplacement = pattern ;
	
	
	//MVP
	float displacement = vDisplacement;

	transformed += normalize(objectNormal) * displacement;   
	`;
