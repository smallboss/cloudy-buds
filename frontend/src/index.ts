import './styles/main.scss';
import {World} from "./ts/world/World";
import {geckos} from "@geckos.io/client";

const w = new World('./assets/models/w.glb');
console.log('RUNNED');

const channel = geckos({ port: 3001 }) // default port is 9208
window['channel'] = channel;

channel.onConnect(error => {
    if (error) {
        console.error(error.message)
        return
    }

    let prevTime = Date.now();
    channel.on('physObjectsData', (data: any) => {
        w.boxes.forEach((box, i) => {
            box.body.quaternion.copy(data[i].quaternion);
            box.body.position.copy(data[i].position);
        });
        // console.log(data);
        // w.hammers[0].mesh.position.x = 0;
        // w.hammers[0].mesh.position.y = data.y;
        // w.hammers[0].mesh.position.z = 0;
        // console.log(w.hammers[1].mesh.position);
        // console.log(w.hammers[2].mesh.position);
        // console.log(w.hammers[3].mesh.position);
        const currTime = Date.now();
        // console.log(`You got the message`, data);
        prevTime = currTime;
    });

    const interv = setInterval(() => {
        if (!w.characters[0]) return;
        channel.emit('init_player', w.characters[0].characterCapsule.body.position);
        clearInterval(interv);
    }, 1000);

    setInterval(() => {
        if (!w.characters[0]) return;
        // const boxListData = w.boxes.map(hammer => {
        //     return {
        //         quaternion: hammer.body.quaternion,
        //         position: hammer.body.position,
        //     }
        // });
        // console.log(w.characters[0].characterCapsule.body.position);

        channel.emit('playerPosition', w.characters[0].characterCapsule.body.position);
    }, 50);
})
