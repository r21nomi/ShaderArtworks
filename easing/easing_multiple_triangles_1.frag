// http://glslsandbox.com/e#44708.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

float backOut(float t) {
	float f = 1.0 - t;
	return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

float triangle (vec2 st,
                vec2 p0, vec2 p1, vec2 p2,
                float smoothness){
  vec3 e0, e1, e2;

  e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
  e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
  e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);

  e0.z = dot(e0.xy, p0) - smoothness;
  e1.z = dot(e1.xy, p1) - smoothness;
  e2.z = dot(e2.xy, p2) - smoothness;

  float a = max(0.0, dot(e0.xy, st) - e0.z);
  float b = max(0.0, dot(e1.xy, st) - e1.z);
  float c = max(0.0, dot(e2.xy, st) - e2.z);

  return smoothstep(smoothness * 2.0,
                    1e-7,
                    length(vec3(a, b, c)));
}

float hexagon(vec2 p, float radius) {
	vec2 q = abs(p);
	return max(abs(q.y), q.x * 0.866025 + q.y * 0.5) - radius;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	uv *= rotate2d(time * 0.2);
	
	vec2 scaledUv = uv * 12.0;
	vec2 repeatedUv = fract(scaledUv);
	repeatedUv -= 0.5;
	
	vec2 itemCenter = floor(scaledUv) + vec2(0.5, 0.5);
	float distanceFromCenter = distance(itemCenter, vec2(0.0));
	
	float t = fract(time * 0.8 + distanceFromCenter) * 2.0 - 1.0;
	float diameter = backOut(abs(t)) * 0.3;
	float circle = step(diameter, length(repeatedUv));
	
	float tr = triangle(
		repeatedUv,
		vec2(-0.5, -0.44) * diameter,
		vec2(0.5, -0.44) * diameter,
		vec2(0.0, 0.44) * diameter,
		0.001
	);
	vec3 color = vec3(tr);
	
	color.g += fract(distanceFromCenter);
	color.b += mod(itemCenter.x * itemCenter.y, distanceFromCenter);

	gl_FragColor = vec4(color, 1.0);
}