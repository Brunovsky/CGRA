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
    constructor(scene, data = defaultCraneDescriptor)
    {
        super(scene);

        this.initVariables(data);

        this.base = new Sphere(scene,
            data.base.radius,
            data.base.slices,
            data.base.stacks,
            data.base.coords);

        this.joint = new Sphere(scene,
            data.joint.radius,
            data.joint.slices,
            data.joint.stacks,
            data.joint.coords);

        this.jib = new Cylinder(scene,
            data.jib.radius,
            data.jib.height,
            data.jib.slices,
            data.jib.stacks,
            data.jib.coords);

        this.arm = new ClosedCylinder(scene,
            data.arm.radius,
            data.arm.height,
            data.arm.slices,
            data.arm.stacks,
            data.arm.coords);

        this.line = new Cylinder(scene,
            data.line.radius,
            data.line.height,
            data.line.slices,
            data.line.stacks,
            data.line.coords);

        this.iman = new ClosedCylinder(scene,
            data.iman.radius,
            data.iman.height,
            data.iman.slices,
            data.iman.stacks,
            data.iman.coords);

        this.cover = new ClosedHalfSphere(scene,
            data.arm.radius,
            data.arm.slices,
            SPHERE_DEFAULT_STACKS);
    };

    initVariables(data)
    {
        this.data = {};
        for (let item in data) {
            this.data[item] = {};
            for (let s in data[item]) {
                this.data[item][s] = data[item][s] || defaultCraneDescriptor[item][s];
            }
        }

        this.phi = Math.PI / 6;
        this.theta = 0;
        this.alpha = 0;

        this.speed = 1; // radians per second

        this.forward = false;
        this.backward = false;

        this.objects = {};
    };

    update(currTime)
    {
        const keys = this.scene.keys;

        if (this.forward) {
            let dT = (currTime - this.time) / 1000;
            let angle = this.speed * dT;

            if (angle > Math.PI) {
                this.forward = false;
                this.alpha = Math.PI;
            } else {
                this.alpha = angle;
            }
        }

        if (this.backward) {
            let dT = (currTime - this.time) / 1000;
            let angle = this.speed * dT;

            if (angle > Math.PI) {
                this.backward = false;
                this.alpha = 0;
            } else {
                this.alpha = Math.PI - angle;
            }
        }

        if (keys.animate && !this.forward && !this.backward) {
            this.time = currTime;

            if (this.alpha === 0) {
                this.forward = true;
                this.backward = false;
                console.log("FORWARD");
            }

            if (this.alpha === Math.PI) {
                this.forward = false;
                this.backward = true;
                console.log("BACKWARD");
            }
        }
    };

    expose(where)
    {
        const data = this.data;

        let R = data.jib.height * Math.sin(this.phi);
        let Y = data.jib.height * Math.cos(this.phi) - data.arm.height
            - data.line.height - data.iman.height;

        let vector = subVectors({X: R, Y: Y, Z: 0}, where);

        this.scene.rotate(-this.alpha, 0, 1, 0);
        this.scene.translate(vector.X, vector.Y, vector.Z);
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

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI, 1, 0, 0);
                this.cover.display();
            this.scene.popMatrix();

            this.scene.translate(0, -data.line.height, 0);
            this.scene.rotate(-this.theta, 0, 0, 1);
            this.line.display();

            this.scene.translate(0, -data.iman.height, 0);
            this.iman.display();
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

    bindObject(id, object, height)
    {
        this.objects[id] = {
            object: object,
            height: height
        };
    };
};
