// http://glslsandbox.com/e#42226.3
// Forked http://glslsandbox.com/e#42199.5

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rand2(vec2 p) {
	p = vec2(dot(p, vec2(102.9898,78.233)), dot(p, vec2(26.65125, 83.054543))); 
	return fract(sin(p) * 43758.5453);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

// Create particles by check the neighbors.
// https://thebookofshaders.com/12/
float createParticles(in vec2 position, float particleCount, float size) {
	vec2 scaledPos = position * particleCount;
	vec2 iPos = floor(scaledPos);
	vec2 fPos = fract(scaledPos);
	float minDist = 1.0;
	
	for (float i = -1.0; i <= 1.0; ++i) {
		for (float j = -1.0; j <= 1.0; ++j) {
			vec2 neighbor = vec2(i, j);
			vec2 newPos = iPos + neighbor;
			vec2 randomPos =  rand2(mod(newPos, particleCount));
			vec2 diff = neighbor  + randomPos - fPos;
			diff *= 1.0 / (particleCount * size);  // Apply settings the size
			minDist = min(minDist, dot(diff, diff));
		}
	}

	return smoothstep(0.9, 1.0, (1.0 - sqrt(minDist)));
}
 

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
		
	vec3 color = vec3(0.0);
	
	float particleSize = 1.5;
	float particleCount = 4.0;
	const int depth = 6;
	
	// Make parallax
	for (int i = 0; i < depth; i++) {
		// Particle position
		vec2 position = vec2(
			uv.x + 1.0 * 0.2 * particleSize,
			uv.y - time * 0.1 * particleSize
		);
		
		color += createParticles(position, particleCount, particleSize / 4.0) * vec3(0.0, particleSize + abs(sin(time)) * particleSize, 1.0); 

		particleSize /= 1.5;  // Make　particle smaller
		particleCount *= 1.5;  // Increase particle count
	}

	gl_FragColor = vec4(color, 1.0);
}