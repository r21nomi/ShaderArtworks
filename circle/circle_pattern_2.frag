// http://glslsandbox.com/e#41823.2

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
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	st += time * 0.3;
	st *= 8.0;
	
	vec2 newSt = fract(st);
	vec3 color = vec3(0.0);
	
	newSt -= 0.5;
	float vx = map(sin(time * 4.0), -1.0, 1.0, 0.1, 0.2);
	float vy = map(cos(time * 3.0), -1.0, 1.0, 0.3, 0.8);
	// Setting different value to vec2() make double circle.
	color.rb = step(abs(length(newSt)), vec2(vx, vy));
	color.g = 0.0;
	newSt += 0.5;

	gl_FragColor = vec4(color, 1.0);
}