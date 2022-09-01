const io = require('socket.io')();
import { THREAD } from './models/thread';

const socketsList: any = {};

const carsTypes = ['car1', 'car2'];

function randomInteger() {
  let rand = 0 - 0.5 + Math.random() * (carsTypes.length - 1 + 1);
  return carsTypes[Math.round(rand)];
}

let cars: any = [
  {
    id: 1,
    position: [-331.7357146489268, 0, -190.51024189236335],
    carOrientation: 1.0175524128699776,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 2,
    position: [-357.99097503127405, 0, -203.82289781755247],
    carOrientation: 3.139306238590082,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 3,
    position: [-258.3642324327178, 0, -254.92195916896264],
    carOrientation: 3.8720191302684572,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 4,
    position: [-357.9314060147179, 0, -278.7009408419009],
    carOrientation: 9.448103524344932,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 5,
    position: [-358.0440159200527, 0, -34.60533949141304],
    carOrientation: 3.183795249432947,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 6,
    position: [-330.0029925965212, 0, -282.8013879792977],
    carOrientation: 2.0746726622773592,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 7,
    position: [-340.4717554113006, 0, -369.7612088620988],
    carOrientation: 0.012100435680347731,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 8,
    position: [-289.90465494641217, 0, -164.9773351659883],
    carOrientation: 4.71981767981168,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 9,
    position: [-321.3096828421427, 0, -237.10253326826654],
    carOrientation: 1.6156239226558287,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  },
  {
    id: 10,
    position: [-330.0321570152193, 0, -110.64555696620971],
    carOrientation: -2.2854669965974823,
    wheelOrientation: 3.141592653589793,
    driver: null,
    speed: 0,
    type: randomInteger()
  }
];

io.on('connection', (socket: any) => {
  socket.on('ready', (peer: any) => {
    socket.emit('socketsList', socketsList);
    socketsList[socket.id] = { id: socket.id, ...peer };
  });
  // @ts-ignore
  socket.on('signal', ({ target, data, me = {} }) => {
    io.to(target).emit('signal', { sender: { id: socket.id, ...me }, data });
  });

  socket.on('moveCar', (data: any) => {
    cars = cars.map((item: { id: number }) => {
      if (item.id === data.id)
        return {
          ...item,
          ...data
        };
      return item;
    });
  });

  // -------------
  socket.userData = {};
  socket.emit('setId', { id: socket.id });

  socket.on('room', async (room: string) => {
    io.to(String(room)).emit('exit');

    socket.join(room);
    socket.userData.room = room;

    THREAD.find({ subscribers: room })
      .populate([
        {
          path: 'participants',
          select: ['_id', 'name', 'wallet']
        }
      ])
      .then((list) => {
        socket.emit('threads', list);
      })
      .catch((error) => {
        console.log(error.message);
      });
  });

  socket.on('voiceOff', function () {
    socket.broadcast.emit('socketDisconnected', socket.id);
    delete socketsList[socket.id];
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('deletePlayer', { id: socket.id });
    socket.broadcast.emit('socketDisconnected', socket.id);
    delete socketsList[socket.id];

    cars = cars.map((item: { driver: any }) => {
      if (item.driver === socket.id)
        return {
          ...item,
          speed: 0,
          driver: null
        };
      return item;
    });
  });

  socket.on('update', (data: any) => {
    socket.userData.x = data.x;
    socket.userData.y = data.y;
    socket.userData.z = data.z;
    socket.userData.heading = data.h;
    socket.userData.gender = data.gender;
    socket.userData.speak = data.speak;
    (socket.userData.pb = data.pb), (socket.userData.action = data.action);
    socket.userData.name = data.name;
  });

  // chat
  socket.on('chat', (data: { message: string; name: string }) => {
    io.emit('chat', data);
  });

  socket.on('activeThread', async (active: string) => {
    socket.userData.activeThread = active;
    if (!active) return;

    try {
      const thread: any = await THREAD.findOne({ _id: active }).lean();

      if (
        String(thread.messages?.[thread.messages.length - 1]?.senderId) !==
          socket.userData.room &&
        thread.unreadCount !== 0
      ) {
        await THREAD.updateOne({ _id: active }, { unreadCount: 0 });
      }
    } catch (error) {
      let errorMessage = 'Failed to create thread';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  });

  socket.on('message', async (data: any) => {
    const message = {
      body: data.body,
      senderId: data.senderId,
      createdAt: new Date()
    };

    io.to(String(data.senderId)).emit('message', {
      thread: data.thread,
      message,
      active: socket.userData.activeThread
    });

    try {
      const thread: any = await THREAD.findOne({ _id: data.thread }).lean();
      const friend = thread.participants.find(
        (item: string) => String(item) !== data.senderId
      );
      const messages = [...(thread.messages || []).slice(0, 100), message];

      const sockets: any = await io.fetchSockets();
      let userData = undefined;
      for (const s of sockets) {
        if (s.userData.room === String(friend)) {
          userData = s.userData;
        }
      }

      if (!userData || userData.activeThread !== data.thread) {
        thread.unreadCount += 1;
      } else {
        thread.unreadCount = 0;
      }

      const updateThread: any = await THREAD.findOneAndUpdate(
        { _id: data.thread },
        {
          messages,
          subscribers: thread.participants,
          unreadCount: thread.unreadCount
        },
        { new: true }
      );

      if (
        thread.subscribers.find(
          (item: string) => String(item) === String(friend)
        ) &&
        userData
      ) {
        io.to(String(friend)).emit('message', {
          thread: data.thread,
          message,
          active: userData.activeThread
        });
        return;
      }

      await updateThread.populate([
        {
          path: 'participants',
          select: ['_id', 'name', 'wallet']
        }
      ]);

      io.to(String(friend)).emit('new-thread', updateThread);
    } catch (error) {
      let errorMessage = 'Failed to create thread';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  });
});

setInterval(async () => {
  const sockets: any = await io.fetchSockets();
  const pack: any = [];

  for (const socket of sockets) {
    if (!socket.userData?.x) continue;

    pack.push({
      id: socket.id,
      x: socket.userData.x,
      y: socket.userData.y,
      z: socket.userData.z,
      heading: socket.userData.heading,
      pb: socket.userData.pb,
      action: socket.userData.action,
      gender: socket.userData.gender,
      speak: socket.userData.speak,
      name: socket.userData.name,
      room: socket.userData.room,
      time: Date.now()
    });
  }

  if (pack.length > 0) io.emit('remoteData', pack);
}, 300);

setInterval(async () => {
  io.emit(
    'remoteCars',
    cars.map((item: any) => ({ ...item, time: Date.now() }))
  );
}, 300);

export default io;
