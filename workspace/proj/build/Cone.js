class Cone extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 32, stacks = 4)
    {
        super(scene);
        this.radius = radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };


    initBuffers() 
    {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        var cos = Math.cos, sin = Math.sin, PI = Math.PI;
        var theta = 2 * PI / this.slices;
        var stackHeight = this.height / this.stacks;
        var rhratio = this.radius / this.height;

        for (var s = 0; s <= this.stacks; ++s) { // stack
            for (var i = 0; i <= this.slices; ++i) { // virtual side
                var x1 = cos(theta * i);
                var y1 = sin(theta * i);
                var X = this.radius * x1 * (1 - s / this.stacks);
                var Y = this.radius * y1 * (1 - s / this.stacks);
                var Z = s * stackHeight;

                this.vertices.push(X, Y, Z);
                this.normals.push(x1 / rhratio, y1 / rhratio, rhratio);
            }
        }

        for (var s = 0; s < this.stacks; ++s) { // stack
            for (var i = 0; i < this.slices; ++i) { // virtual side
                var above = this.slices + 1;
                var stack = s * above;

                var current = i + stack;

                // ... v4  v3 ...
                // 
                // ... v1  v2 ...
                var v1 = current;
                var v2 = current + 1;
                var v3 = current + 1 + above;
                var v4 = current + above;

                this.indices.push(v1, v2, v3);
                this.indices.push(v1, v3, v4);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};



class ClosedCone extends CGFobject
{
	constructor(scene, radius = 1, height = 1, slices = 32, stacks = 4)
	{
		super(scene);
		this.cone = new Cone(scene, radius, height, slices, stacks);
		this.base = new Circle(scene, radius, slices);
		this.initBuffers();
	};

	display()
	{
        this.scene.pushMatrix();
            this.cone.display();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.base.display();
        this.scene.popMatrix();
	};
};



class DoubleCone extends CGFobject
{
	constructor(scene, radius = 1, height = 1, slices = 32, stacks = 4)
	{
		super(scene);
		this.cone = new Cone(scene, radius, height, slices, stacks);
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.cone.display();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.cone.display();
		this.scene.popMatrix();
	}
}