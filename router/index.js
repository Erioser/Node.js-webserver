
const router = require('./router')

const requestListener = (req, res) => {

    if ( router.favicon(req, res) ) return false;

    router.handler(req, res)
    
}

module.exports = requestListener