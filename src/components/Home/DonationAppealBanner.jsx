import { motion } from "framer-motion";
import { Heart, ShieldCheck, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function DonationAppealBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30">
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              <span>Section 80G Tax Exemption Certified</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Help Keep Our Cyber Victim Helpline{" "}
              <span className="text-yellow-300">100% Free for Everyone</span>
            </h2>

            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
              As a registered non-profit welfare society, we never charge victims of
              cyber fraud or extortion. Your generous donation or Corporate CSR sponsorship
              funds our round-the-clock crisis desk, digital literacy camps for rural schools,
              and emergency legal counseling.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-300" /> 50% Tax Exemption Under Sec 80G
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-300" /> Instant Official NGO Donation Receipt
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-300" /> Transparent Annual Audits
              </span>
            </div>
          </div>

          {/* Right Column: Donation CTAs */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </div>

            <h3 className="text-xl font-extrabold text-white">
              Support Our Mission
            </h3>

            <p className="text-xs text-white/80 leading-relaxed">
              Every ₹500 helps guide a vulnerable victim through digital evidence collection and police liaison.
            </p>

            <div className="space-y-2.5 pt-2">
              <Link
                to="/donate"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Make an 80G Donation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact-us"
                className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 transition flex items-center justify-center gap-2 text-xs"
              >
                <Building2 className="w-4 h-4" />
                <span>Corporate CSR Partnership Inquiries</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
