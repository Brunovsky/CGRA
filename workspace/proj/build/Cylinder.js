let CYLINDER_DEFAULT_SLICES = 64, CYLINDER_DEFAULT_STACKS = 1;

class Cylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 64, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.height = height;
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
        const slices = this.slices, stacks = this.stacks,
            radius = this.radius, height = this.height,
            coords = this.coords;

        const thetaInc = 2 * PI / slices;
        const stackHeight = height / stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let s = 0; s <= stacks; ++s) { // stack
            for (let i = 0; i <= slices; ++i) { // virtual side
                let theta = -thetaInc * (i + 0.5);
                let xUnit = cos(theta);
                let zUnit = sin(theta);
                let X = radius * xUnit;
                let Y = s * stackHeight;
                let Z = radius * zUnit;

                // Up (out)
                this.vertices.push(X, Y, Z);
                this.normals.push(xUnit, 0, zUnit);

                // Down (in)
                this.vertices.push(X, Y, Z);
                this.normals.push(-xUnit, 0, -zUnit);

                // Texture Up, Down
                let stexUnit = theta / (2 * PI);
                let ttexUnit = Y / height;
                let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
                let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
                this.texCoords.push(stex, ttex); // Up
                this.texCoords.push(stex, ttex); // Down
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

    display()
    {
        this.scene.pushTexture(this.texture);
        super.display();
        this.scene.popTexture();
    };

    bindTexture(cylinderTexture)
    {
        this.texture = cylinderTexture;
    };
};



class ClosedCylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 64, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.cylinder = new Cylinder(scene, radius, height, slices, stacks, coords);
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
                this.scene.translate(0, this.height, 0);
                this.base.display();
        this.scene.popMatrix();
    };

    bindTexture(cylinderTexture, circleTexture)
    {
        this.cylinder.bindTexture(cylinderTexture);
        this.base.bindTexture(circleTexture || cylinderTexture);
    };
};



class HalfSpheredCylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 64, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.cylinder = new Cylinder(scene, radius, height, slices, stacks, coords);
        this.sphere = new HalfSphere(scene, radius, slices);
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
                this.scene.translate(0, this.height, 0);
                this.sphere.display();
        this.scene.popMatrix();
    };

    bindTexture(cylinderTexture, circleTexture)
    {
        this.cylinder.bindTexture(cylinderTexture);
        this.sphere.bindTexture(cylinderTexture);
        this.base.bindTexture(circleTexture || cylinderTexture);
    };
};



class SpheredCylinder extends CGFobject
{
    constructor(scene, radius = 1, height = 1, slices = 64, stacks = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.cylinder = new Cylinder(scene, radius, height, slices, stacks, coords);
        this.sphere = new HalfSphere(scene, radius, slices);
        this.height = height;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.cylinder.display();
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.sphere.display();
            this.scene.popMatrix();
                this.scene.translate(0, this.height, 0);
                this.sphere.display();
        this.scene.popMatrix();
    };

    bindTexture(cylinderTexture, circleTexture)
    {
        this.cylinder.bindTexture(cylinderTexture);
        this.sphere.bindTexture(circleTexture || cylinderTexture);
    };
};
