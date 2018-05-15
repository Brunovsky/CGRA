class MyInterface extends CGFinterface {
 	constructor() {
 		super();
 	};
	
	init(application) {
		super.init(application);

		this.scene.initControls();

        this["Light 1"] = true;
        this["Light 2"] = true;
        this["Light 3"] = true;
        this["Light 4"] = true;
        this["Light 5"] = true;
        this["Show axis"] = true;
        this["Textures"] =  "board";
        this["Speed"] = 1;

		var gui = this.gui = new dat.GUI();

		var lightsGroup = gui.addFolder("Lights");
		lightsGroup.open();

		lightsGroup.add(this.scene, "Light 1");
		lightsGroup.add(this.scene, "Light 2");
		lightsGroup.add(this.scene, "Light 3");
		lightsGroup.add(this.scene, "Light 4");
		lightsGroup.add(this.scene, "Light 5");

		gui.add(this.scene, "Show axis");
		gui.add(this.scene, "Textures", ["board", "table", "floor"]);
		gui.add(this.scene, "Speed", 0, 3);

		this.initKeys();
		return true;
	};

	initKeys() {
		this.scene.gui = this;
		this.processKeyboard = function(){};
		this.activeKeys = {};
	};
		
	processKeyDown(event) {
		this.activeKeys[event.code] = true;
		console.log(event.code);
	};
	
	processKeyUp(event) {
		this.activeKeys[event.code] = false;
		console.log(event.code);
	};
	
	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
	};
};
