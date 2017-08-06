// http://glslsandbox.com/e#41854.3

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float PI = 3.141592;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float spiral() {
	return map(sin(time * 1.0), -1.0,1.0, -40.0, 40.0);
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float v = 1.0 - length(st * sin(time * 3.0));

	float angle = atan(st.y, st.x);
	float stepCount = 10.0;
		
	vec3 color = vec3(sin(angle * stepCount + length(st) * spiral() + time));
	color.rg *= v * 3.0;
	
	gl_FragColor = vec4(color, 1.0 );
}