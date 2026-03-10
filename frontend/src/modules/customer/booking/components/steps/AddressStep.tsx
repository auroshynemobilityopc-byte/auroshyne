import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, ChevronUp, CheckCircle2, Home, Briefcase, Search, Navigation, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { StepProps } from "../../types";
import { useSavedData } from "../../../profile/hooks";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }: { position: L.LatLng | null; setPosition: (p: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : <Marker position={position}></Marker>;
}

function MapUpdater({ center }: { center: L.LatLng | null }) {
    const map = useMap();
    if (center) {
        map.flyTo(center, 15);
    }
    return null;
}

export default function AddressStep({ booking, updateBooking }: StepProps) {
    const { data: savedResult } = useSavedData();
    const savedAddresses: any[] = savedResult?.data?.savedAddresses ?? [];

    const [showSaved, setShowSaved] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const applyAddress = (a: any) => {
        setSelectedId(a._id);
        updateBooking({
            address: {
                house: a.apartmentName || "",
                street: a.address || "",
                mobile: a.mobile || booking.address.mobile,
                mapLocation: a.mapLocation || null
            },
        });
    };

    const labelIcons: Record<string, any> = { Home, Office: Briefcase, Work: Briefcase };

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (e) {
            console.error("Geocoding failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    const selectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        updateBooking({
            address: {
                ...booking.address,
                street: result.display_name,
                mapLocation: { lat, lng }
            }
        });
        setSearchResults([]);
        setSearchQuery("");
    };

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                updateBooking({
                    address: {
                        ...booking.address,
                        mapLocation: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }
                });
            }, () => {
                alert("Unable to retrieve your location. Please check your browser permissions.");
            });
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Location Details</h2>

            {/* ── Saved Addresses Quick-Pick ── */}
            {savedAddresses.length > 0 && (
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setShowSaved(v => !v)}
                        className="flex items-center justify-between w-full text-sm font-semibold text-brand-blue"
                    >
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            Use a Saved Address
                        </span>
                        {showSaved ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {showSaved && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-1">
                                    {savedAddresses.map((a: any) => {
                                        const Icon = labelIcons[a.label] || MapPin;
                                        const isSelected = selectedId === a._id;
                                        return (
                                            <button
                                                key={a._id}
                                                type="button"
                                                onClick={() => applyAddress(a)}
                                                className={cn(
                                                    "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all",
                                                    isSelected
                                                        ? "border-brand-blue bg-brand-blue/10"
                                                        : "border-white/10 bg-charcoal-800 hover:border-brand-blue/40"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                    isSelected ? "bg-brand-blue/20" : "bg-white/5"
                                                )}>
                                                    <Icon className={cn("w-4 h-4", isSelected ? "text-brand-blue" : "text-zinc-400")} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-white">{a.label}</p>
                                                    <p className="text-xs text-zinc-400 truncate">{a.address}</p>
                                                    {a.apartmentName && <p className="text-xs text-zinc-500 truncate">{a.apartmentName}</p>}
                                                </div>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <div className="flex-1 h-px bg-white/10" />
                        or fill manually
                        <div className="flex-1 h-px bg-white/10" />
                    </div>
                </div>
            )}

            {/* ── Manual Form ── */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">House / Flat / Apartment Name <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={booking.address.house}
                        onChange={(e) => {
                            setSelectedId(null);
                            updateBooking({ address: { ...booking.address, house: e.target.value } });
                        }}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">Street / Landmark <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={booking.address.street}
                        onChange={(e) => {
                            setSelectedId(null);
                            updateBooking({ address: { ...booking.address, street: e.target.value } });
                        }}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-grey">Mobile Number <span className="text-red-400">*</span></label>
                    <input
                        type="tel"
                        value={booking.address.mobile}
                        onChange={(e) => updateBooking({ address: { ...booking.address, mobile: e.target.value } })}
                        className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                    />
                </div>

                <div className="pt-4 space-y-3">
                    {booking.isBulkBooking && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                        >
                            <label className="text-sm text-text-grey">Society / Apartment Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Prestige High Fields"
                                value={booking.address.house}
                                onChange={(e) => updateBooking({ address: { ...booking.address, house: e.target.value } })}
                                className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-4 text-white focus:border-brand-blue focus:outline-none"
                            />
                            <p className="text-xs text-brand-blue bg-brand-blue/10 p-2 rounded-lg">
                                Bulk booking active: {booking.vehicles.length} vehicle(s) added.
                            </p>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-4 mt-8">
                    <label className="text-sm font-semibold text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-brand-blue" />
                            Pin Location on Map
                            {booking.address.mapLocation && <CheckCircle2 className="inline w-4 h-4 text-brand-blue ml-1" />}
                        </span>

                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-xs font-semibold"
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            Use Current
                        </button>
                    </label>

                    {/* Search Location */}
                    <div className="relative z-10">
                        <div className="flex bg-charcoal-800 border border-white/10 rounded-xl overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/50">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search location manually..."
                                className="w-full bg-transparent p-3 text-sm text-white focus:outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
                            >
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-zinc-400" /> : <Search className="w-4 h-4 text-zinc-400" />}
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl max-h-48 overflow-y-auto shadow-xl z-50 flex flex-col"
                                >
                                    {searchResults.map((result, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => selectSearchResult(result)}
                                            className="text-left p-3 hover:bg-zinc-800 text-xs text-zinc-300 border-b border-zinc-800/50 last:border-b-0 transition-colors"
                                        >
                                            {result.display_name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-[250px] w-full rounded-2xl overflow-hidden border border-white/10 z-0 relative shadow-inner">
                        <MapContainer
                            center={booking.address.mapLocation ? [booking.address.mapLocation.lat, booking.address.mapLocation.lng] : [17.3850, 78.4867]}
                            zoom={13}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", zIndex: 0 }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapUpdater
                                center={booking.address.mapLocation ? L.latLng(booking.address.mapLocation.lat, booking.address.mapLocation.lng) : null}
                            />
                            <LocationMarker
                                position={booking.address.mapLocation ? L.latLng(booking.address.mapLocation.lat, booking.address.mapLocation.lng) : null}
                                setPosition={(p) => {
                                    updateBooking({ address: { ...booking.address, mapLocation: { lat: p.lat, lng: p.lng } } });
                                }}
                            />
                        </MapContainer>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">Tap anywhere on the map to manually drop the pin.</p>
                </div>
            </div>
        </div>
    );
}
