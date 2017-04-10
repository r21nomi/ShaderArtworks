// http://glslsandbox.com/e#39736.1

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution;
	vec3 p3 = vec3(st.x - 0.5, st.y - 0.5, sin(time));
	float color = 0.0;
	
	for(int i = 0; i < 4; i++){
		color = cos(float(i) * color * 10. + length(p3));
	}
	
	gl_FragColor = vec4(vec3(color, color * sin(time), color * time * 0.1), 1.0);
}