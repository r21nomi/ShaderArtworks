// http://glslsandbox.com/e#40087.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	// How to move spher is here (https://goo.gl/MolkFJ).
	st.x += cos(time);
	st.y += sin(time);
	// See this page (https://goo.gl/KJ9ScK) about the formula below.
	float f = abs(sin(time)) * 0.1 / length(st);
	gl_FragColor = vec4(vec3(f), 1.0);
}