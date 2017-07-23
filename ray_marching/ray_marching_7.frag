// http://glslsandbox.com/e#41640.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float EPS = 0.0001;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float exposeInOut(float t) {
	if (t == 0.0) {
		return 0.0;
	
	} else if (t == 1.0) {
		return 1.0;
	
	} else if ((t /= 0.5) < 1.0) {
		return 0.5 * pow(2.0, 10.0 * (t - 1.0));
	
	} else {
		return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
	}
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float _angle){
	return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

vec3 repetition(vec3 ray, float offset) {
	vec3 repeatedRay = mod(ray, offset) - offset / 2.0;
	return vec3(repeatedRay.x, repeatedRay.y, ray.z);
}

float barDist(vec2 st, float width) {
	return length(max(abs(st) - width, 0.0));
}

float sceneDist(vec3 ray) {
	vec3 repeatedRay1 = repetition(ray, 0.8);
	vec3 repeatedRay2 = repetition(ray, 0.8);
	
	float t = time * 1.0;
	float step = 1.0;
	float easing =  exposeInOut(fract(t));
	float speed = (floor(t) + easing) * step;
	
	// Rotate each item.
	repeatedRay1 = vec3(repeatedRay1.xy * rotate2d(speed), repeatedRay1.z);
	repeatedRay2 = vec3(repeatedRay2.xy * rotate2d(speed), repeatedRay2.z);

	float barDistance1 = barDist(repeatedRay1.xz , 0.15);
	float barDistance2 = barDist(repeatedRay2.yz, 0.15);
	
	// Make multiple pole.
	float result = max(barDistance1, barDistance2);
	
	return result;
}

vec3 getNormal(vec3 p){
	return normalize(vec3(
		sceneDist(p + vec3(EPS, 0.0, 0.0)) - sceneDist(p + vec3(-EPS, 0.0, 0.0)),
		sceneDist(p + vec3(0.0,  EPS, 0.0)) - sceneDist(p + vec3(0.0,  -EPS, 0.0)),
		sceneDist(p + vec3(0.0, 0.0,  EPS)) - sceneDist(p + vec3(0.0, 0.0,  -EPS))
	));
}

void main( void ) {
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	st *= rotate2d(time * 0.1);
	
	vec3 cameraPosition = vec3(0.0,  0.0, 1.0);
	vec3 cameraDirection = vec3(0.0,  0.0, -1.0);
	vec3 cameraUp  = vec3(0.0,  1.0,  0.0);
	vec3 cameraSide = cross(cameraDirection, cameraUp);
	float targetDepth = 0.3;
	
	vec3 ray = normalize(cameraSide * st.x + cameraUp * st.y + cameraDirection * targetDepth);
	
	vec3 rayPosition = cameraPosition;
	float distance = 0.0;
	float currentRayLength = 0.0;
	bool hit = false;
	
	vec3 lightDirection = normalize(vec3(0.5, 0.5, 1.0));
	
	for (int i = 0; i < 100; i++) {
		distance = sceneDist(rayPosition);
		currentRayLength += distance;
		rayPosition = cameraPosition + ray * currentRayLength;
		
		if (abs(distance) < EPS) {
			hit = true;
			break;
		}
	}
	
	vec3 color = vec3(0.0);
	
	if (hit) {
		vec3 normal = getNormal(rayPosition);
		float diff = clamp(dot(lightDirection, normal), 0.1, 1.0);
		color = vec3(1.0, 0.0, 0.4) * diff ;
		
	} else {
		color = vec3(1.0);
	}
	
	gl_FragColor = vec4(color + 0.05 * currentRayLength, 1.0);
}