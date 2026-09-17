import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { ChevronRight, Shield, AlertTriangle, Lock, Eye, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OLXFraud() {
  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">OLX Fraud Protection</span>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Fraud Prevention Guide</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                Stay Safe from
                <span className="block text-yellow-300">OLX Fraud</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                Protect yourself from scammers on online marketplaces. Learn to recognize, 
                prevent, and respond to fraud attempts with our comprehensive security guide.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#protection"
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Learn Protection Tips
                </a>
                <a
                  href="#report"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-xl hover:bg-white/20 transition"
                >
                  Report Fraud
                </a>
              </motion.div>
            </div>

            {/* Right Content - Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:grid grid-cols-2 gap-4"
            >
              {[
                { icon: AlertTriangle, label: "Fraud Cases", value: "10K+", color: "bg-red-500" },
                { icon: Shield, label: "Protected Users", value: "50K+", color: "bg-blue-500" },
                { icon: Eye, label: "Active Monitors", value: "24/7", color: "bg-purple-500" },
                { icon: CheckCircle, label: "Success Rate", value: "98%", color: "bg-green-500" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition"
                >
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Understanding Section */}
        <section>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold">Understanding the Threat</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              What is OLX Fraud?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Understanding common fraud tactics is your first line of defense
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100"
          >
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              OLX fraud involves scammers posing as genuine buyers or sellers to deceive users 
              into transferring money or revealing sensitive information. These cybercriminals 
              use sophisticated tactics to exploit trust in online marketplaces.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "🎭", text: "Offering fake or non-existent products" },
                { icon: "📝", text: "Creating counterfeit listings with stolen images" },
                { icon: "⚡", text: "Pressuring for immediate payments" },
                { icon: "💳", text: "Sending fake payment confirmations" },
                { icon: "📦", text: "Claiming false shipping issues" },
                { icon: "🔗", text: "Sharing phishing links to steal data" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <p className="text-gray-700 font-medium pt-1">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Protection Section */}
        <section id="protection">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4"
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold">Protection Strategies</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              How to Protect Yourself
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Follow these essential security practices to stay safe
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: "Verify Listings and Profiles",
                desc: "Thoroughly check seller reviews, profile history, and product images. Be cautious of deals that seem too good to be true or sellers who pressure you into quick decisions.",
                color: "emerald",
              },
              {
                icon: Lock,
                title: "Use Secure Payment Methods",
                desc: "Always use OLX's official secure payment feature or verified payment gateways. Never transfer money directly to personal bank accounts or through untraceable methods.",
                color: "blue",
              },
              {
                icon: Shield,
                title: "Communicate Within the Platform",
                desc: "Scammers often try to move conversations to WhatsApp, email, or social media. Keep all communication within OLX to maintain transaction records and platform protection.",
                color: "purple",
              },
              {
                icon: Users,
                title: "Meet in Safe Public Places",
                desc: "Always meet in crowded, well-lit public locations with CCTV coverage. Bring a friend if possible, and never invite strangers to your home or go to theirs.",
                color: "orange",
              },
              {
                icon: AlertTriangle,
                title: "Trust Your Instincts",
                desc: "If something feels off or too good to be true, it probably is. Don't hesitate to walk away from suspicious deals and report fraudulent activity immediately.",
                color: "red",
              },
              {
                icon: CheckCircle,
                title: "Verify Payment Confirmations",
                desc: "Always confirm payment receipt through official channels before handing over items. Scammers often show fake payment screenshots or confirmations.",
                color: "green",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Report Section */}
        <section id="report" className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Encountered Fraud?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-700 mb-8"
            >
              Report suspicious activity immediately to help protect yourself and the community. 
              Quick reporting can prevent others from falling victim to the same scam.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Report Fraud Now
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}