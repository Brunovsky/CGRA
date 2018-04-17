/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */

class MyClock extends CGFobject
{
	constructor(scene)
    {
        super(scene);
		this.cylinder = new MyCylinder(this.scene, 12, 1);
		this.circle = new MyCircle(this.scene, 12);

        scene.clockAppearance = new CGFappearance(scene);
		scene.clockAppearance.setAmbient(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		scene.clockAppearance.setDiffuse(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		scene.clockAppearance.setSpecular(HUGE_COMP, HUGE_COMP, HUGE_COMP, 1);
		scene.clockAppearance.setShininess(120);
        scene.clockAppearance.loadTexture("../resources/images/clock.png");
        //this.clockAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    convertRGB(a){
        return a/255.0;
    };
	
	display(){
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 0.2);
			this.scene.clockAppearance.apply();
			this.circle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(1, 1, 0.2);
			this.cylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene
			this.clockHours.display();
		this.scene.popMatrix();
	}
};