class MyInterface extends CGFinterface {
 	constructor() {
 		super();
 	};
	
	init(application) {
		super.init(application);

		this.scene.gui = this;
		
		let datgui = new dat.GUI();
		this.scene.initControls(datgui);

		this.initKeys();
		return true;
	};

	initKeys() {
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
