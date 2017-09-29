// http://glslsandbox.com/e#42690.4
// Forked from http://glslsandbox.com/e#42597.0

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 -  resolution.xy) / resolution.x;
	
	float direction = -1.0;
	float speed = time * direction * 0.1;

	float angle = atan(uv.y, uv.x) / (3.14159265359);
	float distanceFromCenter = length(uv);
	
	float color = 0.0;

	float scaledFloorAngle = floor(angle * 360.0);
	float randomAngle = fract(scaledFloorAngle * fract(scaledFloorAngle * 0.7235) * 45.0);
	float t = speed + randomAngle * 30.0;
	
	float lightsCountOffset = 0.1;
	float adist = randomAngle / distanceFromCenter * lightsCountOffset;
	float dist = t + adist;
	dist = abs(fract(dist) - 1.0);  // repeat.
	
	float lightLength = 80.0;
	color +=  (1.0 / dist) * cos(sin(speed)) / lightLength;  // cos(sin(speed)) make endless.
	
	gl_FragColor = vec4(color, color, color, 1.0);
}