// http://glslsandbox.com/e#39582.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

void main( void ) {
	vec2 st = (gl_FragCoord.xy / resolution.xy);
	float pct = 0.0;

	pct = step(0.1, st.x);  // left
	pct *= step(0.1, 1.0 - st.x);  // right
	pct *= step(0.1, 1.0 - st.y);  // top
	pct *= step(0.1, st.y);  // bottom
	
	vec3 color = vec3(pct);
	gl_FragColor = vec4(color, 1.0);
}