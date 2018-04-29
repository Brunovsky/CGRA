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
        const cos = Math.cos, sin = Math.sin, PI = Math.PI, sqrt = Math.sqrt;
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
                // ... ][v1   M   v2][ ...  -- stack s

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
                this.vertices.push(X, Y, Z); // v1

                // M
                theta = thetaInc * i;
                xUnit = cos(theta);
                yUnit = sin(theta);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v1's normals
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ); // v2's normals

                // v2
                theta = thetaInc * (i + 0.5);
                xUnit = cos(theta);
                yUnit = sin(theta);
                X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                Y = baseRadius * yUnit * (1 - s / stacks)
                    + topRadius * yUnit * (s / stacks);
                Z = s * stackHeight;
                this.vertices.push(X, Y, Z); // v2
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                let above = 2 * sides;
                let next = 2;

                let stack = s * above;
                let current = next * i + stack;

                // ... v4  v3 ... -- stack s+1
                // 
                // ... v1  v2 ... -- stack s
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