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

void main(void){
    vec2 uv = -1. + 2. * inData.v_texcoord;
    uv.x *= resolution.x / resolution.y;

    vec3 color = vec3((uv.x * cos(time)) + (uv.y * sin(time)));
    //color = vec3(1.0);

    fragColor = vec4(color, 1.0);
}
