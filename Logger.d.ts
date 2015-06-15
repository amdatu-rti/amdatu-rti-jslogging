declare module Rti {
    export interface Logger {
        new(host : string, port : number) : Logger;
        error(message:any, context?:any);
        warn(message:any, context?:any);
        info(message:any, context?:any);
        debug(message:any, context?:any);
    }
}

declare var websocketLogger : Rti.Logger;
declare var restLogger: Rti.Logger;

declare module "RtiWebsocketLogger" {
    export = websocketLogger
}

declare module "RtiRestLogger" {
	export = restLogger
}