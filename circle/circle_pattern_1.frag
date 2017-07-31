// http://glslsandbox.com/e#41770.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main( void ) {
	 vec2 st = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	st *= 6.0;
	
	vec2 newSt = fract(st);
	newSt -= 0.5;
	
	float radius = map(cos(time * floor(st.x)) + sin(time * floor(st.y)), -1.0, 1.0, 0.2, 0.4);
	float bold = map(cos(time * 4.0), -1.0, 1.0, 0.02, 0.1);
	
	vec4 rect = vec4(0.1, 0.1, 0.9, 0.9);
    	vec2 hv = step(rect.xy, newSt + 0.5) * step(newSt + 0.5, rect.zw);
	
	vec3 color = vec3(bold / abs(radius - length(newSt)), 0.0, 0.9);
	color.b *= cos(time * 10.0 * (fract(newSt.x - 0.5) + fract(newSt.y - 0.5))) * hv.x * hv.y;

	gl_FragColor = vec4(color, 1.0);
}