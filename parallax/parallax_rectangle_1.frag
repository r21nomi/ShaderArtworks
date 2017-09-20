// http://glslsandbox.com/e#42552.3

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

float box(vec2 uv, float size) {
	vec2 rect = step(-size, uv) * (1.0 - step(size, uv));
	return min(rect.x, rect.y);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float speed = time * 0.3;
	float scale = 4.0;
	float offset = 1.0;
	vec3 color = vec3(0.0);
	
	for (int i = 0; i < 3; i++) {
		if (i == 0) {
			uv.x += speed;
		} else {
			uv.x -= speed;
		}
		
		uv *= scale;
		uv = fract(uv);
		uv -= 0.5;
		
		float r = random(offset);
		vec3 box = vec3(0.2 + r, 0.6 * r, mod(8.0 * r, 1.0)) * box(uv, 0.3);
		color += box;
		scale /= 1.0;
		offset /= 2.0;
	}
	
	gl_FragColor = vec4(color, 1.0);
}