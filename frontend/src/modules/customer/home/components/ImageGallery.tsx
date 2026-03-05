import { motion } from "motion/react";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    if (!images || images.length === 0) return null;

    // Duplicate images for infinite scrolling effect
    const scrollImages = [...images, ...images, ...images];

    return (
        <section className="py-12 md:py-20 bg-charcoal-900 overflow-hidden relative border-t border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12">
                <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2 block text-center md:text-left">Gallery</span>
                <h2 className="text-2xl md:text-4xl font-bold text-center md:text-left text-white">Our Recent Work</h2>
            </div>

            {/* Scrolling Carousel */}
            <div className="relative w-full flex items-center overflow-hidden">
                {/* Left Fade */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-charcoal-900 to-transparent z-10" />

                <motion.div
                    className="flex gap-4 md:gap-8 px-4"
                    animate={{
                        x: [0, -1035],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {scrollImages.map((src, idx) => {
                        // Randomize slightly for a collage effect
                        const heightClass = idx % 2 === 0 ? "h-48 md:h-72" : "h-56 md:h-80";
                        const mtClass = idx % 2 !== 0 ? "mt-4 md:mt-8" : "";

                        return (
                            <motion.div
                                key={`${src}-${idx}`}
                                className={`w-64 md:w-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ${heightClass} ${mtClass} group relative`}
                                whileHover={{ scale: 1.05, zIndex: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={src}
                                    alt={`Gallery Image ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/20 transition-colors duration-300" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Right Fade */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-charcoal-900 to-transparent z-10" />
            </div>
        </section>
    );
}
