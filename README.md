# ShaderArtworks
Artworks with Shader.

## How I create artwork
Use [GLSL Sandbox](http://glslsandbox.com/) to create artwork.  
After create artwork, save it as `.frag` file with [ShaderEditor](http://editor.thebookofshaders.com/).

## Generate GIF image
I'm using [glsl2img](https://github.com/fand/glsl2img).
```
$ glsl2gif PATH_TO_SHADER_FILE -r 30 -l 3.0 -s 700x700
```
