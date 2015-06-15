/// <reference path="typescriptDefinitions/libs.d.ts" />
define(["require", "exports", 'lodash', 'Atmosphere'], function (require, exports, _, Atmosphere) {
    var RtiWebsocketLogger = (function () {
        function RtiWebsocketLogger(host, port) {
            this.host = host;
            this.port = port;
            this.connect();
        }
        RtiWebsocketLogger.prototype.error = function (message, context) {
            this.webSocketLog('error', message, context);
        };
        RtiWebsocketLogger.prototype.debug = function (message, context) {
            this.webSocketLog('debug', message, context);
        };
        RtiWebsocketLogger.prototype.warn = function (message, context) {
            this.webSocketLog('warn', message, context);
        };
        RtiWebsocketLogger.prototype.info = function (message, context) {
            this.webSocketLog('info', message, context);
        };
        RtiWebsocketLogger.prototype.webSocketLog = function (level, message, context) {
            var _this = this;
            var args = [];
            if (_.isObject(message) || _.isArray(message)) {
                _.forEach(message, function (arg) {
                    args.push(_this.formatError(arg));
                });
            }
            else {
                args.push(message);
            }
            var browserInfo = this.getBrowserInfo().split(' ');
            var enhancedContext = {};
            enhancedContext['browser_context'] = {};
            if (browserInfo[0] != '') {
                enhancedContext['browser_context']['name'] = browserInfo[0];
            }
            if (browserInfo[1] != '') {
                enhancedContext['browser_context']['version'] = browserInfo[1];
            }
            if (context != undefined) {
                enhancedContext['application_context'] = context;
            }
            var data = JSON.stringify({ level: level, message: args.join(), context: enhancedContext });
            this.request.push(data);
        };
        RtiWebsocketLogger.prototype.formatError = function (arg) {
            if (arg instanceof Error) {
                if (arg.stack) {
                    arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
                }
                else if (arg.sourceURL) {
                    arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                }
            }
            return arg;
        };
        // Stackoverflow to the rescue
        RtiWebsocketLogger.prototype.getBrowserInfo = function () {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null)
                    return 'Opera ' + tem[1];
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null)
                M.splice(1, 1, tem[1]);
            return M.join(' ');
        };
        RtiWebsocketLogger.prototype.connect = function () {
            this.request = Atmosphere.subscribe({
                url: 'http://' + this.host + ':' + this.port + '/atmosphere/rtilog',
                contentType: "application/json",
                transport: 'websocket',
                trackMessageLength: false,
                onOpen: function (resp) {
                },
                onError: function (e) { return console.log(e); },
                onMessage: function (m) { return console.log(m); },
                onClose: function () { return console.log("Close"); },
                onClientTimeout: function () { return console.log("Timeout"); },
                onTransportFailure: function () { return console.log("Failure"); },
                logLevel: 'debug'
            });
        };
        return RtiWebsocketLogger;
    })();
    return RtiWebsocketLogger;
});
//# sourceMappingURL=RtiWebsocketLogger.js.map