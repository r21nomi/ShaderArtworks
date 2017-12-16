// http://glslsandbox.com/e#44223.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float pluralRing(vec2 uv, float interval) {
	return sin(length(uv) * interval);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 scaledUv = uv * 9.0;
	vec2 repeatedUv  = fract(scaledUv);
	repeatedUv -= 0.5;
	
	vec2 number = floor(scaledUv);
	float interval = map(sin(time * (number.x + number.y + 0.5)), -1.0, 1.0, 10.0, 40.0);
	float ring = pluralRing(repeatedUv, interval);
	
	vec3 color = vec3(ring * 0.4, ring * 0.8, 0.2);

	gl_FragColor = vec4(color, 1.0);
}