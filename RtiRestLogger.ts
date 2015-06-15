/// <reference path="typescriptDefinitions/libs.d.ts" />

import Logger = require('./RtiRestLogger')
import _ = require('lodash')


class RtiRestLogger implements Logger {

    constructor (private host: string, private port: number) {        
    }

    error(message:any, context?:any) {
        this.restLog('error', message, context);
    }

    debug(message:any, context?:any) {
        this.restLog('debug', message, context);
    }

    warn(message:any, context?:any) {
        this.restLog('warn', message, context);
    }

    info(message:any, context?:any) {
        this.restLog('info', message, context);
    }

    private restLog(level:string, message:any, context?:any) {
        var args = [];

        if(_.isObject(message) || _.isArray(message)) {
            _.forEach(message, (arg) => {
                args.push(this.formatError(arg));
                });
        } else {
            args.push(message)
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
        var data = JSON.stringify({level: level, message: args.join(), context: enhancedContext});
        this.makeHttpRequest(data);
    }

    private makeHttpRequest(data) {
    	var xhr = new XMLHttpRequest();
    	var url = 'http://' + this.host + ':' + this.port +'/logging';

    	if(xhr) {
    		xhr.open("POST", url);
    		xhr.setRequestHeader("Content-Type", "application/json");
    		xhr.send(data);
    	}
    }

    private formatError(arg) {
        if (arg instanceof Error) {
            if (arg.stack) {
                arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                    ? 'Error: ' + arg.message + '\n' + arg.stack
                    : arg.stack;
            } else if (arg.sourceURL) {
                arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
        }
        return arg;
    }

    // Stackoverflow to the rescue
    private getBrowserInfo() {
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\bOPR\/(\d+)/);
            if(tem!= null) return 'Opera '+tem[1];
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

}

export = RtiRestLogger
