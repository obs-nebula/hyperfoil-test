const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 8083,
    host: '0.0.0.0'
  });

  const io = require('socket.io')(server.listener);
  io.on('connection', (socket) => {
    socket.emit('news', { hello: 'hey' });
    socket.on('msg', (data) => {
      console.log(data);
    });
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

