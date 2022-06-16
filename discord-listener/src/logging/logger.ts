import { LogLevel, loglevelIdentifier } from "./logLevel";

const useLoglevel = LogLevel.DEBUG

export const log = (message: string, loglevel: LogLevel = LogLevel.INFO, ...optionalParams: any[]) => {
    
    if(loglevel >= useLoglevel) {
        if(optionalParams.length > 0)
            console.log(`[${new Date().toLocaleTimeString()}][${loglevelIdentifier(loglevel)}]: ${message}`, optionalParams)
        else
            console.log(`[${new Date().toLocaleTimeString()}][${loglevelIdentifier(loglevel)}]: ${message}`)
    }
}