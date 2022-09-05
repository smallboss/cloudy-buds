import express, { Request, Response, NextFunction } from 'express';
import io from './socket';
import * as http from 'http';
import path from 'path';
import cors from 'cors';
// import MasterRouter from './routers';
import config from './config';

class Server {
  private app = express();
  // private router = MasterRouter;

  constructor() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    this.app.use(cors());

    const serverHttp = http.createServer(this.app);
    io.attach(serverHttp);

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

    this.app.use(express.static(`${__dirname}/../../frontend/dist`));
    this.app.get('/', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type, Authorization'
      );

      res.contentType('text/html; charset=utf-8');

      res.sendFile(path.join(`${__dirname}/../../frontend/dist/index.html`));
    });
  }
}

export = new Server();
