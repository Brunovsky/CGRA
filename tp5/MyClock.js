/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 *
 * altered to have base
 *
 */
var CLOCKHAND_WIDTH_H_M = 1;
var CLOCKHAND_LENGTH_H_M = 0.8;
var CLOCKHAND_WIDTH_M_M = 0.4;
var CLOCKHAND_LENGTH_M_M = 1.2;
var CLOCKHAND_WIDTH_S_M = 0.1;
var CLOCKHAND_LENGTH_S_M = 1.4;

class MyClock extends CGFobject
{
	constructor(scene)
    {
        super(scene);
		this.cylinder = new MyCylinder(this.scene, 12, 1);
		this.circle = new MyCircle(this.scene, 12);
		this.clockHandHours = new MyClockHand(this.scene, 90, CLOCKHAND_WIDTH_H_M, CLOCKHAND_LENGTH_H_M);
		this.clockHandMinutes = new MyClockHand(this.scene, 180, CLOCKHAND_WIDTH_M_M, CLOCKHAND_LENGTH_M_M);
		this.clockHandSeconds = new MyClockHand(this.scene, 270, CLOCKHAND_WIDTH_S_M, CLOCKHAND_LENGTH_S_M);
		

        scene.clockAppearance = new CGFappearance(scene);
		scene.clockAppearance.setAmbient(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		scene.clockAppearance.setDiffuse(AVG_COMP, AVG_COMP, AVG_COMP, 1);
		scene.clockAppearance.setSpecular(HUGE_COMP, HUGE_COMP, HUGE_COMP, 1);
		scene.clockAppearance.setShininess(120);
        scene.clockAppearance.loadTexture("../resources/images/clock.png");
    }
    
    update(currTime)
    {
    	// Assume currTime == Date.now()
    	var secondsSinceEpoch = currTime / 1000;
    	var seconds = secondsSinceEpoch % 60;
    	var minutesSinceEpoch = secondsSinceEpoch / 60;
    	var minutes = minutesSinceEpoch % 60;
    	var hoursSinceEpoch = minutesSinceEpoch / 60;
    	var hours = hoursSinceEpoch % 24;

    	this.clockHandSeconds.setAngle(360 * (seconds / 60));
    	this.clockHandMinutes.setAngle(360 * (minutes / 60));
    	this.clockHandHours.setAngle(360 * (hours / 24));
    }
	
	display()
	{
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 0.2);
			this.scene.clockAppearance.apply();
			this.circle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(1, 1, 0.2);
			this.cylinder.display();
		this.scene.popMatrix();

		//clockHandHours
		this.scene.pushMatrix();
			this.scene.materialDefault.apply();
			this.clockHandHours.display();
		this.scene.popMatrix();
		
		//clockHandMinutes
		this.scene.pushMatrix();
			this.scene.materialDefault.apply();
			this.clockHandMinutes.display();
		this.scene.popMatrix();	
		
		//clockHandSeconds
		this.scene.pushMatrix();
			this.scene.materialDefault.apply();
			this.clockHandSeconds.display();
		this.scene.popMatrix();
	}
};