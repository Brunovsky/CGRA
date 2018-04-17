/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */

class MyCircle extends CGFobject
{
	constructor(scene, slices)
    {
        super(scene);
		this.slices = slices;
        this.initBuffers();
    }


	initBuffers() 
	{ 
		this.vertices = [];
        this.indices = [];
        this.normals = [];
		
		var teta = 2*(Math.PI)/this.slices;
		
		this.vertices.push(0, 0, 0);
		
		for(var i = 0; i < this.slices; i++){
                this.vertices.push(Math.cos(teta*i), Math.sin(teta*i), 0);
				this.normals.push(Math.cos(teta*i), Math.sin(teta*i), 0);
		}				
		
		for(var i = 1; i < this.slices + 1; i++){
			this.normals.push(0, i, i + 1);
		}
		
		
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};




