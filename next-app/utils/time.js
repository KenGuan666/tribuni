export function relativeTimeLabel(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp * 1000); // Convert seconds to milliseconds

    const timeDifference = targetDate - currentDate;
    if (timeDifference < 0) {
        return "Completed";
    }

    const seconds = Math.abs(Math.floor(timeDifference / 1000));
    const minutes = Math.abs(Math.floor(seconds / 60));
    const hours = Math.abs(Math.floor(minutes / 60));
    const days = Math.abs(Math.floor(hours / 24));
    const weeks = Math.abs(Math.floor(days / 7));
    const months = Math.abs(Math.floor(days / 30));
    const years = Math.abs(Math.floor(days / 365));

    if (years > 0) return `in ${years}y`;
    if (months > 0) return `in ${months}mo`;
    if (weeks > 0) return `in ${weeks}w`;
    if (days > 0) return `in ${days}d`;
    if (hours > 0) return `in ${hours}h`;
    if (minutes > 0) return `in ${minutes}min`;

    return `in ${seconds}s`;
}

export function isInThePast(timestamp) {
    return new Date() > new Date(timestamp * 1000);
}

export function secondsFromNow(timestamp) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return timestamp - nowInSeconds;
}

/*
    isNearUTCSecondStampNow: whether utcSecondStamp is within timeDifferenceCap seconds of the UTC second stamp now.
    "Second stamp" is an integer between 0 and 86399 which specifies how many seconds have passed since midnight
*/
export function isNearUTCSecondStampNow(secondStampUTC, timeDifferenceCap) {
    const currentDate = new Date();
    const currentSecondStampUTC =
        currentDate.getUTCHours() * 3600 +
        currentDate.getUTCMinutes() * 60 +
        currentDate.getUTCSeconds();

    return Math.abs(currentSecondStampUTC - secondStampUTC) < timeDifferenceCap;
}
