// http://glslsandbox.com/e#42690.5
// Forked from http://glslsandbox.com/e#42597.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

float random(float n) {
	return fract(abs(sin(n * 55.753) * 367.34));
}

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle),  sin(angle), cos(angle));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 -  resolution.xy) / resolution.x;

	uv *= rotate2d(time * 0.2);  // Rotate screen.
	
	float direction = -1.0;
	float speed = time * direction * 0.1;
	float distanceFromCenter = length(uv);

	float meteorAngle = atan(uv.y, uv.x) * (180.0 / PI);  // Angle for meteor.

	float flooredAngle = floor(meteorAngle);
	float randomAngle = pow(random(flooredAngle), 0.5);
	float t = speed + randomAngle;  // Meteor flow randomly.
	
	float lightsCountOffset = 0.3;
	float adist = randomAngle / distanceFromCenter * lightsCountOffset;
	float dist = t + adist;
	dist = abs(fract(dist) - 1.0);  // repeat.
	
	float lightLength = 100.0;
	float meteor = (1.0 / dist) * cos(sin(speed)) / lightLength;  // cos(sin(speed)) make endless.
	meteor *= distanceFromCenter * 2.0;  // Make darker with coming closer to center.
	
	vec3 color = vec3(0.0);
	color.gb += meteor;
	
	gl_FragColor = vec4(color, 1.0);
}