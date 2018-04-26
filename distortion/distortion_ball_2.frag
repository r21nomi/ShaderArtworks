// http://glslsandbox.com/e#46631.2

precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;

float quadraticInOut(float t) {
	float p = 2.0 * t * t;
	return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

float random(in vec2 uv){
	return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float circle(vec2 uv, float radius) {
	return step(radius, length(uv));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 -  resolution.xy) / min(resolution.x, resolution.y);
	
	uv.x += time * 0.2;
	
	vec2 scaledUv = uv * 3.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
    
	uv.x += (floor(time) + quadraticInOut(fract(time))) * 0.2;
	float line = step(0.2, fract(uv * 15.0).x);
	
	float randomOffset = random(floor(scaledUv)) + 0.5;
	float offsetContur = randomOffset *sin (floor(time) + quadraticInOut(fract(time)));
	float distortion = (repeatedUv.x + sin(repeatedUv.y * offsetContur * 20.0 + (time * 15.0 * randomOffset))) * 0.03;
	
	repeatedUv.x += distortion;
	
	vec2 circleUv1 = repeatedUv - vec2(0.0, distortion);
	vec2 circleUv2 = repeatedUv + vec2(0.0, distortion * 2.0);
	vec2 circleUv3 = repeatedUv + vec2(distortion, 0.0);
	
	vec3 color = vec3(
		circle(circleUv1, 0.44),
		1.0 - circle(circleUv2, 0.24),
		circle(circleUv3, 0.44 + offsetContur * 0.1)
	);
	
	if (length(color) > 1.0) {
		color *= vec3( line);
	}
	
	gl_FragColor = vec4(color, 1.0);
}
