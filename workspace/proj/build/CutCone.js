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
        const cos = Math.cos, sin = Math.sin, PI = Math.PI, sqrt = Math.sqrt;
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

                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit * dXY, yUnit * dXY, dZ);
            }
        }

        for (let s = 0; s < stacks; ++s) { // stack
            for (let i = 0; i < slices; ++i) { // virtual side
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