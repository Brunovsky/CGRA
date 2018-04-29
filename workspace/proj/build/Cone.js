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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI, sqrt = Math.sqrt;
        const radius = this.radius, height = this.height,
            slices = this.slices, stacks = this.stacks;

        const thetaInc = 2 * PI / slices;
        const stackHeight = height / stacks;
        const hypotenuse = sqrt(radius * radius + height * height);
        const dXY = height / hypotenuse, dZ = radius / hypotenuse;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual side
                let theta = thetaInc * (i + 0.5);
                let xUnit = cos(theta);
                let yUnit = sin(theta);
                let X = radius * xUnit * (1 - s / stacks);
                let Y = radius * yUnit * (1 - s / stacks);
                let Z = s * stackHeight;

                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ);
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < slices; ++i) { // virtual side
                let above = slices + 1;
                let next = 1, right = 1;

                let stack = s * above;
                let current = next * i + stack;

                // ... v4  v3 ...
                // 
                // ... v1  v2 ...
                let v1 = current;
                let v2 = current + right;
                let v3 = current + right + above;
                let v4 = current + above;

                this.indices.push(v1, v2, v3);
                this.indices.push(v1, v3, v4);

                this.indices.push(v1, v3, v2);
                this.indices.push(v1, v4, v3);
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