import { Phone, Mail, MapPin, CheckCircle, ShieldAlert, HeartHandshake, Lock } from "lucide-react";
import ContactForm from "./ContactForm";
import { trustPoints } from "../../constants/data";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Citizen Cyber Helpline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Need Immediate Help?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Speak with Our NGO Team
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Our volunteers and certified cybersecurity analysts provide free,
            confidential guidance for victims of cyber fraud, extortion, and digital abuse.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right: Emergency Info & Trust (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Helpline Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Direct NGO Hotline
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live 24/7
                </span>
              </div>

              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                <p className="text-xs text-slate-400">National Cybercrime Emergency</p>
                <a
                  href="tel:1930"
                  className="text-3xl font-black text-amber-400 hover:text-amber-300 transition block mt-1 tracking-wider"
                >
                  Dial 1930
                </a>
                <p className="text-[11px] text-slate-400 mt-1">
                  Immediate bank freeze portal operated by Govt. of India
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">NGO Helpline & WhatsApp Desk</p>
                    <a
                      href="tel:+919310597258"
                      className="font-bold text-white hover:text-emerald-400 transition text-base"
                    >
                      +91 93105 97258
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Confidential Email Support</p>
                    <a
                      href="mailto:support@cyberawareness.ngo"
                      className="font-semibold text-white hover:text-emerald-400 transition"
                    >
                      support@cyberawareness.ngo
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Head Office & Registered Society</p>
                    <p className="font-semibold text-white">
                      Patti Mundala, Khekra, Baghpat, Uttar Pradesh — 250101
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Victims Trust Us Card */}
            <div className="bg-white p-7 rounded-3xl shadow-md border border-slate-200/80 space-y-4">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Why Citizens Trust Our NGO
              </h4>
              <ul className="space-y-3 text-slate-700 text-sm">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}