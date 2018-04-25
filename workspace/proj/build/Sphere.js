class HalfSphere extends CGFobject
{
	constructor(scene, radius = 1, slices = 32, stacks = 32)
	{
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.radius = radius;
		this.initBuffers();
	};

	initBuffers()
	{
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var cos = Math.cos, sin = Math.sin, PI = Math.PI;
        var theta = 2 * PI / this.slices;
        var phi = PI / (2 * this.stacks);

        for (var s = 0; s <= this.stacks; ++s) { // stack
        	for (var i = 0; i <= this.slices; ++i) { // virtual slice
        		var x1 = cos(s * phi) * cos(i * theta);
        		var y1 = cos(s * phi) * sin(i * theta);
        		var z1 = sin(s * phi);
        		var x = this.radius * x1;
        		var y = this.radius * y1;
        		var z = this.radius * z1;

        		this.vertices.push(x, y, z);
        		this.normals.push(x1, y1, z1);
        	}
        }

        for (var s = 0; s < this.stacks; ++s) { // stack
            for (var i = 0; i < this.slices; ++i) { // virtual slice
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

                this.indices.push(v1, v2, v4);
                this.indices.push(v2, v3, v4);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	};
};



class ClosedHalfSphere extends CGFobject
{
	constructor(scene, radius = 1, slices = 32, stacks = 32)
	{
		super(scene);
		this.half = new HalfSphere(scene, radius, slices, stacks);
		this.base = new Polygon(scene, slices, radius);
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.half.display();
			this.scene.rotate(Math.PI, 1, 1, 0);
			this.base.display();
		this.scene.popMatrix();
	};
};



class Sphere extends CGFobject
{
	constructor(scene, radius = 1, slices = 32, stacks = 32)
	{
		super(scene);
		this.half = new HalfSphere(scene, radius, slices, stacks);
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.half.display();
			this.scene.rotate(Math.PI, 1, 1, 0);
			this.half.display();
		this.scene.popMatrix();
	};
};