// http://glslsandbox.com/e#39624.0

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

/**
  * 0.0 : Circle
  * 1.0 : Background
  */
bool isCircle(vec2 pos, vec2 center, float radius) {
	float d = distance(pos, center);
	return step(radius, d) == 0.0;
}

void main( void ) {
	vec3 circleColor = vec3(0.3, 0.2, 0.8);
	vec3 backgroundColor = vec3(0.1, 0.9, 0.5);
	
	vec2 fStep = vec2(50.0, 50.0);  // distance between circles
	vec2 fPos = mod(gl_FragCoord.xy + vec2(time) * 0.2, fStep);
	
	vec3 color =  isCircle(fPos, fStep / 2.0, 20.0) ? circleColor : backgroundColor;
	
	gl_FragColor = vec4(color, 1.0);
}