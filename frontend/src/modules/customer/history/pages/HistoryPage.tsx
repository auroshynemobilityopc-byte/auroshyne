import { Clock, MapPin, UserCheck, WifiOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { useMyBookings, useServices, useAddons } from "../../booking/hooks";
import { useState, useMemo } from "react";
import { HistoryDetailsSheet } from "../components/HistoryDetailsSheet";

export default function HistoryPage() {
  const { data: result, isLoading, isError } = useMyBookings();
  const { data: servicesResult } = useServices();
  const { data: addonsResult } = useAddons();

  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookings = result?.data || [];
  const SERVICES = servicesResult?.data || [];
  const ADDONS = addonsResult?.data || [];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b: any) => {
      if (activeTab === "PENDING") {
        return ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(b.status);
      }
      return ["COMPLETED", "CANCELLED"].includes(b.status);
    });
  }, [bookings, activeTab]);

  if (isLoading) return <div className="p-6 pb-24 text-center mt-12">Loading history...</div>;
  if (isError) return (
    <div className="p-6 pb-24 flex flex-col items-center justify-center mt-12 gap-3">
      <WifiOff className="w-10 h-10 text-zinc-500" />
      <p className="text-zinc-400 text-sm text-center">
        You're offline and no cached booking history was found.<br />
        Connect to the internet and open this page once to enable offline access.
      </p>
    </div>
  );

  return (
    <div className="p-6 pb-24 md:max-w-7xl md:mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>

      <div className="mb-6 overflow-hidden rounded-lg bg-charcoal-800 p-1 flex">
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "PENDING" ? "bg-brand-blue text-white" : "text-text-grey hover:text-white"
          )}
          onClick={() => setActiveTab("PENDING")}
        >
          Active / Progress
        </button>
        <button
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "COMPLETED" ? "bg-brand-blue text-white" : "text-text-grey hover:text-white"
          )}
          onClick={() => setActiveTab("COMPLETED")}
        >
          Completed / Cancelled
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center text-text-grey mt-12">No bookings found in this status.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking: any) => {
            const service = SERVICES.find((s: any) => s._id === booking.vehicles?.[0]?.serviceId)?.name || "Wash Service";
            const isCompleted = booking.status === 'COMPLETED';
            const isCancelled = booking.status === 'CANCELLED';
            const tech = booking.technicianId;

            return (
              <div key={booking._id} className="bg-charcoal-800 rounded-2xl p-5 border border-white/5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-text-grey mb-1 block">#{booking.bookingId}</span>
                    <h3 className="font-bold text-lg leading-tight">{service} {booking.vehicles?.length > 1 ? `(+${booking.vehicles.length - 1})` : ''}</h3>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded bg-brand-blue/20 text-xs font-bold uppercase tracking-wider",
                    isCompleted ? "bg-green-500/20 text-green-400" :
                      isCancelled ? "bg-red-500/20 text-red-400" :
                        "bg-brand-blue/20 text-brand-blue"
                  )}>
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-text-grey">
                    <Clock className="w-4 h-4" />
                    <span>{booking.date ? format(new Date(booking.date), 'dd MMM yyyy') : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-grey">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{booking.customer?.address || 'Saved Address'}</span>
                  </div>

                  {tech && (
                    <div className="flex items-center gap-2 text-sm text-text-grey bg-brand-blue/10 p-2 rounded-lg mt-2">
                      <UserCheck className="w-4 h-4 text-brand-blue" />
                      <div>
                        <p className="text-xs text-brand-blue font-medium">Assigned Tech</p>
                        <p className="text-white truncate">{tech.name} • {tech.mobile}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                  <span className="font-bold text-lg">₹{booking.totalAmount}</span>
                  <button onClick={() => setSelectedBooking(booking)} className="text-sm font-medium px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-brand-blue hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <HistoryDetailsSheet
        booking={selectedBooking}
        services={SERVICES}
        addons={ADDONS}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onRefresh={() => setSelectedBooking(null)}
      />
    </div>
  );
}
