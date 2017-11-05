// http://glslsandbox.com/e#43448.6

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float NUM = 8.0;

float makeLattice(in vec2 uv, float count) {
	float c1 = 0.1;
	float cb = -1.0;
	float c3 = 0.4;
	
	uv = fract(uv * count);
	uv *= NUM;
	
	int bx = int(uv.x);
	int by = int(uv.y);
	
	float g = 0.0;
	if (by == 0) {
		g = (bx == 3 || bx == 5) ? c1 : cb;
	} else if (by == 1) {
		g = bx == 0 ? cb : bx == 5 ? c1 : c3;
	} else if (by==2 || by==6) {
		g = (bx == 0 || bx == 2 || bx == 4 || bx == 6) ? cb : (bx == 1 || bx == 7) ? c3 : c1;
	} else if (by == 3) {
		g = bx==4 ? cb : bx==7 ? c3 : c1;
	} else if (by == 4) {
		g = (bx==1||bx==7) ? c3 : cb;
	} else if (by == 5) {
		g = bx==4 ? cb : bx==1 ? c3 : c1;
	} else if (by == 7) {
		g = bx == 0 ? cb : bx == 3 ? c1 : c3;
	}
	return g;
}

vec3 hue(float hue){
	vec3 rgb = fract(hue + vec3(0.0, 0.2, 0.6));
	rgb = abs(rgb * 2.0 - 1.0);  // fade
	return clamp(rgb, 0.0, 1.0);
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	uv *= rotate2d(time * 0.5);
	 
	float count = 4.0;
	float lattices = makeLattice(uv, count);
	
	vec3 color = vec3(hue(lattices + sin(time * 0.5)));
	gl_FragColor = vec4(color, 1.0);
}