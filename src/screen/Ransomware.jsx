import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { ChevronRight, Lock, AlertTriangle, Shield, HardDrive, FileCheck, Ban, PhoneCall, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Ransomware() {
  return (
    <div className="pt-32 min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Ransomware & System Locks</span>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 flex items-center gap-4">
              <Lock className="w-12 h-12 md:w-16 md:h-16" />
              Ransomware
            </h1>
            <p className="text-lg md:text-xl max-w-4xl leading-relaxed opacity-95">
              Ransomware is a type of malicious software designed to block access to a computer system 
              or data, typically by encrypting files, until a ransom is paid. This cyber threat can be 
              devastating for individuals, businesses, and critical institutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* What is Ransomware? */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          >
            What is Ransomware?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed max-w-4xl space-y-5"
          >
            <p>
              Ransomware attacks often begin when a user clicks a malicious link, opens an infected email 
              attachment, or visits a compromised website. Once executed, the malware silently encrypts 
              your files — documents, photos, databases — rendering them inaccessible.
            </p>
            <p>
              A ransom note then appears, demanding payment (usually in Bitcoin or Monero) in exchange 
              for a decryption key. Even if payment is made, there is <strong>no guarantee</strong> the 
              attacker will provide a working key.
            </p>
            <p className="font-semibold text-red-600">
              Paying the ransom funds criminal operations and does not guarantee recovery.
            </p>
          </motion.div>
        </section>

        <hr className="border-gray-200" />

        {/* How We Help */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            How Cyber Awareness Welfare Society Helps You Fight Back
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Incident Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-amber-100 rounded-xl w-fit mb-5 group-hover:bg-amber-500 transition-colors">
                <AlertTriangle className="w-8 h-8 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Incident Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                We analyze the ransomware strain, scope of encryption, and potential data exfiltration 
                to give you a clear picture of the attack.
              </p>
            </motion.div>

            {/* Containment & Removal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-red-100 rounded-xl w-fit mb-5 group-hover:bg-red-500 transition-colors">
                <Ban className="w-8 h-8 text-red-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Containment & Removal</h3>
              <p className="text-gray-600 leading-relaxed">
                Immediate steps to isolate infected devices, stop lateral spread, and safely remove 
                the malware without triggering data destruction.
              </p>
            </motion.div>

            {/* Decryption & Recovery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-blue-100 rounded-xl w-fit mb-5 group-hover:bg-blue-500 transition-colors">
                <FileCheck className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Decryption & Recovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to known decryptors (e.g., NoMoreRansom project), backup restoration guidance, 
                and file recovery strategies.
              </p>
            </motion.div>

            {/* Preventive Measures */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-emerald-100 rounded-xl w-fit mb-5 group-hover:bg-emerald-500 transition-colors">
                <Shield className="w-8 h-8 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Preventive Measures</h3>
              <p className="text-gray-600 leading-relaxed">
                Expert recommendations on backups, patch management, email filtering, and endpoint 
                protection to prevent future attacks.
              </p>
            </motion.div>

            {/* Legal & Reporting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 lg:col-span-2"
            >
              <div className="p-4 bg-purple-100 rounded-xl w-fit mb-5 group-hover:bg-purple-500 transition-colors">
                <HardDrive className="w-8 h-8 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Legal & Reporting Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Guidance on reporting to cybercrime units, preserving evidence, and understanding 
                legal obligations — especially for businesses and healthcare providers.
              </p>
            </motion.div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Emergency CTA */}
        <section className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-12 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <AlertTriangle className="w-20 h-20 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Infected with Ransomware Right Now?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-95">
              Do NOT pay the ransom. Do NOT power off immediately. Contact us instantly — 
              we’re here 24/7 to help you recover without feeding criminals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
                <PhoneCall className="w-6 h-6" />
                Get Emergency Help (24/7)
              </a>
              <a href="https://www.nomoreransom.org" target="_blank" rel="noopener" className="inline-flex items-center gap-3 border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                <ExternalLink className="w-5 h-5" />
                Check Free Decryptors
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}