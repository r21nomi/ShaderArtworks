// http://glslsandbox.com/e#41514.6
// Forked from http://glslsandbox.com/e#41469.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 st) {
	return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 st2Triangle(vec2 st) {
	float sx1 = st.x - st.y / 2.0; // skewed x
	float sx2 = st.x + st.y / 2.0; // skewed x
	return vec2(sx1, sx2 + floor(st.y));  // vec2(sx1, sx2) will be rhombus.
}

float triangle(vec2 st) {
	float sp = random(floor(st2Triangle(st)));
	return max(0.0, sin(sp * time));
}

void main() {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	st *= 10.0;  // Make pattern.
	st.y -= time * 2.0;  // Move

	float triangles = triangle(st);  // Make triangles.
	
	vec3 color = vec3(0.5, triangles, 0.9);
	
	gl_FragColor = vec4(color, 1.0);
}
