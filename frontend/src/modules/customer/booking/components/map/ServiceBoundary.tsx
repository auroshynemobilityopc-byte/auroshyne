import { useEffect, useMemo } from "react";
import { useMap, Polygon } from "react-leaflet";
import * as turf from "@turf/turf";
import L from "leaflet";
import { VIZAG_SERVICE_BOUNDARY } from "../../lib/geo";

interface ServiceBoundaryProps {
    /**
     * Optional custom boundary coordinates.
     * Use [lat, lng] format (Leaflet style).
     */
    customBoundary?: [number, number][];
    fitBounds?: boolean;
}

// Refined Visakhapatnam Service Area Boundaries (GVMC Area ~681 sq km)
// Moved to ../../lib/geo.ts for reusability.

export default function ServiceBoundary({ 
    customBoundary, 
    fitBounds = true 
}: ServiceBoundaryProps) {
    const map = useMap();
    
    // Use custom coordinates if provided, otherwise default to Vizag boundary
    const polygonCoords = useMemo(() => customBoundary || VIZAG_SERVICE_BOUNDARY, [customBoundary]);

    // Turf expects [lng, lat]
    const turfCoords = useMemo(() => {
        return [polygonCoords.map(coord => [coord[1], coord[0]])];
    }, [polygonCoords]);

    // Calculate area using Turf.js
    const areaData = useMemo(() => {
        try {
            const polygon = turf.polygon(turfCoords);
            const areaSqMeters = turf.area(polygon);
            const areaSqKm = areaSqMeters / 1_000_000;
            const areaSqFt = areaSqMeters * 10.7639104167;

            return {
                sqKm: areaSqKm,
                sqFt: areaSqFt
            };
        } catch (error) {
            console.error("Area calculation error:", error);
            return null;
        }
    }, [turfCoords]);

    // Format numbers with commas and rounding
    const formatNumber = (num: number) => {
        return Math.round(num).toLocaleString("en-IN");
    };

    // Auto-fit bounds on mount or when coordinates change
    useEffect(() => {
        if (fitBounds && polygonCoords.length > 0) {
            const bounds = L.latLngBounds(polygonCoords);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, polygonCoords, fitBounds]);

    return (
        <>
            <Polygon
                positions={polygonCoords}
                interactive={false}
                pathOptions={{
                    fillColor: "#0EA5E9", // Brand blue / Sky blue
                    fillOpacity: 0.15,
                    color: "#0284C7", // Darker border
                    weight: 2,
                    dashArray: "5, 10" // Dashed border
                }}
            />

            {/* Fixed Area Readout */}
            {areaData && (
                <div className="absolute top-3 right-3 z-[400] pointer-events-none">
                    <div 
                        className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/20 pointer-events-auto"
                    >
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Service Coverage</h4>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-gray-900 leading-tight">{formatNumber(areaData.sqKm)} sq km</span>
                            <span className="text-[10px] text-gray-500 font-medium">{formatNumber(areaData.sqFt)} sq ft</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
