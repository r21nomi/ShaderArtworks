// http://glslsandbox.com/e#41495.1
// Referenced from https://www.shadertoy.com/view/Mtj3Rh

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

float random(vec2 n) {
	return random(dot(n, vec2(2.46, -1.21)));
}

float patternize(float n) {
	// Fade by cos()
	return cos(fract(n) * 2.0 * PI);
}

vec2 shear(vec2 st, float radian) {
	return (st + vec2(st.y, 0.0) * cos(radian)) + vec2(floor(4.0 * (st.x - st.y * cos(radian))), 0.0);
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float radian = radians(60.0);
	float scale = 2.0;
	
	st *= scale;
	
	vec2 newSt = shear(st, radian);
	
 	float n = patternize(random(floor(newSt * 4.0)) + random(floor(newSt * 2.0)) + random(floor(newSt)) + time * 0.1);
	
	vec3 color = vec3(n * 0.5, n * 1.5, 0.8);
	
	gl_FragColor = vec4(color, 1.0);
}
