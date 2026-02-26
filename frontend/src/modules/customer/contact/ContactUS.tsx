import { motion } from "motion/react";

export default function ContactUS() {
    return (
        <div className="p-6 md:py-20">
            <div className="max-w-5xl mx-auto">
                <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
                    Get in Touch
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-10">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-xl">AURO-SHYNE MOBILITY</h3>

                        <div>
                            <p className="text-text-grey text-sm">Phone</p>
                            <p className="font-semibold">+91 9346748605</p>
                        </div>

                        <div>
                            <p className="text-text-grey text-sm">Email</p>
                            <p className="font-semibold">auroshynemobility@gmail.com</p>
                        </div>

                        <div>
                            <p className="text-text-grey text-sm">Working Hours</p>
                            <p className="font-semibold">Monday – Sunday</p>
                            <p className="text-text-grey text-sm">9:00 AM – 7:00 PM</p>
                        </div>

                        <div>
                            <p className="text-text-grey text-sm">Registered Office</p>
                            <p className="text-sm leading-relaxed">
                                D.No.1-111-33, Plot No.143, Sector-8,
                                <br />
                                MVP Colony, Visakhapatnam,
                                <br />
                                Visakhapatnam – 530017
                            </p>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-brand-blue to-brand-accent rounded-2xl p-6 flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-2">
                                Need Help With Booking?
                            </h3>
                            <p className="text-white/80 text-sm">
                                Chat with our support team on WhatsApp for quick booking and
                                bulk enquiries.
                            </p>
                        </div>

                        <a
                            href="https://wa.me/919346748605"
                            target="_blank"
                            className="mt-6 inline-block bg-white text-brand-blue px-6 py-3 rounded-xl font-bold text-center hover:bg-gray-100"
                        >
                            Chat on WhatsApp
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}