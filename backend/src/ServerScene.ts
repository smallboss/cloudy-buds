import * as AMMONodejs from '@enable3d/ammo-on-nodejs';
import _ammo  from '@enable3d/ammo-on-nodejs/ammo/ammo.js';

class ServerScene {
    public physics: AMMONodejs.default.Physics;

    constructor() {
        // test if we have access to Ammo
        console.log('Ammo', new Ammo.btVector3(1, 2, 3).y() === 2);

        // init the Physics
        this.physics = new AMMONodejs.default.Physics();
        this.factory = this.physics.factory;

        this.create()
    }

    create() {
        const ground = this.physics.add.box({
            name: 'ground',
            width: 40,
            depth: 40,
            collisionFlags: 2,
            mass: 0
        });

        const box = this.physics.add.box({ name: 'box', y: 5 });
        this.objects = [ground, box];

        const clock = new AMMONodejs.default.ServerClock()

        // for debugging you disable high accuracy
        // high accuracy uses much more cpu power
        if (process.env.NODE_ENV !== 'production') clock.disableHighAccuracy()

        clock.onTick(delta => this.update(delta))
    }

    update(delta: number) {
        this.physics.update(delta * 1000)

        const box = this.objects[1]
        const y = box.position.y.toFixed(2)

        // will print the y position of the box from 5.00 to 1.00
        if (y > 1) console.log('y:', y)

        // TODO
        // send new positions to the client
    }
}

console.log('AMMONodejs',AMMONodejs.default.Physics);

// wait for Ammo to be loaded
_ammo().then(ammo => {
    // @ts-ignore
    globalThis.Ammo = ammo;

    // start server scene
    // new ServerScene()
})

export default ServerScene;
