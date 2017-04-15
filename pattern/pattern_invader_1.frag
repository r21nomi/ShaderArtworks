// http://glslsandbox.com/e#39897.8
// Forked  http://glslsandbox.com/e#39877.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(in vec2 st){
	return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453);
}

float randomChar(vec2 outer, vec2 inner){
	float grid = 7.0;
	vec2 margin = vec2(0.15, 0.15);
	vec2 borders = step(margin, inner) * step(margin, 1.0 - inner);
	vec2 ipos = floor(inner * grid);
	ipos = abs(ipos - vec2(3.0, 0.0));
	
	return step(0.5, random(outer * 64.0 + ipos)) * borders.x * borders.y;
}

void main(){
	vec2 st = gl_FragCoord.st / resolution.xy;
	float ratio = resolution.x / resolution.y;
	
    	st.x *= ratio;  // Make each shape square.

	float rows = 10.0;  // Number of shape.
	vec2 fpos = fract(st * rows);  // Get decimal number.
    
	vec3 pct = vec3(1.0);
	vec2 chr = vec2(sin(floor(time) * 0.1));  // This effect to the shape.
	
	pct *= vec3(
		randomChar(chr + fract(mouse.x), fpos),
		randomChar(chr * 1.0, fpos),
		randomChar(chr * 10.0, fpos)
	);
	pct *= randomChar(chr + 33.0, fpos);

	gl_FragColor = vec4(vec3(pct), 1.0);
}