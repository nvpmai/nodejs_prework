let logLevelLookup = {
    'ALERT': 0,
    'ERROR': 1,
    'WARNING': 2,
    'INFORMATIONAL': 3,
    'DEBUG': 4
}

class LogLevel {
    /**
     * log input into logStream based on global log level.
     * @param logLevel: string - the level we set for our server
     * @param logStream: the output stream
     * @return
     */

    constructor(logLevel, logStream) {
        this.logLevel = logLevel || 'debug'
        this.logStream = logStream || process.stdout
    }

    logMessage(level, input) {
        if (logLevelLookup[level] > logLevelLookup[this.logLevel]) {
            return
        }

        var logStr = 'Logger[' + level + ']: '

        if (typeof(input) == 'string') {
            this.logStream.write(logStr + input + '\n')
            return
        }

        if (typeof(input) === 'object' && input.hasOwnProperty('readable')) {
            this.logStream.write(logStr);
            input.pipe(this.logStream);
            return;
        }

        return this.logStream.write(logStr + '[object] ' + JSON.stringify(input));
    }

    new_line() {
        this.logStream.write('\n')
    }

    alert(input) {
        return this.logMessage('ALERT', input)
    }

    error(input) {
        return this.logMessage('ERROR', input)
    }

    warning(input) {
        return this.logMessage('WARNING', input)
    }

    informational(input) {
        return this.logMessage('INFORMATIONAL', input)
    }

    debug(input) {
        return this.logMessage('DEBUG', input)
    }
}

module.exports = LogLevel