// http://glslsandbox.com/e#41342.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

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

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
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
	
	// Zoom in out.
	float count = map(sin(time * 1.0), -1.0, 1.0, 4.0, 100.0);
	
	// Divide by 2 since the origin of display is center(the range of y is -1.0 ~ 1.0)
	st *= float(count / 2.0);
	
	// Apply easing.
	float easing =  exposeInOut(fract(time * 1.1));
	float speed = time + easing;
	
	// Animate
	st.x += mod(st.y, 2.0) < 1.0 ? -speed : speed;
	
	// Patternize
	vec2 p = patternize(st);
	
	// Rotate
	p -= 0.5;  // Move each items to center.
	p *= rotate2d(time);  // Rotate.
	p += 0.5;  // Set rotation axis to center.

	float minScale1 = 0.5;
	float minScale2 = 0.1;
	float maxScale = 1.0;
	
	// Scale with animation.
	float scale = easing < 0.5 ?  map(easing, 0.0, 1.0, maxScale, minScale1) : map(easing, 0.0, 1.0, minScale1, maxScale);
	float scale2 = easing < 0.7 ?  map(easing, 0.0, 1.0, maxScale, minScale2) : map(easing, 0.0, 1.0, minScale2, maxScale);
	
	// Box
	float b2 = box(p, vec2(0.6 * scale));
	float b1 = box(p, vec2(0.4 * scale2));
	
	float result = b1 + b2;
	float offset = 1.0 + sin(time * 5.0 + fract(st.x) * fract(st.y)) / 2.0;
	
	vec3 color = vec3(0.0);
	
	float val = mod(st.y, 3.0);
	
	// Divide colors to 3.
	if (val < 1.0) {
		color = vec3(
			result * offset * 0.1,
			result * offset * 0.3,
			result * 0.8
		);
	} else if (val < 2.0) {
		color = vec3(
			result * offset * 0.5,
			result * offset * 0.0,
			result * 0.3
		);
	}  else {
		color = vec3(
			result * offset * 1.0,
			result * offset * 0.8,
			result * 1.0
		);
	}
	
	gl_FragColor = vec4(color, 1.0);
}