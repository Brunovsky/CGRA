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

        this.car = new MyVehicle(this, carFunctionSmooth);
        this.car.bindTextureSet("silver");

        this.hills = new MyTerrain(this, hillsDivs, hillsAltimetry, 50);
        this.hills.bindTexture(tex.terrain.hills);

        this.river = new MyTerrain(this, riverDivs, riverAltimetry, 50);
        this.river.bindTexture(tex.terrain.river);

        this.terrain = this.river;

        this.crane = new MyCrane(this);
        this.crane.bindTexture(tex.other.table, tex.other.floor);
        this.crane.bindObject(this.car);
    };

    initTextures()
    {
        let textures = {
            default: new CGFappearance(this),
            terrain: {
                hills: new CGFappearance(this),
                river: new CGFappearance(this),
            },
            car: {
                windshield: new CGFappearance(this),
                white: new CGFappearance(this),
                frontlight: new CGFappearance(this),
                backlight: new CGFappearance(this),
                base: new CGFappearance(this),
            },
            other: {
                table: new CGFappearance(this),
                board: new CGFappearance(this),
                slides: new CGFappearance(this),
                floor: new CGFappearance(this),
                metalmixed: new CGFappearance(this),
                metaldirty: new CGFappearance(this),
            },
            hood: {
                silver: new CGFappearance(this),
                police: new CGFappearance(this),
                wood: new CGFappearance(this),
                red: new CGFappearance(this),
            },
            side: {
                silver: new CGFappearance(this),
                police: new CGFappearance(this),
                wood: new CGFappearance(this),
                red: new CGFappearance(this),
            },
            wheeltread: {
                gta: new CGFappearance(this),
                table: new CGFappearance(this),
            },
            wheelside: {
                gold: new CGFappearance(this),
                white: new CGFappearance(this),
                table: new CGFappearance(this),
            },
        };

        textures.default.setAmbient(0.10, 0.45, 0.7, 1);
        textures.default.setDiffuse(0.2, 0.4, 0.6, 1);
        textures.default.setSpecular(0.7, 0.6, 0.9, 1);
        textures.default.setShininess(20);

        textures.terrain.hills.setAmbient(0.5, 0.5, 0.5, 1);
        textures.terrain.hills.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.terrain.hills.setShininess(150);
        textures.terrain.hills.loadTexture("tex/hills.png");

        textures.terrain.river.setAmbient(0.5, 0.5, 0.5, 1);
        textures.terrain.river.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.terrain.river.setShininess(150);
        textures.terrain.river.loadTexture("tex/river.png");

        textures.car.windshield.setAmbient(0.5, 0.5, 0.5, 1);
        textures.car.windshield.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.car.windshield.setShininess(150);
        textures.car.windshield.loadTexture("tex/windshield.png");

        textures.car.white.setAmbient(0.5, 0.5, 0.5, 1);
        textures.car.white.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.car.white.setShininess(150);
        textures.car.white.loadTexture("tex/white.png");

        textures.car.frontlight.setAmbient(0.5, 0.5, 0.5, 1);
        textures.car.frontlight.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.car.frontlight.setShininess(150);
        textures.car.frontlight.loadTexture("tex/frontlight.png");

        textures.car.backlight.setAmbient(0.5, 0.5, 0.5, 1);
        textures.car.backlight.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.car.backlight.setShininess(150);
        textures.car.backlight.loadTexture("tex/backlight.png");

        textures.car.base.setAmbient(0.5, 0.5, 0.5, 1);
        textures.car.base.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.car.base.setShininess(150);
        textures.car.base.loadTexture("tex/base.png");

        textures.other.table.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.table.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.table.setShininess(150);
        textures.other.table.loadTexture("tex/table.png");

        textures.other.board.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.board.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.board.setShininess(150);
        textures.other.board.loadTexture("tex/board.png");

        textures.other.slides.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.slides.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.slides.setShininess(150);
        textures.other.slides.loadTexture("tex/slides.png");

        textures.other.floor.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.floor.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.floor.setShininess(150);
        textures.other.floor.loadTexture("tex/floor.png");

        textures.other.metalmixed.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.metalmixed.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.metalmixed.setShininess(150);
        textures.other.metalmixed.loadTexture("tex/metal-mixed.png");

        textures.other.metaldirty.setAmbient(0.5, 0.5, 0.5, 1);
        textures.other.metaldirty.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.other.metaldirty.setShininess(150);
        textures.other.metaldirty.loadTexture("tex/metal-dirty.png");

        textures.hood.silver.setAmbient(0.5, 0.5, 0.5, 1);
        textures.hood.silver.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.hood.silver.setShininess(150);
        textures.hood.silver.loadTexture("tex/hoodsilver.png");

        textures.hood.police.setAmbient(0.5, 0.5, 0.5, 1);
        textures.hood.police.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.hood.police.setShininess(150);
        textures.hood.police.loadTexture("tex/hoodpolice.png");

        textures.hood.red.setAmbient(0.5, 0.5, 0.5, 1);
        textures.hood.red.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.hood.red.setShininess(150);
        textures.hood.red.loadTexture("tex/hoodred.png");

        textures.hood.wood = textures.other.floor;

        textures.side.silver.setAmbient(0.5, 0.5, 0.5, 1);
        textures.side.silver.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.side.silver.setShininess(150);
        textures.side.silver.loadTexture("tex/sidesilver.png");

        textures.side.police.setAmbient(0.5, 0.5, 0.5, 1);
        textures.side.police.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.side.police.setShininess(150);
        textures.side.police.loadTexture("tex/sidepolice.png");

        textures.side.red.setAmbient(0.5, 0.5, 0.5, 1);
        textures.side.red.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.side.red.setShininess(150);
        textures.side.red.loadTexture("tex/sidered.png");

        textures.side.wood = textures.other.floor;

        textures.wheeltread.gta.setAmbient(0.5, 0.5, 0.5, 1);
        textures.wheeltread.gta.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.wheeltread.gta.setShininess(150);
        textures.wheeltread.gta.loadTexture("tex/wheeltread-gta.png");

        textures.wheeltread.table = textures.other.table;

        textures.wheelside.gold.setAmbient(0.5, 0.5, 0.5, 1);
        textures.wheelside.gold.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.wheelside.gold.setShininess(150);
        textures.wheelside.gold.loadTexture("tex/wheelside-gold.png");

        textures.wheelside.white.setAmbient(0.5, 0.5, 0.5, 1);
        textures.wheelside.white.setDiffuse(0.7, 0.7, 0.7, 1);
        textures.wheelside.white.setShininess(150);
        textures.wheelside.white.loadTexture("tex/wheelside-white.png");

        textures.wheelside.table = textures.other.table;

        this.textures = textures;
    };

    initControls(datgui)
    {
        let lights = this.lights;
        let axis = this.axis;

        this.keymap = {
            ArrowDown:  "down",
            ArrowUp:    "up",
            ArrowLeft:  "left",
            ArrowRight: "right",
            Space:      "space",
            KeyB:       "animate"
        };

        this.keys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false,
            animate: false
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
                "Engine forward": this.car.cons.engForward,
                "Engine backward": this.car.cons.engBackward,
                "Break constant": this.car.cons.break,
                "Drag constant": this.car.cons.drag,
                "Roll constant": this.car.cons.roll,
                "Car mass": this.car.cons.mass,
            },
            crane: {
                "Max α": this.crane.cons.maxα,
                "Phi φ": this.crane.cons.phi,
                "Theta θ": this.crane.cons.theta,
                "Rotation speed": this.crane.cons.speed,
                "Acceptable": this.crane.cons.acceptable,
            },
            "Show axis": true,
            "Car Texture": "silver",
            "Terrain Texture": "river",
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

        physGroup.add(this.control.physics, "Engine forward", 0, this.car.cons.engForward * 10)
            .onChange(value => { this.car.cons.engForward = value; });
        physGroup.add(this.control.physics, "Engine backward", 0, this.car.cons.engBackward * 10)
            .onChange(value => { this.car.cons.engBackward = value; });
        physGroup.add(this.control.physics, "Break constant", 0, this.car.cons.break * 10)
            .onChange(value => { this.car.cons.break = value; });
        physGroup.add(this.control.physics, "Drag constant", 0, this.car.cons.drag * 10)
            .onChange(value => { this.car.cons.drag = value; });
        physGroup.add(this.control.physics, "Roll constant", 0, this.car.cons.roll * 10)
            .onChange(value => { this.car.cons.roll = value; });
        physGroup.add(this.control.physics, "Car mass", 0, this.car.cons.mass * 10)
            .onChange(value => { this.car.cons.mass = value; });

        let craneGroup = datgui.addFolder("Crane");
        craneGroup.open();

        const PI = Math.PI;
        craneGroup.add(this.control.crane, "Max α", 0.25 * PI, 1.75 * PI)
            .onChange(value => { this.crane.cons.maxα = value; });
        craneGroup.add(this.control.crane, "Phi φ", 0, 0.25 * PI)
            .onChange(value => { this.crane.cons.phi = value; });
        craneGroup.add(this.control.crane, "Theta θ", 0, 0.5 * PI)
            .onChange(value => { this.crane.cons.theta = value; });
        craneGroup.add(this.control.crane, "Rotation speed", 0, 0.5 * PI)
            .onChange(value => { this.crane.cons.speed = value; });
        craneGroup.add(this.control.crane, "Acceptable", 0, 10)
            .onChange(value => { this.crane.cons.acceptable = value; });

        datgui.add(this.control, "Show axis");
        datgui.add(this.control, "Car Texture", ["silver", "police", "wood", "red"])
            .onChange(value => { this.car.bindTextureSet(value); });
        datgui.add(this.control, "Terrain Texture", ["hills", "river"])
            .onChange(value => { this.terrain = this[value]; });
    };

    initCameras() 
    {
        this.camera = new CGFcamera(0.4, 0.1, 500,
            vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
    };

    initLights() 
    {
        this.setGlobalAmbientLight(AMBIENT[0], AMBIENT[1], AMBIENT[2], AMBIENT[3]);

        this.lights[0].setPosition(6, -0.5, 15, 1);
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

        // Update all lights used
        this.updateLights();

        // Draw axis
        if (this.control["Show axis"]) this.axis.display();

        // ---- END Background, camera and axis setup
		
        // ---- BEGIN Scene drawing section

        this.pushTexture(this.tableTex);
        this.pushMatrix();

        this.terrain.display();

        this.translate(-5, 0, 0);

        this.crane.display();

        this.car.display();

        this.popMatrix();
        this.popTexture();

        // ---- END Scene drawing section
    };

    update(currTime)
    {
        this.checkKeys();
        
        this.car.update(currTime);
        this.crane.update(currTime);
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

let hillsAltimetry = [
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.3, 1.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.4, 1.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.2, 0.2, 0.0 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.6, 1.5, 1.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.4, 1.2, 0.4, 0.3, 0.0 ],
    [ 0.0, 0.0, 0.0, 0.0, 1.5, 0.4, 0.1, 0.0, 0.0, 0.0, 1.2, 0.9, 0.0, 0.0, 0.0, 0.5, 1.4, 1.4, 0.0, 0.0, 0.0 ],
    [ 0.0, 0.5, 0.9, 1.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 0.6, 0.3, 0.6, 0.0, 1.6, 2.1, 0.5, 0.0, 0.0, 0.0 ],
    [ 0.0, 0.7, 1.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.3, 0.8, 3.2, 2.6, 0.0, 0.0, 0.0, 1.5, 1.8 ],
    [ 0.0, 0.9, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 1.9, 1.6, 0.0, 0.0, 0.0, 1.7, 2.0 ],
    [ 0.2, 0.8, 0.0, 0.0, 0.0, 0.0, 0.4, 0.9, 0.0, 0.0, 0.4, 0.0, 0.1, 0.4, 0.6, 0.4, 0.0, 0.0, 0.0, 0.8, 2.1 ],
    [ 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.8, 0.7, 0.0, 1.0, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.5, 2.5, 1.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
    [ 0.0, 0.0, 0.0, 0.0, 1.3, 0.5, 1.2, 1.0, 1.7, 0.9, 0.0, 0.8, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5 ],
    [ 0.0, 0.0, 0.0, 0.4, 1.5, 0.6, 0.8, 0.0, 0.0, 1.6, 1.0, 2.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.4, 1.8 ],
    [ 0.0, 0.0, 0.2, 0.9, 0.5, 0.2, 0.4, 0.0, 0.0, 0.0, 0.6, 1.5, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.2, 1.8 ],
    [ 0.1, 0.1, 0.4, 0.0, 0.1, 0.7, 1.3, 0.5, 0.0, 0.0, 0.0, 0.4, 0.0, 0.0, 0.0, 0.9, 1.3, 1.4, 0.8, 1.6, 2.1 ],
    [ 0.2, 0.4, 0.2, 0.0, 0.0, 1.2, 1.8, 1.5, 1.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 1.0, 1.1, 1.0, 2.0, 2.5 ],
    [ 0.1, 0.1, 0.1, 0.0, 0.0, 0.8, 2.0, 2.3, 1.8, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6, 1.0, 1.2, 1.2, 1.9, 2.3 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 1.2, 2.6, 2.2, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 0.9, 1.0, 1.5, 1.5, 1.9 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.7, 2.6, 0.9, 0.3, 0.6, 0.3, 0.0, 0.0, 0.0, 0.5, 1.2, 1.8, 2.3, 2.6 ],
    [ 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8, 2.0, 2.2, 2.2, 2.2, 1.2, 0.1, 0.0, 0.0, 0.0, 0.1, 1.3, 1.4, 2.3 ],
    [ 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 2.0, 2.5, 3.0, 2.6, 1.5, 0.4, 0.0, 0.0, 0.0, 0.0, 0.8, 0.1, 1.7 ],
    [ 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 1.7, 2.8, 3.3, 3.5, 1.8, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.1 ]
], hillsDivs = 20;

let riverAltimetry = [
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 0.8, 2.1, 3.2, 3.2, 3.3, 3.1, 3.0, 1.2, 0.7, 0.7 ],
    [ 0.0, 0.1, 0.2, 0.2, 0.4, 1.2, 0.8, 0.2, 0.0, 0.1, 0.2, 1.8, 3.1, 3.3, 3.1, 3.3, 3.4, 3.0, 0.7, 0.7, 1.0 ],
    [ 0.1, 0.2, 0.3, 0.6, 3.6, 2.4, 0.8, 0.3, 0.1, 0.0, 0.1, 0.1, 1.5, 3.0, 1.3, 0.3, 1.0, 2.0, 1.1, 1.0, 1.2 ],
    [ 0.1, 0.3, 0.4, 2.7, 3.5, 2.0, 0.6, 0.2, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.0, 0.1, 0.2, 0.7, 1.3, 1.8, 1.8 ],
    [ 0.1, 0.8, 2.6, 3.0, 2.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.5, 2.0, 2.5 ],
    [ 0.1, 0.2, 1.8, 2.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.6, 3.1, 3.7, 3.8 ],
    [ 0.1, 0.3, 0.7, 1.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 3.0, 4.7, 4.8, 4.9 ],
    [ 0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.3, 3.5, 5.3, 5.2, 5.1 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.7, 4.4, 5.4, 5.6, 5.3 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 2.5, 5.0, 5.3, 5.5, 5.4 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 3.0, 5.0, 5.2, 5.4, 5.4 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.5, 2.5, 5.1, 5.3, 5.2 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 4.0, 2.0, 4.7, 5.1, 5.1 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.6, 4.0, 1.0, 3.8, 4.6, 4.8 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.3, 3.3, 0.6, 1.1, 4.0, 4.5 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 0.7, 2.0, 0.0, 0.0, 0.0, 0.0, 0.3, 3.8, 4.3 ],
    [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.4, 0.4, 0.5, 0.7, 3.5, 3.6, 3.5, 3.3, 2.0, 0.0, 0.3, 3.6, 4.3 ],
    [ 0.0, 0.1, 0.2, 0.3, 0.3, 0.3, 0.1, 0.1, 3.4, 3.7, 3.8, 3.4, 3.9, 4.1, 4.0, 3.8, 0.6, 0.0, 0.4, 3.8, 4.2 ],
    [ 0.1, 0.2, 0.5, 1.8, 1.8, 1.0, 0.5, 0.6, 3.4, 4.1, 4.2, 4.1, 4.2, 4.3, 4.2, 3.8, 0.1, 0.0, 0.9, 3.9, 4.1 ],
    [ 0.1, 0.3, 1.9, 2.1, 2.0, 2.0, 0.4, 0.5, 1.0, 3.7, 3.9, 4.3, 4.5, 4.7, 4.4, 0.3, 0.0, 0.0, 3.0, 4.0, 4.1 ],
    [ 0.1, 0.5, 2.0, 2.1, 2.3, 2.1, 1.4, 0.5, 0.6, 3.2, 3.7, 4.4, 4.5, 4.5, 3.9, 0.3, 0.0, 0.0, 2.5, 3.5, 4.0 ]
], riverDivs = 20;
