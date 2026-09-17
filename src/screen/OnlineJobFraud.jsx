import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Users, 
  CheckCircle, 
  LifeBuoy, 
  Scale, 
  ShieldCheck,
  ArrowRight,
  Zap,
  BadgeAlert,
  HandHelping
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" }
};

export default function OnlineJobFraud() {
  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Online Job Fraud Protection</span>
      </div>

      {/* EPIC HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <BadgeAlert className="w-5 h-5" />
                <span className="text-sm font-medium">Job Scam Alert 2025</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                Stop Falling for
                <span className="block text-yellow-300">Fake Job Offers</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                Every day, thousands lose money to fake recruiters asking for “registration fees”, 
                “training costs”, or bank details. You don’t have to be one of them.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#protect"
                  className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Protect Yourself Now <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#report"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition"
                >
                  Report a Scam
                </a>
              </motion.div>
            </div>

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { icon: AlertTriangle, value: "1.2L+", label: "Victims in India (2024)", color: "bg-red-500" },
                { icon: ShieldCheck, value: "₹850Cr+", label: "Money Lost", color: "bg-orange-500" },
                { icon: Eye, value: "24/7", label: "Scam Monitoring", color: "bg-purple-500" },
                { icon: CheckCircle, value: "99%", label: "Prevention Rate", color: "bg-green-500" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition text-center"
                >
                  <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* Common Scams */}
        <section>
          <div className="text-center mb-12">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Most Common Tactics</span>
            </motion.div>
            <motion.h2 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-gray-900">
              How Job Scammers Trick You
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "Money", text: "Asking for registration/training/security deposit" },
              { emoji: "Laptop", text: "Offering work-from-home with free laptop (after payment)" },
              { emoji: "WhatsApp", text: "Moving chat to WhatsApp/Telegram immediately" },
              { emoji: "Guarantee", text: "Guaranteeing job after payment" },
              { emoji: "Form", text: "Sending Google Forms asking for Aadhaar, PAN, bank details" },
              { emoji: "Urgent", text: "Creating urgency – “Only 2 seats left!”" },
            ].map((scam, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition group"
              >
                <span className="text-4xl mb-4 block">{scam.emoji}</span>
                <p className="text-gray-700 font-medium">{scam.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Protection Tips - SAME PREMIUM CARDS */}
        <section id="protect">
          <div className="text-center mb-12">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-bold">Your Safety Shield</span>
            </motion.div>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900">
              100% Proven Ways to Stay Safe
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: "Never Pay Upfront", desc: "Legitimate companies NEVER ask for money to give you a job.", color: "red" },
              { icon: Lock, title: "Verify Company", desc: "Check official website, LinkedIn, Glassdoor. Fake companies have no digital footprint.", color: "emerald" },
              { icon: Users, title: "Stay on Platform", desc: "Real recruiters don’t rush you to WhatsApp on the first message.", color: "blue" },
              { icon: ShieldCheck, title: "No Personal Docs Early", desc: "Aadhaar, PAN, bank details only after offer letter & joining.", color: "purple" },
              { icon: CheckCircle, title: "Research Salary", desc: "₹50K/month for data entry with zero experience? Red flag.", color: "orange" },
              { icon: HandHelping, title: "Ask Us First", desc: "Confused about a job offer? DM us — we verify in minutes.", color: "pink" },
            ].map((tip, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-${tip.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <tip.icon className={`w-8 h-8 text-${tip.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How We Help - Upgraded */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 md:p-16">
          <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
            We’ve Got Your Back
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Free Awareness Workshops", color: "emerald" },
              { icon: LifeBuoy, title: "1-on-1 Victim Support", color: "cyan" },
              { icon: Scale, title: "Legal & Police Guidance", color: "indigo" },
              { icon: Zap, title: "Real-time Scam Verification", color: "pink" },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                </div>
                <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Report CTA */}
        <section id="report" className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </motion.div>

          <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Already Paid or Shared Details?
          </motion.h2>

          <motion.p {...fadeUp} className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Don’t wait. Every minute counts. Report now and we’ll guide you step-by-step.
          </motion.p>

          <motion.a
            href="/report-scam"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition shadow-xl"
          >
            Report Job Scam Now <ArrowRight className="w-6 h-6" />
          </motion.a>
        </section>
      </div>
    </div>
  );
}