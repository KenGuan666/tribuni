export function sanitizeText(text) {
    if (text === null || text === undefined) {
        return null;
    }

    return text.replace(/'/g, "''");
}

/*
    postgresInsertArrayFromJsArray formats an js array for insert query
    Example:
        UPDATE TABLE
        SET column = ${postgresInsertArrayFromJsArray(values)}
*/
export function postgresInsertArrayFromJsArray(array) {
    return `{${array.map((item) => `"${item}"`).join(",")}}`;
}
