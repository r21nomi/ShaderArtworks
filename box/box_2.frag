// http://glslsandbox.com/e#44540.1
 
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
 
float mappedSin(float t) {
	return map(sin(t), -1.0, 1.0, 0.7, 1.1);
}
 
float box(vec2 uv, float size) {
	vec2 rect = step(-size, uv) * (1.0 - step(size, uv));
	return min(rect.x, rect.y);
}
 
void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
 
	float boxSize = 0.5;
	
	vec3 color = vec3(0.0);
	
	// Center box
	color += box(uv, boxSize * mappedSin(time * 2.8));
	
	// Left top box
	color += vec3(0.2, 0.8, fract(time * 1.1)) * box(vec2(uv.x + 0.2, uv.y - 0.2), boxSize * mappedSin(time * 6.5));
	color += vec3(0.9, fract(time * 0.8), 0.3) * box(vec2(uv.x + 0.4, uv.y - 0.4), boxSize * mappedSin(time * 4.0));
	color += vec3(fract(time * 0.8), 0.2, 0.3) * box(vec2(uv.x + 0.6, uv.y - 0.6), boxSize * mappedSin(time * 2.4));
	
	// RIght top box
	color += vec3(fract(time), 0.2, 0.1) * box(uv - 0.2, boxSize * mappedSin(time * 6.0));
	color += vec3(0.7, 0.2, fract(time * 0.9)) * box(uv - 0.4, boxSize * mappedSin(time * 2.0));
	color += vec3(0.1, fract(time * 0.3), 0.4) * box(uv - 0.6, boxSize * mappedSin(time * 7.5));
	
	// Right bottom box
	color += vec3(0.7, fract(time * 0.7), 0.6) * box(vec2(uv.x - 0.2, uv.y + 0.2), boxSize * mappedSin(time * 7.0));
	color += vec3(fract(time * 0.9), 0.6, 0.1) * box(vec2(uv.x - 0.4, uv.y + 0.4), boxSize * mappedSin(time * 4.5));
	color += vec3(fract(time * 0.3), 0.2, 0.7) * box(vec2(uv.x - 0.6, uv.y + 0.6), boxSize * mappedSin(time * 3.2));
	
	// Left bottom box
	color += vec3(0.2, 0.5, fract(time * 1.2)) * box(uv + 0.2, boxSize * mappedSin(time * 7.5));
	color += vec3(0.1, fract(time * 0.7), 0.2) * box(uv + 0.4, boxSize * mappedSin(time * 2.5));
	color += vec3(0.5, 0.7, fract(time * 0.3)) * box(uv + 0.6, boxSize * mappedSin(time * 8.5));
 
	gl_FragColor = vec4(color, 1.0);
}
