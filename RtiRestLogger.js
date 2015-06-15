/// <reference path="typescriptDefinitions/libs.d.ts" />
define(["require", "exports", 'lodash'], function (require, exports, _) {
    var RtiRestLogger = (function () {
        function RtiRestLogger(host, port) {
            this.host = host;
            this.port = port;
        }
        RtiRestLogger.prototype.error = function (message, context) {
            this.restLog('error', message, context);
        };
        RtiRestLogger.prototype.debug = function (message, context) {
            this.restLog('debug', message, context);
        };
        RtiRestLogger.prototype.warn = function (message, context) {
            this.restLog('warn', message, context);
        };
        RtiRestLogger.prototype.info = function (message, context) {
            this.restLog('info', message, context);
        };
        RtiRestLogger.prototype.restLog = function (level, message, context) {
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
            this.makeHttpRequest(data);
        };
        RtiRestLogger.prototype.makeHttpRequest = function (data) {
            var xhr = new XMLHttpRequest();
            var url = 'http://' + this.host + ':' + this.port + '/logging';
            if (xhr) {
                xhr.open("POST", url);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(data);
            }
        };
        RtiRestLogger.prototype.formatError = function (arg) {
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
        RtiRestLogger.prototype.getBrowserInfo = function () {
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
        return RtiRestLogger;
    })();
    return RtiRestLogger;
});
//# sourceMappingURL=RtiRestLogger.js.map