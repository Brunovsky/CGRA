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
    };

	initBuffers() 
	{ 
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
		
		var teta = 2*(Math.PI)/this.slices;
		
		this.vertices.push(0, 0, 0);
		this.texCoords.push(0.5, 0.5);
		this.normals.push(0, 0, 1);
		
		for(var i = 0; i < this.slices; i++){
                var x = Math.cos(teta*i);
                var y = Math.sin(teta*i);
				var stex = x/2 + 0.5;
				var ttex = -y/2 + 0.5;

                this.vertices.push(x, y, 0);
				this.normals.push(0, 0, 1);
				this.texCoords.push(stex, ttex);
		}
		
		for(var i = 1; i < this.slices + 1; i++){
			this.indices.push(0, i, i+1);
		}
		//(0,i,i+1) i=1 i<=this.slices
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};




