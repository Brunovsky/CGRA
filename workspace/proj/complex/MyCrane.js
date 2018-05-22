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
        height: 15.0,
        slices: CYLINDER_DEFAULT_SLICES,
        stacks: CYLINDER_DEFAULT_STACKS,
        coords: [0, 1, 0, 20],
    },
    arm: {
        radius: 0.30,
        height: 7.5,
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
        this.phi = Math.PI / 6;
        this.theta = Math.PI / 12;
        this.alpha = 0;
        this.cumulative = 0;

        this.speed = 1; // radians per second

        this.moving = false;
        this.restoring = false;
    };

    update(currTime)
    {
        const keys = this.scene.keys;

        let dT = (currTime - this.time) / 1000;
        this.time = currTime;
        let angle = this.speed * dT;

        // Step 3: Unrotate PI radians ONLY the crane.
        if (this.restoring) {
            this.alpha -= angle;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.restoring = false;
            }
        }

        // Step 2: Rotate PI radians.
        if (this.moving) {
            this.alpha += angle;
            this.cumulative += angle;

            if (this.alpha >= Math.PI) {
                this.alpha = Math.PI;
                this.cumulative -= (this.alpha - Math.PI);

                // Done, release the car
                this.moving = false;
                this.restoring = true;
                this.movable.resume();
            }
        }

        // Step 1: Init the movement with key B
        if (this.movable && keys.animate && !this.moving && !this.restoring) {
            this.time = currTime;
            console.log(currTime, "Hello");

            this.moving = true;
            this.movable.stop();
        }
    };

    imanPosition()
    {
        let cos = Math.cos, sin = Math.sin;
        let data = this.data;
        let h = data.joint.height;
        let a = data.arm.height;
        let b = data.line.height + data.iman.height;

        // Auxiliary
        return {
            X: h * sin(this.phi) + a * sin(this.theta),
            Y: h * cos(this.phi) - a * cos(this.theta) - b,
            Z: 0
        };
    };

    movableDistance()
    {
        let vecIman = this.imanPosition();
        let vecMovable = this.movable.getPosition();

        vecIman.Y = 0; vecMovable.Y = 0;
        
        return norm(subVectors(vecIman, vecMovable));
    };

    display()
    {
        const data = this.data;

        this.scene.pushMatrix();
            this.scene.rotate(-this.alpha, 0, 1, 0);
            this.scene.rotate(-this.phi, 0, 0, 1);
            this.base.display();
            this.jib.display();

            this.scene.translate(0, data.jib.height, 0);
            this.scene.rotate(this.phi + this.theta, 0, 0, 1);
            this.joint.display();

            this.scene.translate(0, -data.arm.height, 0);
            this.arm.display();

            this.scene.rotate(-this.theta, 0, 0, 1);
            this.scene.translate(0, -data.line.height, 0);
            this.line.display();

            this.scene.translate(0, -data.iman.height, 0);
            this.iman.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.rotate(-this.cumulative, 0, 1, 0);
            if (this.moving) {
                let ceil = this.movable.getCeil();
                this.scene.translate(0, this.imanHeight() - ceil.Y, 0);
            }
            this.movable.display();
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
        this.cumulative = 0;
    };

    unbind()
    {
        this.movable = null;
        this.cumulative = 0;
    };
};
