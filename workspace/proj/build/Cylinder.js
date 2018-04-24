class Cylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 32, stacks = 1)
    {
        super(scene);
        this.slices = slices;
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
        var theta = 2 * PI / this.slices;
        var d = this.height / this.stacks;

        for (var s = 0; s <= this.stacks; ++s) { // stack
            for (var i = 0; i <= this.slices; ++i) { // side
                var x1 = cos(theta * i);
                var y1 = sin(theta * i);
                var X = this.radius * x1;
                var Y = this.radius * y1;
                var Z = s * d;

                this.vertices.push(X, Y, Z);
                this.normals.push(x1, y1, 0);
            }
        }

        for (var s = 0; s < this.stacks; ++s) { // stack
            for (var i = 0; i < this.slices; ++i) { // side
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



class ClosedCylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 30, stacks = 1)
    {
        super(scene);
        this.cylinder = new Cylinder(scene, radius, height, slices, stacks);
        this.base = new Polygon(scene, slices, radius);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.cylinder.display();
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 1, 0);
            this.base.display();
            this.scene.popMatrix();
            this.scene.translate(0, 0, this.height);
            this.base.display();
        this.scene.popMatrix();
    };
};