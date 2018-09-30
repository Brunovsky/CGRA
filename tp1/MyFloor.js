class MyFloor extends CGFobject
{
    constructor(scene) 
	{
		super(scene);
		this.initBuffers();
        this.cube = new MyUnitCubeQuad(this.scene);
	};

	display(){
        this.scene.pushMatrix();      //Chão
        this.scene.scale(8, 0.1, 6);
        this.cube.display();
        this.scene.popMatrix();
    }

};