import { motion } from "framer-motion";
import { achievements } from "../../constants/data";
import { ShieldCheck, HeartHandshake, Award, FileCheck2 } from "lucide-react";

export default function AchievementsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background glow & mesh */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Measured Humanitarian Impact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Making the Internet Safer,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              One Citizen at a Time
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our welfare society actively collaborates with cyber cells, academic
            institutions, and grassroots communities to protect victims and educate future defenders.
          </p>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-3xl p-8 text-center hover:border-emerald-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {item.value}
              </div>
              <div className="mt-3 text-lg font-bold text-white">
                {item.label}
              </div>
              <div className="mt-2 text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Accountability & Statutory Note */}
        <div className="mt-16 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">
                Certified & Transparent Non-Profit Governance
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Registered under the Societies Registration Act XXI of 1860 • 12A & 80G Certified by the Income Tax Department of India
              </p>
            </div>
          </div>

          <a
            href="/donate"
            className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
          >
            Support With a Tax-Deductible Donation →
          </a>
        </div>
      </div>
    </section>
  );
}