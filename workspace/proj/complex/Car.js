class Car extends CGFobject
{
    constructor(scene, car)
    {
        super(scene);
        this.car = car;
        this.hood = new uvSurface(scene,
            car.hood,
            car.hoodBoundaries,
            car.slices);
        this.left = new uvSurface(scene,
            car.left,
            car.leftBoundaries,
            car.slices,
            car.sideCoordsMap);
        this.right = new uvSurface(scene,
            car.right,
            car.rightBoundaries,
            car.slices,
            car.sideCoordsMap);
        this.wheelLeftFront = new Wheel(scene, car.rWheel, car.lWheel);
        this.wheelRightFront = new Wheel(scene, car.rWheel, car.lWheel);
        this.wheelLeftBack = new Wheel(scene, car.rWheel, car.lWheel);
        this.wheelRightBack = new Wheel(scene, car.rWheel, car.lWheel);

        this.initVariables();
    };

    forward(distance)
    {
        this.wheelLeftFront.forward(distance);
        this.wheelRightFront.forward(distance);
        this.wheelLeftBack.forward(distance);
        this.wheelRightBack.forward(distance);
    };

    turn(phi)
    {
        this.wheelLeftFront.turn(phi);
        this.wheelRightFront.turn(phi);
    };

    stop()
    {
        this.forcedStop = true;
        this.velocity = nullVector();
    };

    resume()
    {
        this.forcedStop = false;
    };

    initVariables()
    {
        // Constants
        this.cons = {
            engForward:  32000,
            engBackward: 25000,
            break:       50000,
            drag:        3,
            roll:        700,
            mass:        1200,
            breakTop:    100,
            breakBot:    1000,
        };

        // Direction the car is facing, unit vector
        this.direction = {X: 1, Y: 0, Z: 0};

        // Position (midpoint of the back wheels) in meters
        this.position = {X: 0, Y: 0, Z: 0};

        // Velocity vector in meters/seconds
        this.velocity = {X: 0, Y: 0, Z: 0};

        // Angle between Ox in radians
        this.alpha = 0;

        // Angle of rotation of car in radians
        this.beta = 0;

        // Angle of left wheel in radians
        this.gammaLeft = 0;

        // Angle of right wheel in radians
        this.gammaRight = 0;

        // Time in seconds
        this.time = -1;
    };

    ceiling()
    {
        return {
            X: this.position.X + this.car.xWheelBack - this.car.ceilX,
            Y: this.position.Y + this.car.ceilY,
            Z: this.position.Z,
        };
    };

    update(currTime)
    {
        const keys = this.scene.keys;
        const cons = this.cons;
        const dWheel = this.car.dWheel;
        const lAxis = this.car.lAxis;

        // First call
        if (this.time <= 0) {
            this.time = currTime;
            return;
        }

        // Time (save)
        const dT = (currTime - this.time) / 1000;
        this.time = currTime;

        // Force stopped by crane? (bad design)
        if (this.forcedStop) {
            return;
        }

        // Load variables
        let direction = this.direction;
        let position = this.position;
        let velocity = this.velocity;
        let alpha = this.alpha;
        let beta = this.beta;
        let betaMax = Math.PI / 8;
        let betaStep = (Math.PI / 8) / 50;

        // Compute basis
        let speed = norm(velocity);
        let way = dotProduct(direction, velocity) > 0 ? 1 : -1;

        // Compute beta
        if (!keys.left && keys.right) {
            if(Math.abs(beta) < betaMax)
                beta +=  2*betaStep;
        } else if (keys.left && !keys.right) {
            if(Math.abs(beta) < betaMax)
                beta += -2*betaStep;
        } else if (!keys.left && !keys.right && beta != 0) {
            if(beta > 0)
                beta += -betaStep;
            else
                beta += betaStep;
        } else {
            beta = 0;
        }

        // Compute each subforce
        let forceForward = scaleVector(cons.engForward, direction);
        let forceBackward = scaleVector(-cons.engBackward, direction);
        let forceDrag = scaleVector(-cons.drag * speed, velocity);
        let forceRolling = scaleVector(-cons.roll, velocity);
        let mod = Math.ulog(cons.breakTop, speed, cons.breakBot); // reals.js
        let forceBreak = scaleVector(-cons.break * mod * way, direction);

        // Compute resulting force
        let force = addVectors(forceDrag, forceRolling);

        if (!keys.space) {
            if (keys.up && !keys.down) {
                force = addVectors(force, forceForward);
            }
            if (!keys.up && keys.down) {
                force = addVectors(force, forceBackward);
            }
        } else {
            force = addVectors(force, forceBreak);
        }

        // Acceleration
        let acceleration = scaleVector(1 / cons.mass, force);

        // Velocity
        velocity = multVectors(velocity, dT, acceleration);
        speed = norm(velocity);

        // Position
        let dP = scaleVector(dT, velocity);
        position = addVectors(position, dP);

        // New way
        way = dotProduct(velocity, direction) > 0 ? 1 : -1;
        let distance = way * norm(dP);

        if (beta != 0) {
            // Add centripetal acceleration
            let curvatureRadius = dWheel / Math.sin(beta); // signed
            //let normal = unrotateYaxis(Math.PI / 2, direction);
            //let centripetal = scaleVector(speed * speed / curvatureRadius, normal);

            // Wheel angles
            var gammaLeft = Math.asin(dWheel / (curvatureRadius + lAxis)) * way;
            var gammaRight = Math.asin(dWheel / (curvatureRadius - lAxis)) * way;

            // Adjusted velocity vector
            //velocity = multVectors(velocity, dT, centripetal);

            // Adjusted car angle
            let dAlpha = norm(dP) / curvatureRadius;
            alpha += dAlpha;

            // Adjusted direction
            direction = unrotateYaxis(alpha, xVector());

            // Stabilize velocity vector
            velocity = scaleVector(speed * way, direction);
        } else {
            // Do not turn wheels
            var gammaLeft = 0;
            var gammaRight = 0;
        }

        // Save variables
        this.direction = direction;
        this.position = position;
        this.velocity = velocity;
        this.alpha = alpha;
        this.beta = beta;
        this.forward(distance);
        this.turn(gammaLeft, gammaRight);
    };

    displayWheels()
    {
        const car = this.car;

        this.scene.pushMatrix();
            this.scene.translate(car.xWheelFront, 0,  car.lCar / 2);
            this.wheelLeftFront.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(car.xWheelFront, 0, -car.lCar / 2);
            this.wheelRightFront.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(car.xWheelBack,  0,  car.lCar / 2);
            this.wheelLeftBack.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(car.xWheelBack,  0, -car.lCar / 2);
            this.wheelRightBack.display();
        this.scene.popMatrix();
    };

    display()
    {
        const car = this.car, position = this.position, alpha = this.alpha;

        this.scene.pushMatrix();
            // 3. Move car to appropriate position and orientation
            this.scene.translate(position.X, position.Y, position.Z);
            this.scene.rotate(-alpha, 0, 1, 0);
            
            // 2. Adaptive transforms
            this.scene.translate(car.xWheelBack, 0, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);

            // 1. Draw car here
            this.hood.display();
            this.left.display();
            this.right.display();
            this.displayWheels();
        this.scene.popMatrix();
    };

    bindTexture(hoodTexture, sideTexture, treadTexture, wheelSideTexture)
    {
        this.hood.bindTexture(hoodTexture);
        this.left.bindTexture(sideTexture);
        this.right.bindTexture(sideTexture);
        this.wheelLeftFront.bindTexture(treadTexture, wheelSideTexture);
        this.wheelRightFront.bindTexture(treadTexture, wheelSideTexture);
        this.wheelLeftBack.bindTexture(treadTexture, wheelSideTexture);
        this.wheelRightBack.bindTexture(treadTexture, wheelSideTexture);
    };
};
