/**
 * Safely parses image data from the backend.
 * Handles:
 * - Arrays (returns as is)
 * - JSON strings (parses them)
 * - Double-stringified JSON (parses recursively)
 * - Single strings (wraps in array)
 * - Null/Undefined (returns empty array)
 * 
 * @param {any} data - The image data to parse
 * @returns {Array} An array of image paths/URLs
 */
export const parseImages = (data) => {
    try {
        if (!data) return [];

        // If it's already an array, return it
        if (Array.isArray(data)) return data;

        // If it's a string, attempt to parse it
        if (typeof data === "string") {
            // Check if it looks like a JSON array
            if (data.trim().startsWith('[') && data.trim().endsWith(']')) {
                try {
                    let parsed = JSON.parse(data);
                    // Handle double-stringified data
                    if (typeof parsed === "string") parsed = JSON.parse(parsed);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    // Fallback execution if JSON parse fails but it looks like an array
                    // Regex to strip [ ] and " 
                    return data.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(s => s !== "");
                }
            }

            // It's a plain string, likely a single image path
            return [data];
        }

        return [data];
    } catch (e) {
        console.error("Error parsing images:", e);
        return [];
    }
};

// Robust Data URI Placeholder (Works offline)
export const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect fill='%23f8f9fa' width='300' height='400'/%3E%3Ctext fill='%23adb5bd' font-family='sans-serif' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENO IMAGE%3C/text%3E%3C/svg%3E";

export const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMG;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
};
