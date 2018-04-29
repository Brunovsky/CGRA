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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
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

                // Up (out)
                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, yUnit, zUnit);

                // Down (in)
                this.vertices.push(X, Y, Z);
                this.normals.push(-xUnit, -yUnit, -zUnit);
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < slices; ++i) { // virtual slice
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