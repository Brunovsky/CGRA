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

        this.clockAppearance = new CGFappearance(scene);
		this.clockAppearance.setAmbient(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		this.clockAppearance.setDiffuse(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		this.clockAppearance.setSpecular(HUGE_COMP, HUGE_COMP, HUGE_COMP, 1);
		this.clockAppearance.setShininess(120);
        this.clockAppearance.loadTexture("../resources/images/clock.png");
        //this.clockAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    convertRGB(a){
        return a/255.0;
    };
	
	display(){
		this.scene.pushMatrix();
			this.clockAppearance.apply();
			this.circle.display();
		this.scene.popMatrix();

		this.cylinder.display();
	}
};