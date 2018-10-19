

const http = require('http')
const requestListener = require('./router')

const server = http.createServer(requestListener)

server.listen(8888, () => {
    console.log(`server is listening...`)
})