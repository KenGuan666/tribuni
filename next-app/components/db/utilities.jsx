export function sanitizeText(text) {
    if (text === null || text === undefined) {
        return null;
    }

    return text.replace(/'/g, "''");
}

/*
    postgresLookupArrayFromJsArray formats an js array for lookup query
    Example:
        SELECT *
        FROM TABLE
        WHERE id IN ${postgresLookupArrayFromJsArray(ids)}
*/
export function postgresLookupArrayFromJsArray(array) {
    return `(${array.map((item) => `'${item}'`).join(",")})`;
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
