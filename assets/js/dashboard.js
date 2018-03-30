var socket = io();

socket.on('news', function (data) {
  console.log(data)
  socket.emit('my other event', { my: 'data' })
})
