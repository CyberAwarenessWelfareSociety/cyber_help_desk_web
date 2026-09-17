import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Shield,
  AlertTriangle,
  Lock,
  EyeOff,
  UserX,
  MessageSquareWarning,
  HeartHandshake,
  Scale,
  Smartphone,
  HeadphonesIcon,
  ArrowRight,
  BadgeAlert,
  Zap,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" },
};

export default function CyberStalking() {
  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Cyber Stalking Protection</span>
      </div>

      {/* HERO SECTION – Deep, Emotional, Urgent */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-rose-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                <span className="text-sm font-bold">You Are Not Alone</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                Stop Cyber Stalking
                <span className="block text-yellow-300">Before It Breaks You</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                No one should live in fear because of unwanted messages, tracking, threats, 
                or online harassment. We help you take back control — safely, privately, and powerfully.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#protect"
                  className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Protect Yourself Now <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#report"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition"
                >
                  Get Help Immediately
                </a>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { icon: AlertTriangle, value: "68%", label: "Women Affected", color: "bg-rose-500" },
                { icon: UserX, value: "1 in 6", label: "Face Threats", color: "bg-teal-500" },
                { icon: MessageSquareWarning, value: "24/7", label: "Harassment", color: "bg-emerald-500" },
                { icon: HeartHandshake, value: "10K+", label: "Women Helped", color: "bg-emerald-500" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition"
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
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* Forms of Cyber Stalking */}
        <section>
          <div className="text-center mb-12">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mb-4">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Common Forms of Harassment</span>
            </motion.div>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900">
              How Cyber Stalkers Operate
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "Messages", text: "Sending unwanted, repeated, threatening messages" },
              { icon: "Eye", text: "Monitoring your social media, stories, location tags" },
              { icon: "Fake Profile", text: "Creating fake accounts to watch or contact you" },
              { icon: "Threat", text: "Threatening to leak photos, info, or harm you/family" },
              { icon: "Impersonation", text: "Pretending to be you and messaging your contacts" },
              { icon: "Doxxing", text: "Sharing your address, phone, workplace publicly" },
            ].map((form, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition group"
              >
                <span className="text-4xl mb-4 block">{form.icon}</span>
                <p className="text-gray-700 font-medium leading-relaxed">{form.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Protection Tips */}
        <section id="protect">
          <div className="text-center mb-12">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-bold">Take Back Control</span>
            </motion.div>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900">
              How to Protect Yourself Right Now
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "Lock Down Privacy", desc: "Make all social accounts private. Disable location. Remove phone/email from bio.", color: "emerald" },
              { icon: EyeOff, title: "Block & Report", desc: "Block the person on EVERY platform. Report to Instagram/FB/Twitter police.", color: "teal" },
              { icon: UserX, title: "Don’t Engage", desc: "Never reply — even to say “stop”. Any response encourages them.", color: "rose" },
              { icon: Smartphone, title: "Secure Devices", desc: "Change passwords, enable 2FA, check for spyware (we help free).", color: "indigo" },
              { icon: Scale, title: "Save Evidence", desc: "Screenshot everything with timestamp. Do NOT delete messages.", color: "blue" },
              { icon: HeartHandshake, title: "Talk to Someone", desc: "Tell a trusted friend/family. You don’t have to face this alone.", color: "emerald" },
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
                <p className="text-gray-600">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* We Are Here For You */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 md:p-16">
          <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
            You Don’t Have To Face This Alone
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {[
              { icon: HeadphonesIcon, title: "24/7 Emotional Support", color: "teal" },
              { icon: Scale, title: "Free Legal Guidance", color: "emerald" },
              { icon: Smartphone, title: "Device Security Audit", color: "indigo" },
              { icon: Shield, title: "Evidence Preservation", color: "emerald" },
              { icon: HeartHandshake, title: "Safe Community", color: "rose" },
            ].map((help, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-20 h-20 bg-${help.color}-100 rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <help.icon className={`w-10 h-10 text-${help.color}-600`} />
                </div>
                <p className="text-lg font-bold text-gray-800">{help.title}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EMERGENCY CTA */}
        <section id="report" className="bg-gradient-to-br from-rose-50 to-red-50 rounded-3xl p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-28 h-28 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <AlertTriangle className="w-14 h-14 text-rose-600" />
          </motion.div>

          <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Feeling Scared or Threatened?
          </motion.h2>

          <motion.p {...fadeUp} className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Talk to us right now — completely confidential, no judgment, instant help.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="tel:1091"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-rose-600 text-white text-lg font-bold rounded-xl hover:bg-rose-700 transition shadow-xl flex items-center justify-center gap-3"
            >
              Call Women Helpline 1091
            </motion.a>
            <motion.a
              href="/contact-us"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-emerald-600 text-white text-lg font-bold rounded-xl hover:bg-emerald-700 transition shadow-xl flex items-center justify-center gap-3"
            >
              Chat With Us Now <ArrowRight className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}