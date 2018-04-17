class MyTable extends CGFobject
{   
    constructor(scene) 
	{
		super(scene);
		this.initBuffers();
        this.cube = new MyUnitCubeQuad(this.scene)
        
		this.scene.enableTextures(true);

        scene.materialC = new CGFappearance(this.scene);
		scene.materialC.setAmbient(0.3,0.3,0.3,1);
        scene.materialC.setDiffuse(0.545, 0.271, 0.075, 1);
		scene.materialC.setSpecular(0.2, 0.2, 0.2, 1);	
		scene.materialC.setShininess(120);
        
        scene.materialD = new CGFappearance(this.scene);
		scene.materialD.setAmbient(0.3,0.3,0.3,1);
		scene.materialD.setDiffuse(this.convertRGB(188), this.convertRGB(198), this.convertRGB(204), 1);
		scene.materialD.setSpecular(0.5, 0.5, 0.5, 1);	
		scene.materialD.setShininess(180);
		
		this.materialTexture = new CGFappearance(this);
		this.materialTexture.setAmbient(0.3,0.3,0.3,1);
		this.materialTexture.setDiffuse(0.6,0.6,0.6,1);
		this.materialTexture.setSpecular(0.1,0.1,0.1,1);	
		this.materialTexture.setShininess(180);
		this.materialTexture.loadTexture("../resources/images/table.png");
	};
    
    convertRGB(a){
        return a/255.0;
    };

	display(){
        this.scene.pushMatrix();      //Tampo
        this.scene.scale(5, 0.3, 3);
        //this.scene.materialC.apply();
		this.scene.materialTexture.apply()
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 1
        this.scene.translate(2, -1.7, -1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.scene.materialD.apply();
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 2
        this.scene.translate(2, -1.7, 1);
        this.scene.scale(0.3, 3.5, 0.3);
        this.scene.materialD.apply();
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 3
        this.scene.translate(-2, -1.7, -1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.scene.materialD.apply();
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    //Perna 4
        this.scene.translate(-2, -1.7, 1)
        this.scene.scale(0.3, 3.5, 0.3);
        this.scene.materialD.apply();
        this.cube.display();
        this.scene.popMatrix();
    }

};