let http = require('http')

let fs = require('fs')
let request = require('request')
let argv = require('yargs')
    .help('help').alias('help', 'h')
    .describe('port', 'Specify a forwarding port')
    .describe('host', 'Specify a forwarding host')
    .describe('url', 'Specify a forwarding url')
    .describe('logfile', 'Specify an output log file')
    .describe('exec', 'Specify stdin/stdout to/from the destination program')
    .example('nodemon index.js --logfile=log.txt', 'Log will be recorded in log.txt')
    .epilog('Copyright 2016')
    .argv

let localhost = '127.0.0.1';
let scheme = 'http://';
let host = argv.host || localhost
let port = argv.port || (host == localhost ? 8000:80)
let destinationUrl = argv.url || scheme + host + ':' + port

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
if (argv.host_ssl || argv.port_ssl) {
    let https = require('https')

    var httpsOptions = {
        key: fs.readFileSync('./https/client-key.pem'),
        cert: fs.readFileSync('./https/client-cert.pem')
    }
    host = argv.host_ssl
    port = argv.port_ssl

    proxyServer = https.createServer(httpsOptions)
}


http.createServer((req, res) => {
    logStream.write('Echo request received at: ${req.url}:\n' + JSON.stringify(req.headers) + '\n')

    for (let header in req.headers) {
        res.setHeader(header, req.headers[header])
    }

    req.pipe(res)
}).listen(8000)


proxyServer.on('request', (req, res) => {
    let url = destinationUrl
    logStream.write('Request proxied to: ${url + req.url}: \n' + JSON.stringify(req.headers))

    if (req.headers['x-destination-url']) {
        url = req.headers['x-destination-url']
        delete req.headers['x-destination-url']
    }

    let options = {
        headers: req.headers,
        url: url + req.url
    }

    req.pipe(logStream, {end: false})
    let downstreamResponse = req.pipe(request(options))
    process.stdout.write(JSON.stringify(downstreamResponse.headers))
    downstreamResponse.pipe(process.stdout)
    downstreamResponse.pipe(res)
})

proxyServer.listen(9000)
