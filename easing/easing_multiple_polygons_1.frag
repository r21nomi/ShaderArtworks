// http://glslsandbox.com/e#44715.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793

float backOut(float t) {
	float f = 1.0 - t;
	return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float polygon(vec2 p, int vertices, float size) {
    float a = atan(p.x, p.y) + 0.2;
    float b = 6.28319 / float(vertices);
    return cos(floor(0.5 + a / b) * b - a) * length(p) - size;
}

float smoothedge(float v) {
    return smoothstep(0.0, 1.0 / resolution.x, v);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	uv *= rotate2d(time * 0.2);
	
	vec2 scaledUv = uv * 12.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	vec2 itemCenter = floor(scaledUv) + vec2(0.5, 0.5);
	float distanceFromCenter = distance(itemCenter, vec2(0.0));
	
	float t = fract(time * 0.2 + distanceFromCenter) * 2.0 - 1.0;
	float diameter = backOut(abs(t)) * 0.4;
	float circle = step(diameter, length(repeatedUv));
	
	float p = polygon(repeatedUv, int(diameter * 12.0), diameter);
	vec3 color = vec3(smoothedge(p));
	
	color.r += fract(distanceFromCenter);
	color.b += mod(itemCenter.x * itemCenter.y, distanceFromCenter);

	gl_FragColor = vec4(color, 1.0);
}