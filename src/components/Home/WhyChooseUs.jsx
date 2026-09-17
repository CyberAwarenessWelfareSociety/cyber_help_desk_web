import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Headphones,
  FileCheck,
  Lock,
  Handshake,
  Heart,
  Scale,
  Sparkles,
} from "lucide-react";

const pillars = [
  {
    title: "100% Free Victim Support",
    description:
      "As a registered non-profit welfare society, our victim triage, incident guidance, and technical counseling are completely free of charge. We never exploit victims in distress.",
    icon: Heart,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    title: "Ironclad Privacy & Discretion",
    description:
      "Inspired by global victim-protection standards, we treat every case with complete confidentiality. Your sensitive evidence, screenshots, and identity are never leaked or shared.",
    icon: Lock,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    title: "Police & Cyber Cell Liaison",
    description:
      "We bridge the gap between victims and law enforcement by compiling professional digital evidence packets, transaction trail audits, and technical complaint briefs for FIR registration.",
    icon: Scale,
    color: "from-purple-500 to-pink-600",
    bg: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    title: "EC-Council Certified Experts",
    description:
      "Our team includes accredited specialists holding Certified Ethical Hacker (CEH) and forensic certifications, giving you access to real cybersecurity expertise when it matters most.",
    icon: ShieldCheck,
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50 text-teal-600 border-teal-200",
  },
  {
    title: "Emotional & Mental Welfare",
    description:
      "Cyber harassment, sextortion, and financial loss cause severe psychological distress. We offer empathetic, stigma-free counseling to help survivors regain peace of mind.",
    icon: Headphones,
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    title: "12A & 80G Tax Exemption",
    description:
      "Transparent governance and rigorous compliance under the Societies Registration Act. Contributions from individuals and CSR partners qualify for 80G tax deductions.",
    icon: FileCheck,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 text-amber-600 border-amber-200",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Our Ethical Commitment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Citizens & Survivors{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Trust Our Welfare Society
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We are more than just a tech service; we are a humanitarian NGO dedicated
            to protecting human rights, digital security, and victim dignity in cyberspace.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 hover:border-emerald-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110 duration-300 ${item.bg}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-500 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">
                    Welfare Guarantee
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
