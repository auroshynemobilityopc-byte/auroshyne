import { motion } from "motion/react";

const faqs = [
    {
        q: "What services do you provide?",
        a: "We provide doorstep vehicle washing, foam wash, interior cleaning, detailing, and minor servicing.",
    },
    {
        q: "Which vehicles do you service?",
        a: "Two wheelers, four wheelers, and commercial cabs.",
    },
    {
        q: "Do you provide apartment or bulk booking?",
        a: "Yes, multiple vehicles can be booked under a single bulk order.",
    },
    {
        q: "How can I book a service?",
        a: "Select vehicle type, enter vehicle details, choose services, select slot, and complete online payment.",
    },
    {
        q: "What payment methods are available?",
        a: "UPI, debit/credit cards, and net banking.",
    },
    {
        q: "Can I cancel my booking?",
        a: "Yes, as per our cancellation policy.",
    },
    {
        q: "Do you provide doorstep service?",
        a: "Yes, all services are delivered at your location.",
    },
];

export default function FAQs() {
    return (
        <div className="p-6 md:py-20">
            <div className="max-w-5xl mx-auto">
                <span className="text-brand-blue font-bold uppercase tracking-wider text-sm">
                    Support
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-10">FAQs</h1>

                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-charcoal-800 border border-white/5 rounded-2xl p-5"
                        >
                            <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                            <p className="text-text-grey text-sm leading-relaxed">{item.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}