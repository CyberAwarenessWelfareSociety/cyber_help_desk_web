import { useState } from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { services } from "../../constants/data";
import { Shield, Sparkles, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Cyber Threats" },
    { id: "financial", label: "Financial Frauds" },
    { id: "personal", label: "Personal & Harassment" },
    { id: "enterprise", label: "Technical & Ransomware" },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Victim Assistance & Prevention</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Threats We Help You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Fight & Overcome
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From UPI recovery assistance to cyber harassment defense, our certified
            NGO analysts provide end-to-end guidance at zero cost to victims.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              desc={service.desc}
              icon={service.icon}
              color={service.color}
              link={service.link}
              badge={service.badge}
              severity={service.severity}
              index={idx}
            />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 text-sm mb-4">
            Facing a fraud not listed above? Our team handles custom cyber investigations.
          </p>
          <Link
            to="/service"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <span>View All Detailed Threat Guides & Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
