class LightingScene extends CGFscene 
{
    init(application) 
    { 
        super.init(application);

        this.initCameras();
        this.initLights();

        this.enableTextures(true);

        this.gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this, 10);

        // Scene elements
        this.octagon = new Regular(this, 8);
        this.square = new Square(this, 2);
        this.triangle = new Triangle(this, 2);
        this.rectangle = new Rectangle(this, 1, 3);
        this.circle = new Circle(this, 1);
        this.hexagon = new Regular(this, 6);
        this.trapezium = new Trapezium(this, 3, 2, 1);
        this.quadrangle = new Polygon(this, [[-2, -1], [1, 0], [1.5, 2], [0.5, 2.5], [-1.5, 2], [-3, 2]]);

        this.cube = new Cube(this, 2);
        this.block = new Block(this, 1, 2, 4);
        this.halfsphere = new HalfSphere(this, 1);
        this.closedhalfsphere = new ClosedHalfSphere(this, 1);
        this.sphere = new Sphere(this, 1);

        this.cylinder = new Cylinder(this, 1, 2);
        this.closedcylinder = new ClosedCylinder(this, 1, 3);
        this.prism = new Prism(this, 5, 1, 3);
        this.closedprism = new ClosedPrism(this, 7, 1, 2);
        this.revcylinder = new revSurface(this, (Z) => 1, [0, 2, -Math.PI, Math.PI]);

        this.cone = new Cone(this, 1, 2);
        this.closedcone = new ClosedCone(this, 1.5, 3);
        this.doublecone = new DoubleCone(this, 1, 3);
        this.pyramid = new Pyramid(this, 5, 1, 2);
        this.closedpyramid = new ClosedPyramid(this, 7, 1.5, 3);
        this.doublepyramid = new DoublePyramid(this, 4, 1, 3);

        this.cutcone = new CutCone(this, 1.5, 1, 1);
        this.closedcutcone = new ClosedCutCone(this, 1, 0.5, 2);
        this.doublecutcone = new DoubleCutCone(this, 1.5, 1, 1);
        this.cutpyramid = new CutPyramid(this, 3, 1, 1/3, 2);
        this.closedcutpyramid = new ClosedCutPyramid(this, 6, 1.5, 2, 4);
        this.doublecutpyramid = new DoubleCutPyramid(this, 4, 1, 0.5, 1.5);

        this.heart = new tPolygon(this, heart, [0, 2 * Math.PI]);
        this.butterfly = new tPolygon(this, butterfly, [0, 2 * Math.PI]);
        this.trifolium = new rPolygon(this, protoFolium.bind(null, 2, 2));

        this.sqXYsurface = new zSurface(this, (X,Y) => X*X + Y*Y, [-1, 1, -1.5, 2]);
        this.cubesurface = new zSurface(this, (X,Y) => 1 + X*X - Y);
        this.torus = new uvSurface(this, protoTorus.bind(null, 2, 0.75), [0, 2 * Math.PI, 0, 2 * Math.PI]);
        this.eight = new uvSurface(this, eightSurface, [0, 2 * Math.PI, -Math.PI / 2, Math.PI / 2]);
        this.astroidal = new uvSurface(this, astroidalEllipsoid, [-Math.PI / 2, Math.PI / 2, -Math.PI, Math.PI]);
        this.kiss = new uvSurface(this, kissSurface, [-Math.PI, Math.PI, -1, 1]);
        this.bohemianDome = new uvSurface(this, bohemianDome, [-Math.PI, Math.PI, -Math.PI, Math.PI], 64);
        this.crossedTrough = new zSurface(this, (X,Y) => X*X*Y*Y);
        this.sineSurface = new uvSurface(this, sineSurface, [-Math.PI, Math.PI, -Math.PI, Math.PI], 64);
        this.cayleySurface = new zSurface(this, cayleySurface);
        this.vase = new revSurface(this, (Z) => 1 + 0.5 * Math.cos(2*Z), [-Math.PI / 2, 0.65 * Math.PI, -Math.PI, Math.PI]);
        this.mobius = new uvSurface(this, mobiusStrip, [-Math.PI, Math.PI, -0.5, 0.5]);

        //this.car = new zSurface(this, carFunction, carProportions, carSlices);

        // Materials
        this.materialDefault = new CGFappearance(this);
        this.materialDefault.setAmbient(0.10, 0.45, 0.7, 1);
        this.materialDefault.setDiffuse(0.2, 0.4, 0.6, 1);
        this.materialDefault.setSpecular(0.7, 0.6, 0.9, 1);
        this.materialDefault.setShininess(20);

        // Table
        this.tableTex = new CGFappearance(this);
        this.tableTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.tableTex.setDiffuse(0.7, 0.7, 0.7, 1);
        this.tableTex.setShininess(150);
        this.tableTex.loadTexture("tex/table.png");
    };

    initCameras() 
    {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
    };

    initLights() 
    {
        this.setGlobalAmbientLight(AMBIENT[0], AMBIENT[1], AMBIENT[2], AMBIENT[3]);

        let i = 0;

        this.lights[i].setPosition(6, 0, 15, 1);
        this.lights[i].setDiffuse(1.0, 1.0, 0.25, 1.0);
        this.lights[i].setConstantAttenuation(0.5);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;

        this.lights[i].setPosition(3, 5, -10, 1);
        this.lights[i].setDiffuse(1.0, 0.25, 1.0, 1.0);
        this.lights[i].setConstantAttenuation(0.5);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;

        this.lights[i].setPosition(0, 10, 8, 1);
        this.lights[i].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[i].setConstantAttenuation(0.5);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;

        this.lights[i].setPosition(3, 0, -4, 1);
        this.lights[i].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[i].setVisible(true);
        this.lights[i].enable();
        i++;
    };

    updateLights() 
    {
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();
    }

    setDefaultAppearance() 
    {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);    
    };

    display() 
    {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Update all lights used
        this.updateLights();

        // Draw axis
        this.axis.display();

        // ---- END Background, camera and axis setup

        // ---- BEGIN Scene drawing section

        this.materialDefault.apply();

        this.pushMatrix();

            this.tableTex.apply();
        this.octagon.display();
        this.translate(3, 0, 0);
        this.square.display();
        this.translate(3, 0, 0);
        this.triangle.display();
        this.translate(3, 0, 0);
        this.rectangle.display();
        this.translate(3, 0, 0);
        this.circle.display();
        this.translate(3, 0, 0);
        this.hexagon.display();
        this.translate(3, 0, 0);
        this.trapezium.display();
        this.translate(5, 0, 0);
        this.quadrangle.display();

        this.popMatrix();
        this.pushMatrix();

        this.translate(0, 5, 0); // +5

        this.cube.display();
        this.translate(3, 0, 0);
        this.block.display();
        this.translate(3, 0, 0);
        this.halfsphere.display();
        this.translate(3, 0, 0);
        this.closedhalfsphere.display();
        this.translate(3, 0, 0);
        this.sphere.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, 10, 0); // +10

        this.cylinder.display();
        this.translate(3, 0, 0);
        this.closedcylinder.display();
        this.translate(3, 0, 0);
        this.prism.display();
        this.translate(3, 0, 0);
        this.closedprism.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, 15, 0); // +15

        this.cone.display();
        this.translate(3, 0, 0);
        this.closedcone.display();
        this.translate(3, 0, 0);
        this.doublecone.display();
        this.translate(3, 0, 0);
        this.pyramid.display();
        this.translate(3, 0, 0);
        this.closedpyramid.display();
        this.translate(3, 0, 0);
        this.doublepyramid.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, -5, 0); // -5

        this.cutcone.display();
        this.translate(3, 0, 0);
        this.closedcutcone.display();
        this.translate(3, 0, 0);
        this.doublecutcone.display();
        this.translate(3, 0, 0);
        this.cutpyramid.display();
        this.translate(3, 0, 0);
        this.closedcutpyramid.display();
        this.translate(3, 0, 0);
        this.doublecutpyramid.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, -10, 0); // -10

            //this.materialDefault.apply();
        this.sqXYsurface.display();
        this.translate(5, 0, 0);
        this.cubesurface.display();
        this.translate(5, 0, 0);
        this.torus.display();
        this.translate(5, 0, 0);
        this.eight.display();
        this.translate(3, 0, 0);
        this.astroidal.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, -15, 0); // -15

        this.kiss.display();
        this.translate(3, 0, 0);
        this.bohemianDome.display();
        this.translate(3, 0, 0);
        this.crossedTrough.display();
        this.translate(3, 0, 0);
        this.sineSurface.display();
        this.translate(3, 0, 0);
        this.cayleySurface.display();
        this.translate(3, 0, 0);

        this.popMatrix();
        this.pushMatrix();
        this.translate(0, -22, 0), // -22

        this.heart.display();
        this.translate(5, 0, 0);
        this.butterfly.display();
        this.translate(5, 0, 0);
        this.trifolium.display();
        this.translate(5, 0, 0);
        this.vase.display();
        this.translate(5, 0, 0);
        this.mobius.display();
        this.translate(3, 0, 0);

        //this.translate(0, -30, 0);

        //this.car.display();

        // ---- END Scene drawing section
    };
};
