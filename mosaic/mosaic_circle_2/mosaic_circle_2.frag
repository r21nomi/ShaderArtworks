#version 150

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;

in VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} inData;

out vec4 fragColor;

#define PI 3.14159265359

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle), -sin(_angle),  sin(_angle), cos(_angle));
}

void main(void){
    vec2 uv = -1. + 2. * inData.v_texcoord;
    uv.x *= resolution.x / resolution.y;

    uv *= rotate2d(time * 0.1 * PI);

    float scale = 30.0;
    vec2 scaledUv = uv * scale;
    vec2 newUv = fract(scaledUv);

    vec2 center = floor(scaledUv) + vec2(0.5, 0.5);
    float dist = distance(center, vec2(0.0));  // Same as length(center)
    dist /= scale;

    vec3 color = vec3(step(spectrum.x * 200, length(uv)) * spectrum.x * 1000, 0.0, 1.0);
    //color.r *= step(spectrum.x * 200, fract(scaledUv.x));
    float offset = 0.1 + spectrum.x * 200;

    if (dist < offset) {
        // Make circle with small circle.
        newUv -= 0.5;

        float radius = 0.1 + spectrum.x * 10 * abs(floor(scaledUv.x));
        float v = 1.0 - step(radius, length(newUv));  // Circle
        v *= time;
        color.g += v * spectrum.x * 100;

        newUv += 0.5;
    }

    fragColor = vec4(color, 1.0);
}
