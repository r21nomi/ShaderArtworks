// http://glslsandbox.com/e#40118.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float toRadian(float degree) {
	return degree * PI / 180.0;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color;
	
	for (int i = 0; i < 10; i++) {
		float degree = (float(i) + 1.0) * (360.0 / 10.0);
		float r = toRadian(degree);
		st.x += cos(time + r) * 0.3;
		st.y += sin(time + r) * 0.3;
		float f = 0.01 / abs(length(st) - 0.7);
		
		color += vec3(f);
	}
	
	gl_FragColor = vec4(color, 1.0);
}