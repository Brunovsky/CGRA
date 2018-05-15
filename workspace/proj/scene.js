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

		this.option1=true; 
		this.option2=false; 
		this.speed=3;

        // ***** Materials
        this.materialDefault = new CGFappearance(this);
        this.materialDefault.setAmbient(0.10, 0.45, 0.7, 1);
        this.materialDefault.setDiffuse(0.2, 0.4, 0.6, 1);
        this.materialDefault.setSpecular(0.7, 0.6, 0.9, 1);
        this.materialDefault.setShininess(20);

        this.tableTex = new CGFappearance(this);
        this.tableTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.tableTex.setDiffuse(0.7, 0.7, 0.7, 1);
        this.tableTex.setShininess(150);
        this.tableTex.loadTexture("tex/table.png");

        this.boardTex = new CGFappearance(this);
        this.boardTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.boardTex.setDiffuse(0.7, 0.7, 0.7, 1);
        this.boardTex.setShininess(150);
        this.boardTex.loadTexture("tex/board.png");

        this.slidesTex = new CGFappearance(this);
        this.slidesTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.slidesTex.setDiffuse(0.7, 0.7, 0.7, 1);
        this.slidesTex.setShininess(150);
        this.slidesTex.loadTexture("tex/slides.png");

        this.floorTex = new CGFappearance(this);
        this.floorTex.setAmbient(0.5, 0.5, 0.5, 1);
        this.floorTex.setDiffuse(0.7, 0.7, 0.7, 1);
        this.floorTex.setShininess(150);
        this.floorTex.loadTexture("tex/floor.png");
		
        // ***** Scene elements
        let PI = Math.PI;

        this.carPolygonal = new Car(this, carPolygonal);
        this.carSmooth = new Car(this, carSmooth);

        // ***** Bind textures
        this.carPolygonal.bindTexture(this.tableTex, this.floorTex, this.slidesTex, this.boardTex);
        this.carSmooth.bindTexture(this.tableTex, this.floorTex, this.slidesTex, this.boardTex);
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

        this.lights[i].setPosition(5, -35, 8, 1);
        this.lights[i].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[i].setConstantAttenuation(0.5);
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

		this.checkKeys();
		
        // ---- BEGIN Scene drawing section

        this.tableTex.apply();

        this.carSmooth.display();
        this.carPolygonal.display();

        // ---- END Scene drawing section
    };
	
	doSomething(){ 
		console.log("Doing something..."); 
	};
	
	checkKeys()
	{
		var text="Keys pressed: ";
		var keysPressed=false;
		if (this.gui.isKeyPressed("KeyW")){
			text+=" W ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyS")){
			text+=" S ";
			keysPressed=true;
		}
		
		if (keysPressed)
			console.log(text);
	}

};
