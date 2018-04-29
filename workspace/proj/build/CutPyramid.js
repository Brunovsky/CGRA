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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI, sqrt = Math.sqrt;
        const sides = this.sides, baseRadius = this.baseRadius,
            topRadius = this.topRadius, height = this.height, stacks = this.stacks;

        const thetaInc = 2 * PI / sides;
        const stackHeight = height / stacks;
        const radius = baseRadius - topRadius;
        const apotema = cos(PI / sides) * radius; // signed
        const hypotenuse = sqrt(apotema * apotema + height * height);
        const dXY = height / hypotenuse, dZ = apotema / hypotenuse;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                // ... ][v1U v1D   M   v2U v2D][ ...  -- stack s

                let theta, xUnit, yUnit, X, Y, Z;

                // v1
                theta = thetaInc * (i - 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                Y = baseRadius * yUnit * (1 - s / stacks)
                    + topRadius * yUnit * (s / stacks);
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v1U
                this.vertices.push(X, Y, Z); // v1D

                // M
                theta = thetaInc * i;
                xUnit = cos(theta);
                yUnit = sin(theta);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v1U's normals
                this.normals.push(-xUnit * dXY, -yUnit * dXY, -dZ); // v1D's normals
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v2U's normals
                this.normals.push(-xUnit * dXY, -yUnit * dXY, -dZ); // v2D's normals

                // v2
                theta = thetaInc * (i + 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                Y = baseRadius * yUnit * (1 - s / stacks)
                    + topRadius * yUnit * (s / stacks);
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

                // ... ][v4U v4D      v3U v3D][ ... --- stack s + 1
                // 
                // ... ][v1U v1D      v2U v2D][ ... --- stack s
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



class ClosedCutPyramid extends CGFobject
{
    constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 4)
    {
        super(scene);
        this.cutPyramid = new CutPyramid(scene, sides, baseRadius, topRadius, height, stacks);
        this.base = new Regular(scene, sides, baseRadius);
        this.top = new Regular(scene, sides, topRadius);
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
        this.top = new Regular(scene, sides, topRadius);
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