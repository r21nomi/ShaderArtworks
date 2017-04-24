// http://glslsandbox.com/e#40121.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color;
	
	vec2 newSt = vec2(mod(st, 0.2)) - 0.1;
	float f = 1.0 /  abs(newSt.x) * abs(newSt.y);
	color = vec3(0.0, f * sin(time + st.x * st.y), f);

	gl_FragColor = vec4(color, 1.0);
}