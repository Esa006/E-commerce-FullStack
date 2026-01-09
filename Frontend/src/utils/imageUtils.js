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

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
};
