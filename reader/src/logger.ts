// Logging system, ideally this would go off to Sentry, DataDog, or some other monitoring platform.

export function logInfo(info: any) {
    console.info(info);
}

export function logWarn(warn: any) {
    console.warn(warn);
}

export function logError(error: any) {
    console.error(error);
}
