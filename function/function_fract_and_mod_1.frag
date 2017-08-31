// fract() vs mod() for repetition

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
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float num = 10.0;
	vec3 color = vec3(0.0);
	
	if (uv.x < 0.0) {
		// fract()
		// Range of each item is 0.0 - 1.0
		
		vec2 uv_fract = uv;
		
		uv_fract.x -= time * 0.1;
	
		uv_fract *= num;
		uv_fract = fract(uv_fract);
		
		float centerOffset = 0.5;
		float radius = centerOffset * 0.8;
		uv_fract -= centerOffset;
		
		color.rb += smoothstep(radius - 0.1, radius, length(uv_fract));
		color.g += step(-0.05, uv_fract.x) * step(uv_fract.x, 0.05);
		color.b += step(centerOffset, uv_fract.y);
	} else {
		// mod()
		// Range of each item is 0.0 - num
		
		vec2 uv_mod = uv;
		
		uv_mod.x += time * 0.1;
	
		uv_mod *= pow(num, 2.0);
		uv_mod = mod(uv_mod, num);
		
		float centerOffset = num / 2.0;
		float radius = centerOffset * 0.8;
		uv_mod -= centerOffset;
		
		color.rg += smoothstep(radius - num * 0.1, radius, length(uv_mod));
		color.b += step(-0.05 * num, uv_mod.x) * step(uv_mod.x,0.05 * num);
		color.r += step(centerOffset, uv_mod.y);
	}
	
	// Center vertical line.
	color -= smoothstep(-0.1, -0.05, uv.x) * smoothstep(uv.x, uv.x + 0.05, 0.1);

	gl_FragColor = vec4(color, 1.0);
}