// http://glslsandbox.com/e#42836.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float dia(vec2 uv) {
	float a = atan(uv.y, uv.x);	
	float s = floor((abs(uv.x) + abs(uv.y)) * 50.0);
	s *= sin(s * 24.0);
	float s2 = fract(sin(s));
	
	float c = step(0.9, tan(a + s + s2 * time) * 0.5 + 0.5);
	
	c *= s2 * 0.7 + 0.5;
	return c;		
}

float pluralRing(vec2 uv, float interval) {
	return sin(length(uv) * interval);
}

float rotationSpiral(vec2 uv, float count, float speed, float num) {
	return step(0.0, sin(atan(uv.y, uv.x) * count + speed)) * sin(floor(length(uv * num)));
}

void main(void) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float scaledTime = mod(time * 1.0, 3.0);
	float type = floor(scaledTime);
	float newTime = 1.0 - fract(scaledTime);
	
	vec3 color = vec3(0.0);
	
	if (type == 1.0) {
		color.r += pluralRing(uv * 4.0, newTime * 25.0);
		
	} else if (type == 2.0) {
		color.g += dia(uv * newTime);
		
	} else {
		color.b += rotationSpiral(uv, 20.0, newTime * 10.0, newTime * 100.0);
	}

	gl_FragColor = vec4(color, 1.0);
}