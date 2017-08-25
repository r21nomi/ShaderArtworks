// http://glslsandbox.com/e#42157.3

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main(void){
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	uv *= rotate2d(time * 0.3);

	float scale = 30.0;
	vec2 scaledUv = uv * scale;
	vec2 newUv = mod(scaledUv, map((sin(time)), -1.0, 1.0, 1.0, 7.0));

	vec2 center = floor(scaledUv) + vec2(0.5, 0.5);
	float dist = distance(center, vec2(0.0));  // Same as length(center)
	dist /= scale;

	vec3 color = vec3(0.0, 0.0, fract(newUv.y));
	float offset = map((sin(time * 2.0)), -1.0, 1.0, 0.5, 1.0);

	scaledUv -= 1.0;
	newUv -= 1.0;
	
	if (dist < offset) {
        	// Make circle with small circle.

		float radius = map(sin((floor(scaledUv.x + scaledUv.y + time * 10.0))), -1.0, 1.0, 0.2, 0.6);
		float v = 1.0 - step(radius, length(newUv));  // Circle
		color.r += v;
	} else {
		float radius = 0.4;
		float v = 1.0 - step(radius, length(newUv));  // Circle
		color += vec3(v);
	}
	
	scaledUv += 0.5;
	newUv + 0.5;

	gl_FragColor = vec4(color, 1.0);
}