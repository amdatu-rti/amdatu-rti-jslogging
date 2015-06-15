/// <reference path="bower_components/amdatu-rti-jslogging/Logger.d.ts" />

import logger = require('RtiRestLogger')

class ExampleApp {
    testLogging() {
        console.log("Starting");
        var log = new logger("localhost", 8181);
        
            log.debug("debug message");
            log.info("info message");
            log.warn("warn message");
            log.error("error message");
            log.debug("debug message with context", {"foo":"bar", "bar":"baz"});            
    }
}

export = ExampleApp