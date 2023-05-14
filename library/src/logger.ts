// Logging system, ideally this would go off to Sentry, DataDog, or some other monitoring platform.

import { terminal } from "terminal-kit";

const LOG_LEVEL = (process.env.LOG_LEVEL ?? "INFO").toUpperCase();

const LOG_LEVELS = ["ERROR", "WARN", "INFO"];

function shouldLog(level: string) {
    const index = LOG_LEVELS.indexOf(LOG_LEVEL);

    return index >= LOG_LEVELS.indexOf(level);
}

export function logInfo(info: any, force?: boolean) {
    if (force || shouldLog("INFO")) {
        terminal.blue("[Info]: ");
        console.info(info);
    }
}

export function logWarn(warn: any, force?: boolean) {
    if (force || shouldLog("WARN")) {
        terminal.yellow("[Warn]: ");
        console.warn(warn);
    }
}

export function logError(error: any, force?: boolean) {
    if (force || shouldLog("ERROR")) {
        terminal.red("[Error]: ");
        console.error(error);
    }
}
