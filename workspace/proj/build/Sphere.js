let SPHERE_DEFAULT_SLICES = 64, SPHERE_DEFAULT_STACKS = 32;

class HalfSphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 64, stacks = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        }
        this.initBuffers();
    };

    initBuffers()
    {
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const radius = this.radius, slices = this.slices,
            stacks = this.stacks, coords = this.coords;

        const thetaInc = 2 * PI / slices;
        const phiInc = (PI / 2) / stacks; 

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual slice
                let theta = -thetaInc * (i + 0.5);
                let phi = s * phiInc;
                let xUnit = cos(phi) * cos(theta);
                let yUnit = sin(phi);
                let zUnit = cos(phi) * sin(theta);
                let X = radius * xUnit;
                let Y = radius * yUnit;
                let Z = radius * zUnit;

                // Up (out)
                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, yUnit, zUnit);

                // Down (in)
                this.vertices.push(X, Y, Z);
                this.normals.push(-xUnit, -yUnit, -zUnit);

                // Texture Up, Down
                let stexUnit = 0.5 * (xUnit + 1);
                let ttexUnit = 0.5 * (zUnit + 1);
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;

                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
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

    display()
    {
        this.scene.pushTexture(this.texture);
        super.display();
        this.scene.popTexture();
    };

    bindTexture(halfTexture)
    {
        this.texture = halfTexture;
    };
};



class ClosedHalfSphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 64, stacks = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.half = new HalfSphere(scene, radius, slices, stacks, coords);
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

    bindTexture(halfTexture, baseTexture)
    {
        this.half.bindTexture(halfTexture);
        this.base.bindTexture(baseTexture || halfTexture);
    };
};



class Sphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 64, stacks = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        let reverse = [coords[0], coords[1], coords[3], coords[2]];
        this.up = new HalfSphere(scene, radius, slices, stacks, coords);
        this.down = new HalfSphere(scene, radius, slices, stacks, reverse);
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.up.display();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.down.display();
        this.scene.popMatrix();
    };

    bindTexture(halfTexture)
    {
        this.up.bindTexture(halfTexture);
        this.down.bindTexture(halfTexture);
    };
};



class FlipSphere extends CGFobject
{
    constructor(scene, radius = 1, slices = 64, stacks = 32, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.half = new HalfSphere(scene, radius, slices, stacks, coords);
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

    bindTexture(halfTexture)
    {
        this.half.bindTexture(halfTexture);
    };
};
