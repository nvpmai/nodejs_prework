let http = require('http')

let fs = require('fs')
let request = require('request')
let argv = require('yargs')
    .help('help').alias('help', 'h')
    .describe('port', 'Specify a forwarding port')
    .describe('host', 'Specify a forwarding host')
    .describe('url_ssl', 'Specify a forwarding http(s) url. Make proxy server support https')
    .describe('url', 'Specify a forwarding url')
    .describe('logfile', 'Specify an output log file')
    .describe('loglevel', 'Specify the level to which only output logs greater than or equal to is recorded')
    .describe('exec', 'Specify stdin/stdout to/from the destination program')
    .describe('h', 'List all possible arguments for the server')
    .example('nodemon index.js --logfile=log.txt', 'Log will be recorded in log.txt')
    .epilog('Copyright 2016')
    .argv

let localhost = '127.0.0.1';
let scheme = 'http://';
let host = argv.host || localhost
let port = argv.port || (host == localhost ? 8000:80)
let url = argv.url

// exec
if (argv.exec) {
    require('child_process').spawn(argv.exec, argv._, {stdio: 'inherit'})
    process.exit(0)
}

// Logger
let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout
let logLevelSetting = argv.loglevel || 'debug'
let Logger = require('./lib/logLevel')
let myLog = new Logger(logLevelSetting, logStream)
let proxyServer = http.createServer()

// https
if (argv.url_ssl) {
    let https = require('https')

    var httpsOptions = {
        key: fs.readFileSync('./https/client-key.pem'),
        cert: fs.readFileSync('./https/client-cert.pem'),
    }

    url = argv.url_ssl
    proxyServer = https.createServer(httpsOptions)
}

let destinationUrl = url || scheme + host + ':' + port

http.createServer((req, res) => {
    myLog.new_line()
    myLog.informational('Echo request received at: ' + JSON.stringify(req.headers))


    for (let header in req.headers) {
        res.setHeader(header, req.headers[header])
    }

    req.pipe(res)
}).listen(8000)


proxyServer.on('request', (req, res) => {
    let url = destinationUrl
    myLog.debug('Proxy Request Headers: ' + JSON.stringify(req.headers))

    if (req.headers['x-destination-url']) {
        url = req.headers['x-destination-url']
        delete req.headers['x-destination-url']
    }

    let options = {
        headers: req.headers,
        url: url + req.url
    }

    myLog.informational('Proxy Destination Url: ' + options.url)
    req.pipe(logStream, {end: false})
    let downstreamResponse = req.pipe(request(options))
    process.stdout.write(JSON.stringify(downstreamResponse.headers))
    downstreamResponse.pipe(process.stdout)
    downstreamResponse.pipe(res)

})
proxyServer.listen(9000)
