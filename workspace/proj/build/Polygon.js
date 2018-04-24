class Polygon extends CGFobject
{
	constructor(scene, sides, radius = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
		this.sides = sides;
		this.radius = radius;
		this.minS = coords[0];
		this.maxS = coords[1];
		this.minT = coords[2];
		this.maxT = coords[3];
        this.initBuffers();
    };

	initBuffers()
	{
		this.vertices = [];
    	this.indices = [];
    	this.normals = [];
    	//this.texCoords = [];
		
		var theta = 2 * (Math.PI) / this.sides;
		
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		//this.texCoords.push((this.minS + this.maxS) / 2,
		//	(this.minT + this.maxT) / 2);
		
		for (var i = 0; i <= this.sides; ++i) {
                var x1 = Math.cos(theta * (i + 0.5));
                var y1 = Math.sin(theta * (i + 0.5));
                var x = this.radius * x1;
                var y = this.radius * y1;

				var stex1 = x / 2 + 0.5;
				var ttex1 = -y / 2 + 0.5;
				var stex = stex1 * this.minS + (1 - stex1) * this.maxS;
				var ttex = ttex1 * this.minT + (1-  ttex1) * this.maxT;

                this.vertices.push(x, y, 0);
				this.normals.push(0, 0, 1);
		//		this.texCoords.push(stex, ttex);
		}
		
		for (var i = 1; i <= this.sides; ++i) {
			this.indices.push(0, i, i + 1);
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
		this.square = new Polygon(scene, 4, side / Math.sqrt(2), coords);
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
		this.circle = new Polygon(scene, slices, radius, coords);
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
		this.triangle = new Polygon(scene, 3, side / Math.sqrt(3), coords);
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



class Trapezium extends CGFobject
{
	constructor(scene, base = 1, height = 1, top = 1, coords = [0, 1, 0, 1])
	{
		super(scene);
		this.base = base;
		this.height = height;
		this.top = top;
		this.minS = coords[0];
		this.maxS = coords[1];
		this.minT = coords[2];
		this.maxT = coords[3];
		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			-this.base / 2, 0,
			this.base / 2, 0,
			-this.top / 2, this.height,
			this.top / 2, this.height
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1,
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			this.minS, this.minT,
			this.maxS, this.minT,
			this.minS, this.maxT,
			this.maxS, this.maxT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};