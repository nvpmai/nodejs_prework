# Proxy Server

This is a Proxy Server for Node.js submitted as the [pre-work](http://courses.codepath.com/snippets/intro_to_nodejs/prework) requirement for CoderSchool.

Time spent: 20 hours

Completed:

* [x] Required: Requests to port `8000` are echoed back with the same HTTP headers and body
* [x] Required: Requests/reponses are proxied to/from the destination server
* [x] Required: The destination server is configurable via the `--host`, `--port`  or `--url` arguments
* [x] Required: The destination server is configurable via the `x-destination-url` header
* [x] Required: Client requests and respones are printed to stdout
* [x] Required: The `--logfile` argument outputs all logs to the file specified instead of stdout
* [x] Optional: The `--exec` argument proxies stdin/stdout to/from the destination program
* [x] Optional: The `--loglevel` argument sets the logging chattiness
* [x] Optional: Supports HTTPS
* [x] Optional: `-h` argument prints CLI API

Walkthrough Gif:

### Echo and Proxy Server
```bash
nodemon index.js
curl -v http://127.0.0.1:8000 -d "hello self" -H "x-wg"f: yodaw
curl -v http://127.0.0.1:9000 -d "hello self" -H "x-wg"f: yodaw
```
![echo and proxy server](https://github.com/nvpmai95/nodejs_prework/blob/master/gifs/echo_proxy.gif)


### --host; --url
```bash
nodemon index.js --url http://kenh14.vn/
curl http://127.0.0.1:9000 -d "Hi kenh14"

nodemon index.js --host google.com
curl http://127.0.0.1:9000 -d "Hi google"
```
![--host; --url](https://github.com/nvpmai95/nodejs_prework/blob/master/gifs/host_url.gif)


### --exec; --h; x-destination-url
```bash
nodemon index.js --h
cat index.js | nodemon index.js --exec "grep require"


#### --exec; --h; x-destination-url
```bash
nodemon index.js --h
cat index.js | nodemon index.js --exec "grep require"

nodemon index.js
curl http://127.0.0.1:9000 -H 'x-destination-url:http://webtretho.com'
```
![--exec; --h; x-destination-url](https://github.com/nvpmai95/nodejs_prework/blob/master/gifs/exec_h_x_url.gif)


### --logfile; --loglevel
```bash
nodemon index.js --logfile log.txt --loglevel DEBUG
curl http://127.0.0.1:8000 -d "Hi Google"

nodemon index.js --logfile log.txt --loglevel INFORMATIONAL
curl http://127.0.0.1:8000 -d "Hi Google"
```
![--logfile; --loglevel](https://github.com/nvpmai95/nodejs_prework/blob/master/gifs/logfile_loglevel.gif)


### --url-ssl
Make proxy Server support https
```bash
nodemon index.js --url-ssl http://127.0.0.1:8000
curl -k https://127.0.0.1:9000 -v
```
![--url-ssl](https://github.com/nvpmai95/nodejs_prework/blob/master/gifs/ssl.gif)


## Starting the Server

```bash
npm start
```

## Features

### Echo Server:

```bash
curl -v -X POST http://127.0.0.1:8000 -d "hello self" -H "x-asdf: yodawg"
* Rebuilt URL to: http://127.0.0.1:8000/
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8000 (#0)
> POST / HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/7.43.0
> Accept: */*
> x-asdf: yodawg
> Content-Length: 10
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 10 out of 10 bytes
< HTTP/1.1 200 OK
< host: 127.0.0.1:8000
< user-agent: curl/7.43.0
< accept: */*
< x-asdf: yodawg
< content-length: 10
< content-type: application/x-www-form-urlencoded
< Date: Wed, 21 Sep 2016 00:39:30 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
hello self
```

### Proxy Server:

Port 9000 will proxy to the echo server on port 8000.

```bash
curl -v http://127.0.0.1:9000/asdf -d "hello proxy"
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 9000 (#0)
> POST /asdf HTTP/1.1
> Host: 127.0.0.1:9000
> User-Agent: curl/7.43.0
> Accept: */*
> Content-Length: 11
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 11 out of 11 bytes
< HTTP/1.1 200 OK
< host: 127.0.0.1:9000
< user-agent: curl/7.43.0
< accept: */*
< content-length: 11
< content-type: application/x-www-form-urlencoded
< connection: close
< date: Wed, 21 Sep 2016 00:41:04 GMT
<
* Closing connection 0
hello proxy
```

### Configuration:

#### CLI Arguments:

The following CLI arguments are supported:

##### `--host`

The host of the destination server. Defaults to `127.0.0.1`.

##### `--port`

The port of the destination server. Defaults to `80` or `8000` when a host is not specified.

##### `--url`

A single url that overrides the above. E.g., `http://www.google.com`

##### `--url_ssl`

Specify a forwarding http(s) url. Make proxy server support https

##### `--logfile`

Specify a file path to redirect logging to.

##### `--loglevel`

Specify the level to which only output logs greater than or equal to is recorded.
ALERT: 0,
ERROR: 1,
WARNING: 2,
INFORMATIONAL: 3,
DEBUG: 4

##### `--h`

List all possible arguments for the server.

##### `--exec`

Specify stdin/stdout to/from the destination program.

#### Headers

The follow http header(s) are supported:

##### `x-destination-url`

Specify the destination url on a per request basis. Overrides and follows the same format as the `--url` argument.
