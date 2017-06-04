// http://glslsandbox.com/e#40771.1

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
	return fract(vec2(st));
}

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;  // Adjust size.
	vec2 uv = step(_size, _st);
	uv *= step(_size, vec2(1.0) - _st);
	return uv.x * uv.y;
}

// From Robert Penner's Easing Functions.
// http://gizma.com/easing/
float easeOutQuad(float t) {
	return -t * (t - 2.0);
}

float exposeInOut(float t) {
	if (t == 0.0) {
		return 0.0;
	
	} else if (t == 1.0) {
		return 1.0;
	
	} else if ((t /= 0.5) < 1.0) {
		return 0.5 * pow(2.0, 10.0 * (t - 1.0));
	
	} else {
		return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
	}
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	int count = 6;
	
	// Apply easing.
	float easing =  exposeInOut(fract(time * 1.1));
	float speed = time + easing;
	
	// Divide by 2 since the origin of display is center(the range of y is -1.0 ~ 1.0)
	st *= float(count / 2);
	
	// Animate
	st.x += mod(st.y, 2.0) < 1.0 ? -speed : speed;

	vec3 color = vec3(0.0);
	float minScale = 0.3;
	float maxScale = 1.0;
	
	// Scale with animation.
	float scale = easing < 0.6 ?  map(easing, 0.0, 1.0, maxScale, minScale) : map(easing, 0.0, 1.0, minScale, maxScale);
	
	color.g = 0.8;
	color.r = box(patternize(st), vec2(0.6 * scale));
	color.b = box(patternize(st), vec2(0.9 * scale));

	gl_FragColor = vec4(color, 1.0);
}