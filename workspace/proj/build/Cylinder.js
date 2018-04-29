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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const slices = this.slices, stacks = this.stacks,
            radius = this.radius, height = this.height;

        const thetaInc = 2 * PI / slices;
        const stackHeight = height / stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual side
                let theta = thetaInc * (i + 0.5);
                let xUnit = cos(theta);
                let yUnit = sin(theta);
                let X = radius * xUnit;
                let Y = radius * yUnit;
                let Z = s * stackHeight;

                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, yUnit, 0);
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



class ClosedCylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 32, stacks = 1)
    {
        super(scene);
        this.cylinder = new Cylinder(scene, radius, height, slices, stacks);
        this.base = new Circle(scene, radius, slices);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.cylinder.display();
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.base.display();
            this.scene.popMatrix();
                this.scene.translate(0, 0, this.height);
                this.base.display();
        this.scene.popMatrix();
    };
};