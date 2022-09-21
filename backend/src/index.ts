import express, { Request, Response, NextFunction } from 'express';
import * as THREE from 'three';
// import io from './socket';
import * as http from 'http';
import path from 'path';
import cors from 'cors';
// import MasterRouter from './routers';
import config from './config.ts';
import geckos from "@geckos.io/server";
import World from './ts/world/World.ts';
// import ServerScene from "./ServerScene.ts";

import {default as AMMONodejs} from '@enable3d/ammo-on-nodejs';
import {CharacterSpawnPoint} from "./ts/world/CharacterSpawnPoint.ts";
import {LoadingManager} from "./ts/core/LoadingManager.ts";
import {Character} from "./ts/characters/Character.ts";


class Server {
  private app = express();
  // private router = MasterRouter;

  constructor() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    this.app.use(cors());

    // new ServerScene();

    const w = new World(path.resolve(process.cwd(), './src/assets/models/w.glb'));

    const serverHttp = http.createServer(this.app);
    // io.attach(serverHttp);

    const io = geckos();
    io.addServer(serverHttp);

    const pos = {x: 0, y: 0, z: 0};

    let i = 0;
    setInterval(() => {
      pos.y = Math.sin(i+= 0.01) * 2 + 2;
    }, 20);

    io.onConnection(channel => {
      channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`)
      })

      let newPlayer: Character;
      // channel.on('playerPosition', data => {
      //   if (!newPlayer) return;
      //
      //   newPlayer.characterCapsule.body.position.copy(data);
      //   // console.log(`got ${newPlayer.characterCapsule.body.position.x} from "chat message"`)
      //   // emit the "chat message" data to all channels in the same room
      //   // pos.x++;
      //   // io.room(channel.roomId).emit('chat message', pos);
      // })

      channel.on('playerAction', (data: any) => {
        console.log('playerActions data', data);
        newPlayer.triggerAction(data.action, data.pressed);
      })


      channel.on('init_player', data => {
        console.log('init_player');
        const obj3d = new THREE.Object3D();
        obj3d.position.copy(data);
        newPlayer = new Character(new THREE.Object3D());
        // w.physicsWorld.addBody(newPlayer.characterCapsule.body);
        w.add(newPlayer);
      })

      let i = 0;
      setInterval(() => {
        // console.log('pos.y', pos.y);
        const boxListData = w.boxes.map(hammer => {
          return {
            quaternion: hammer.body.quaternion,
            position: hammer.body.position,
          }
        });
        io.room(channel.roomId).emit('physObjectsData', boxListData);
        // channel.emit('chat message', pos);
      }, 30);
    })

    // db()
    //   .then((info: any) => {
    //     console.log(`Connected ${info.name} database`);
        serverHttp.listen(config.APP_PORT, () => {
          console.log('Launched SkyBuds server');
        });
    //   })
    //   .catch((err) => {
    //     console.error(`Error ${err.message}`);
    //     process.exit(1);
    //   });

    // this.app.use('/api', this.router);

    // this.app.use(express.static(`${process.cwd()}/../../frontend/dist`));
    // this.app.get('/', (req, res) => {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //   res.header(
    //     'Access-Control-Allow-Headers',
    //     'X-Requested-With,content-type, Authorization'
    //   );
    //
    //   res.contentType('text/html; charset=utf-8');
    //
    //   res.sendFile(path.join(`${__dirname}/../../frontend/dist/index.html`));
    // });
  }
}

new Server();
export default {};
