/**
 * MyPrism
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, slices, stacks)
    {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }


	initBuffers() 
	{
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        var teta = 2*(Math.PI)/this.slices;
        var d = 1/this.stacks;
        
        for(var z = 0; z <= this.stacks; z++){
            
            for(var i = 0; i < this.slices; i++){
                this.vertices.push(Math.cos(teta*i), Math.sin(teta*i), z*d); 
                this.normals.push(Math.cos(teta*i), Math.sin(teta*i), 0);
                }
            
                if(z != this.stacks)
                    for(var i = 0; i < this.slices; i++){
                        if(i != this.slices - 1){
                            this.indices.push(i + z * this.slices, i + 1 + z * this.slices, i + (z + 1) * this.slices);
                            this.indices.push(i + 1 + z * this.slices, i + 1 + (z + 1) * this.slices, i + (z + 1) * this.slices);   }
                        else{
                            this.indices.push(i + z * this.slices, i + 1 + z * this.slices - this.slices, i + (z + 1) * this.slices);
                            this.indices.push(i + 1 + z * this.slices - this.slices, i + 1 + z * this.slices , i + (z + 1) * this.slices);   }
                            
                            
                            
                            
                            /*this.indices.push(i + z * this.slices, i + 1 + (z-1) * this.slices, i + 1 + z * this.slices);
                            this.indices.push(i + z * this.slices,  i + 1 + z * this.slices, i + 3 + z * this.slices);   }*/
                    }
            }  
        
			
        
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};








