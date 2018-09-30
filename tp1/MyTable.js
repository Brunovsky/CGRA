class MyTable extends CGFobject
{
    constructor(scene) 
	{
		super(scene);
		this.initBuffers();
        this.cube = new MyUnitCubeQuad(this.scene);
	};

	display(){
        this.scene.pushMatrix();      //Tampo
        this.scene.scale(5, 0.3, 3);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 1
        this.scene.translate(2, -1.7, -1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 2
        this.scene.translate(2, -1.7, 1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 3
        this.scene.translate(-2, -1.7, -1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 4
        this.scene.translate(-2, -1.7, 1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.cube.display();
        this.scene.popMatrix();
    }

};