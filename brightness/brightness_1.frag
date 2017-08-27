// http://glslsandbox.com/e#42182.3
// Forked http://glslsandbox.com/e#42172.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const float PI = 3.14159;
const float N = 90.0;

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

void main(){
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	st *= 8.0;
	
	float brightness = 0.0;
	vec3 baseColor = vec3(0.0, 0.1, 0.3);
	float speed = time * 1.0;
	
	for (float i = 0.0;  i < N;  i++) {
		brightness += 0.002 / abs(sin(PI * st.x) * sin(PI * st.y) * sin(PI * speed + random(floor(st.x )) + random(floor(st.y))));
	}
	
	gl_FragColor = vec4(baseColor * brightness, 1.0);	
}