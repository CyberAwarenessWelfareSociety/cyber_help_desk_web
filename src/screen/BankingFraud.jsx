import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  AlertTriangle,
  Lock,
  Shield,
  UserCheck,
  FileCheck,
  Info
} from "lucide-react";

export default function BankingFraud() {
  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Banking Fraud Protection</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M30 10h-2v10h-10v2h10v10h2v-10h10v-2h-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
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
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Banking Fraud Prevention</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                Protect Yourself From  
                <span className="block text-yellow-300">Banking Fraud</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                Banking fraud is a rapidly growing cybercrime. Learn how criminals target
                financial systems and discover best-in-class practices to stay safe and 
                safeguard your money.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#types"
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore Fraud Types
                </a>
                <a
                  href="#help"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-xl hover:bg-white/20 transition"
                >
                  How We Help
                </a>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:grid grid-cols-2 gap-4"
            >
              {[
                { icon: AlertTriangle, label: "Reported Cases", value: "25K+", color: "bg-red-500" },
                { icon: Lock, label: "Secured Accounts", value: "90K+", color: "bg-blue-500" },
                { icon: Shield, label: "Fraud Prevention Rate", value: "92%", color: "bg-purple-500" },
                { icon: FileCheck, label: "Resolved Issues", value: "15K+", color: "bg-green-500" }
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
          <svg viewBox="0 0 1440 120"><path d="M0 120L1440 75V120H0Z" fill="#F9FAFB" /></svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Fraud Types */}
        <section id="types">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold">Types of Banking Fraud</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Common Banking Fraud Techniques
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Info, title: "Identity Theft", desc: "Criminals use stolen personal data to access or open bank accounts." },
              { icon: Lock, title: "Phishing Attacks", desc: "Fake emails/SMS/calls impersonate banks to steal passwords and OTPs." },
              { icon: Shield, title: "Card Skimming", desc: "Skimming devices on ATMs and POS terminals capture card data." },
              { icon: UserCheck, title: "Account Takeover", desc: "Hackers gain access to online banking using stolen credentials." },
              { icon: FileCheck, title: "Check Fraud", desc: "Counterfeit or altered checks are used to steal funds." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section id="help" className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              How We Can Help
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-lg text-gray-700 mb-8"
            >
              We provide expert resources and support to help you stay safe from banking fraud.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Educational Resources", desc: "Guides & articles to recognize and avoid banking fraud." },
                { title: "Awareness Campaigns", desc: "We highlight trending fraud techniques to keep you updated." },
                { title: "Victim Assistance", desc: "Support for reporting fraud & recovering lost funds." },
                { title: "Legal Guidance", desc: "Help filing complaints and understanding your legal rights." }
              ].map((help, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-emerald-600 mb-2">{help.title}</h3>
                  <p className="text-gray-700">{help.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
