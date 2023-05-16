// Logging system, ideally this would go off to Sentry, DataDog, or some other monitoring platform.

export function logInfo(info: any, force?: boolean) {
    console.info(info);
}

export function logWarn(warn: any, force?: boolean) {
    console.warn(warn);
}

export function logError(error: any, force?: boolean) {
    console.error(error);
}
