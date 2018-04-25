class Prism extends CGFobject
{
    constructor(scene, sides, radius = 1, height = 1, stacks = 1)
    {
        super(scene);
        this.sides = sides;
        this.stacks = stacks;
        this.radius = radius;
        this.height = height;
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

        for (var s = 0; s <= this.stacks; ++s) { // stack
            for (var i = 0; i < this.sides; ++i) { // side
                // ... ][v1   M   v2][ ...  -- stack s

                var x1, y1, X, Y, Z = s * stackHeight;

                // v1
                x1 = cos(theta * (i - 0.5));
                y1 = sin(theta * (i - 0.5));
                X = this.radius * x1;
                Y = this.radius * y1;
                this.vertices.push(X, Y, Z); // v1

                // M
                x1 = cos(theta * i);
                y1 = sin(theta * i);
                this.normals.push(x1, y1, 0); // v1's normals
                this.normals.push(x1, y1, 0); // v2's normals

                // v2
                x1 = cos(theta * (i + 0.5));
                y1 = sin(theta * (i + 0.5));
                X = this.radius * x1;
                Y = this.radius * y1;
                this.vertices.push(X, Y, Z); // v2
            }
        }

        for (var s = 0; s < this.stacks; ++s) { // stack
            for (var i = 0; i < this.sides; ++i) { // side
                var above = 2 * this.sides;
                var stack = s * above;

                var current = (2 * i) + stack;

                // ... v4  v3 ...  -- stack s+1
                // 
                // ... v1  v2 ...  -- stack s
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



class ClosedPrism extends CGFobject
{
    constructor(scene, sides, radius = 1, height = 1, stacks = 1)
    {
        super(scene);
        this.prism = new Prism(scene, sides, radius, height, stacks);
        this.base = new Polygon(scene, sides, radius);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.prism.display();
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.base.display();
            this.scene.popMatrix();
                this.scene.translate(0, 0, this.height);
                this.base.display();
        this.scene.popMatrix();
    };
};