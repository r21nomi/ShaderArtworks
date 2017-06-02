// http://glslsandbox.com/e#40729.1

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

vec2 patternize(vec2 st) {
	return fract(st);
}

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;  // Adjust size.
	vec2 uv = step(_size, _st);
	uv *= step(_size, vec2(1.0) - _st);
	return uv.x * uv.y;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	int count = 8;
	float speed = time * 0.5;
	
	// Divide by 2 since the origin of display is center(the range of y is -1.0 ~ 1.0)
	st *= float(count / 2);
	
	// Animate
	st.x += mod(st.y, 2.0) < 1.0 ? -speed : speed;

	vec3 color = vec3(0.0);
	color.r = box(patternize(st), vec2(map(sin(time * 3.0), -1.0, 1.0, 0.6, 0.9)));
	color.g = box(patternize(st), vec2(map(sin(time * 8.0), -1.0, 1.0, 0.9, 1.0)));
	color.b = map(sin(time * 8.0), -1.0, 1.0, 0.5, 0.7);

	gl_FragColor = vec4(color, 1.0);
}