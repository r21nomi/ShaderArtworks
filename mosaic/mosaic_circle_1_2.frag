// http://glslsandbox.com/e#41972.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

void main(void){
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	uv *= rotate2d(time * 0.3);

	float scale = 10.0;
    	vec2 repeatedUv = uv * scale;
    	vec2 newUv = fract(repeatedUv);

    	vec2 center = floor(repeatedUv) + vec2(0.5, 0.5);
    	float dist = distance(center, vec2(0.0));  // Same as length(center)
    	dist /= scale;

    	vec3 color = vec3(0.0);
    	float offset = map(sin(time * 3.0), -1.0, 1.0, 0.6, 0.9);

    	if (dist < offset) {
		// Make circle with small circle.
        	newUv -= 0.5;

        	float radius = 0.4;
	    	float dist = length(uv);
	    	float deg = atan(uv.y, uv.x);
	    	newUv *= rotate2d(-deg);
        	float circle = 1.0 - step(radius, length(vec2(newUv.x * (1.0 + (dist * 2.0)), newUv.y)));  // Circle
        	color.gb += circle;

 	       newUv += 0.5;
    	}
	
	gl_FragColor = vec4(color, 1.0);
}