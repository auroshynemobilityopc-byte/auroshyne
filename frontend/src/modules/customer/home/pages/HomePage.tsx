import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Clock, Sparkles, CheckCircle2, Play } from "lucide-react";
import { useServices } from "../../booking/hooks";

export default function HomePage() {
    const { data: servicesResult } = useServices();
    const ALL_SERVICES = servicesResult?.data || [];

    // Deduplicate by name and find the starting price
    const uniqueServicesMap = new Map();
    ALL_SERVICES.forEach((s: any) => {
        if (!uniqueServicesMap.has(s.name)) {
            uniqueServicesMap.set(s.name, { ...s });
        } else {
            const existing = uniqueServicesMap.get(s.name);
            if (s.price < existing.price) {
                existing.price = s.price;
            }
        }
    });
    const SERVICES = Array.from(uniqueServicesMap.values());

    return (
        <div className="pb-20 md:pb-0">
            {/* ================= HERO SECTION ================= */}
            <section className="relative h-[400px] md:h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/20 to-charcoal-900 z-10 md:bg-gradient-to-r md:from-charcoal-900 md:via-charcoal-900/80 md:to-transparent" />
                <img
                    src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop"
                    alt="Car Detailing"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-60"
                />

                <div className="relative z-20 h-full flex flex-col justify-end p-6 pb-12 md:justify-center md:max-w-7xl md:mx-auto md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="md:max-w-2xl"
                    >
                        <div className="hidden md:flex items-center gap-2 mb-6">
                            <span className="px-4 py-1.5 bg-brand-blue/20 border border-brand-blue/30 rounded-full text-brand-blue text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Premium Care
                            </span>
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white text-sm font-medium flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9/5 Rated
                            </span>
                        </div>

                        <span className="md:hidden inline-block px-3 py-1 bg-brand-blue/20 border border-brand-blue/30 rounded-full text-brand-blue text-xs font-bold uppercase tracking-wider mb-3">
                            Premium Care
                        </span>

                        <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
                            We Bring the <span className="text-brand-blue">Shine</span><br />
                            to Your Drive
                        </h1>

                        <p className="text-text-grey mb-6 md:mb-8 max-w-[80%] md:max-w-lg md:text-lg leading-relaxed">
                            Professional doorstep vehicle cleaning services. Book a slot in seconds and get showroom finish at your home.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link
                                to="/bookings"
                                className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold shadow-lg shadow-brand-blue/25 hover:bg-brand-accent transition-all hover:scale-105"
                            >
                                Book Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="hidden md:inline-flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm">
                                <Play className="w-5 h-5 fill-current" /> Watch Process
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= FEATURES GRID ================= */}
            <section className="p-6 md:py-20 md:px-0 -mt-8 md:mt-0 relative z-30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
                    {[
                        { icon: Clock, title: "Slot-based Booking", desc: "You pick the time, we arrive on time." },
                        { icon: Shield, title: "Trusted Experts", desc: "Background verified & trained professionals." },
                        { icon: Sparkles, title: "Premium Products", desc: "Eco-friendly & paint-safe chemicals." },
                        { icon: Star, title: "Top Rated Service", desc: "Loved by 500+ happy customers." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-charcoal-800/80 backdrop-blur-sm border border-white/5 p-4 md:p-8 rounded-2xl hover:border-brand-blue/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-charcoal-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-blue transition-colors">
                                <feature.icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-sm md:text-lg mb-2">{feature.title}</h3>
                            <p className="text-xs md:text-sm text-text-grey leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= SERVICES PREVIEW ================= */}
            <section className="p-6 pt-2 md:py-20 bg-charcoal-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-6 md:mb-12">
                        <div>
                            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
                            <h2 className="text-2xl md:text-4xl font-bold">Choose Your Package</h2>
                        </div>
                        <Link to="/bookings" className="text-brand-blue text-sm md:text-base font-medium hover:underline flex items-center gap-1">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                        {SERVICES.slice(0, 3).map((service: any, i: number) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-charcoal-800 rounded-2xl p-1 md:p-0 overflow-hidden flex md:flex-col border border-white/5 hover:border-brand-blue/30 transition-all group"
                            >
                                <div className="w-24 h-24 md:w-full md:h-64 bg-charcoal-900 rounded-xl md:rounded-none flex-shrink-0 relative overflow-hidden">
                                    <img
                                        src={`https://source.unsplash.com/random/800x600?car-wash&sig=${i}`}
                                        alt={service.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=600&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent opacity-60" />
                                </div>
                                <div className="p-3 md:p-6 flex flex-col justify-center flex-1">
                                    <h3 className="font-bold text-white mb-1 md:text-xl md:mb-3">{service.name}</h3>
                                    <p className="text-xs md:text-sm text-text-grey line-clamp-2 mb-2 md:mb-6">{service.description}</p>

                                    <div className="hidden md:block space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-text-grey">
                                            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                            <span>{service.benefit}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-grey">
                                            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                            <span>Recommended: {service.recommended}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-2 md:pt-4 md:border-t md:border-white/5">
                                        <div>
                                            <span className="text-xs text-text-grey block md:hidden">Starts from</span>
                                            <span className="text-brand-blue font-bold text-sm md:text-2xl">₹{service.price}<span className="text-sm text-text-grey font-normal ml-1 hidden md:inline">/ Starting</span></span>
                                        </div>
                                        <Link to="/bookings" className="p-1.5 md:px-6 md:py-2 bg-white/5 md:bg-brand-blue rounded-lg md:rounded-xl hover:bg-brand-blue md:hover:bg-brand-accent hover:text-white transition-colors flex items-center gap-2">
                                            <span className="hidden md:inline font-bold text-white">Book Now</span>
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= DESKTOP ONLY: WHY CHOOSE US ================= */}
            <section className="hidden md:block py-20">
                <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2 block">Why Choose Auro-Shyne</span>
                        <h2 className="text-4xl font-bold mb-6">Experience the Future of <br />Vehicle Care</h2>
                        <p className="text-text-grey text-lg mb-8 leading-relaxed">
                            We combine technology with expertise to deliver a seamless car cleaning experience. No more waiting in queues or dealing with unprofessional service.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Eco-Friendly", desc: "We use water-saving techniques and biodegradable products." },
                                { title: "Trained Professionals", desc: "Our staff is rigorously trained and background verified." },
                                { title: "100% Satisfaction", desc: "If you're not happy, we'll re-do it for free." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-text-grey">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-brand-blue/20 rounded-3xl blur-2xl" />
                        <img
                            src="https://images.unsplash.com/photo-1605164661537-84af99c9632e?q=80&w=1200&auto=format&fit=crop"
                            alt="Detailing Process"
                            className="relative rounded-3xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="p-6 pt-0 md:py-20">
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-brand-blue to-brand-accent rounded-3xl p-6 md:p-16 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Apartment or Society Booking?</h2>
                        <p className="text-white/80 text-sm md:text-xl mb-4 md:mb-0">Get special bulk discounts for your society. We organize dedicated camps for apartments.</p>
                    </div>
                    <div className="relative z-10">
                        <Link to="/bookings" className="inline-block bg-white text-brand-blue px-6 py-2 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-lg shadow-xl hover:bg-gray-100 transition-colors">
                            Book Bulk Slot
                        </Link>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-96 md:h-96 bg-white/10 rounded-full -mr-10 -mt-10 md:-mr-20 md:-mt-20 blur-2xl md:blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 md:w-64 md:h-64 bg-black/10 rounded-full -ml-10 -mb-10 md:-ml-20 md:-mb-20 blur-xl md:blur-3xl" />
                </div>
            </section>

            {/* ================= WHATSAPP FLOATING BUTTON ================= */}
            <a
                href="https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20to%20book%20a%20car%20wash%20service!"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-50 group"
            >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

                {/* Button */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20bc5a] rounded-full shadow-2xl shadow-[#25D366]/40 flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95">
                    {/* WhatsApp SVG icon */}
                    <svg
                        className="w-7 h-7 md:w-8 md:h-8 fill-white"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16.002 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.364.638 4.573 1.748 6.484L2.667 29.333l7.054-1.718A13.27 13.27 0 0 0 16.002 29.333C23.364 29.333 29.333 23.364 29.333 16S23.364 2.667 16.002 2.667zm0 2.4C22.04 5.067 27.2 10.135 27.2 16c0 5.865-5.16 10.933-11.198 10.933a10.87 10.87 0 0 1-5.52-1.497l-.396-.237-4.185 1.018.998-4.077-.258-.41A10.871 10.871 0 0 1 5.067 16C5.067 10.135 10.138 5.067 16.002 5.067zm-3.647 5.6c-.213 0-.548.08-.836.4-.288.32-1.1 1.074-1.1 2.619s1.127 3.038 1.284 3.248c.157.21 2.194 3.51 5.397 4.79.754.325 1.343.52 1.802.666.757.24 1.447.207 1.99.126.607-.09 1.87-.764 2.134-1.502.264-.738.264-1.37.185-1.502-.078-.13-.288-.21-.603-.368s-1.87-.921-2.159-1.025c-.288-.104-.498-.157-.707.157-.21.314-.81 1.025-1 1.235-.184.21-.368.236-.682.079-.316-.157-1.333-.491-2.539-1.569-.94-.837-1.574-1.872-1.758-2.186-.185-.314-.02-.484.139-.64.142-.14.316-.366.473-.549.158-.183.21-.314.315-.523.105-.21.053-.393-.026-.549-.079-.157-.707-1.7-.968-2.33-.256-.612-.513-.527-.707-.537l-.6-.01a1.15 1.15 0 0 0-.835.392z" />
                    </svg>
                </div>

                {/* Tooltip */}
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg border border-white/10">
                    Chat with us
                </span>
            </a>
        </div>
    );
}
