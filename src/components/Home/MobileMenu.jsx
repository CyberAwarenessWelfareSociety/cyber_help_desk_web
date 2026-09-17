import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainLinks = [
  { label: "Home", href: "#home" },
  {
    label: "About",
    dropdown: [
      { label: "About Us", href: "#aboutus" },
      { label: "Our Team", href: "#ourteam" },
      { label: "FAQ's", href: "#faqs" },
      { label: "Terms & Conditions", href: "#terms" },
    ],
  },
  {
    label: "Our Services",
    dropdown: [
      { label: "OLX Fraud", href: "#olxfraud" },
      { label: "Payment Fraud", href: "#paymentfraud" },
      { label: "Banking Fraud", href: "#bankingfraud" },
      { label: "Online Job Fraud", href: "#onlinejobfraud" },
      { label: "Cyber Stalking", href: "#cyberstalking" },
      { label: "Cyber Security Education & Training", href: "#cyberedu" },
      { label: "View All Services", href: "#allservices" },
    ],
  },
  {
    label: "Courses",
    dropdown: [
      { label: "Certified Ethical Hacker (C|EH)", href: "#ceh" },
      { label: "Certified Penetration Testing Professional (C|PENT)", href: "#cpent" },
      { label: "Computer Hacking Forensic Investigator (C|HFI)", href: "#chfi" },
      { label: "Certified Network Defender (C|ND)", href: "#cnd" },
      { label: "Certified Cloud Security Engineer (C|CSE)", href: "#cse" },
      { label: "Certified DevSecOps Engineer (E|CDE)", href: "#ecde" },
    ],
  },
  { label: "Blog", href: "#blog" },
  { label: "Donate", href: "#donate" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Cyber Awareness NGO
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Global Welfare & Support</p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {mainLinks.map((link) => (
            <div key={link.label}>
              {link.dropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium">
                    {link.label} <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {link.dropdown.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <a href={item.href}>{item.label}</a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a href={link.href} className="text-gray-700 hover:text-emerald-600 font-medium">
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <a href="tel:+919310597258" className="hidden md:flex items-center gap-2 text-emerald-600 font-semibold">
            <Phone className="w-5 h-5" /> +91 93105 97258
          </a>

          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl">
            Login
          </Button>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden bg-white shadow-xl border-t p-4 space-y-4">
            {mainLinks.map((link) => (
              <div key={link.label}>
                {link.dropdown ? (
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-800 py-2 flex justify-between items-center">
                      {link.label}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
                    </summary>
                    <div className="ml-4 pl-2 border-l space-y-2">
                      {link.dropdown.map((item) => (
                        <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="block text-gray-700 py-1 hover:text-emerald-600">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a href={link.href} onClick={() => setMobileOpen(false)} className="block text-gray-800 py-2 font-medium hover:text-emerald-600">
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
