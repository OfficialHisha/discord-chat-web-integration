export enum LogLevel {
    NONE,
    DEBUG,
    INFO,
    ERROR,
    EXCEPTION
}

export const loglevelIdentifier = (loglevel: LogLevel) => {
    switch (loglevel) {
        case LogLevel.NONE:
            return ""
        case LogLevel.DEBUG:
            return "DEBUG"
        case LogLevel.INFO:
            return "INFO"
        case LogLevel.ERROR:
            return "ERROR"
        case LogLevel.EXCEPTION:
            return "EXCEPTION"
        default:
            return ""
    }
}