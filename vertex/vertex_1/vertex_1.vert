#version 150

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;

uniform mat4 mvp;
uniform mat4 minv;

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

out VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} outData;

void main(void)
{

    // Basic matrix.
    // This is an alternative matrix of mvp.
    mat4 m = mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    // Translation matrix.
    mat4 tm = mat4(
        1, 0, 0, 0.3,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    // scaling matrix.
    mat4 sm = mat4(
        0.5, 0, 0, 0,
        0, 0.5, 0, 0,
        0, 0, 0.5, 0,
        0, 0, 0, 1
    );

    float vertexCount = 100.0;
    float down = floor(sqrt(vertexCount));
    float across = floor(vertexCount / down);

    //float x = mod();

    // Some drivers don't like position being written here
    // with the tessellation stages enabled also.
    // Comment next line when Tess.Eval shader is enabled.
    gl_Position = m * vec4(a_position.x, a_position.y, 0.0, 1.0) * tm * sm;

    outData.v_position = a_position;
    outData.v_normal = a_normal;
    outData.v_texcoord = a_texcoord;
}
