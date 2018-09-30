class Regular extends CGFobject
{
    constructor(scene, sides, radius = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.sides = sides;
        this.radius = radius;
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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const sides = this.sides, radius = this.radius,
            coords = this.coords;

        const thetaInc = 2 * (PI) / sides;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Center vertex Up
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push((coords.minS + coords.maxS) / 2);
        this.texCoords.push((coords.minT + coords.maxT) / 2);

        // Center vertex Down
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push((coords.minS + coords.maxS) / 2);
        this.texCoords.push((coords.minT + coords.maxT) / 2);
        
        for (let i = 0; i <= sides; ++i) {
            let theta = -thetaInc * (i + 0.5);
            let xUnit = cos(theta);
            let zUnit = sin(theta);
            let X = radius * xUnit;
            let Z = radius * zUnit;

            // Up
            this.vertices.push(X, 0, Z); // vU
            this.normals.push(0, 1, 0);

            // Down
            this.vertices.push(X, 0, Z); // vD
            this.normals.push(0, -1, 0);

            // Texture Up, Down
            let stexUnit = 0.5 * (xUnit + 1);
            let ttexUnit = 0.5 * (zUnit + 1);
            let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
            let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
            this.texCoords.push(stex, ttex); // Up
            this.texCoords.push(stex, ttex); // Down
        }

        for (let i = 1; i <= sides; ++i) {
            let next = 2, right = 2;

            let current = next * i;

            // ... v1U v1D      v2U v2D ... --- around the unit circle
            let v0U = 0;
            let v1U = current;
            let v2U = current + right;
            let v0D = 1 + v0U;
            let v1D = 1 + v1U;
            let v2D = 1 + v2U;

            this.indices.push(v0U, v1U, v2U);
            this.indices.push(v0D, v2D, v1D);
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

    bindTexture(regularTexture)
    {
        this.texture = regularTexture;
    };
};



class Polygon extends CGFobject
{
    constructor(scene, V, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.V = V;
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
        const V = this.V, coords = this.coords;

        let b = {
            minX:  Infinity,
            maxX: -Infinity,
            minZ:  Infinity,
            maxZ: -Infinity
        };

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        for (let i = 0; i < V.length; ++i) {
            let X = V[i][0];
            let Z = V[i][1];

            // Up
            this.vertices.push(X, 0, Z);
            this.normals.push(0, 1, 0);

            // Down
            this.vertices.push(X, 0, Z);
            this.normals.push(0, -1, 0);

            if (X < b.minX) b.minX = X;
            if (X > b.maxX) b.maxX = X;
            if (Z < b.minZ) b.minZ = Z;
            if (Z > b.maxZ) b.maxZ = Z;
        }

        for (let i = 0; i < V.length; ++i) {
            const inc = 6;
            let X = this.vertices[inc * i];
            let Z = this.vertices[inc * i + 2];

            let stexUnit = (X - b.minX) / (b.maxX - b.minX);
            let ttexUnit = (Z - b.minZ) / (b.maxZ - b.minZ);
            let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
            let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
            this.texCoords.push(stex, ttex); // Up
            this.texCoords.push(stex, ttex); // Down
        }

        for (let i = 1; i < V.length - 1; ++i) {
            let next = 2, right = 2;

            let current = next * i;

            // ... v1U v1D      v2U v2D ... --- along the curve
            let v0U = 0;
            let v1U = current;
            let v2U = current + right;
            let v0D = 1 + v0U;
            let v1D = 1 + v1U;
            let v2D = 1 + v2U;

            let p0 = this.vertices.slice(3 * v0U, 3 * v0U + 3);
            let p1 = this.vertices.slice(3 * v1U, 3 * v1U + 3);
            let p2 = this.vertices.slice(3 * v2U, 3 * v2U + 3);

            if (triangleOrientation(p0, p1, p2).Y > 0) {
                this.indices.push(v0U, v1U, v2U);
                this.indices.push(v0D, v2D, v1D);
            } else {
                this.indices.push(v0U, v2U, v1U);
                this.indices.push(v0D, v1D, v2D);
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

    bindTexture(polygonTexture)
    {
        this.texture = polygonTexture;
    };
};



class Square extends CGFobject
{
    constructor(scene, side = 1, coords = [0, 1, 0, 1]) 
    {
        super(scene);
        let V = [
            [-side / 2, -side / 2],
            [ side / 2, -side / 2],
            [ side / 2,  side / 2],
            [-side / 2,  side / 2]
        ];
        this.square = new Polygon(scene, V, coords);
        this.initBuffers();
    };

    display()
    {
        this.square.display();
    };

    bindTexture(squareTexture)
    {
        this.square.bindTexture(squareTexture);
    };
};



class Circle extends CGFobject
{
    constructor(scene, radius = 1, slices = 64, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.circle = new Regular(scene, slices, radius, coords);
        this.initBuffers();
    };

    display()
    {
        this.circle.display();
    };

    bindTexture(circleTexture)
    {
        this.circle.bindTexture(circleTexture);
    };
};



class Triangle extends CGFobject
{
    constructor(scene, side = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.triangle = new Regular(scene, 3, side / Math.sqrt(3), coords);
        this.initBuffers();
    };

    display()
    {
        this.triangle.display();
    };

    bindTexture(triangleTexture)
    {
        this.triangle.bindTexture(triangleTexture);
    };
};



class Rectangle extends CGFobject
{
    constructor(scene, sideX, sideZ, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.square = new Square(scene, 1, coords);
        this.sideX = sideX;
        this.sideZ = sideZ;
        this.initBuffers();
    };

    display()
    {
        this.scene.pushMatrix();
            this.scene.scale(this.sideX, 1, this.sideZ);
            this.square.display();
        this.scene.popMatrix();
    };

    bindTexture(rectangleTexture)
    {
        this.rectangle.bindTexture(rectangleTexture);
    };
};



class Trapezium extends CGFobject
{
    constructor(scene, base = 1, height = 1, top = 1, coords = [0, 1, 0, 1])
    {
        super(scene);
        let V = [
            [-base / 2, -height / 2],
            [ base / 2, -height / 2],
            [  top / 2,  height / 2],
            [ -top / 2,  height / 2]
        ];
        this.trapezium = new Polygon(scene, V, coords);
        this.initBuffers();
    };

    display()
    {
        this.trapezium.display();
    };

    bindTexture(trapeziumTexture)
    {
        this.trapezium.bindTexture(trapeziumTexture);
    };
};



class tPolygon extends CGFobject
{
    constructor(scene, tfunction, limits = [0, 1], samples = 1024, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.tfunction = tfunction;
        this.limits = {
            minT: limits[0],
            maxT: limits[1]
        };
        this.samples = samples;
        this.coords = {
            minS: coords[0],
            maxS: coords[1],
            minT: coords[2],
            maxT: coords[3]
        };
        this.initBuffers()
    };

    initBuffers()
    {
        const tfunction = this.tfunction, l = this.limits,
            samples = this.samples, coords = this.coords;

        const tInc = (l.maxT - l.minT) / samples;

        let b = {
            minX:  Infinity,
            maxX: -Infinity,
            minZ:  Infinity,
            maxZ: -Infinity
        };

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let i = 0; i <= samples; ++i) {
            let t = l.minT + tInc * i;
            let Point = tfunction(t);

            let X = Point.X;
            let Z = Point.Y || Point.Z;

            // Up
            this.vertices.push(X, 0, Z);
            this.normals.push(0, 1, 0);

            // Down
            this.vertices.push(X, 0, Z);
            this.normals.push(0, -1, 0);

            if (X < b.minX) b.minX = X;
            if (X > b.maxX) b.maxX = X;
            if (Z < b.minZ) b.minZ = Z;
            if (Z > b.maxZ) b.maxZ = Z;
        }

        for (let i = 0; i <= samples; ++i) {
            const inc = 6;
            let X = this.vertices[inc * i];
            let Z = this.vertices[inc * i + 2];

            let stexUnit = (X - b.minX) / (b.maxX - b.minX);
            let ttexUnit = (Z - b.minZ) / (b.maxZ - b.minZ);
            let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
            let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
            this.texCoords.push(stex, ttex); // Up
            this.texCoords.push(stex, ttex); // Down
        }

        for (let i = 1; i < samples; ++i) {
            let next = 2, right = 2;

            let current = next * i;

            // ... v1U v1D      v2U v2D ... --- around the unit circle
            let v0U = 0;
            let v1U = current;
            let v2U = current + right;
            let v0D = 1 + v0U;
            let v1D = 1 + v1U;
            let v2D = 1 + v2U;

            let p0 = this.vertices.slice(3 * v0U, 3 * v0U + 3);
            let p1 = this.vertices.slice(3 * v1U, 3 * v1U + 3);
            let p2 = this.vertices.slice(3 * v2U, 3 * v2U + 3);

            if (triangleOrientation(p0, p1, p2).Y > 0) {
                this.indices.push(v0U, v1U, v2U);
                this.indices.push(v0D, v2D, v1D);
            } else {
                this.indices.push(v0U, v2U, v1U);
                this.indices.push(v0D, v1D, v2D);
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

    bindTexture(tpolygonTexture)
    {
        this.texture = tpolygonTexture;
    };
};



class rPolygon extends CGFobject
{
    constructor(scene, rfunction, limits = [-Math.PI, Math.PI], samples = 1024, coords = [0, 1, 0, 1])
    {
        super(scene);
        this.rfunction = rfunction;
        this.limits = {
            minTheta: limits[0],
            maxTheta: limits[1]
        };
        this.samples = samples;
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
        const sin = Math.sin, cos = Math.cos, PI = Math.PI;
        const rfunction = this.rfunction, l = this.limits,
            samples = this.samples, coords = this.coords;

        const thetaInc = (l.maxTheta - l.minTheta) / samples;

        let b = {
            minX:  Infinity,
            maxX: -Infinity,
            minZ:  Infinity,
            maxZ: -Infinity
        };

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Center vertex Up
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);

        // Center vertex Down
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);

        for (let i = 0; i <= samples; ++i) {
            let theta = -l.minTheta + thetaInc * i;
            let r = rfunction(theta);

            let X = r * cos(theta);
            let Z = r * sin(theta);

            // Up
            this.vertices.push(X, 0, Z);
            this.normals.push(0, 1, 0);

            // Down
            this.vertices.push(X, 0, Z);
            this.normals.push(0, -1, 0);

            if (X < b.minX) b.minX = X;
            if (X > b.maxX) b.maxX = X;
            if (Z < b.minZ) b.minZ = Z;
            if (Z > b.maxZ) b.maxZ = Z;
        }

        for (let i = 0; i <= samples + 1; ++i) {
            const inc = 6;
            let X = this.vertices[inc * i];
            let Z = this.vertices[inc * i + 2];

            let stexUnit = (X - b.minX) / (b.maxX - b.minX);
            let ttexUnit = (Z - b.minZ) / (b.maxZ - b.minZ);
            let stex = (1 - stexUnit) * coords.minS + stexUnit * coords.maxS;
            let ttex = (1 - ttexUnit) * coords.minT + ttexUnit * coords.maxT;
            this.texCoords.push(stex, ttex); // Up
            this.texCoords.push(stex, ttex); // Down
        }

        for (let i = 1; i <= samples; ++i) {
            let next = 2, right = 2;

            let current = next * i;

            // ... v1U v1D      v2U v2D ... --- around the unit circle
            let v0U = 0;
            let v1U = current;
            let v2U = current + right;
            let v0D = 1 + v0U;
            let v1D = 1 + v1U;
            let v2D = 1 + v2U;

            let p0 = this.vertices.slice(3 * v0U, 3 * v0U + 3);
            let p1 = this.vertices.slice(3 * v1U, 3 * v1U + 3);
            let p2 = this.vertices.slice(3 * v2U, 3 * v2U + 3);

            if (triangleOrientation(p0, p1, p2).Y > 0) {
                this.indices.push(v0U, v1U, v2U);
                this.indices.push(v0D, v2D, v1D);
            } else {
                this.indices.push(v0U, v2U, v1U);
                this.indices.push(v0D, v1D, v2D);
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

    bindTexture(rpolygonTexture)
    {
        this.texture = rpolygonTexture;
    };
};
