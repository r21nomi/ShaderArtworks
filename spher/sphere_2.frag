// http://glslsandbox.com/e#42318.1

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

float sphere(float t, float k) {
	float d = 1.0 + t * t - t * t * k * k;
	if (d <= 0.0) {
		return -1.0;
	}
	float x = (k - sqrt(d)) / (1.0 + t * t * t);
	return asin(x * t);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float num = 2.0;
	uv *= pow(num,2.0);
	uv = mod(uv, num);
	
	uv -= num / 2.0;
	float startX = fract(uv.x);

	vec3 color = vec3(0.0);
	
	color.r = sphere(1.0 - length(uv),2.0) * map(sin(time * 10.0 * startX), -1.0, 1.0, 0.3, 1.0);

	gl_FragColor = vec4(color, 1.0);
}