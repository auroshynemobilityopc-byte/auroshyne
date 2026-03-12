import { useState } from "react";
import { motion } from "motion/react";
import { customerApi } from "../../../app/customer/customerApi";
import toast from "react-hot-toast";

export default function ContactUS() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error("Please fill in subject and message");
            return;
        }
        try {
            setSending(true);
            await customerApi.post("/mail/support", { subject, message });
            toast.success("Your message has been sent! We'll get back to you soon.");
            setSubject("");
            setMessage("");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to send. Please try again.");
        } finally {
            setSending(false);
        }
    };

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
                                Auro-Shyne Mobility (OPC) Private Limited,
                                <br />
                                20-91-18 B, Relliveedhi Kotha,
                                <br />
                                Visakhapatnam – 530001, Andhra Pradesh
                            </p>
                        </div>

                        <div>
                            <p className="text-text-grey text-sm">Corporate Office</p>
                            <p className="text-sm leading-relaxed">
                                Auro-Shyne Mobility (OPC) Private Limited,
                                <br />
                                D.No 1-11-33, Plot No.143, Sector-8,
                                <br />
                                MVP Colony, Visakhapatnam – 530017
                            </p>
                        </div>
                    </div>

                    {/* Support Form + WhatsApp CTA */}
                    <div className="flex flex-col gap-4">
                        {/* Email Support Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 flex flex-col gap-4"
                        >
                            <h3 className="font-bold text-lg">Send Us a Message</h3>
                            <p className="text-text-grey text-sm">
                                Have a question or need support? Write to us directly.
                            </p>
                            <form onSubmit={handleSend} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Issue with my booking"
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={4}
                                        placeholder="Tell us how we can help you..."
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-brand-blue hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {sending ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </motion.div>

                        {/* WhatsApp CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-brand-blue to-brand-accent rounded-2xl p-6 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">
                                    Need Instant Help?
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Chat with our support team on WhatsApp for quick booking and
                                    bulk enquiries.
                                </p>
                            </div>

                            <a
                                href="https://wa.me/919346748605"
                                target="_blank"
                                className="mt-4 inline-block bg-white text-brand-blue px-6 py-3 rounded-xl font-bold text-center hover:bg-gray-100"
                            >
                                Chat on WhatsApp
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}