// http://glslsandbox.com/e#42489.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float random(vec2 uv) {
	return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float pluralRing(vec2 uv, float interval) {
	return sin(length(uv) * interval);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec2 scaledUv = uv * 4.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	float r = random(floor(scaledUv));
	vec3 color = vec3(0.8 * r, 0.5 * r, 0.8);
	
	float interval = map(sin(time * r * 6.0), -1.0, 1.0, 10.0, 26.0);
	color *= pluralRing(repeatedUv, interval);

	gl_FragColor = vec4(color, 1.0);
}