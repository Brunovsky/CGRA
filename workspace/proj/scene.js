class MyScene extends CGFscene 
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

        this.setUpdatePeriod(1000 / HZ);

        this.initStack();
        this.initTextures();
        this.initObjects();
    };

    initStack()
    {
        this.texStack = new Stack();
        this.texStack.undef = 0;
    };

    initObjects()
    {
        let tex = this.textures;

        this.car = new Car(this, carFunctionSmooth);
        this.car.bindTexture(tex.table, tex.floor, tex.slides, tex.board);
    };

    initTextures()
    {
        let textures = {
            default: new CGFappearance(this),
            table:   new CGFappearance(this),
            board:   new CGFappearance(this),
            slides:  new CGFappearance(this),
            floor:   new CGFappearance(this)
        };

        textures.default.setAmbient(0.10, 0.45, 0.7, 1);
        textures.default.setDiffuse(0.2, 0.4, 0.6, 1);
        textures.default.setSpecular(0.7, 0.6, 0.9, 1);
        textures.default.setShininess(20);

        textures.table.setAmbient(0.5, 0.5, 0.5, 1);
        textures.table.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.table.setShininess(150);
        textures.table.loadTexture("tex/table.png");

        textures.board.setAmbient(0.5, 0.5, 0.5, 1);
        textures.board.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.board.setShininess(150);
        textures.board.loadTexture("tex/board.png");

        textures.slides.setAmbient(0.5, 0.5, 0.5, 1);
        textures.slides.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.slides.setShininess(150);
        textures.slides.loadTexture("tex/slides.png");

        textures.floor.setAmbient(0.5, 0.5, 0.5, 1);
        textures.floor.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.floor.setShininess(150);
        textures.floor.loadTexture("tex/floor.png");

        this.textures = textures;
    };

    initControls(datgui)
    {
        let car = this.car;
        let lights = this.lights;
        let axis = this.axis;

        this.keymap = {
            ArrowDown:  "down",
            ArrowUp:    "up",
            ArrowLeft:  "left",
            ArrowRight: "right",
            Space:      "space"
        };

        let physicsMap = {
            "Engine forward": "engForward",
            "Engine backward": "engBackward",
            "Break constant": "break",
            "Drag constant": "drag",
            "Roll constant": "roll",
            "Car mass": "mass"
        };

        this.keys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false
        };

        this.control = {
            lights: {
                "Light 0": true,
                "Light 1": true,
                "Light 2": true,
                "Light 3": true,
                "Light 4": true
            },
            physics: {
                "Engine forward": car.cons.engForward,
                "Engine backward": car.cons.engBackward,
                "Break constant": car.cons.break,
                "Drag constant": car.cons.drag,
                "Roll constant": car.cons.roll,
                "Car mass": car.cons.mass,
            },
            "Show axis": true,
            "Texture": "wood"
        };

        function updateLight(i, value) {
            if (value) {
                lights[i].enable(); lights[i].setVisible(true);
            } else {
                lights[i].disable(); lights[i].setVisible(false);
            }
        }
        
        let lightsGroup = datgui.addFolder("Lights");
        lightsGroup.open();

        lightsGroup.add(this.control.lights, "Light 0")
            .onChange(value => updateLight(0, value));
        lightsGroup.add(this.control.lights, "Light 1")
            .onChange(value => updateLight(1, value));
        lightsGroup.add(this.control.lights, "Light 2")
            .onChange(value => updateLight(2, value));
        lightsGroup.add(this.control.lights, "Light 3")
            .onChange(value => updateLight(3, value));
        lightsGroup.add(this.control.lights, "Light 4")
            .onChange(value => updateLight(4, value));

        let physGroup = datgui.addFolder("Physics");
        physGroup.open();

        physGroup.add(this.control.physics, "Engine forward", 0, car.cons.engForward * 10)
            .onFinishChange(value => { car.cons.engForward = value; });
        physGroup.add(this.control.physics, "Engine backward", 0, car.cons.engBackward * 10)
            .onFinishChange(value => { car.cons.engBackward = value; });
        physGroup.add(this.control.physics, "Break constant", 0, car.cons.break * 10)
            .onFinishChange(value => { car.cons.break = value; });
        physGroup.add(this.control.physics, "Drag constant", 0, car.cons.drag * 10)
            .onFinishChange(value => { car.cons.drag = value; });
        physGroup.add(this.control.physics, "Roll constant", 0, car.cons.roll * 10)
            .onFinishChange(value => { car.cons.roll = value; });
        physGroup.add(this.control.physics, "Car mass", 0, car.cons.mass * 10)
            .onFinishChange(value => { car.cons.mass = value; });

        datgui.add(this.control, "Show axis");
        datgui.add(this.control, "Texture", ["red", "blue", "green", "wood"]);
    };

    initCameras() 
    {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
    };

    initLights() 
    {
        this.setGlobalAmbientLight(AMBIENT[0], AMBIENT[1], AMBIENT[2], AMBIENT[3]);

        this.lights[0].setPosition(6, 0, 15, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 0.25, 1.0);
        this.lights[0].setConstantAttenuation(0.5);
        this.lights[0].setVisible(true);
        this.lights[0].enable();

        this.lights[1].setPosition(3, 5, -10, 1);
        this.lights[1].setDiffuse(1.0, 0.25, 1.0, 1.0);
        this.lights[1].setConstantAttenuation(0.5);
        this.lights[1].setVisible(true);
        this.lights[1].enable();

        this.lights[2].setPosition(0, 10, 8, 1);
        this.lights[2].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[2].setConstantAttenuation(0.5);
        this.lights[2].setVisible(true);
        this.lights[2].enable();

        this.lights[3].setPosition(3, 0, -4, 1);
        this.lights[3].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[4].setConstantAttenuation(0.5);
        this.lights[3].setVisible(true);
        this.lights[3].enable();

        this.lights[4].setPosition(5, -35, 8, 1);
        this.lights[4].setDiffuse(0.25, 1.0, 1.0, 1.0);
        this.lights[4].setConstantAttenuation(0.5);
        this.lights[4].setVisible(true);
        this.lights[4].enable();
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
        this.clearTextures();
        this.pushTexture(this.materialDefault);

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // check keys
        this.checkKeys();

        // Update all lights used
        this.updateLights();

        // Draw axis
        if (this.control["Show axis"]) this.axis.display();

        // ---- END Background, camera and axis setup
		
        // ---- BEGIN Scene drawing section

        this.pushTexture(this.tableTex);
        this.pushMatrix();

        this.car.display();

        this.popMatrix();
        this.popTexture();

        // ---- END Scene drawing section
    };

    update(currTime)
    {
        this.checkKeys();
        
        this.car.update(currTime);
    };
	
	checkKeys()
	{
        for (const key in this.keymap) {
            this.keys[this.keymap[key]] = this.gui.isKeyPressed(key);
        }
	};

    currentTexture()
    {
        return this.texStack.top();
    };

    pushTexture(T)
    {
        if (T) {
            this.texStack.push(T).apply();
        } else {
            this.texStack.undef++;
        }
        return this;
    };

    popTexture()
    {
        if (this.texStack.undef == 0) {
            this.texStack.pop().apply();
        } else {
            this.texStack.undef--;
        }
        return this;
    };

    clearTextures()
    {
        this.texStack.clear();
        this.texStack.undef = 0;
        return this;
    };
};
