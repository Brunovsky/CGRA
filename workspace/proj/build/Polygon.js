// coords: CHECK
// let: CHECK
// theta, phi: CHECK
// cos,sin,PI, this.: CHECK
// 
class Regular extends CGFobject
{
	constructor(scene, sides, radius = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
		this.sides = sides;
		this.radius = radius;
		this.coords = {
			minS: coords[0],
			maxS: coords[1],
			minT: coords[2],
			maxT: coords[3]
		};
        this.initBuffers();
    };

	initBuffers()
	{
		const cos = Math.cos, sin = Math.sin, PI = Math.PI;
		const sides = this.sides, radius = this.radius,
			coords = this.coords;

		const thetaInc = 2 * (Math.PI) / sides;

		this.vertices = [];
    	this.indices = [];
    	this.normals = [];
    	this.texCoords = [];
		
		// Center vertex
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push((coords.minS + coords.maxS) / 2);
		this.texCoords.push((coords.minT + coords.maxT) / 2);
		
		for (let i = 0; i <= sides; ++i) {
			let theta = thetaInc * (i + 0.5);
            let xUnit = cos(theta);
            let yUnit = sin(theta);
            let X = radius * xUnit;
            let Y = radius * yUnit;

			let stexUnit = 0.5 * (X + 1);
			let ttexUnit = 0.5 * (Y - 1);
			let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
			let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;

            this.vertices.push(X, Y, 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(stex, ttex);
		}
		
		for (let i = 1; i <= sides; ++i) {
			// indices:
			this.indices.push(0, i, i + 1);
			this.indices.push(0, i + 1, i);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};



class Square extends CGFobject
{
	constructor(scene, side = 1, coords = [0, 1, 0, 1]) 
	{
		super(scene);
		this.square = new Regular(scene, 4, side / Math.sqrt(2), coords);
		this.initBuffers();
	};

	display()
	{
		this.square.display();
	};
};



class Circle extends CGFobject
{
	constructor(scene, radius = 1, slices = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
		this.circle = new Regular(scene, slices, radius, coords);
        this.initBuffers();
    };

	display()
	{
		this.circle.display();
	};
};



class Triangle extends CGFobject
{
	constructor(scene, side = 1, coords = [0, 1, 0, 1])
	{
		super(scene);
		this.triangle = new Regular(scene, 3, side / Math.sqrt(3), coords);
		this.initBuffers();
	};

	display()
	{
		this.triangle.display();
	};
};



class Rectangle extends CGFobject
{
	constructor(scene, sideX, sideY, coords = [0, 1, 0, 1])
	{
		super(scene);
		this.square = new Square(scene, 1, coords);
		this.sideX = sideX;
		this.sideY = sideY;
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.scene.scale(this.sideX, this.sideY, 1);
			this.square.display();
		this.scene.popMatrix();
	};
};


		const cos = Math.cos, sin = Math.sin, PI = Math.PI;
		const sides = this.sides, radius = this.radius,
			coords = this.coords;

		const thetaInc = 2 * (Math.PI) / sides;

class Trapezium extends CGFobject
{
	constructor(scene, base = 1, height = 1, top = 1, coords = [0, 1, 0, 1])
	{
		super(scene);
		this.base = base;
		this.height = height;
		this.top = top;
		this.coords = {
			minS: coords[0],
			maxS: coords[1],
			minT: coords[2],
			maxT: coords[3]
		};
		this.initBuffers();
	};

	initBuffers()
	{
		const base = this.base, height = this.height,
			top = this.top, coords = this.coords;
		
		//   v3  v2
		// v0      v1
		this.vertices = [
			-base / 2, -height / 2, 0,
			 base / 2, -height / 2, 0,
			  top / 2,  height / 2, 0,
			 -top / 2,  height / 2, 0
		];

		this.indices = [
			0, 1, 2,
			0, 2, 3,
			0, 2, 1,
			0, 3, 2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			coords.minS, coords.minT,
			coords.maxS, coords.minT,
			coords.minS, coords.maxT,
			coords.maxS, coords.maxT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};



class Quadrangle extends CGFobject
{
	constructor(scene, xy = [[-1, -1], [-1, 1], [1, 1], [1, -1]], coords = [0, 1, 0, 1])
	{
		super(scene);
		this.xy = xy;
		this.coords = {
			minS: coords[0],
			maxS: coords[1],
			minT: coords[2],
			maxT: coords[3]
		};
		this.initBuffers();
	};

	initBuffers()
	{
		const xy = this.xy, coords = this.coords;

		this.vertices = [
			xy[0][0], xy[0][1], 0,
			xy[1][0], xy[1][1], 0,
			xy[2][0], xy[2][1], 0,
			xy[3][0], xy[3][1], 0,
		];

		this.indices = [
			0, 1, 2,
			0, 2, 3,
			0, 2, 1,
			0, 3, 2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			coords.minS, coords.minT,
			coords.maxS, coords.minT,
			coords.minS, coords.maxT,
			coords.maxS, coords.maxT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};