// http://glslsandbox.com/e#40905.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

// Easing Function
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

// Fuction to repeat
vec2 repetition(vec2 st) {
	return fract(vec2(st));
}

// Return distance between the front edge of the ray and sphere
float distanceFunction(vec3 rayPosition, vec3 targetPosition,  float size) {
	return distance(rayPosition, targetPosition) - size;
}

// Drop shadow to the sphere
vec3 getNormal(vec3 p, vec3 targetPosition,  float size){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunction(p + vec3(  d, 0.0, 0.0), targetPosition, size) - distanceFunction(p + vec3( -d, 0.0, 0.0), targetPosition, size),
        distanceFunction(p + vec3(0.0,   d, 0.0), targetPosition, size) - distanceFunction(p + vec3(0.0,  -d, 0.0), targetPosition, size),
        distanceFunction(p + vec3(0.0, 0.0,   d), targetPosition, size) - distanceFunction(p + vec3(0.0, 0.0,  -d), targetPosition, size)
    ));
}

void main(void){
	vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// Repetition
	int count = 6;
	st *= float(count / 2);
	st = repetition(st);
	st -= 0.5;
	
	// camera
	vec3 cameraPos = vec3(0.0,  0.0,  3.0);  // camera top
	vec3 cameraDir = vec3(0.0,  0.0, -1.0);  // camera direction
	vec3 cameraUp  = vec3(0.0,  1.0,  0.0);  // up direction for camera
	vec3 cameraSide = cross(cameraDir, cameraUp);  // calcurate side direction by 外積
	float targetDepth = 1.0;  // depth for forcus
	
	// ray
	vec3 ray = normalize(cameraSide * st.x + cameraUp * st.y + cameraDir * targetDepth);
	float rayLength = 0.0;
	vec3 rayPos = cameraPos;
	
	// sphere
	float sphereSize = 1.0;
	vec3 spherePos = vec3(0.0, 0.0, 0.0);
	
	float distance = 0.0;
	
	vec2 easing =  vec2(
		map(exposeInOut(cos(time * 1.5)), 0.0, 1.0, -1.0, 1.0),
		map(exposeInOut(sin(time * 1.5)), 0.0, 1.0, -1.0, 1.0)
	);
	
	vec3 lightDir = vec3(
		easing.x,
		easing.y,
		1.0
	);
	
	// calcurate distance
	for (int i = 0; i < 16; i++) {
		distance = distanceFunction(rayPos, spherePos, sphereSize);
		rayLength += distance;
		rayPos = cameraPos + ray * rayLength;
	}
    
	if (abs(distance) < 0.001) {
		vec3 normal = getNormal(rayPos, spherePos, sphereSize);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		gl_FragColor = vec4(vec3(diff), 1.0);
		
	}else{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}