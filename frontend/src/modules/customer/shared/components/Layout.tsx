import { Home, Calendar, History, User, Settings, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Book Service", path: "/bookings" },
    { icon: History, label: "My Bookings", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-charcoal-900 text-white flex flex-col">
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-charcoal-800/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <span className="font-bold text-white text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-tight">AURO-SHYNE</h1>
            <p className="text-[10px] text-brand-blue font-bold tracking-[0.2em] uppercase">Mobility</p>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-blue relative py-2",
                  isActive ? "text-brand-blue" : "text-text-grey"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a href="tel:+919346748605" className="flex items-center gap-2 text-sm font-medium text-text-grey hover:text-white transition-colors">
            <Phone className="w-4 h-4" />
            <span>Support</span>
          </a>
          <Link
            to="/bookings"
            className="bg-brand-blue hover:bg-brand-accent text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden bg-charcoal-800/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <span className="font-bold text-white text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AURO-SHYNE</h1>
            <p className="text-[10px] text-brand-blue font-medium tracking-wider uppercase">Mobility</p>
          </div>
        </div>
        <Link to="/profile" className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-text-grey" />
        </Link>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 overflow-y-auto w-full scroll-smooth">
        {children}
      </main>

      {/* ================= WHATSAPP BUTTON ================= */}
      <a
        href="https://wa.me/919346748605"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute right-full mr-3 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Chat with us
        </span>
      </a>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal-800/90 backdrop-blur-lg border-t border-white/5 max-w-md mx-auto">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                  isActive ? "text-brand-blue" : "text-text-grey hover:text-white"
                )}
              >
                <div className="relative">
                  <item.icon className={cn("w-6 h-6 mb-1 transition-transform", isActive && "scale-110")} />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= DESKTOP FOOTER ================= */}
      <footer className="hidden md:block bg-charcoal-800 border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div>
              <span className="font-bold text-lg">AURO-SHYNE</span>
            </div>
            <p className="text-text-grey text-sm leading-relaxed">
              Premium doorstep vehicle cleaning services. We bring the shine to your drive with professional care and eco-friendly products.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-text-grey">
              <li><Link to="/" className="hover:text-brand-blue transition-colors">Home</Link></li>
              <li><Link to="/bookings" className="hover:text-brand-blue transition-colors">Book Service</Link></li>
              <li><Link to="/history" className="hover:text-brand-blue transition-colors">My Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-brand-blue transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-text-grey">
              <li>Water Wash</li>
              <li>Foam Wash</li>
              <li>Interior Deep Cleaning</li>
              <li>Premium Detailing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-text-grey">
              <li>+91 9346748605</li>
              <li>auroshynemobility@gmail.com</li>
              <li>Hyderabad, Telangana</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-text-grey">
          © 2024 Auro-Shyne Mobility (OPC) Pvt. Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

