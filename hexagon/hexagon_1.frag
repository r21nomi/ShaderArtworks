// http://glslsandbox.com/e#42992.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex(vec2 p) {
	//p.x *= 0.57735 * 2.0;
	p.y += mod(floor(p.x), 2.0) * 0.5;
	p = abs((mod(p, 1.0) - 0.5));
	return abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0);
}


void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) - min(resolution.x, resolution.y);
	uv.x += time * 50.0;
	//uv *= 10.0;
	//vec2 newUv = fract(uv);
	vec2 newUv = uv;
	
	vec2 p = newUv / 50.0; 
	float strokeWidth = 0.1;	
	gl_FragColor = vec4(step(strokeWidth, hex(p)));
}