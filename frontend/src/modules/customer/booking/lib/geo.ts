import * as turf from "@turf/turf";

/**
 * Visakhapatnam Service Area Boundaries (GVMC Area ~681 sq km)
 * Order: [lat, lng] for Leaflet
 */
export const VIZAG_SERVICE_BOUNDARY: [number, number][] = [
    [17.9358, 83.4231], // North: Tagarapuvalasa
    [17.8864, 83.4503], // Bheemili
    [17.7865, 83.3860], // East: Rushikonda
    [17.7126, 83.3333], // Vizag City (Coastal)
    [17.6745, 83.2811], // Port Area
    [17.6534, 83.2201], // Gajuwaka Junction
    [17.6350, 83.1000], // South West boundary
    [17.7600, 83.1000], // West boundary
    [17.8200, 83.1600], // Pendurthi area
    [17.8890, 83.2571], // Anandapuram 
    [17.9358, 83.4231], // Close the polygon
];

/**
 * Checks if a given [lat, lng] point is within the service area.
 */
export function isPointInServiceArea(lat: number, lng: number): boolean {
    try {
        const point = turf.point([lng, lat]);
        // Turf expects [lng, lat] for polygon coords too
        const polygon = turf.polygon([VIZAG_SERVICE_BOUNDARY.map(c => [c[1], c[0]])]);
        return turf.booleanPointInPolygon(point, polygon);
    } catch (e) {
        console.error("Geo check error:", e);
        return false;
    }
}
