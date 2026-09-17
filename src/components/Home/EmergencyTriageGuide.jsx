import { motion } from "framer-motion";
import {
  ShieldAlert,
  PhoneCall,
  FileCheck2,
  Lock,
  HeartHandshake,
  ArrowRight,
  ExternalLink,
  Clock,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmergencyTriageGuide() {
  const steps = [
    {
      number: "01",
      title: "Act Within the Golden Hour (0 - 2 Hours)",
      description:
        "Financial cyber frauds move swiftly across mule accounts. Immediately dial National Helpline 1930 or file an urgent report on cybercrime.gov.in so banks can freeze the transaction before withdrawal.",
      badge: "Crucial for Fund Recovery",
      icon: Clock,
      color: "border-red-500/40 bg-red-500/5 text-red-600",
      iconBg: "bg-red-500 text-white",
    },
    {
      number: "02",
      title: "Preserve Digital Evidence (Do NOT Delete)",
      description:
        "Do not clear chats, delete scammer phone numbers, or discard payment receipts. Capture screenshots with visible timestamps, sender handles, and UTR/Transaction numbers for legal proof.",
      badge: "Legal Proof Required",
      icon: FileCheck2,
      color: "border-amber-500/40 bg-amber-500/5 text-amber-600",
      iconBg: "bg-amber-500 text-white",
    },
    {
      number: "03",
      title: "Isolate & Secure Your Accounts",
      description:
        "Temporarily block your compromised ATM card, net banking, or UPI PIN via your official bank app. Log out of active sessions on WhatsApp, Google, and social media, and turn on App Authenticator 2FA.",
      badge: "Prevent Lateral Access",
      icon: Lock,
      color: "border-blue-500/40 bg-blue-500/5 text-blue-600",
      iconBg: "bg-blue-500 text-white",
    },
    {
      number: "04",
      title: "Connect with CAWS NGO Victim Desk",
      description:
        "Reach out to our certified cyber counselors. We prepare technical incident summaries, guide you through police FIR registration, and provide 100% confidential mental and legal reassurance.",
      badge: "100% Free & Confidential",
      icon: HeartHandshake,
      color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600",
      iconBg: "bg-emerald-600 text-white",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Crisis Action Protocol</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Under Cyber Attack?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Follow the First Golden Hours Guide
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            In cyber fraud and digital harassment, immediate action determines recovery.
            Follow these verified crisis steps before panicking.
          </p>
        </div>

        {/* 4-STEP GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${step.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-600 group-hover:text-emerald-400 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-slate-300 bg-slate-700/60 px-2.5 py-0.5 rounded-md mb-3">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700/50 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Priority Step #{step.number}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM RAPID ACTION BANNER */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900/60 via-teal-900/50 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              Need Immediate Human Assistance from Our NGO?
            </h4>
            <p className="text-sm text-slate-300 max-w-xl">
              Our volunteers and certified cybersecurity professionals provide free assistance 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919310597258"
              className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline (+91 93105 97258)</span>
            </a>

            <Link
              to="/service"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold px-5 py-3 rounded-xl transition flex items-center gap-1.5"
            >
              <span>Explore All Threat Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
