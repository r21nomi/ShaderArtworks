// http://glslsandbox.com/e#40319.0

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

vec2 patternize(vec2 st, int count) {
	vec2 pattern = st * float(count);
	return fract(pattern);
}

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;  // Adjust size.
	vec2 uv = step(_size, _st);
	uv *= step(_size, vec2(1.0) - _st);
	return uv.x * uv.y;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	
	st = patternize(st, 6 / 2);
	st -= 0.5;
	st *= rotate2d(sin(time) * PI);
	st += 0.5;
	
	color = vec3(box(st, vec2(0.5)));

	gl_FragColor = vec4(color, 1.0);
}