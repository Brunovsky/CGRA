let defaultCraneDescriptor = {
    base: {
        radius: 1.1,
        slices: SPHERE_DEFAULT_SLICES,
        stacks: SPHERE_DEFAULT_STACKS,
        coords: [0, 1, 0, 1],
    },
    joint: {
        radius: 0.8,
        slices: SPHERE_DEFAULT_SLICES,
        stacks: SPHERE_DEFAULT_STACKS,
        coords: [0, 1, 0, 1],
    },
    jib: {
        radius: 0.45,
        height: 16.0,
        slices: CYLINDER_DEFAULT_SLICES,
        stacks: CYLINDER_DEFAULT_STACKS,
        coords: [0, 1, 0, 20],
    },
    arm: {
        radius: 0.30,
        height: 7.0,
        slices: CYLINDER_DEFAULT_SLICES,
        stacks: CYLINDER_DEFAULT_STACKS,
        coords: [0, 1, 0, 10],
    },
    line: {
        radius: 0.075,
        height: 1.5,
        slices: CYLINDER_DEFAULT_SLICES,
        stacks: CYLINDER_DEFAULT_STACKS,
        coords: [0, 1, 0, 5],
    },
    iman: {
        radius: 1.5,
        height: 0.5,
        slices: CYLINDER_DEFAULT_SLICES,
        stacks: CYLINDER_DEFAULT_STACKS,
        coords: [0, 1, 0, 1],
    },
};

class MyCrane extends CGFobject
{
    constructor(scene, given = defaultCraneDescriptor)
    {
        super(scene);

        this.initData(given);
        this.initVariables();

        this.base = new Sphere(scene,
            this.data.base.radius,
            this.data.base.slices,
            this.data.base.stacks,
            this.data.base.coords);

        this.joint = new Sphere(scene,
            this.data.joint.radius,
            this.data.joint.slices,
            this.data.joint.stacks,
            this.data.joint.coords);

        this.jib = new Cylinder(scene,
            this.data.jib.radius,
            this.data.jib.height,
            this.data.jib.slices,
            this.data.jib.stacks,
            this.data.jib.coords);

        this.arm = new SpheredCylinder(scene,
            this.data.arm.radius,
            this.data.arm.height,
            this.data.arm.slices,
            this.data.arm.stacks,
            this.data.arm.coords);

        this.line = new Cylinder(scene,
            this.data.line.radius,
            this.data.line.height,
            this.data.line.slices,
            this.data.line.stacks,
            this.data.line.coords);

        this.iman = new ClosedCylinder(scene,
            this.data.iman.radius,
            this.data.iman.height,
            this.data.iman.slices,
            this.data.iman.stacks,
            this.data.iman.coords);

        this.cover = new ClosedHalfSphere(scene,
            this.data.arm.radius,
            this.data.arm.slices,
            SPHERE_DEFAULT_STACKS);

        this.enter = new tPolygon(scene, t => hypocycloid(4, 0.25, t), [0, 2 * Math.PI]);
    };

    initData(given)
    {
        this.data = {};
        for (let item in defaultCraneDescriptor) {
            this.data[item] = {};
            if (!given[item]) {
                this.data[item] = defaultCraneDescriptor[item];
                continue;
            }
            for (let s in defaultCraneDescriptor[item]) {
                this.data[item][s] = given[item][s] || defaultCraneDescriptor[item][s];
            }
        }
    };

    initVariables()
    {
        this.cons = {
            maxα: Math.PI,
            phi: Math.PI / 4,
            theta: 0,
            speed: 1, // rad/s
            acceptable: 4
        };

        this.alpha = 0;
        this.cumulative = 0;

        this.moving = false;
        this.restoring = false;
    };

    update(currTime)
    {
        const keys = this.scene.keys;

        let dT = (currTime - this.time) / 1000;
        this.time = currTime;
        let deltaAngle = this.cons.speed * dT;

        // Step 3: Unrotate PI radians ONLY the crane.
        if (this.restoring) {
            this.alpha -= deltaAngle;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.restoring = false;
            }
        }

        // Step 2: Rotate PI radians.
        if (this.moving) {
            this.alpha += deltaAngle;
            this.cumulative += deltaAngle;

            if (this.alpha >= this.cons.maxα) {
                this.alpha = this.cons.maxα;
                this.cumulative -= (this.alpha - this.cons.maxα);
                this.movable.rotate(this.imanPosition(), this.alpha, deltaAngle);

                // Done, release the car
                this.moving = false;
                this.restoring = true;
                this.movable.endRotation();
            } else {
                this.movable.rotate(this.imanPosition(), this.alpha, deltaAngle);
            }
        }

        // Step 1: Init the movement with key B
        if (this.movable && keys.animate && !this.moving && !this.restoring) {
            this.time = currTime;

            let iman = this.imanPosition(), car = this.movable.getPosition();
            iman.Y = 0, car.Y = 0;

            console.log(iman);
            console.log(car);
            console.log(subVectors(iman, car));

            if (norm(subVectors(iman, car)) < this.cons.acceptable) {
                this.moving = true;
                this.movable.startRotation();
            }
        }
    };

    imanX() {
        const cos = Math.cos, sin = Math.sin;
        let h = this.data.jib.height;
        let a = this.data.arm.height;
        return h * sin(this.cons.phi) + a * sin(this.cons.theta);
    }

    imanY() {
        const cos = Math.cos, sin = Math.sin;
        let h = this.data.jib.height;
        let a = this.data.arm.height;
        let b = this.data.line.height + this.data.iman.height;
        return h * cos(this.cons.phi) - a * cos(this.cons.theta) - b;
    }

    imanPosition()
    {
        let imanAlongX = {
            X: this.imanX(),
            Y: this.imanY(),
            Z: 0
        };

        return unrotateYaxis(this.alpha, imanAlongX);
    };

    display()
    {
        const data = this.data;

        this.scene.pushMatrix();
            this.scene.rotate(-this.alpha, 0, 1, 0);
            this.scene.rotate(-this.cons.phi, 0, 0, 1);
            this.base.display();
            this.jib.display();

            this.scene.translate(0, data.jib.height, 0);
            this.scene.rotate(this.cons.phi + this.cons.theta, 0, 0, 1);
            this.joint.display();

            this.scene.translate(0, -data.arm.height, 0);
            this.arm.display();

            this.scene.rotate(-this.cons.theta, 0, 0, 1);
            this.scene.translate(0, -data.line.height, 0);
            this.line.display();

            this.scene.translate(0, -data.iman.height, 0);
            this.iman.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(this.imanX(), 0.05, 0);
            this.enter.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(-this.cons.maxα, 0, 1, 0);
            this.scene.translate(this.imanX(), 0.05, 0);
            this.enter.display();
        this.scene.popMatrix();
    };

    bindTexture(baseTexture, jibTexture, jointTexture, armTexture, imanTexture)
    {
        this.base.bindTexture(baseTexture);
        this.jib.bindTexture(jibTexture);
        this.joint.bindTexture(jointTexture || baseTexture);
        this.arm.bindTexture(armTexture || jibTexture);
        this.cover.bindTexture(armTexture || jibTexture);
        this.line.bindTexture(imanTexture || armTexture || jibTexture);
        this.iman.bindTexture(imanTexture || armTexture || jibTexture);
    };

    bindObject(movable)
    {
        this.movable = movable;
    };

    unbind()
    {
        this.movable = null;
    };
};
