// http://glslsandbox.com/e#41532.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;  // Adjust size.
	vec2 uv = step(_size, _st);
	float speed = time * 5.0;
	float bold = 0.2;
	uv.y *= step(fract(_st.y * 5.5 + speed + _st.x * 5.5), bold);
	return uv.x * uv.y;
}

vec2 patternize(vec2 st) {
	return fract(st);
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float count = 8.0;
	st *= count / 2.0;
	
	st.x +=  time;

	vec2 p = patternize(st);
	
	float b = box(p, vec2(0.5));
	
	vec3 color = vec3(0.9, b, 0.5);

	gl_FragColor = vec4(color, 1.0);
}