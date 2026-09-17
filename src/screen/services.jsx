import React, { useState } from "react";
import {
  ChevronRight,
  Shield,
  AlertTriangle,
  Briefcase,
  UserX,
  Lock,
  Wifi,
  MessageCircle,
  ArrowRight,
  PhoneCall,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Home/Header";
import { Link } from "react-router-dom";

const services = [
  {
    id: "payment",
    title: "Payment & UPI Fraud",
    desc: "Fake QR codes, unauthorized Google Pay & PhonePe debits, screen-share app takeovers, and fraudulent UPI collect requests.",
    icon: Lock,
    iconBg: "bg-red-50 text-red-600 border-red-200",
    badge: "₹500Cr+ Lost Annually",
    badgeColor: "bg-red-100 text-red-800",
    link: "/payment-fraud",
    category: "financial",
    actionTip: "Golden hour rule: Call 1930 within 2 hours to freeze recipient bank account.",
  },
  {
    id: "olx",
    title: "OLX & Marketplace Fraud",
    desc: "Fake buyers posing as defense personnel sending fake payment receipts and asking you to scan QR codes or enter UPI PIN to receive money.",
    icon: Shield,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "Most Common Marketplace Scam",
    badgeColor: "bg-amber-100 text-amber-800",
    link: "/olx-fraud",
    category: "financial",
    actionTip: "Entering your UPI PIN is strictly for debiting your account, never receiving funds.",
  },
  {
    id: "banking",
    title: "Banking & KYC Fraud",
    desc: "Threatening SMS to update PAN/KYC to avoid account freeze, fake bank support numbers listed on search engines, and SIM swap exploits.",
    icon: Lock,
    iconBg: "bg-blue-50 text-blue-600 border-blue-200",
    badge: "Account Takeover Risk",
    badgeColor: "bg-blue-100 text-blue-800",
    link: "/banking-fraud",
    category: "financial",
    actionTip: "Banks never ask for OTP, passwords, or remote desktop app installations.",
  },
  {
    id: "job",
    title: "Online Job & Task Scams",
    desc: "Work-from-home offers on Telegram/WhatsApp paying for YouTube video likes or merchant reviews, demanding prepayments to withdraw earnings.",
    icon: Briefcase,
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badge: "1.2 Lakh+ Targeted",
    badgeColor: "bg-orange-100 text-orange-800",
    link: "/online-job-fraud",
    category: "financial",
    actionTip: "Legitimate employment never requires job seekers to deposit crypto or processing fees.",
  },
  {
    id: "stalking",
    title: "Cyber Stalking & Blackmail",
    desc: "Continuous abusive messages, morphed photo threats, webcam video extortion, doxxing, and intimidation across social media networks.",
    icon: UserX,
    iconBg: "bg-purple-50 text-purple-600 border-purple-200",
    badge: "100% Confidential Support",
    badgeColor: "bg-purple-100 text-purple-800",
    link: "/cyber-stalking",
    category: "personal",
    actionTip: "Preserve all original screenshots and profile URLs. Never send money to extortionists.",
  },
  {
    id: "ransomware",
    title: "Ransomware & System Locks",
    desc: "Encrypted business and personal files demanding Bitcoin or monero ransom. Forensic triage, containment, and recovery without funding crime.",
    icon: Wifi,
    iconBg: "bg-rose-50 text-rose-600 border-rose-200",
    badge: "Critical Data Threat",
    badgeColor: "bg-rose-100 text-rose-800",
    link: "/ransomware",
    category: "technical",
    actionTip: "Disconnect affected machine from network cables and Wi-Fi immediately.",
  },
  {
    id: "phishing",
    title: "Phishing & Malicious Links",
    desc: "Deceptive SMS, email, and WhatsApp links mimicking banks, courier updates, or government schemes designed to harvest passwords.",
    icon: MessageCircle,
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-200",
    badge: "90% Breaches Start Here",
    badgeColor: "bg-cyan-100 text-cyan-800",
    link: "/phishing-attack",
    category: "technical",
  },
];

export default function OurServices() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((s) => {
    const matchesCategory =
      selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 bg-slate-50 min-h-screen text-slate-900">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Threat Solutions & Victim Assistance</span>
      </div>

      {/* HERO SECTION - INHOPE / StopNCII Inspiring Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Victim Assistance Directory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto"
          >
            Comprehensive Support for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Every Cyber Threat
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            From UPI recovery assistance to cyber harassment defense, our registered
            NGO provides immediate triage, evidence preservation guides, and law enforcement liaison.
          </motion.p>

          {/* Emergency Hotline Alert */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="tel:1930"
              className="bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>National Cyber Helpline: 1930</span>
            </a>
            <a
              href="tel:+919310597258"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              CAWS 24/7 Desk: +91 93105 97258
            </a>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Threats ({services.length})
            </button>
            <button
              onClick={() => setSelectedCategory("financial")}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                selectedCategory === "financial"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Financial & Banking
            </button>
            <button
              onClick={() => setSelectedCategory("personal")}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                selectedCategory === "personal"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Personal & Stalking
            </button>
            <button
              onClick={() => setSelectedCategory("technical")}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition ${
                selectedCategory === "technical"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ransomware & Technical
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search threat or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 duration-300 ${service.iconBg}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full ${service.badgeColor}`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  {service.actionTip && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 mb-6">
                      <strong className="text-emerald-700 font-semibold block mb-0.5">
                        ⚡ Immediate Action Tip:
                      </strong>
                      {service.actionTip}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-sm group-hover:gap-2.5 transition-all"
                  >
                    <span>Read Prevention Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/contact-us"
                    className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                  >
                    Get Help →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM REASSURANCE BANNER */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h3 className="text-2xl font-extrabold">
              Can't Find Your Exact Cyber Incident?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              New cyber threat vectors emerge every day. Our certified team of forensic analysts
              and cyber lawyers can review your case confidentially at no charge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact-us"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow transition"
            >
              Submit Case for Review
            </Link>
            <a
              href="tel:+919310597258"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition"
            >
              Call Helpline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}