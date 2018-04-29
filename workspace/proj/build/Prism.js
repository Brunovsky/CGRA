class Prism extends CGFobject
{
    constructor(scene, sides, radius = 1, height = 1, stacks = 1)
    {
        super(scene);
        this.sides = sides;
        this.radius = radius;
        this.height = height;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers()
    {
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const sides = this.sides, stacks = this.stacks,
            radius = this.radius, height = this.height;

        const thetaInc = 2 * PI / sides;
        const stackHeight = height / stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                // ... ][v1   M   v2][ ...  -- stack s

                let theta, xUnit, yUnit, X, Y, Z;

                // v1
                theta = thetaInc * (i - 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = radius * xUnit;
                Y = radius * yUnit;
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v1U
                this.vertices.push(X, Y, Z); // v1D

                // M
                theta = thetaInc * i;
                xUnit = cos(theta);
                yUnit = sin(theta);
                this.normals.push(xUnit, yUnit, 0); // v1U's normals
                this.normals.push(-xUnit, -yUnit, 0); // v1D's normals
                this.normals.push(xUnit, yUnit, 0); // v2U's normals
                this.normals.push(-xUnit, -yUnit, 0); // v2D's normals

                // v2
                theta = thetaInc * (i + 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = radius * xUnit;
                Y = radius * yUnit;
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v2U
                this.vertices.push(X, Y, Z); // v2D
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                let above = 4 * sides;
                let next = 4, right = 2;

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



class ClosedPrism extends CGFobject
{
    constructor(scene, sides, radius = 1, height = 1, stacks = 1)
    {
        super(scene);
        this.prism = new Prism(scene, sides, radius, height, stacks);
        this.base = new Regular(scene, sides, radius);
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