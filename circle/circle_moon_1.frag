// http://glslsandbox.com/e#42205.4

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	float divide = 2.0;
	
	uv *= 8.0;
	float x = floor(max(abs(uv.x), abs(uv.y))) * 0.5 + 1.0;
	uv = mod(uv, divide);
	
	uv -= 0.5;
	uv *= rotate2d(time * x);
	uv += 0.5;
	
	float radius = map(sin(time * x), -1.0, 1.0, 0.4, 0.5);
	uv -= radius;
	float circle = smoothstep(radius - 0.1, radius, length(uv));
	
	float radius2 = map(sin(time * x), -1.0, 1.0, 0.3, 0.6);
	uv += radius / 2.0 - radius2 / 2.0 + 0.08;
	float circle2 = smoothstep(1.0 - radius2 - 0.1, 1.0 - radius2, 1.0 - length(uv));
	
	vec3 color = vec3(vec2(1.0 - max(circle, circle2)), 0.1);

	gl_FragColor = vec4(color, 1.0);
}