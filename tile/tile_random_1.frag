// http://glslsandbox.com/e#42331.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(in vec2 uv){
	return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
}

float randomTile(in vec2 uv) {
	return random(floor(uv));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 -  resolution.xy) / min(resolution.x, resolution.y);
	
	uv *= 8.0;
	vec2 newUv = fract(uv);

	vec3 color = vec3(0.0);
	color.r += random(floor(uv));
	color.gb += sin(randomTile(uv) * time * 5.0);

	gl_FragColor = vec4(color, 1.0);
}