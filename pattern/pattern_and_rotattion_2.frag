// http://glslsandbox.com/e#40380.0

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
	vec2 st1 = st;
	vec2 st2 = st;
	vec2 st3 = st;

	vec3 color = vec3(0.0);
	
	st1 = patternize(vec2(st.x, st.y - time * 0.7), 6 / 2);
	st2 = patternize(vec2(st.x, st.y + time), 4 / 2);
	st3 = patternize(vec2(st.x + time * 0.3, st.y), 10 / 2);
	
	st1 -= 0.5;
	st1 = st1 * rotate2d(- time * 0.3 * PI);
	st1 += 0.5;
	
	st2 -= 0.5;
	st2 = st2 * rotate2d(time * PI);
	st2 += 0.5;
	
	st3 -= 0.5;
	st3 = st3 * rotate2d(time * 3.0 * PI);
	st3 += 0.5;
	
	float size1 = abs(sin(time)) * 0.5 + 0.2;
	float size2 = abs(cos(time)) * 0.2 + 0.2;
	float size3 = 0.3;
	color = vec3(box(st1, vec2(size1)), box(st2, vec2(size2)), box(st3, vec2(size3)));

	gl_FragColor = vec4(color, 1.0);
}