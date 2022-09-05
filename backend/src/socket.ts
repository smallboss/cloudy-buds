const io = require('socket.io')();
// import { THREAD } from './models/thread';

const socketsList: any = {};

io.on('connection', (socket: any) => {
  console.log('connection!!');
  // socket.on('ready', (peer: any) => {
  //   // socket.emit('socketsList', socketsList);
  //   console.log('socketID', socket);
  //   socketsList[socket.id] = { id: socket.id, ...peer };
  // });

  // -------------
  socket.userData = {};
  socket.emit('setId', { id: socket.id });

  socket.on('disconnect', function () {
    socket.broadcast.emit('deletePlayer', { id: socket.id });
    socket.broadcast.emit('socketDisconnected', socket.id);
    delete socketsList[socket.id];
  });

  socket.on('update', (data: any) => {
    socket.userData.x = data.x;
    socket.userData.y = data.y;
    socket.userData.z = data.z;
    socket.userData.velX = data.velX;
    socket.userData.velY = data.velY;
    socket.userData.velZ = data.velZ;
    socket.userData.orX = data.orX;
    socket.userData.orY = data.orY;
    socket.userData.orZ = data.orZ;
    socket.userData.clipName = data.clipName;
    socket.userData.fadeIn = data.fadeIn;
    // socket.userData.heading = data.h;
    // socket.userData.gender = data.gender;
    // socket.userData.speak = data.speak;
    // (socket.userData.pb = data.pb), (socket.userData.action = data.action);
    // socket.userData.name = data.name;
  });
});

setInterval(async () => {
  const sockets: any = await io.fetchSockets();
  const pack: any = [];

  console.log('sockets', sockets.length);

  for (const socket of sockets) {
    if (socket.userData?.x === undefined) continue;

    pack.push({
      id: socket.id,
      x: socket.userData.x,
      y: socket.userData.y,
      z: socket.userData.z,
      velX: socket.userData.velX,
      velY: socket.userData.velY,
      velZ: socket.userData.velZ,
      orX: socket.userData.orX,
      orY: socket.userData.orY,
      orZ: socket.userData.orZ,
      clipName: socket.userData.clipName,
      fadeIn: socket.userData.fadeIn,
      time: Date.now(),
      // heading: socket.userData.heading,
      // pb: socket.userData.pb,
      // action: socket.userData.action,
      // gender: socket.userData.gender,
      // speak: socket.userData.speak,
      // name: socket.userData.name,
      // room: socket.userData.room,
      // time: Date.now()
    });
  }

  if (pack.length > 0) io.emit('remoteData', pack);
}, 200);

export default io;
