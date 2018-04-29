class HalfSphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 32, stacks = 32)
    {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers()
    {
        const cos = Math.cos, sin = Math.sin, PI = Math.PI;
        const radius = this.radius, slices = this.slices,
            stacks = this.stacks;

        const thetaInc = 2 * PI / slices;
        const phiInc = (PI / 2) / stacks; 

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual slice
                let theta = thetaInc * (i + 0.5);
                let phi = s * phiInc;
                let xUnit = cos(phi) * cos(theta);
                let yUnit = cos(phi) * sin(theta);
                let zUnit = sin(phi);
                let X = radius * xUnit;
                let Y = radius * yUnit;
                let Z = radius * zUnit;

                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, yUnit, zUnit);
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < slices; ++i) { // virtual slice
                let above = slices + 1;
                let next = 1;

                let stack = s * above;
                let current = next * i + stack;

                // ... v4  v3 ...
                // 
                // ... v1  v2 ...
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



class ClosedHalfSphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 32, stacks = 32)
    {
        super(scene);
        this.half = new HalfSphere(scene, radius, slices, stacks);
        this.base = new Regular(scene, slices, radius);
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.half.display();
            this.scene.rotate(Math.PI, 1, 0, 0);
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
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.half.display();
        this.scene.popMatrix();
    };
};