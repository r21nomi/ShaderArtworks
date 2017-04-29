// http://glslsandbox.com/e#40196.5

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
	
	st *= rotate2d(sin(time) * PI);
	st += vec2(0.5);
	
	vec3 color = vec3(cross(st, 2.0));

	gl_FragColor = vec4(color, 1.0);
}