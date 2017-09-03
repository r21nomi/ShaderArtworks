// http://glslsandbox.com/e#42297.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float num = 2.0;
	uv *= pow(num, 2.0);
	uv = mod(uv, num);

	vec3 color = vec3(0.0);
	float depth = 1.0;
	
	uv -= num / 2.0;
	for (int i = 0; i < 4; i++) {
		uv.x -= depth * time * 0.01;
		vec2 newUv = uv * 30.0;
		newUv = fract(newUv);
		newUv -= 0.5;
		float circle = 1.0 - step(0.2 * depth, length(newUv));
		color += circle * vec3(mod(uv, map(sin(time * 3.0), -1.0, 1.0, 1.0, 5.0)),1.0);
		depth /= 1.3;
	}

	gl_FragColor = vec4(color, 1.0);
}