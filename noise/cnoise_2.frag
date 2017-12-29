// http://glslsandbox.com/e#44436.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float fade(float x) {
	return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

float phash(float p) {
	p = fract(7.8233139 * p);
	p = ((2384.2345 * p - 1324.3438) * p + 3884.2243) * p - 4921.2354;
	return fract(p) * 2.0 - 1.0;
}

float cnoise(float p) {
	float ip = floor(p);
	float fp = fract(p);
	float d0 = phash(ip) *  fp;
	float d1 = phash(ip + 1.0) * (fp - 1.0);
	return mix(d0, d1, fade(fp));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	//  Backgroud.
	vec3 color = vec3(0.5, 0.1, 0.9);
	
	vec2 scaledUv = uv * 6.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	// Rotate.
	repeatedUv *= rotate2d(time);
	
	// Main object.
	for (float i = 0.0; i < 1.0; i += 0.5) {
		float circle = smoothstep(0.6, 0.8, 1.0 - length(repeatedUv + cnoise(i * floor(scaledUv.x) + time)));
		color += circle;
		gl_FragColor = vec4(color, 1.0);
	}
}