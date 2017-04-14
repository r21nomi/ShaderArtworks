// http://glslsandbox.com/e#39869.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

float get(vec2 st, float left, float bottom,  float width,  float height) {
	float l = step(left, st.x);
	float b = step(bottom, st.y);
	float r = step(1.0 - (left + width), 1.0 - st.x);
	float t = step(1.0 - (bottom + height), 1.0 - st.y);
	
	return l * b * r * t;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy / resolution.xy);
	vec3 color = vec3(0.0);
	float bg = 0.0;

	/*
	float p1 = get(st, 0.11, 0.0, 0.01, 1.0);
	color += vec3(p1, bg, bg);
	
	float p2 = get(st, 0.21, 0.0, 0.02, 1.0);
	color += vec3(p2, p2, bg);
	
	float p3 = get(st, 0.31, 0.0, 0.003, 1.0);
	color += vec3(p3, bg, bg);
	
	float p4 = get(st, 0.41, 0.0, 0.03, 1.0);
	color += vec3(p4 * 0.2, p4, bg);
	
	float p5 = get(st, 0.51, 0.0, 0.02, 1.0);
	color += vec3(p5, bg, bg);
	*/
	
	for (int i = 0; i < 60; i++) {
		float v = get(st, float(i) / 60.0, 0.0, 0.001, 1.0);
		color += vec3(v, v, 0.0);
	}
	
	for (int i = 0; i < 60; i++) {
		float v = get(st, 0.0, float(i) / 60.0, 1.0, 0.001);
		color += vec3(0.0, v, 0.0);
	}

	gl_FragColor = vec4(color, 1.0);
}