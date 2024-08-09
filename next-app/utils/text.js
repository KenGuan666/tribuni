export function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export function htmlToPlaintext(html) {
    // Remove all HTML tags except for img
    let text = html.replace(/<(?!img\s*\/?)(?:.|[\n\r])*?>/gi, "");

    // Replace img tags with their alt text or a default
    text = text.replace(/<img\s+[^>]*alt\s*=\s*["']([^"']*)["'][^>]*>/gi, "$1");
    text = text.replace(
        /<img\s+[^>]*title\s*=\s*["']([^"']*)["'][^>]*>/gi,
        "$1",
    );
    text = text.replace(/<img\s*[^>]*>/gi, ":image:");

    // Decode HTML entities
    text = text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

    // Clean up extra whitespace
    return text.trim().replace(/\s+/g, " ");
}

export function trimLength(text, length) {
    if (text.length < length) {
        return text;
    }
    return text.slice(0, length) + "...";
}

export function sanitizeAIListOutput(text) {
    // remove surrounding brackets and quotation marks
    if ("()[]{}'\"".includes(text[0])) {
        return sanitizeAIListOutput(text.slice(1));
    }
    if ("()[]{}'\"".includes(text[text.length - 1])) {
        return sanitizeAIListOutput(text.slice(0, -1));
    }
    return text.split(/•|\\n|- /).filter((p) => p.trim().length);
}
