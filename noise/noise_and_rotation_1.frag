// http://glslsandbox.com/e#40602.0
// forked from http://glslsandbox.com/e#40600.0

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle),  sin(angle), cos(angle));
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float fbm(vec2 p) {
     float v = 0.0;
     v += random(p * 1.0) * 0.5;
     v += random(p * 2.0) *0.25;
     v += random(p * 4.0) * 0.125;
     return v * 1.0;
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
		
	float timeVal = 0.0;
	vec3 color = vec3(0.0);
	
	st *= rotate2d(time * 1.0);
	
	for(int i = 1; i < 5; i++) {
		float t = abs(1.0 / ((st.x * fbm(st * + time * float(i))) * 50.0));
		float v = map(sin(time * 2.0), -1.0, 1.0, 0.5, 1.0);
		color +=  t * vec3(1.0, v, 2.0);
	}
	
	gl_FragColor = vec4(color, 1.0);
}