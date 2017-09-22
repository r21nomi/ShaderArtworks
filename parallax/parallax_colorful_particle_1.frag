// http://glslsandbox.com/e#42567.1

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

float random(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

float circle(vec2 uv, float size, float s) {
	return 1.0 - step(size, length(uv) * s);
}

// Referenced from https://github.com/keijiro/ShaderSketches/blob/master/Fragment/Discs4.glsl
vec3 palette(float z) {
	float g = 0.6 + 0.4 * sin(z * 8.0 + time * 2.0);
	float b = 0.5 + 0.4 * sin(z * 5.0 + time * 3.0);
	return vec3(1.0, g, b);
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
		float z1 = random(0.2 * floor(uv));
		float s1 = 1.3 + sin(time * (0.6 + z1)) * 0.6;
		uv = fract(uv);
		uv -= 0.5;
		
		float r = random(offset);
		vec3 box = vec3(0.2 + r, 0.6 * r, mod(8.0 * r, 1.0)) * circle(uv, 0.3, s1);
		color += box / palette(s1);
		scale /= 1.0;
		offset /= 2.0;
	}
	
	gl_FragColor = vec4(color, 1.0);
}