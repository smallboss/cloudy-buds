import express, { Request, Response, NextFunction } from 'express';
// import io from './socket';
import * as http from 'http';
import path from 'path';
import cors from 'cors';
// import MasterRouter from './routers';
import config from './config.ts';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import geckos from "@geckos.io/server";
// const geckos = await require("@geckos.io/server");

class Server {
  private app = express();
  // private router = MasterRouter;

  constructor() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    this.app.use(cors());

    const serverHttp = http.createServer(this.app);
    // io.attach(serverHttp);

    const io = geckos();
    io.addServer(serverHttp);

    io.onConnection(channel => {
      channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`)
      })

      channel.on('chat message', data => {
        console.log(`got ${data} from "chat message"`)
        // emit the "chat message" data to all channels in the same room
        io.room(channel.roomId).emit('chat message', data)
      })
    })

    // db()
    //   .then((info: any) => {
    //     console.log(`Connected ${info.name} database`);
        serverHttp.listen(config.APP_PORT || 3001, () => {
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
