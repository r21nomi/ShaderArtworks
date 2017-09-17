// http://glslsandbox.com/e#42514.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

float random(vec2 uv) {
	return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float backOut(float elapsedTimeRate) {
	float amount = 1.7;
	return --elapsedTimeRate * elapsedTimeRate * ((amount + 1.0) * elapsedTimeRate + amount) + 1.0;
}

float rotationSpiral(vec2 uv, float count, float speed) {
	float rotationEasing = (floor(time) + backOut(fract(time))) * PI * 2.0;
	return step(0.0, sin(atan(uv.y, uv.x) * count + rotationEasing * speed));
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy * 2.0 -  resolution.xy ) / min(resolution.x, resolution.y);
	
	vec2 scaledUv = uv * 5.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	float randomVal = random(floor(scaledUv));
	
	float minCount = 3.0;
	float count = floor(9.0 * randomVal) + minCount;
	float spiral = rotationSpiral(repeatedUv, count, 3.0);
	float windmill = smoothstep(0.3, 0.4, spiral + length(repeatedUv));

	vec3 color = vec3(windmill, windmill + randomVal, 1.0);

	gl_FragColor = vec4(color, 1.0 );
}