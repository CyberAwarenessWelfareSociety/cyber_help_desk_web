import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  Zap,
  Phone,
  Award,
  UserCheck,
  FileCheck,
  Eye,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useBanners } from "../../hooks/useBanners";
import playstore from "../../assets/android.png";
import appstore from "../../assets/apple.png";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  const { banners, bannerIndex, setBannerIndex } = useBanners();
  const [announcement, setAnnouncement] = useState("");
  const [selectedIncident, setSelectedIncident] = useState("upi");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || banners.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      // Swiped left -> next banner
      setBannerIndex((i) => (i + 1) % banners.length);
    } else if (distance < -45) {
      // Swiped right -> prev banner
      setBannerIndex((i) => (i - 1 + banners.length) % banners.length);
    }
  };

  useEffect(() => {
    fetch("https://api.cyberawareness.ngo/api/get-Announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) {
          setAnnouncement(data.data[0].announcement_text);
        }
      })
      .catch(() => {});
  }, []);

  const incidents = [
    {
      id: "upi",
      title: "Lost Money in UPI / Bank Scam",
      action: "Golden Hour: Call 1930 within 2 hours to freeze bank accounts!",
      tip: "Save the UPI transaction ref ID and SMS immediately. Do not delete banking SMS.",
      badge: "Critical Urgency",
      badgeColor: "bg-red-500",
      link: "/payment-fraud",
    },
    {
      id: "stalking",
      title: "Cyber Stalking & Blackmail",
      action: "Do not delete chats, audio, or profiles. Preserving metadata is critical for FIR.",
      tip: "Never pay extortion money — perpetrators always demand more. Contact our team for technical isolation.",
      badge: "100% Confidential",
      badgeColor: "bg-purple-600",
      link: "/cyber-stalking",
    },
    {
      id: "olx",
      title: "OLX / Marketplace QR Scam",
      action: "Remember: Entering your UPI PIN is strictly for SENDING money, never receiving.",
      tip: "Take screenshots of the fake QR code, merchant name, and fraudster mobile number.",
      badge: "High Occurrence",
      badgeColor: "bg-amber-500",
      link: "/olx-fraud",
    },
    {
      id: "job",
      title: "Fake Job / Task Scam",
      action: "Legitimate recruiters never ask for registration fees or crypto deposits.",
      tip: "Save Telegram channel links, bank account numbers used for deposits, and withdrawal rejection notices.",
      badge: "Financial Scam",
      badgeColor: "bg-blue-600",
      link: "/online-job-fraud",
    },
    {
      id: "ransomware",
      title: "Ransomware / Hacked Account",
      action: "Disconnect device from Wi-Fi immediately to prevent lateral propagation.",
      tip: "Do not pay the ransom. Consult our forensic team for decryptor options and account recovery.",
      badge: "Technical Threat",
      badgeColor: "bg-emerald-600",
      link: "/ransomware",
    },
  ];

  const activeIncidentData = incidents.find((i) => i.id === selectedIncident);

  return (
    <div className="pt-28 sm:pt-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ANNOUNCEMENT TICKER (IF AVAILABLE) */}
      {announcement && (
        <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-2.5 px-4 shadow-md overflow-hidden relative border-b border-emerald-500/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Notice</span>
            </div>
            <div className="overflow-hidden flex-1 text-sm font-medium">
              <motion.div
                className="whitespace-nowrap inline-block"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className="mr-12">{announcement}</span>
                <span className="mr-12">{announcement}</span>
                <span className="mr-12">{announcement}</span>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* HERO MAIN CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* INFORMATION COLUMN: HERO CONTENT & EMERGENCY TRIAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 lg:col-span-7 space-y-6"
          >
            {/* NGO VERIFIED TRUST BADGE */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Registered NGO • 12A & 80G Certified • Free Victim Assistance</span>
            </div>

            {/* HERO HEADLINE (INHOPE & StopNCII Inspired) */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Defending Citizens Against Cybercrime.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                You Are Not Alone.
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-xl leading-relaxed max-w-2xl font-normal">
              Whether you’ve lost funds to an online scam, face digital blackmail,
              or seek certified cybersecurity education, the{" "}
              <strong className="text-white font-semibold">
                Cyber Awareness Welfare Society
              </strong>{" "}
              provides confidential, expert-led victim triage, legal liaison, and
              community protection.
            </p>

            {/* CALL TO ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              {/* EMERGENCY CALL */}
              <a
                href="tel:+919310597258"
                className="inline-flex items-center justify-center sm:justify-start gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold shadow-lg hover:shadow-red-500/20 transition-all text-sm group border border-red-400/30"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold opacity-90">
                    24/7 Helpline
                  </span>
                  <span className="text-sm sm:text-base font-extrabold tracking-wide">
                    +91 93105 97258
                  </span>
                </div>
              </a>

              {/* REPORT INCIDENT FORM BUTTON */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                <span>Report Incident Online</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* DONATE CTA */}
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Donate (80G Benefit)</span>
              </Link>
            </div>

            {/* APP STORE DOWNLOAD BADGES */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">
                Official Cyber Help Desk App:
              </span>
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <a
                  href="https://play.google.com/store/apps/details?id=com.cybercrime"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition text-xs"
                >
                  <img src={playstore} className="h-4 object-contain" alt="Play Store" />
                  <span className="font-semibold">Google Play</span>
                </a>
                <a
                  href="https://apps.apple.com/in/app/cyber-help-desk/id6751521460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition text-xs"
                >
                  <img src={appstore} className="h-4 object-contain" alt="App Store" />
                  <span className="font-semibold">App Store</span>
                </a>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.8★ Rating
                </span>
              </div>
            </div>
          </motion.div>

          {/* BANNER CAROUSEL & IMPACT STATS (ORDER-1 ON MOBILE, ORDER-2 ON DESKTOP) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-5 relative"
          >
            {/* CAROUSEL CONTAINER */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative h-[230px] xs:h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-800 touch-pan-y"
            >
              <AnimatePresence mode="wait">
                {banners.length > 0 ? (
                  <motion.img
                    key={bannerIndex}
                    src={banners[bannerIndex]}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    alt={`Awareness Campaign ${bannerIndex + 1}`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-8 text-center">
                    <Shield className="w-20 h-20 text-emerald-400 mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Cyber Awareness Welfare Society
                    </h3>
                    <p className="text-slate-300 text-sm max-w-sm">
                      Protecting vulnerable citizens against digital crimes and online abuse.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {/* GRADIENT VIGNETTE */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* BANNER CONTROLS */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setBannerIndex(
                        (i) => (i - 1 + banners.length) % banners.length
                      )
                    }
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-white transition z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={() =>
                      setBannerIndex((i) => (i + 1) % banners.length)
                    }
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-white transition z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* DOTS */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setBannerIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === bannerIndex
                            ? "bg-emerald-400 w-5 sm:w-6"
                            : "bg-white/40 w-1.5 hover:bg-white/70"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* OVERLAY BADGE */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-emerald-300 font-semibold flex items-center gap-1.5 z-10">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                <span>Verified NGO Initiative</span>
              </div>
            </div>

            {/* FLOATING QUICK STATS CARD */}
            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/70 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
                <p className="text-lg sm:text-2xl font-black text-emerald-400">15K+</p>
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Victims Guided</p>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/70 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
                <p className="text-lg sm:text-2xl font-black text-teal-300">₹14.5Cr+</p>
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Funds Prevented</p>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/70 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-center">
                <p className="text-lg sm:text-2xl font-black text-amber-300">100%</p>
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Free Victim Help</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CREDIBILITY & PARTNER ACCREDITATION STRIP (INHOPE Style) */}
      <div className="border-t border-slate-800/90 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Registered Welfare Society Under Indian Societies Act</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Income Tax Act 12A & 80G Certified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>EC-Council Accredited Training Partner</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Strict Data Confidentiality & Zero Commercialization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}