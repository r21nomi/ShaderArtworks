// http://glslsandbox.com/e#40215.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float box(vec2 st, vec2 size) {
	vec2 newSize = vec2(0.5) - size * 0.5;
	vec2 uv = step(newSize, st);
	uv *= step(newSize, vec2(1.0) - st);
	return uv.x * uv.y;
}

float cross(vec2 st, float size) {
	return box(st, vec2(size, size / 4.0)) + box(st, vec2(size / 4.0, size));	
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float interval = 0.22;
	float size = 0.2;
	vec2 newSt = mod(st, interval);
	
	newSt -= vec2(interval / 2.0);  // Move each items to center.
	newSt *= rotate2d(sin(time) * PI);  // Rotate.
	newSt += vec2(0.5);  // Set rotation axis to center.
	
	vec3 color = vec3(cross(newSt, size));

	gl_FragColor = vec4(color, 1.0);
}