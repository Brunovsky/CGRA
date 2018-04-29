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

                // Up
                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, yUnit, 0);

                // Down
                this.vertices.push(X, Y, Z);
                this.normals.push(-xUnit, -yUnit, 0);
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < slices; ++i) { // virtual side
                let above = 2 * slices + 2;
                let next = 2, right = 2;

                let stack = s * above;
                let current = next * i + stack;

                // ... v4U v4D      v3U v3D ... --- stack s + 1
                // 
                // ... v1U v1D      v2U v2D ... --- stack s
                let v1U = current;
                let v2U = current + right;
                let v3U = current + right + above;
                let v4U = current + above;
                let v1D = 1 + v1U;
                let v2D = 1 + v2U;
                let v3D = 1 + v3U;
                let v4D = 1 + v4U;

                this.indices.push(v1U, v2U, v3U);
                this.indices.push(v1U, v3U, v4U);
                
                this.indices.push(v1D, v3D, v2D);
                this.indices.push(v1D, v4D, v3D);
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