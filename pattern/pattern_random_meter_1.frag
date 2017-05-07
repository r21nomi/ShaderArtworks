// http://glslsandbox.com/e#40386.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in float x) {
    return fract(sin(x) * 1e4);
}

vec2 patternize(vec2 st, int count) {
	vec2 pattern = st * float(count);
	return fract(vec2(pattern.x , pattern.y)) +fract(time * random(st.x));
}

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;
	vec2 uv = step(_size, _st);
	uv *= step(_size, vec2(1.0) - _st);
	return uv.x * uv.y;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color;
	
	st /= vec2(0.3,  1.0);
	st = patternize(st, 6 / 2);
	
	color = vec3(box(st, vec2(0.6)), 0, fract(time));

	gl_FragColor = vec4(color, 1.0);
}