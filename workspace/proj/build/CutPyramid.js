class CutPyramid extends CGFobject
{
    constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 4)
    {
        super(scene);
        this.sides = sides;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers() 
    {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        var cos = Math.cos, sin = Math.sin, PI = Math.PI;
        var theta = 2 * PI / this.sides;
        var stackHeight = this.height / this.stacks;
        var rhratio = this.radius * cos(PI / this.sides) / this.height;

        for (var s = 0; s <= this.stacks; ++s) { // stack
            for (var i = 0; i < this.sides; ++i) { // side
            	// ... ][v1   M   v2][ ...  -- stack s
            	
            	var x1, y1, X, Y, Z = s * stackHeight;

            	// v1
                x1 = cos(theta * (i - 0.5));
                y1 = sin(theta * (i - 0.5));
                X = this.baseRadius * x1 * (1 - s / this.stacks)
                    + this.topRadius * x1 * (s / this.stacks);
                Y = this.baseRadius * y1 * (1 - s / this.stacks)
                    + this.topRadius * y1 * (s / this.stacks);
                this.vertices.push(X, Y, Z); // v1

                // M
                x1 = cos(theta * i);
                y1 = sin(theta * i);
                this.normals.push(x1 / rhratio, y1 / rhratio, rhratio); // v1's normals
                this.normals.push(x1 / rhratio, y1 / rhratio, rhratio); // v2's normals

            	// v2
                x1 = cos(theta * (i + 0.5));
                y1 = sin(theta * (i + 0.5));
                X = this.baseRadius * x1 * (1 - s / this.stacks)
                    + this.topRadius * x1 * (s / this.stacks);
                Y = this.baseRadius * y1 * (1 - s / this.stacks)
                    + this.topRadius * y1 * (s / this.stacks);
                this.vertices.push(X, Y, Z); // v2
            }
        }

        for (var s = 0; s < this.stacks; ++s) { // stack
            for (var i = 0; i < this.sides; ++i) { // side
                var above = 2 * this.sides;
                var stack = s * above;

                var current = (2 * i) + stack;

                // ... v4  v3 ... -- stack s+1
                // 
                // ... v1  v2 ... -- stack s
                var v1 = current;
                var v2 = current + 1;
                var v3 = current + 1 + above;
                var v4 = current + above;

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



class ClosedCutPyramid extends CGFobject
{
	constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 4)
	{
		super(scene);
		this.cutPyramid = new CutPyramid(scene, sides, baseRadius, topRadius, height, stacks);
		this.base = new Polygon(scene, sides, baseRadius);
        this.top = new Polygon(scene, sides, topRadius);
        this.height = height;
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
			this.cutPyramid.display();
            this.scene.pushMatrix();
    			this.scene.rotate(Math.PI, 1, 0, 0);
    			this.base.display();
            this.scene.popMatrix();
                this.scene.translate(0, 0, this.height);
                this.top.display();
		this.scene.popMatrix();
	};
};



class DoubleCutPyramid extends CGFobject
{
	constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 4)
	{
		super(scene);
		this.cutPyramid = new CutPyramid(scene, sides, baseRadius, topRadius, height, stacks);
        this.top = new Polygon(scene, sides, topRadius);
        this.height = height;
		this.initBuffers();
	};

	display()
	{
		this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.cutPyramid.display();
                this.scene.translate(0, 0, this.height);
                this.top.display();
            this.scene.popMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.cutPyramid.display();
                this.scene.translate(0, 0, this.height);
                this.top.display();
		this.scene.popMatrix();
	};
};