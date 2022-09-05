import './styles/main.scss';
import {World} from "./ts/world/World";
import {geckos} from "@geckos.io/client";

const w = new World('./assets/models/w.glb');
console.log('RUNNED');

const channel = geckos({ port: 3000 }) // default port is 9208

channel.onConnect(error => {
    if (error) {
        console.error(error.message)
        return
    }

    channel.on('chat message', data => {
        console.log(`You got the message ${data}`)
    })

    channel.emit('chat message', 'a short message sent to the server')
})
