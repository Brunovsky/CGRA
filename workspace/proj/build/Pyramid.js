class Pyramid extends CGFobject
{
    constructor(scene, sides, radius = 1, height = 1, stacks = 4)
    {
        super(scene);
        this.sides = sides;
        this.radius = radius;
        this.height = height;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers() 
    {
        const cos = Math.cos, sin = Math.sin, PI = Math.PI, sqrt = Math.sqrt;
        const sides = this.sides, radius = this.radius,
            height = this.height, stacks = this.stacks;

        const thetaInc = 2 * PI / sides;
        const stackHeight = height / stacks;
        const apotema = cos(PI / sides) * radius;
        const hypotenuse = sqrt(apotema * apotema + height * height);
        const dXY = height / hypotenuse, dZ = apotema / hypotenuse;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
            	// ... ][v1   M   v2][ ...  -- stack s
            	
            	let theta, xUnit, yUnit, X, Y, Z;

            	// v1
                theta = thetaInc * (i - 0.5); 
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = radius * xUnit * (1 - s / stacks);
                Y = radius * yUnit * (1 - s / stacks);
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v1

                // M
                theta = thetaInc * i;
                xUnit = cos(theta);
                yUnit = sin(theta);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v1's normals
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v2's normals

            	// v2
                theta = thetaInc * (i + 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = radius * xUnit * (1 - s / stacks);
                Y = radius * yUnit * (1 - s / stacks);
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v2
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                let above = 2 * sides;
                let next = 2;

                let stack = s * above;
                let current = next * i + stack;

                // ... v4  v3 ... -- stack s+1
                // 
                // ... v1  v2 ... -- stack s
                let v1 = current;
                let v2 = current + 1;
                let v3 = current + 1 + above;
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



class ClosedPyramid extends CGFobject
{
	constructor(scene, sides, radius = 1, height = 1, stacks = 4)
	{
		super(scene);
		this.pyramid = new Pyramid(scene, sides, radius, height, stacks);
		this.base = new Regular(scene, sides, radius);
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.pyramid.display();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.base.display();
		this.scene.popMatrix();
	};
};



class DoublePyramid extends CGFobject
{
	constructor(scene, sides, radius = 1, height = 1, stacks = 4)
	{
		super(scene);
		this.pyramid = new Pyramid(scene, sides, radius, height, stacks);
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.pyramid.display();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.pyramid.display();
		this.scene.popMatrix();
	};
};