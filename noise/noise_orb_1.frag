// http://glslsandbox.com/e#46172.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(random(i + vec2(0.0,0.0)), random( i + vec2(1.0,0.0) ), u.x), mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x), u.y);
}

float rect(vec2 p, float size) {  
	vec2 d = abs(p) - vec2(size);
	return min(max(d.x, d.y), 0.0) + length(max(d,0.0));
}

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec3 color = vec3(0.0);
	
	vec2 scaledUv = uv * 20.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	float n = noise(uv * 10.0 + time);
	
	float t = 0.1 / length(vec2(0.0) - repeatedUv * n);
	float shape = step(0.0, t * n);
	
	color += vec3(shape, t, t);
	
	gl_FragColor = vec4(color, 1.0);
}