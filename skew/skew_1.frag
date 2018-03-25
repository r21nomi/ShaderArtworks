#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float pluralRing(vec2 uv, float interval) {
	return sin(length(uv) * interval);
}

float ball(vec2 uv, float radius) {
	return step(radius, length(uv) - radius);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.0);
	vec2 uv2 = uv;
	
	uv /= -(uv.y) + 0.8;
	uv.x -= time * 0.05;
	uv.y += time * 0.3;
	
	uv *= 10.0;
	vec2 horizon = uv.xy * vec2(0.5, 0.5);
	
	horizon = fract(horizon);
	horizon -= 0.5;
	float size = 0.2;
	float circle = ball(horizon, size);
	
	float interval = map(sin(time * 6.0), -1.0, 1.0, 10.0, 26.0);
	interval = mod(time * 2.0, 5.0) * 10.0 + 15.0;
	float p = pluralRing(horizon, interval);
	
	vec2 horizon2 = horizon + vec2(
		map(cos(time), -1.0, 1.0, -0.1, 0.1),
		map(sin(time), -1.0, 1.0, 0.05, 0.1)
	);
	float circle2 = min(circle, ball(horizon2, size * 0.95));
	
	float dot = dot(vec2(0.0, 1.0), uv2) * 1.6;
	
	vec3 color = vec3(1.0 - circle);
	color.r *= p;
	color.rb += circle2;
	color += dot;

	gl_FragColor = vec4(color, 1.0 );

}