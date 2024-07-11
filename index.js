const app = require('./app')
const http = require('http')
const server = http.createServer(app)

server.listen(7000, ()=> {
  console.log('El servidor esta activo');
}) 