export function sanitizeText(text) {
    if (text === null || text === undefined) {
        return null;
    }

    return text.replace(/'/g, "''");
}

export function postgresArrayFromJsArray(array) {
    return `{${array.map((item) => `"${item}"`).join(",")}}`;
}
