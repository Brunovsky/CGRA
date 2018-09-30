let CUTPYRAMID_DEFAULT_STACKS = 1;

class CutPyramid extends CGFobject
{
    constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.sides = sides;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.stacks = stacks;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        };
        this.initBuffers();
    };

    initBuffers()
    {
        const sin = Math.sin, cos = Math.cos, PI = Math.PI, sqrt = Math.sqrt;
        const sides = this.sides, baseRadius = this.baseRadius,
            topRadius = this.topRadius, height = this.height,
            stacks = this.stacks, coords = this.coords;

        const thetaInc = 2 * PI / sides;
        const stackHeight = height / stacks;
        const radius = baseRadius - topRadius;
        const apotema = cos(PI / sides) * radius; // signed
        const hypotenuse = sqrt(apotema * apotema + height * height);
        const dXZ = height / hypotenuse, dY = apotema / hypotenuse;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i < sides; ++i) { // side
                // ... ][v1U v1D   M   v2U v2D][ ...  -- stack s

                let theta, xUnit, zUnit, X, Y, Z;
                let stexUnit, ttexUnit, stex, ttex;

                // v1
                theta = -thetaInc * (i - 0.5);
                xUnit = cos(theta);
                zUnit = sin(theta);
                X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                Y = s * stackHeight;
                Z = baseRadius * zUnit * (1 - s / stacks)
                    + topRadius * zUnit * (s / stacks);
                this.vertices.push(X, Y, Z); // v1U
                this.vertices.push(X, Y, Z); // v1D

                // Texture v1
                stexUnit = theta / (2 * PI);
                ttexUnit = 1 - Y / height;
                stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // v1U's texcoords
                this.texCoords.push(stex, ttex); // v1D's texcoords

                // M
                theta = -thetaInc * i;
                xUnit = cos(theta);
                zUnit = sin(theta);
                this.normals.push(xUnit * dXZ, dY, zUnit * dXZ); // v1U's normals
                this.normals.push(-xUnit * dXZ, -dY, -zUnit * dXZ); // v1D's normals
                this.normals.push(xUnit * dXZ, dY, zUnit * dXZ); // v2U's normals
                this.normals.push(-xUnit * dXZ, -dY, -zUnit * dXZ); // v2D's normals

                // v2
                theta = -thetaInc * (i + 0.5);
                xUnit = cos(theta);
                zUnit = sin(theta);
                X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                Y = s * stackHeight;
                Z = baseRadius * zUnit * (1 - s / stacks)
                    + topRadius * zUnit * (s / stacks);
                this.vertices.push(X, Y, Z); // v2U
                this.vertices.push(X, Y, Z); // v2D

                // Texture v2
                stexUnit = theta / (2 * PI);
                ttexUnit = 1 - Y / height;
                stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // v2U's texcoords
                this.texCoords.push(stex, ttex); // v2D's texcoords
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

    display()
    {
        this.scene.pushTexture(this.texture);
        super.display();
        this.scene.popTexture();
    };

    bindTexture(cutPyramidTexture)
    {
        this.texture = cutPyramidTexture;
    };
};



class ClosedCutPyramid extends CGFobject
{
    constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.cutPyramid = new CutPyramid(scene, sides, baseRadius, topRadius, height, stacks, coords);
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
                this.scene.translate(0, this.height, 0);
                this.top.display();
        this.scene.popMatrix();
    };

    bindTexture(cutPyramidTexture, baseTexture, topTexture)
    {
        this.cutPyramid.bindTexture(cutPyramidTexture);
        this.base.bindTexture(baseTexture || cutPyramidTexture);
        this.top.bindTexture(topTexture || baseTexture || cutPyramidTexture);
    };
};



class DoubleCutPyramid extends CGFobject
{
    constructor(scene, sides, baseRadius = 1, topRadius = 0.5, height = 1, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.cutPyramid = new CutPyramid(scene, sides, baseRadius, topRadius, height, stacks, coords);
        this.top = new Regular(scene, sides, topRadius);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.cutPyramid.display();
                this.scene.translate(0, this.height, 0);
                this.top.display();
            this.scene.popMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.cutPyramid.display();
                this.scene.translate(0, this.height, 0);
                this.top.display();
        this.scene.popMatrix();
    };

    bindTexture(cutPyramidTexture, topTexture)
    {
        this.cutPyramid.bindTexture(cutPyramidTexture);
        this.top.bindTexture(topTexture || cutPyramidTexture);
    };
};
