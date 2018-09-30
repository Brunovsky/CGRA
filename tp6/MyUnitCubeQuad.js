class MyUnitCubeQuad extends CGFobject
{
    constructor(scene, minS = 0, maxS = 1, minT = 0, maxT = 1) 
	{
		super(scene);
		this.initBuffers();
        this.quad = new MyQuad(scene, minS, maxS, minT, maxT);
        this.quad.initBuffers();
	};

	display(){
        this.scene.pushMatrix();    //F
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix(); 
        
        this.scene.pushMatrix();   //T
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(180*Math.PI/180, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();  //B
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();  //C
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-90*Math.PI/180, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();  //E
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
        
         this.scene.pushMatrix();  //D
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-90*Math.PI/180, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    }

};