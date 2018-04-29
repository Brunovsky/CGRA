class CutCone extends CGFobject
{
    constructor(scene, baseRadius = 1, topRadius = 0.5, height = 1, slices = 32, stacks = 4)
    {
        super(scene);
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers()
    {
        const sin = Math.sin, cos = Math.cos, PI = Math.PI, sqrt = Math.sqrt;
        const baseRadius = this.baseRadius, topRadius = this.topRadius,
            height = this.height, slices = this.slices, stacks = this.stacks;

        const thetaInc = 2 * PI / slices;
        const stackHeight = height / stacks;
        const radius = baseRadius - topRadius;
        const hypotenuse = sqrt(radius * radius + height * height);
        const dXY = height / hypotenuse, dZ = radius / hypotenuse;

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual side
                let theta = thetaInc * (i + 0.5);
                let xUnit = cos(theta);
                let yUnit = sin(theta);
                let X = baseRadius * xUnit * (1 - s / stacks)
                    + topRadius * xUnit * (s / stacks);
                let Y = baseRadius * yUnit * (1 - s / stacks)
                    + topRadius * yUnit * (s / stacks);
                let Z = s * stackHeight;

                // Up
                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ);

                // Down
                this.vertices.push(X, Y, Z);
                this.normals.push(-xUnit * dXY, -yUnit * dXY, -dZ);
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



class ClosedCutCone extends CGFobject
{
    constructor(scene, baseRadius = 1, topRadius = 0.5, height = 1, slices = 32, stacks = 4)
    {
        super(scene);
        this.cone = new CutCone(scene, baseRadius, topRadius, height, slices, stacks);
        this.base = new Circle(scene, baseRadius, slices);
        this.top = new Circle(scene, topRadius, slices);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.cone.display();
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.base.display();
            this.scene.popMatrix();
                this.scene.translate(0, 0, this.height);
                this.top.display();
        this.scene.popMatrix();
    };
};



class DoubleCutCone extends CGFobject
{
    constructor(scene, baseRadius = 1, topRadius = 0.5, height = 1, slices = 32, stacks = 4)
    {
        super(scene);
        this.cone = new CutCone(scene, baseRadius, topRadius, height, slices, stacks);
        this.top = new Circle(scene, topRadius, slices);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.cone.display();
                this.scene.translate(0, 0, this.height);
                this.top.display();
            this.scene.popMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.cone.display();
                this.scene.translate(0, 0, this.height);
                this.top.display();
        this.scene.popMatrix();
    }
}