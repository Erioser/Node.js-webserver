
const PATH = require('path')
const URL  = require('url')
const fs  = require('fs-extra')
const mime = require('mime-type/with-db')


class Router {

    constructor () {
        this.redirect = { // 重定向 
            '/': '/index.html'
        }

        this.api = { // api请求依据
            '/lagou': {
                
            }
        }
    }

    init () {

    }

    handler (req, res) { // 处理每一次请求
        this.res = res
        let content = ''// 准备响应的内容

        let pathname = URL.parse(req.url).pathname // 取出部分路径

        let isApi = this.isApiRequest(pathname)  // 判断是不是api请求

        if ( isApi ) {
            content =  '对不起，目前服务器没有响应api的能力'
            this.response(content, pathname)

        } else { // 资源请求

            pathname = this.redirect[req.url] || pathname // 重定向  /index.html ...
            // 真正的文件的路径
            pathname = PATH.join(__dirname, '../public' + pathname)
            this.getFileContent(pathname)
                           
        } 
       
    }

    getFileContent (pathname) { // 获取文件内容          
        try {
            // 说明这个文件是存在的
            fs.accessSync(pathname, fs.constants.R_OK | fs.constants.W_OK);
            console.log('可读可写');
            this.response(fs.readFileSync(pathname), pathname)
        } catch (err) {
            // 文件不存在就返回404
            console.error('不可访问！');
            pathname = PATH.join(__dirname, '../public/404.html')
            this.response(fs.readFileSync(pathname), pathname, 404)
        }
    }

    response (content, pathname, code = 200) { // 专门处理响应
        //  mime.lookup 可以根据传入的文件的路径判断出文件的mime-type
        this.res.writeHead(code, { 'content-type': mime.lookup(pathname) }) 
        this.res.end(content)
    }

    isApiRequest (pathname) { // 判断是否是数据请求
        for (const path in this.api) {
            if ( pathname.startsWith(path) ) {
                // 说明这里是数据请求
                return true
            }
        }
        return false
    }

   

    favicon (req, res) { // 处理chrome默认的favicon的请求
        if ( req.url === '/favicon.ico' ) {
            res.end('')
            return true;
        }
        return false;
    }

}

module.exports = new Router()