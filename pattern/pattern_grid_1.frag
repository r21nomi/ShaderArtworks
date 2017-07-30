// http://glslsandbox.com/e#41744.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	st *= 10.0;
	st += time;
	
	vec2 newSt = fract(st);
	
	float borderX = step(newSt.x, map(sin(time * 5.0), -1.0, 1.0, 0.2, 0.5));
	float borderY = step(newSt.y, map(sin(time * 5.0), -1.0, 1.0, 0.2, 0.5));
	
	vec3 color = vec3(0.2, borderX, borderY);
	
	gl_FragColor = vec4(color, 1.0);
}