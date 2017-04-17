// http://glslsandbox.com/e#39972.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 st =  gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);
	float ratio = resolution.x / resolution.y;
	
	st.x *= ratio;
	
	color += distance(vec2(cos(st.x * time * 100.0)), vec2(0.5));
	color += distance(vec2(sin(st.y * time * 100.0)), vec2(0.5));

	gl_FragColor = vec4(color.x * 0.2, color.y * 0.2, color.z, 1.0);

}