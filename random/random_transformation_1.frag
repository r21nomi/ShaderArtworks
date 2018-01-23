// http://glslsandbox.com/e#44880.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

float random(in vec2 uv){
	return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float particle(vec2 uv, float size) {
    return step(size, length(uv));
}

float obliqueLline(vec2 uv){
	return step(0.6, fract((uv.x + uv.y + time * 0.8) * 4.0));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec2 scaledUv = uv * 6.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
    
	float offset1 = random(floor(scaledUv)) * random(floor(scaledUv));
	float p = particle(repeatedUv,  map(cos(time * 3.0 + offset1 * 10.0), -1.0, 1.0, 0.2, 0.6));
	
	float offset2 = random(floor(scaledUv));
	vec3 color = vec3(p);
	color.r += obliqueLline(repeatedUv);
	color.g += particle(repeatedUv, map(sin(time * 6.0 + offset2 * 20.0), -1.0, 1.0, 0.1, 0.8));
	color.rb += max(offset1, offset2);
    
	gl_FragColor = vec4(color, 1.0);
}
